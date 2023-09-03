import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { CardService } from 'src/app/feature/card/card/Services/card.service';
import { ViewDocumentComponent } from 'src/app/feature/permanent-pass-request/View/view-document/view-document.component';
import { ReoprtsService } from '../../reoprts.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import {Constants} from '../../../permanent-pass-request/constant/column'
import { defaultVal } from 'src/app/core/models/app-common-enum';
@Component({
  selector: 'app-report-detail-view',
  templateUrl: './report-detail-view.component.html',
  styleUrls: ['./report-detail-view.component.scss']
})
export class ReportDetailViewComponent implements OnInit {
  permanentData: any;
  categoryType: any;
  postDocumentData: any;
  photoUrl: any = "assets/images/profile-pic.png";
  reportData: any;
  columns = Constants.ViewDocumentCard;
  pageSize: defaultVal.pageSize;
  testDate:any;
  constructor(
    public dialogRef: MatDialogRef<ReportDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public reportService:ReoprtsService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    console.log(this.data,'data')
    this.getDeatilsView()
  }
  getDeatilsView(){
    let data = {
      id : this.data.data.id
    }
    this.reportService.viewReportDetailss(data).subscribe((response) => {
      this.permanentData = response.data
      this.reportData = response.data
      this.postDocumentData =this.permanentData.documents
      this.photoUrl = this.permanentData.photoUrl[0]
      this.categoryType = this.permanentData.category
    })
  }
  openDialogForDocument(rowData){
    const dialogRef = this.dialog.open(ReportDetailViewComponent, {
      data: {
        data : rowData,
        width:"40%"
      },
      panelClass: ["vams-dialog-confirm","vams-dialog"]
    });
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  cancel(){
    this.dialogRef.close()
  }

  async handleIamge(photoUrl){
    let parserContent = s3ParseUrl(photoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.photoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
}
