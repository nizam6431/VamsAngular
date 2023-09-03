import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { _base64ToArrayBuffer } from 'src/app/core/functions/functions';
import { AppointmentService } from '../services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-time-in-out',
  templateUrl: './time-in-out.component.html',
  styleUrls: ['./time-in-out.component.scss']
})
export class TimeInOutComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  timeInOutType: string;
  public preScheduleForm: FormGroup;
  currentSlide: number = 1;
  visitorData: any;
  fromCard: boolean;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<TimeInOutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public appointmentService: AppointmentService,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.validationMessages = {
      cell: {
        required: this.translate.instant("UpdateProfile.cellNumber_Placeholder"),
        pattern: this.translate.instant("Company.CellPattern"),
        minlength:this.translate.instant("Company.minmum_digit_10") ,
        maxlength:this.translate.instant("Company.Cellmaxlength")
      },
      qrCode: {
        required: this.translate.instant("pop_up_messages.qr_code"),
      },
    };
  }

  ngOnInit(): void {
    this.timeInOutType = this.data['type'];
    if ('startFromSlide') {
      this.currentSlide = this.data['startFromSlide'];
      this.getData(this.data.appointmentData.id);
      this.fromCard = true;
    }
    this.preScheduleForm = this.formBuilder.group({
      qrCode: [null, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*')]]
    });
  }

  scanSuccessHandler(event, type) {
    if (type === 'qrcode') {
      // this.getData(4);
    }
    if (type === 'usercode') {
      this.getData(parseInt(this.preScheduleForm.value.qrCode));
    }
  }
  getData(appointmentId) {
    this.appointmentService.GetTimeInOutById(appointmentId, this.timeInOutType).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.visitorData = resp.data;
        if (!this.fromCard)
          this.currentSlide = this.currentSlide + 1;
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })

  }

  public showValidationMessageForQrCode(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.preScheduleForm.get(control).touched || this.preScheduleForm.get(control).dirty) && this.preScheduleForm.get(control).errors) {
        if (this.preScheduleForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }
  confirmTimeIn() {
    this.dialogRef.close();
    this.appointmentService.TimeInOutAsync(this.data.appointmentData.id, this.timeInOutType).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }

}
