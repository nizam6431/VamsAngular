import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { VisitorReportDetails } from '../../models/report_details';
import { DetailsPageService } from '../../services/details-page.service'
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import s3ParseUrl from 's3-url-parser';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
@Component({
  selector: 'app-visitor-report-details',
  templateUrl: './visitor-report-details.component.html',
  styleUrls: ['./visitor-report-details.component.scss']
})
export class VisitorReportDetailsComponent implements OnInit {
  reportDetails = Object(VisitorReportDetails);
  reportDetailsKeys = Object.keys(VisitorReportDetails);
  reportData = {};
  detailsToBeShown: any;
  drivingPhotoUrl:string="assets/images/profile-pic.png";
  selfPhotoUrl:string="assets/images/profile-pic.png";
  specialColumn: any[] = ['visitorCellNumber', 'hostCellNumber'];
  productTypeList = ProductTypes;
  productType: any;
  userDetails: any;
  SeepzWorkFlow: any;
  constructor(
    private fileUploadService:FileUploadService,
    private toastr: ToastrService,
    private userService: UserService,
    private _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<VisitorReportDetailsComponent>,
    public dialog: MatDialog,
    public detailPageService: DetailsPageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
     this.productType = this.userService.getProductType();
    this.userDetails = this.userService.getUserData();
    // console.log(this.reportDetailsKeys)
    if (this.productType == this.productTypeList.Commercial) {
         let newReportKeys = []
        for (let i = 0; i < this.reportDetailsKeys.length-3; i++){
          newReportKeys.push(this.reportDetailsKeys[i])
        }
        this.reportDetailsKeys = newReportKeys
        // console.log(newReportKeys)
    }

    this.SeepzWorkFlow = this.userService.getWorkFlow();

     }

  ngOnInit(): void {
    console.log(this.data,'data')
    if (this.data && this.data.data && this.data.data.appointmentId) {
      this.detailPageService.getReportDetails(this.data.data.appointmentId).pipe(first()).subscribe((resp) => {
          if(resp.statusCode == 200 && resp.errors === null){
            this.reportData = resp?.data;
            // console.log(this.reportData);
            if(this.reportData && this.reportData['visitorCapturedLivePhoto'])
              this.selfPhotoUrl = this.reportData['visitorCapturedLivePhoto'];
            if(this.reportData && this.reportData['visitorDLIndividualPhoto'])
              this.drivingPhotoUrl = this.reportData['visitorDLIndividualPhoto'];
            this.handleIamge(this.selfPhotoUrl,'self');
            this.handleIamge(this.drivingPhotoUrl,'dl');
          }
      },
      (error)=>{
        if(error && error.error && error.error.Message)
          this.toastr.error(error.error.Message,"Error")
        if(error && error.error && error.error.message)          
          this.toastr.error(error.error.message,"Error")
      });
    }
  }

  cancel() {
    this.dialogRef.close()
  }

  isBoolean(type){
    return typeof type === 'boolean';
  }

  formatCell(value:string){
    if(value){
      let getFormatvalue = ""
      let formatNumber = value.split(" ");
      if(formatNumber.length>1){
        getFormatvalue = "+"+formatNumber[0]+" "+this.formatCellNumber(formatNumber[1]);
        return getFormatvalue;
      }
      else{
        return value;
      }
    }
    else{
      return value
    }
  }
  
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  async handleIamge(PhotoUrl,type){
    let parserContent = s3ParseUrl(PhotoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    PhotoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    if(type == 'self')
      this.selfPhotoUrl = PhotoUrl;
    else  
      this.drivingPhotoUrl = PhotoUrl;
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
}
