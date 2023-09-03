import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { _base64ToArrayBuffer } from 'src/app/core/functions/functions';
import { AppointmentService } from '../services/appointment.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-checkin-modal',
  templateUrl: './checkin-modal.component.html',
  styleUrls: ['./checkin-modal.component.css']
})
export class CheckinModalComponent implements OnInit {
  private trigger: Subject<void> = new Subject<void>();
  @ViewChildren('otpVal') otpControls: ElementRef<any>;
  @ViewChildren('bypassPin') bypassPinControls: ElementRef<any>;
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  @Input() formData: any;
  isoCode: any[] = [
    "+91", "+92"
  ]
  currentSlide: number = 1;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public preScheduleForm: FormGroup;
  visitorData: any;
  checkinForm: FormGroup;
  timeLeft: number = 30;
  interval: any;
  isResent: boolean = false;
  isOTPError: boolean = false;
  showWebcam = true;
  webcamImage: WebcamImage | undefined;
  isPhotoCaptured: boolean | undefined;
  errors: WebcamInitError[] = [];
  fromCardCheckIn: boolean;
  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CheckinModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public appointmentService: AppointmentService,
    private _fb: FormBuilder,) {
    this.validationMessages = {
      cell: {
        required: 'Please enter cell number.',
        pattern: 'Please enter 10 digit number separated by comma.',
        minlength: 'Minimum digits required: 10',
        maxlength: 'Maximum digits allowed: 54'
      },
      qrCode: {
        required: 'Please enter valid qr code.',
      },
    };
  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    if (this.data && 'startFromSlide' in this.data) {
      this.currentSlide = this.data['startFromSlide'];
      this.fromCardCheckIn = true;
    }
    this.createForm();
  }

  createForm() {
    this.preScheduleForm = this.formBuilder.group({
      qrCode: [null, [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9]*')]]
    });
    this.checkinForm = this._fb.group({
      // otp: ['', [Validators.required, Validators.pattern("[0-9]{4}")]],
      pin: ['', [Validators.required, Validators.pattern("[0-9]{6}")]]
    });
  }

  onSubmit() {
    if (this.preScheduleForm.invalid) {
      // this.toastrService.warning('There are errors in the preScheduleForm', 'Could Not Save');
      Object.keys(this.preScheduleForm.controls).forEach(field => {
        this.preScheduleForm.controls[field].markAsDirty();
        this.preScheduleForm.controls[field].markAsTouched();
      });
    } else {
    }
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

  cancel() {
    this.dialogRef.close();
  }
  scanSuccessHandler(event) {
    this.appointmentService.GetByQrCodeAsync('2451395436',null)
    .pipe(first())
    .subscribe((resp)=>{
      if(resp.statusCode === 200){
        this.visitorData = resp?.data;
        this.currentSlide = 2;
      }
    })
  }
  next() {
    this.currentSlide = this.currentSlide + 1;
    if (this.currentSlide === 4) {
      // if (this.checkinForm.controls['pin'].value) {
      //   this.checkinForm.controls['otp'].setValue('');
      //   this.checkinForm.controls['otp'].setErrors(null);
      // } else {
      //   let errorFound = false, otpValue = '';
      //   this.otpControls['_results'].forEach(element => {
      //     if (!element.nativeElement.value) {
      //       this.checkinForm.controls['otp'].setErrors({ required: true });
      //       errorFound = true;
      //     } else {
      //       otpValue += element.nativeElement.value;
      //     }
      //   });
      //   if (!errorFound) {
      //     let otp =
      //       this.checkinForm.controls['otp'].setValue(otpValue);
      //   } else {
      //     return;
      //   }
      // }
      // if (this.checkinForm.controls['otp'].value) {
      //   this.checkinForm.controls['pin'].setValue('');
      //   this.checkinForm.controls['pin'].setErrors(null);
      // } else {
      let error = false, pinValue = '';
      this.bypassPinControls['_results'].forEach(element => {
        if (!element.nativeElement.value) {
          this.checkinForm.controls['otp'].setErrors({ required: true });
          error = true;
        } else {
          pinValue += element.nativeElement.value;
        }
      });
      if (!error) {
        let pin =
          this.checkinForm.controls['pin'].setValue(pinValue);
      } else {
        return;
      }
      // }
      this.currentSlide = 5;
    }
  }
  back() {
    this.currentSlide = this.currentSlide - 1;
  }
  validateOTP() {
    if (this.checkinForm.invalid) {
      return;
    }
  }
  onKeyUpEvent(index, event, length) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < length) {
      this.otpControls['_results'][pos].nativeElement.focus();
    }
  }
  onKeyUpEventBypass(index, event, length) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < length) {
      this.bypassPinControls['_results'][pos].nativeElement.focus();
    }
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
        clearInterval(this.interval);
      }
    }, 1000)
  }

  openBypassPin() {
    this.currentSlide = 4;
  }

  showOTPScreen() {
    this.currentSlide = 3;
  }

  resendOTP() {
    this.startTimer();
    this.isResent = false;
  }
  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }
  takeSnapshot(): void {
    this.isPhotoCaptured = true;
    this.trigger.next();
  }
  handleImage(webcamImage: WebcamImage) {
    //this.getPicture.emit(webcamImage);
    this.webcamImage = webcamImage;
    this.showWebcam = false;
  }
  upload() {
    this.isPhotoCaptured = true;
    if (this.webcamImage == undefined) {
      this.isPhotoCaptured = false;
      return;
    }
    // resizeImage(this.webcamImage.imageAsDataUrl, 250, 250).then((value: any) => {
    //   base64ToBufferAsync(value).then((byteArray: any) => {
    //     this.dashboardService.uploadThumbnail(byteArray, this.visitorId).subscribe((res: any) => {
    //       this.checkIn();
    //     }, (error: any) => {
    //       this.errorService.handleError(error);
    //     });
    //   });
    // });
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  hasPermission(action: string) {
    // return this.permissions.find(element => {
    //   return element.PermissionKey == action;
    // })?.IsPermissible;
  }

  showPrintBadge() {
    // this.dialogService.dismissAll("dd");
    // this.dialogService.open(
    //   printbadgeDialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
    // this.currentSlide = 6;
    // this.dashboardService.GetFileBadge(this.printerType, this.visitorId).subscribe((res: any) => {
    //   var pdfFile = new Blob([res.body], {
    //     type: "application/pdf"
    //   });
    //   var thisObject = this;
    //   var pdfUrl = URL.createObjectURL(pdfFile);
    //   PrintPDF(pdfUrl, function () {
    //     thisObject.dialogService.dismissAll("dd");
    //   });
    // }, (error: any) => {
    //   this.errorService.handleError(error);
    // });
  }

  get otp() { return this.checkinForm.get('otp'); }
  get pin() { return this.checkinForm.get('pin'); }
}
