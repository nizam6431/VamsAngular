import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from '../../../services/configure.service';
import s3ParseUrl from 's3-url-parser';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { DomSanitizer } from '@angular/platform-browser';
import { documentType } from 'src/app/core/constants/pp_tc_nda';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  @Output() fileUpload = new EventEmitter();
  uploadFileForm: FormGroup;
  doc: any = "";
  @Input() privacyUploadFile;
  private validationMessages: { [key: string]: { [key: string]: string } };
  @ViewChild('inputFile') myInputVariable: ElementRef;
  level2Id: number = null;
  file: any;
  userDetails: any;
  docType: string = documentType.privacyPolicy
  updateFlag: boolean = false;
  id: number = null;
  fileName: string = '';

  constructor(
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private fileUploadService: FileUploadService,
    private toastr: ToastrService,
    private userService: UserService,
    private configureService: ConfigureService
  ) {
    this.userDetails = this.userService.getUserData();
    this.validationMessages = {
      pdf_file: {
        required: translate.instant('nda.pdfRequired')
      },
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.uploadFileForm)
      this.uploadFileForm.get('pdf_file').setValue(null);
    this.fileUpload.emit({ 'fileUpload': 'success' });
    if (this.privacyUploadFile) {
      this.uploadPdf();
    }
  }
  uploadPdf() {
    console.log(this.updateFlag, this.id);
    let path = "level1/" + this.userDetails?.level1DisplayId + "/PrivacyPolicy/" + new Date().getTime() + "/";
    this.fileUploadService.NDAFileUpload(this.file, path).promise().then(resp => {
      if (this.updateFlag) {
        this.openDialogForUpdate(resp);
      } else {
        this.configureService.uploadPdf(resp.Location, this.docType).subscribe(resp => {
          if (resp.statusCode == 200 && resp.errors == null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.getPdf()
          }
        })
      }
    })
  }
  getPdf() {
    this.configureService.getPdfUrl(this.docType,this.level2Id).subscribe(async resp => {
      console.log(resp)
      if (resp.statusCode == 200 && resp.errors == null) {
        this.updateFlag = true;
        this.id = resp.data['id'];
        this.doc = resp.data['docURL'];
        let parserContent = s3ParseUrl(this.doc);
        let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
        this.doc = this._base64ToArrayBuffer(this.encode(data?.Body));
      
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
  openDialogForUpdate(resp) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "nda",
        name: resp.Location,
        pop_up_type: "privacy_policy",
        // icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.configureService.updatePdfUrl(resp.Location, this.docType, this.id).subscribe(resp => {
          if (resp.statusCode == 200 && resp.errors == null) {
            this.toastr.success(resp.message,  this.translate.instant("pop_up_messages.success"));
            this.fileName = null;
          }
        })
      } else {
        this.fileName = null;
        this.getPdf();
      }
    });
  }
  ngOnInit(): void {
    // if (this.userDetails.data.level2List) {
    //   this.userDetails.data.level2List.forEach(element => {
    //     if (element.isDefault == true) {
    //       this.level2Id = element.id;
    //     }
    //   })
    // }
    this.createForm()
    this.getPdf();
  }

  createForm() {
    this.uploadFileForm = this.formBuilder.group({
      pdf_file: [null]
    });
  }
  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.uploadFileForm.get(control).touched || this.uploadFileForm.get(control).dirty) && this.uploadFileForm.get(control).errors) {
        if (this.uploadFileForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  onFileChange(evt) {
    this.file = evt.target.files[0];
    this.fileName = this.file.name;
    
    // condition to check file size less than two mb and pdf only
    if (this.file.size < 1048576 && this.file.type == 'application/pdf') {
      var reader = new FileReader();
      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.doc = reader.result;
        this.fileUpload.emit({ 'status': 'success' });
      };
    } else {
      this.fileName = null;
      this.file = null;
      this.myInputVariable.nativeElement.value = '';
      this.toastr.error(this.translate.instant('nda.pdfRequiredSize'),  this.translate.instant("pop_up_messages.error"));
    } 
  }

}
