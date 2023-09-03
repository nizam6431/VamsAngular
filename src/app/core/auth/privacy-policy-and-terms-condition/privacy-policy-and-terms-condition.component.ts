import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { CommonService } from '../../services/common.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { bool } from 'aws-sdk/clients/signer';
import { documentType } from 'src/app/core/constants/pp_tc_nda';
import { handleIamge } from '../../functions/functions';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-privacy-policy-and-terms-condition',
  templateUrl: './privacy-policy-and-terms-condition.component.html',
  styleUrls: ['./privacy-policy-and-terms-condition.component.scss']
})
export class PrivacyPolicyAndTermsConditionComponent implements OnInit {
  logoUrl: any;
  currentSlide: number = 2;
  privacyPolicyDocType: string = documentType.privacyPolicy;
  termsConditionDocType: string = documentType.termdCondition;
  pdfUrl: string =''
  doc: any;
  isPPAccept: boolean;
  isTCAccept: boolean; 
  level2Id: number = null;
  constructor(private commonService: CommonService,
    private fileUploadService: FileUploadService,
    private configureService: ConfigureService,
    private configService:ConfigService,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer,
    private translate:TranslateService,
    public dialogRef: MatDialogRef<PrivacyPolicyAndTermsConditionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {
      this.getLogo();
   }

  async getLogo() {
    // this.logoUrl = environment.LogoBase64;
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + environment.LogoBase64);
    // this.logoUrl = await handleIamge(this.commonService.getLogo(),this.fileUploadService,this._sanitizer)
  }

  ngOnInit(): void {
    this.configService.setS3ConfigurationByAPI();
    this.data = this.data.data;
    this.isTCAccept= this.data.isTCAccept;
    this.isPPAccept = this.data.isPPAccept;

    if (!this.isPPAccept && !this.isTCAccept) {
      this.currentSlide = 2;
      this.getPdf(this.privacyPolicyDocType);
    }
    else if (this.isPPAccept) {
      this.currentSlide = 3;
      this.getPdf(this.termsConditionDocType);
    }
   else if (this.isTCAccept) {
      this.currentSlide = 2;
      this.getPdf(this.privacyPolicyDocType);
    }
  }
  changeSlide(event){
  }
  next() {
    // save flag
    this.configureService.updatePrivaycPolicy(this.data['employeeId']).subscribe(resp => { 
     if (resp.statusCode == 200 && resp.errors === null) {
        // this.toastr.success(resp.message, "Success");
        this.currentSlide = this.currentSlide + 1;
        this.pdfUrl = null;
        if(this.currentSlide == 3 && this.isTCAccept ==null ) {
          this.pdfUrl = null;
          this.getPdf(this.termsConditionDocType);
        } else {
          this.dialogRef.close(true);
        }
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
      });

  }
  accept() {
    this.configureService.updateTermsConditions(this.data['employeeId']).subscribe(resp => {
      if (resp.statusCode == 200 && resp.errors === null) {
        //  this.toastr.success(resp.message, "Success");
        this.dialogRef.close(true);
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
      });
  }
  back() {
    if (this.currentSlide == 3) {
      if (this.isPPAccept) {
        this.dialogRef.close(false);
      } else {
        this.pdfUrl = null;
        this.currentSlide = this.currentSlide - 1;
        this.getPdf(this.privacyPolicyDocType);
      }
    }
    else if (this.currentSlide == 2) {
      this.dialogRef.close(false);
    }
  }
  getPdf(docType:string) {
    this.configureService.getPdfUrl(docType, this.level2Id).subscribe(async resp => {
      
      if (resp.statusCode == 200 && resp.errors == null) {
        this.doc = resp.data['docURL'];
        let parserContent = s3ParseUrl(this.doc);
        let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
        this.doc = this._base64ToArrayBuffer(this.encode(data?.Body));
        this.pdfUrl = this.doc;
      }
    })
  }
  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }
}
