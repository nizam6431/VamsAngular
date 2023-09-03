import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { VisitorReportDetails ,HSQReportDetails} from '../../models/report_details';
import { DetailsPageService } from '../../services/details-page.service';
import { formatPhoneNumber } from "../../../../core/functions/functions";
import { formatMoment } from 'ngx-bootstrap/chronos/format';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import s3ParseUrl from 's3-url-parser';

@Component({
  selector: 'app-hsq-report-details',
  templateUrl: './hsq-report-details.component.html',
  styleUrls: ['./hsq-report-details.component.scss']
})
export class HsqReportDetailsComponent implements OnInit {
  reportDetails = Object(HSQReportDetails);
  reportDetailsKeys = Object.keys(HSQReportDetails); 
  reportData = {};
  detailsToBeShown:any;
  drivingPhotoUrl:string="assets/images/profile-pic.png";
  selfPhotoUrl:string="assets/images/profile-pic.png";
  specialColumn:any[]=['visitorCellNumber','hostCellNumber'];
  constructor(
    private fileUploadService:FileUploadService,
    private toastr: ToastrService,
    private _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<HsqReportDetailsComponent>,
    public dialog: MatDialog,
    public detailPageService: DetailsPageService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    console.log(this.reportDetailsKeys, this.reportDetails);
    if (this.data && this.data.data && this.data.data.appointmentId) {
      this.detailPageService.getAppointmentHsqDetails(this.data.data.appointmentId).pipe(first()).subscribe((resp) => {
          if(resp.statusCode == 200 && resp.errors === null){
            this.reportData = resp?.data;
            if(this.reportData && this.reportData['visitorCapturedLivePhoto'])
              this.drivingPhotoUrl = this.reportData['visitorCapturedLivePhoto'];
            if(this.reportData && this.reportData['visitorDLIndividualPhoto'])
              this.selfPhotoUrl = this.reportData['visitorDLIndividualPhoto'];
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

  cancel(){
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

  async handleIamge(appointment){
    let parserContent = s3ParseUrl(appointment['visitorPhotoUrl']);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    appointment['visitorPhotoUrl'] =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

}
