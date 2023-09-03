import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppointmentDetails } from '../constants/enums';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-time-in-out-with-qr',
  templateUrl: './time-in-out-with-qr.component.html',
  styleUrls: ['./time-in-out-with-qr.component.scss']
})
export class TimeInOutWithQrComponent implements OnInit {
  apptDetailsKeys = Object.keys(AppointmentDetails);
  currentSlide: number = 1;
  qrCode: string = ""
  appointmentData: any;
  constructor(
    public dialogRef: MatDialogRef<TimeInOutWithQrComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public appointmentService: AppointmentService,
    private toastr: ToastrService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    console.log(this.apptDetailsKeys);
  }

  cancel() {
    this.dialogRef.close();
  }

  scanSuccessHandler(qrCode) {
    this.qrCode = qrCode;
    this.appointmentService.GetAppointmentDetailsByQRCodeAsync(qrCode).subscribe((resp) => {
      console.log(resp);
      if (resp.statusCode == 200 && resp.errors === null) {
        this.appointmentData = resp?.data;
        this.currentSlide = this.currentSlide + 1;
      }
    },
    (error) => {
      try{
        this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))
      }
      catch(e){
        this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
      }      
    })
  }

  timeInOut() {
    let type = (this.appointmentData?.isTimeIn)?('in'):('out');
    if(!(this.appointmentData?.isTimeIn) && !(this.appointmentData?.isTimeOut)){
      type = "in";
      // this is because first time both flags are set to be false
      // Need to change this in getByIs
    }
    this.appointmentService.timeInOutbyQrCode(this.appointmentData?.appointmentId, type).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        this.dialogRef.close(resp);
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }

}
