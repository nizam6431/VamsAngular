import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-view-images',
  templateUrl: './view-images.component.html',
  styleUrls: ['./view-images.component.scss']
})
export class ViewImagesComponent implements OnInit {

  documentsPhoto:any;
  customHeight: any;
  docType: any;
  doc: string;
  docUrls: any="";
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewImagesComponent>,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    // get docType
    let docUrl = this.data.data.rowData.documentUrl;
    docUrl = docUrl.split('.')
    this.docType=docUrl[docUrl.length-1]
    console.log(this.docType)
    
    this.documentsPhoto = this.data.data.rowData.documentUrl

    if (this.docType == 'pdf') {
        this.getPdf(this.documentsPhoto)
    }
    
  }

  async handleIamge(documentsPhoto) {
    console.log(documentsPhoto)
    let parserContent = s3ParseUrl(documentsPhoto);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.documentsPhoto =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    console.log(this.documentsPhoto)
    //  this.documentsPhoto = "data:application/pdf;base64," + this.documentsPhoto.;
  }
  async getPdf(documentsPhoto) {
        console.log(documentsPhoto)
        let parserContent = s3ParseUrl(documentsPhoto);
        let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
        this.docUrls = this._base64ToArrayBuffer(this.encode(data?.Body));
        console.log(this.docUrls)
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
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
  cancel() {
    this.dialogRef.close();
  }

}
