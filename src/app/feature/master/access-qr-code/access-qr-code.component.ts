import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MasterService } from '../services/master.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-access-qr-code',
  templateUrl: './access-qr-code.component.html',
  styleUrls: ['./access-qr-code.component.scss']
})
export class AccessQrCodeComponent implements OnInit {

  url:any;
  extension:string=".png";
  base64image: string;
  isQrCode: boolean;
  constructor(   
    private _sanitizer: DomSanitizer,
    public masterService:MasterService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AccessQrCodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    let empId = this.data?.employeedata?.did
    this.masterService.accessEmployeeQrCode(empId)
    .pipe()
    .subscribe((resp)=>{
      if(resp.statusCode === 200 && resp.errors ==null){
          this.isQrCode = true;
          this.base64image = "data:image/png;base64,"+resp?.data;
          this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.base64image);
      }
    },
    (error)=>{
      this.isQrCode = false;
      if(error.statusCode === 400){
      }
    })
  }

  cancel(){
    this.dialogRef.close();
  }

  downloadImage() {
    let fileName = this.data?.fileName+this.extension;
    this.masterService.downloadImage(this.base64image,fileName)
  }

}

