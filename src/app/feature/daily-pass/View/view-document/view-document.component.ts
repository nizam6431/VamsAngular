import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  documentsPhoto: any;
  docUrls:any=''
  docType: any;
  imageFlag:boolean=false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ViewDocumentComponent>,
  ) { }

  ngOnInit(): void {
    console.log(this.data.data.rowData.documentUrl)
    this.docType=this.data.data.rowData.documentUrl.type.split('/')[1]

    console.log(this.docType, "=======", this.data.data.rowData)
   
    console.log(this.documentsPhoto);
    if (this.docType != 'pdf') {
      console.log("testttttttttt")
        var image = document.getElementById('blobImg') as HTMLImageElement | null;
      if( image != null ){
        image.src = URL.createObjectURL(this.data.data.rowData.documentUrl);
      }
      
    } else {
      this.imageFlag = true;
       var reader = new FileReader();
      reader.readAsDataURL(this.data.data.rowData.documentUrl);
      reader.onload = () => {
        this.docUrls = reader.result;
      };
    }
   

  }
 
cancel() {
  this.dialogRef.close();
}
 
}
