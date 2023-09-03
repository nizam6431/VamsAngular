import { Component, OnInit } from '@angular/core';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from '../../services/file-upload.service';
import { Router } from '@angular/router';
import {documentType } from 'src/app/core/constants/pp_tc_nda'
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-show-policy',
  templateUrl: './show-policy.component.html',
  styleUrls: ['./show-policy.component.scss']
})
export class ShowPolicyComponent implements OnInit {
  logoUrl: any;
  docType: string;
  doc: any;
  level2Id: string = null;
  pdfUrl: any;
  type: string;
  subDomain: string;
  privacyPolicyDocType: string = documentType.visitorPrivacyPolicy;
  termsConditionDocType: string = documentType.visitorTermsCondition;
  constructor(private configureService: ConfigureService,
    private fileUploadService: FileUploadService,
    private _sanitizer: DomSanitizer,
    private router: Router) { }

  ngOnInit(): void {
    this.subDomain = environment.Subdomain;
    this.logoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + environment.LogoBase64);
    // this.logoUrl = "assets/images/login-vams-logo.png";
    // this.pdfUrl ="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
    this.type = this.router.url.split('/')[3];
    if (this.type == 'privacy-policy') {
      this.docType = this.privacyPolicyDocType
      this.getPdf();
    }
    else if (this.type == 'terms-condition') {
      this.docType = this.termsConditionDocType
      this.getPdf();
    } else {
      this.router.navigate['invalid-link']
    }
  }
  getPdf() {
    // let data = this.fileUploadService.getContentFromS3Url("https://sit-master.s3.ap-south-1.amazonaws.com/account/253/emailasset/partner/otp.png");
    this.configureService.getVisitorPdfUrl(this.docType, this.level2Id, this.subDomain).subscribe(async resp => {   
      if (resp.statusCode == 200) {
        this.pdfUrl = "data:application/pdf;base64," + resp.data;
      }
    })
  }
}


