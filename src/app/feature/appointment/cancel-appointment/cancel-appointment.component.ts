import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { GetAppointmentRequest } from '../models/appointment-schedule';
import { AppointmentService } from '../services/appointment.service';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-cancel-appointment',
  templateUrl: './cancel-appointment.component.html',
  styleUrls: ['./cancel-appointment.component.scss']
})
export class CancelAppointmentComponent implements OnInit {
  hostNameTranslate: { hostName: string; };
  private validationMessages: { [key: string]: { [key: string]: string } };
  name:string="Vijay Chavan";
  public formCancel: FormGroup;
  reasonData:any[]=[];
  currentSlide:number = 1;
  isDropDown:boolean =false;
  public getAppointmentRequest: GetAppointmentRequest =
    new GetAppointmentRequest();
  appointmentScheduleDetails: any;
  appointmentstatus: any;
  appointmentType: any;
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CancelAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService:DataService,
    public appointmentService:AppointmentService,
    private toastr: ToastrService,    
    private translate: TranslateService,
    public dialog: MatDialog
    ) {
      this.validationMessages = {
        reason: {
          required: this.translate.instant("AppointmentDetails.PleaseSelectReason")
        },
      }
     }

  ngOnInit(): void {
    this.hostNameTranslate = {"hostName":this.data.hostFirstName + " " + this.data.hostLastName};
    this.getReason();
    this.createForm();
  }

  createForm(){
    this.formCancel = this.formBuilder.group({
      reason:[null,[Validators.required]]
    });
  }

  getReason(){
    this.appointmentService.getCancelAppointmentReason().pipe(first())
    .subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        // this.createForm();
        this.reasonData = resp.data.list;
        if(this.reasonData.length>=10){
          this.isDropDown = true;
          // this.formCancel.get('reason').setValue(this.reasonData[0]);
        }
        else{
          this.isDropDown = false;
          // this.formCancel.get('reason').setValue([this.reasonData[0]]);
        }
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      }
      else {
        this.toastr.error(error.Message, this.translate.instant('pop_up_messages.error'));
      }
    });
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formCancel.get(control).touched || this.formCancel.get(control).dirty) && this.formCancel.get(control).errors) {
        if (this.formCancel.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  cancel() {
    this.dialogRef.close();
  }
  
  cancelAppointment(isMultiDayCancel ) {
    let reasonObject ={
      "appointmentId": this.data?.id,
      "rejectionReasonId": this.isDropDown ? this.formCancel.value.reason.id:this.formCancel.value.reason[0].id,
      "IsCancelMultiDay":isMultiDayCancel == "true" ?true:false
    }
    this.appointmentService.cancelAppointment(reasonObject).pipe(first())
    .subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));

        this.cancel();
        this.dialogRef.close(resp);

        this.currentSlide = 2;
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      }
      else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        this.dialogRef.close({type:"cancel"});
      }
      // this.dialogRef.close({ type: 'employee', status: false });
    });
  }

  openDialog() {
    if (this.data.isMultiDayAppointment) {
      this.openMiltidayCancelDialog();
    } else {
      this.openConfirmationDialog();
    }

  }

  openMiltidayCancelDialog() {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        apnt_type: "multiDayReschedule",
        pop_up_type: "multiday_cancel",
        icon: "assets/images/error.png",
        isMultiDayReschedule: true
      },
      panelClass: ["vams-dialog-confirm"]
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.decision) {
        this.openConfirmationDialog(result.isRescheduleMultiDay);
      } else {
        this.dialogRef.close();
      }
    });
  }

  openConfirmationDialog(isMultiDay?: boolean) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        reason: this.isDropDown?this.formCancel.value.reason.reason:this.formCancel.value.reason[0].reason,
        pop_up_type: "cancel",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cancelAppointment(isMultiDay);
      } else {
      }
    });
  }

  openRejectDialog(){
    if (this.data.isMultiDayAppointment) {
      this.openMiltidayCancelDialog();
    } else {
      this.openConfirmationRejectDialog();
    }
  }
  openConfirmationRejectDialog(isMultiDay?: boolean) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        reason: this.isDropDown?this.formCancel.value.reason.reason:this.formCancel.value.reason[0].reason,
        pop_up_type: "reject",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cancelAppointment(isMultiDay);
      } else {
      }
    });
  }



}
