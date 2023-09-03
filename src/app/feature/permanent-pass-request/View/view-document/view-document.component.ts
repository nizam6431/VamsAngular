import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  documentsPhoto:any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDocumentComponent>,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
   this.documentsPhoto = this.data.data.rowData.documentUrl
  }

  async handleIamge(documentsPhoto){
    let parserContent = s3ParseUrl(documentsPhoto);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.documentsPhoto =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
  cancel() {
    this.dialogRef.close();
  }
}
