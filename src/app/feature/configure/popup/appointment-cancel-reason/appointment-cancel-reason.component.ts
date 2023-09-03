import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { ConfigureService } from '../../services/configure.service';

@Component({
  selector: 'app-appointment-cancel-reason',
  templateUrl: './appointment-cancel-reason.component.html',
  styleUrls: ['./appointment-cancel-reason.component.scss']
})
export class AppointmentCancelReasonComponent implements OnInit {
  formData: any;
  public formAppointmentRejectedReason: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  constructor(public dialogRef: MatDialogRef<AppointmentCancelReasonComponent>,
    private formBuilder: FormBuilder,
    private translate:TranslateService ,
    private toastr: ToastrService,
    private configureService:ConfigureService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.validationMessages = {
        reason:{
          required:  translate.instant('appointment_reject_reason.rejected_reason_placeholder'),
        }
      }
    }

  ngOnInit(): void {
    this.formData=this.data;
    this.createForm();
  }

  createForm(){
    this.formAppointmentRejectedReason = this.formBuilder.group({
     reason:[this.formData?.data?.reason ? this.formData.data.reason : null,
      [Validators.required,],]
    })
  }

  onSubmit(){
    if(this.formAppointmentRejectedReason.invalid){
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.formAppointmentRejectedReason.controls).forEach(field => {
        this.formAppointmentRejectedReason.controls[field].markAsDirty();
        this.formAppointmentRejectedReason.controls[field].markAsTouched();
      });
    }
    else{
      let addObj ={
        reason :this.formAppointmentRejectedReason.value.reason
      }
      this.configureService.addAppointmentCancelReason(addObj).pipe(first()).
      subscribe(res =>{
        if (res.statusCode === 200 && res.errors === null) {
          // this.toastr.success(res.message, 'Success');
          this.toastr.success(this.translate.instant("pop_up_messages.appointment_cancel_sucessfully"))
          this.dialogRef.close({ type: 'appointment_reject_reason_master', status: true });
        }
      },error => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          });
        } else {
          // this.toastr.error(error.error.Message, "Error");
          this.toastr.error(this.translate.instant("pop_up_messages.appointment_cancel_alrady_exits"))
        }
      })

    }
  }
  updateForm(){
    this.formData.mode='edit'
    if(this.formAppointmentRejectedReason.invalid){
      Object.keys(this.formAppointmentRejectedReason.controls).forEach(field => {
        this.formAppointmentRejectedReason.controls[field].markAsDirty();
        this.formAppointmentRejectedReason.controls[field].markAsTouched();
      });
    }
    else{
      let editReqObj ={
        id:this.formData.data.id,
        reason :this.formAppointmentRejectedReason.value.reason
      }
      this.configureService.updateAppointmentCancelReason(editReqObj).pipe(first()).
      subscribe(res =>{
        if (res.statusCode === 200 && res.errors === null) {
          // this.toastr.success(res.message, 'Success');
          this.toastr.success(this.translate.instant("pop_up_messages.appointment_cancel_sucessfully"))
          this.dialogRef.close({ type: 'appointment_reject_reason_master', status: true });
        }
      }, error => {
        if ( error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
        // this.toastr.error(error.error.Message, 'Error');
        this.toastr.error(this.translate.instant("pop_up_messages.appointment_cancel_alrady_exits"))
        }
      })
    }
  }

  resetForm(){
    this.formAppointmentRejectedReason.reset();
  }
  cancel() {
    this.dialogRef.close();
  }
  
  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if(this.formAppointmentRejectedReason && this.formAppointmentRejectedReason.get(control)){
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.formAppointmentRejectedReason.get(control).touched ||
            this.formAppointmentRejectedReason.get(control).dirty) &&
          this.formAppointmentRejectedReason.get(control).errors
        ) {
          if (this.formAppointmentRejectedReason.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }
}
