import { DatePipe, formatDate } from "@angular/common";
import {
  Component,
  Inject,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { calcTime, convertTime12to24, removeSpecialCharAndSpaces } from "src/app/core/functions/functions";
import { AppointmentService } from "../services/appointment.service";
declare let $: any;
import {
  NgxMaterialTimepickerTheme,
  NgxMaterialTimepickerModule, NgxMaterialTimepickerComponent,
} from "ngx-material-timepicker";
import { UserService } from "src/app/core/services/user.service";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { first } from "rxjs/operators";
import { MY_FORMATS } from "src/app/core/models/users";
import { RestrictedVisitorRequest } from "../models/appointment-schedule";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { createPrivateKey } from "crypto";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmVisitorRestrictionComponent } from "../confirm-visitor-restriction/confirm-visitor-restriction.component";
// import { DateAdapter } from '@angular/material';

@Component({
  selector: "app-reschedule-modal",
  templateUrl: "./reschedule-modal.component.html",
  styleUrls: ["./reschedule-modal.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class RescheduleModalComponent implements OnInit {
  scheduleSecondForm: FormGroup;
  dateFormat: string = "MM-dd-yyyy";
  timeFormat: any = "12";
  timeZone: string;
  // currentLocation: any = JSON.parse(localStorage.getItem("currentLocation")!);
  minDate: string = formatDate(new Date(), "MM-dd-YYYY HH:mm:ss", "en");
  minTime: string = formatDate(new Date(), "HH:mm:ss", "en");
  datePickerConfig = {
    format: this.dateFormat.toUpperCase(),
    min: this.minDate,
  };

  timePickerFromTimeConfig = {
    showSeconds: false,
    minutesInterval: 5,
    timeSeparator: "",
    min: this.minTime,
    max: "23:59:59",
    format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
    showTwentyFourHours: this.timeFormat == "12" ? false : true,
  };
  minValue: string;
  timePickerToTimeConfig = {
    showSeconds: false,
    minutesInterval: 5,
    timeSeparator: "",
    min: this.minTime,
    max: "23:59:59",
    format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
    showTwentyFourHours: this.timeFormat == "12" ? false : true,
  };
  selectedDate: any;
  fromtime: any;
  toTime: any;
  timeZoneOffset: number;
  modalServiceReference: any;
  purposeOfVisits: any[] = [];
  holidayDetails: any[] = [];
  locationId: number = 0;
  ipAddress: any = "110.111.1.12";
  appointmentDetails: any;
  @Output() actionCompleted = new EventEmitter<boolean>();
  @ViewChild("outOfHoursWarning") outOfHoursWarningModal: TemplateRef<any>;
  @ViewChild("rescheduleSuccess") rescheduleSuccessModal: TemplateRef<any>;
  fullnameTranslate: any;
  appointmentId: number;
  darkTheme: NgxMaterialTimepickerTheme = {
    // container: {
    //     bodyBackgroundColor: '#424242',
    //     buttonColor: '#fff'
    // },
    // dial: {
    //     dialBackgroundColor: '#555',
    // },
    // clockFace: {
    //     clockFaceBackgroundColor: '#555',
    //     clockHandColor: '#9fbd90',
    //     clockFaceTimeInactiveColor: '#fff'
    // }
  };
  defaultTime: string = '00:30';
  todayDate: any = new Date();
  fromMinTime: string = '00:30';
  toMinTime: string = "00:00";
  fromMinTimeAppt: string = "00:00";
  currentTimeZone: any;
  userData: any;
  @ViewChild("time1") timePicker1: NgxMaterialTimepickerModule;
  @ViewChild("time2") timePicker2: NgxMaterialTimepickerModule;
  @ViewChild("input1") input1: ElementRef;
  @ViewChild("input2") input2: ElementRef;
  dateOfAppointment: any = new Date();
  timeFormatForTimePicker: number = 24;
  is24hourFormat: boolean = true;
  originalApptStartTime: any = "";
  originalApptEndTime: any = "";
  isSameDayAppointment: boolean = false;
  selectDate: any = null;
  isApptScheduledToday: boolean;
  format24Hr: RegExp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])$/;
  format12Hr: RegExp = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/;
  isError: boolean = false;
  finalTimeFormat: RegExp = this.format24Hr;
  private validationMessages: { [key: string]: { [key: string]: string } };
  isApptFromTimeInvalid: boolean;
  isApptToTimeInvalid: boolean;
  isStartGreatThanEndTime: boolean;
  atLeast15min: boolean;
  toDateshow: any;
  visitorData: any;
  visitorName: any;
  visitorRole: any;
  visitorRemark: any;
  addMinmumDurationTime: any;
  callFrom: number;
  callTo: number;
  visitorDetails: any;
  enterPrise: boolean;

  constructor(
    public dialogRef: MatDialogRef<RescheduleModalComponent>,
    private appointmentService: AppointmentService,
    @Inject(MAT_DIALOG_DATA) public appointmentData: any,
    private _fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private datePipe: DatePipe,
    private dialogService: NgbModal,
    private userService: UserService,
    private dateAdapter: DateAdapter<Date>,
    private ngxTimePicker: NgxMaterialTimepickerModule,
    public dialog: MatDialog,
  ) {
    this.validationMessages = {
      appointmentFromTime: {
        required: this.translate.instant("pop_up_messages.start_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time"),
      },
      appointmentToTime: {
        required: this.translate.instant("pop_up_messages.end_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time")
      }
    }
    // this.dateAdapter.setLocale('ar');
  }
  // ngAfterViewInit(): void {
  // }

  // changedFromTime(event: any) {
  //   if (this.appointmentFromTime?.status != "INVALID") {
  //     var currentDate1 =
  //       formatDate(new Date(), "YYYY-MM-dd", "en") +
  //       "T" +
  //       (this.timeFormat == "12"
  //         ? convertTime12to24(this.appointmentFromTime?.value)
  //         : this.appointmentFromTime?.value) +
  //       ":00";
  //     var currentDate = new Date(currentDate1);
  //     var addedTime = new Date(currentDate.getTime() + 15 * 60000);
  //     var format =
  //       this.timeFormat == "12"
  //         ? moment(addedTime).format("hh:mm a")
  //         : moment(addedTime).format("HH:mm");
  //     this.appointmentToTime?.patchValue(format);
  //     this.timePickerToTimeConfig = {
  //       showSeconds: false,
  //       minutesInterval: 5,
  //       timeSeparator: "",
  //       min: format,
  //       max: "23:59:59",
  //       format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
  //       showTwentyFourHours: this.timeFormat == "12" ? false : true,
  //     };
  //   }
  // }

  // closeModal() {
  //   if (this.modalServiceReference) {
  //     this.modalServiceReference.close();
  //   }
  //   this.dialogService.dismissAll("dd");
  // }

  // isToday = (someDate: any, timezoneOffset: number) => {
  //   const today = calcTime(timezoneOffset);
  //   return (
  //     someDate.getDay() == today.getDay() &&
  //     someDate.getMonth() == today.getMonth() &&
  //     someDate.getFullYear() == today.getFullYear()
  //   );
  // };

  getAppointmentData(appointmentId) {
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      (resp) => {
        if (resp.statusCode == 200 && resp.errors === null) {
          this.visitorDetails = resp.data;
        }
      },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    );
  }

  ngOnInit() {
    if (this.userService.getProductType() == "Enterprise") {
      this.enterPrise=true
    }
    this.userData = this.userService.getUserData();
    // let date = this.appointmentData?.appointmentData.date;
    this.appointmentId = this.appointmentData.appointmentData?.id;
    this.originalApptStartTime = this.appointmentData.appointmentData?.startTime;
    this.originalApptEndTime = this.appointmentData.appointmentData?.endTime;

    if (this.appointmentId) {
      this.getAppointmentData(this.appointmentId);
    }

    if (this.appointmentData) {
      // let currentDateTime = new Date();
      // let minutes = Math.ceil(currentDateTime.getMinutes() / 5) * 5;
      // let finalmins = minutes + 5;
      // currentDateTime.setMinutes(finalmins);
      // let minTimeDiff = formatDate(currentDateTime, "HH:mm:ss", "en");
      // this.selectDate = new Date();


      //  let format = this.dateFormat.toUpperCase().replace(/\s/g, '');
      // this.scheduleSecondForm = this._fb.group({
      //   typeOfVisitor: [""],
      //   selectedPurpose: [""],
      //   fromDate: [moment(date,format).isValid()?moment(date,format):moment(date,'DD-MM-YYYY'), [Validators.required]],
      //   // toDate: [date, [Validators.required]],
      //   appointmentFromTime: [this.appointmentData.appointmentData?.startTime, [Validators.required]],
      //   appointmentToTime: [ this.appointmentData.appointmentData?.endTime, [Validators.required]],
      //   meetingNotes: [""],
      // });
      // this.appointmentFromTime?.patchValue(minTimeDiff);
      this.getDetails();
    }
  }

  rescheduleAppointment() {
    if (this.scheduleSecondForm.invalid || this.isApptToTimeInvalid || this.isApptFromTimeInvalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      return;
    }
    let apptStartTime = this.scheduleSecondForm.get("appointmentFromTime").value;
    let apptEndTime = this.scheduleSecondForm.get("appointmentToTime").value;
    let apptStart = moment(moment(this.scheduleSecondForm.get("fromDate").value).format("YYYY-MM-DD") + " " + apptStartTime);
    let apptEnd = moment(moment(this.scheduleSecondForm.get("fromDate").value).format("YYYY-MM-DD") + " " + apptEndTime);
    this.isStartGreatThanEndTime = (apptEnd.diff(apptStart, 'minutes')) < 0 ? true : false;
    this.atLeast15min = (apptEnd.diff(apptStart, 'minutes')) < 15 ? true : false;
    if (this.isStartGreatThanEndTime) {
      this.toastr.warning(this.translate.instant("toster_message.appointment_time"), this.translate.instant("toster_message.warning"));
    }
    // else if (this.atLeast15min) {
    //   this.toastr.warning("Appointment must be at least 15 minutes", "Could Not Save");
    // } 
    else {
      let formData: RestrictedVisitorRequest = {
        firstName: this.appointmentData.appointmentData.visitorFirstName,
        lastName: this.appointmentData.appointmentData.visitorLastName,
        isd: this.appointmentData.appointmentData.visitorIsd != null ? this.appointmentData.appointmentData.visitorIsd : null,
        mobileNo: this.appointmentData.appointmentData.visitorPhone != null
          ? removeSpecialCharAndSpaces(this.appointmentData.appointmentData.visitorPhone.toString()) : null,
        emailId: this.appointmentData.appointmentData.visitorEmail,
        level2Id: this.userService.getLevel2Id(),
        level3Id: this.userService.getLevel3Id(),
        companyUnitId: this.userService.getCompanyUnitId()
      }
      this.appointmentService
        .restrictThisVisitor(formData)
        .pipe(first())
        .subscribe(
          (resp) => {
            this.visitorName = resp.data.employeeName || ""
            this.visitorRole = resp.data.employeeRole || ""
            this.visitorRemark = resp.data.remark || ""
            if (resp.statusCode == 200 && resp.errors === null) {
              if (resp?.data?.isRestrict == true) {
                this.openRestrictedVisitorDialog(formData);
              } else {
                if (this.appointmentData.appointmentData.isMultiDayAppointment) {
                  this.openRescheduleMiltidayDialog();
                } else {
                  this.rescheduleApp();
                }
              }
            }
          },
          (error) => {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        );
    }
  }

  openRestrictedVisitorDialog(formData) {
    formData['rescheduleText'] = true;
    console.log("test")
    const dialogRef = this.dialog.open(ConfirmVisitorRestrictionComponent, {
      data: {
        apnt_type: "reschedule",
        name: formData.firstName && formData.lastName ? formData.
          firstName + " " + formData.lastName : "",
        visitorData: this.visitorName + " - " + this.visitorRole,
        visitorRemark: this.visitorRemark,
        // name: formData.firstName && formData.lastName ? formData.firstName + " " + formData.lastName : "",
        pop_up_type: "restricted_visitor",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.appointmentData.appointmentData.isMultiDayAppointment) {
          this.openRescheduleMiltidayDialog();
        } else {
          this.rescheduleApp();
        }
      } else {
        this.dialogRef.close();
      }
    });
  }

  openRescheduleMiltidayDialog() {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        apnt_type: "multiDayReschedule",
        pop_up_type: "multi_reschedule",
        icon: "assets/images/error.png",
        isMultiDayReschedule: true
      },
      panelClass: ["vams-dialog-confirm"]
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.decision) {
        this.rescheduleApp(result.isRescheduleMultiDay);
      } else {
        this.dialogRef.close();
      }
    });
  }

  setData() {
    let date = this.appointmentData?.appointmentData.date;
    // let toDate = this.appointmentData?.appointmentData.multiDayEndDate;
    let toDate = this.appointmentData?.appointmentData.date;
    let format = this.dateFormat.toUpperCase().replace(/\s/g, '');
    this.scheduleSecondForm = this._fb.group({
      typeOfVisitor: [this.appointmentData?.appointmentData?.visitorTypeId,],
      selectedPurpose: [this.appointmentData?.appointmentData?.visitorPurposeId,],
      fromDate: [moment(date, format).isValid() ? moment(date, format) : moment(date, format), [Validators.required]],
      // toDate: [moment(toDate,format).isValid()?moment(toDate,format):moment(toDate,format)],
      appointmentFromTime: [this.appointmentData.appointmentData?.startTime, [Validators.required]],
      appointmentToTime: [this.appointmentData.appointmentData?.endTime, [Validators.required]],
      meetingNotes: [this.appointmentData?.appointmentData?.meetingNotes],
    });
  }

  rescheduleApp(isRescheduleMultiDay?) {


    const formData = this.scheduleSecondForm.value;
    let fromDate = new Date(formData.fromDate);
    let appointmentReScheduleRequestObject = {
      device: "WEB",
      appointmentId: this.appointmentId,
      startDate: this.datePipe.transform(fromDate, this.dateFormat),
      endDate: this.datePipe.transform(fromDate, this.dateFormat),
      startTime:
        formData.appointmentFromTime.split(":")[0].length <= 1
          ? "0" + formData.appointmentFromTime
          : formData.appointmentFromTime,
      endTime:
        formData.appointmentToTime.split(":")[0].length <= 1
          ? "0" + formData.appointmentToTime
          : formData.appointmentToTime,
      visitorTypeId:(formData?.typeOfVisitor)? formData?.typeOfVisitor:null,
      visitPurposeId:(formData?.selectedPurpose)? formData?.selectedPurpose:null,
      meetingNotes: (formData?.meetingNotes) ? formData.meetingNotes:null,
      isRescheduleMultiDay: isRescheduleMultiDay == "true" ? true : false
    };

    this.appointmentService
      .appointmentReSchedule(appointmentReScheduleRequestObject)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.scheduleSecondForm.reset();
            this.toastr.success(response.message, this.translate.instant('pop_up_messages.success'));
            this.cancel();
            this.dialogRef.close(response);
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
          }
        }
      );
  }

  cancel() {
    this.dialogRef.close();
  }

  setTimeValue(type: string) {
    if (type == 'endTime') {
      let timeStr = this.scheduleSecondForm.get('appointmentFromTime').value
      let dateAndTimeFormat = moment(this.scheduleSecondForm.get('fromDate').value, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + timeStr;
      //let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat)
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(this.addMinmumDurationTime, 'm').format('LT'));
      else
        this.toMinTime = (moment(dateAndTimeFormat).add(this.addMinmumDurationTime, 'm').format('LT'));
      //this.setAppointmentEndTime(apptStartTime);
      this.callFrom = new Date().getTime();
    }
    else {
      let timeStr = this.scheduleSecondForm.get('appointmentFromTime').value
      let dateAndTimeFormat = moment(this.scheduleSecondForm.get('fromDate').value, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + timeStr;
      let timeAheadBy5 = moment(dateAndTimeFormat, 'YYYY-MM-DD H:m A');
      let aaptEndTime;
      if (this.is24hourFormat)
        // aaptEndTime = convertTime12to24(this.roundToNumber(moment(timeAheadBy5).add(1, "m")).format('LT'));
        aaptEndTime = convertTime12to24((moment(timeAheadBy5).add(this.addMinmumDurationTime, "m")).format('LT'));
      else
        // aaptEndTime = (this.roundToNumber(moment(timeAheadBy5).add(1, "m")).format('LT'));
        aaptEndTime = ((moment(timeAheadBy5).add(this.addMinmumDurationTime, "m")).format('LT'));
      this.scheduleSecondForm.get('appointmentToTime').setValue(aaptEndTime);
      this.scheduleSecondForm.updateValueAndValidity();
      this.callTo = new Date().getTime();
    }
  }


  getDetails() {
    if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
      let locationId = this.userData?.level2List?.find(location => location.isDefault == true);
      this.getVisitorSettings(locationId.id);
    }
    // else if(this.userData.role.shortName === LevelAdmins.Level3Admin || this.userData.role.shortName === LevelAdmins.Level1Admin){
    //   this.getVisitorSettings(this.userData.role?.level1Id);
    // }
    else if (this.userData && this.userData?.level1Id) {
      this.getVisitorSettings(null);
    }
    else {

    }
  }

  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.dateFormat = response?.data?.dateFormat;
        this.setData();
        this.addMinmumDurationTime = response?.data?.minDuration;
        this.timeFormatForTimePicker = (response?.data?.timeformat) ? (response?.data?.timeformat) : 24;
        this.is24hourFormat = (this.timeFormatForTimePicker === 24) ? true : false;
        this.dateOfAppointment = new Date(this.appointmentData?.appointmentData.date);
        this.isSameDayAppointment = (moment(this.appointmentData?.appointmentData.date, this.dateFormat.toUpperCase()).format(this.dateFormat.toUpperCase()) === moment(new Date(), this.dateFormat.toUpperCase()).format(this.dateFormat.toUpperCase())) ? true : false;



        if (this.is24hourFormat) {
          this.finalTimeFormat = this.format24Hr;
          this.scheduleSecondForm.get('appointmentFromTime').setValidators([Validators.required]);
          this.scheduleSecondForm.get('appointmentToTime').setValidators([Validators.required]);
        }
        else {
          this.finalTimeFormat = this.format12Hr;
          // this.scheduleSecondForm.get('appointmentFromTime').setValidators([Validators.pattern(this.format12Hr)]);
          // this.scheduleSecondForm.get('appointmentToTime').setValidators([Validators.pattern(this.format12Hr)])     
        }
        this.currentTimeZone = response?.data?.timeZone;
        this.getCurrentTimeZone(this.currentTimeZone);
        this.appointmentService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
      } else {
        this.toastr.error(response.message, this.translate.instant('pop_up_messages.error'));
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
  }

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : "India Standard Time";
    this.appointmentService.getCurrentTimeByZone(timezone).subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.todayDate = moment(response?.data);
          let timeAheadBy5 = moment(this.todayDate, this.dateFormat.toUpperCase() + "HH:mm").add(5, "m");
          if ((moment(this.appointmentData?.appointmentData.date, this.dateFormat).format(this.dateFormat) === moment(new Date(), this.dateFormat).format(this.dateFormat)) || moment(this.selectDate).format('L') === this.todayDate.format('L') || moment(this.selectDate).format('L') === moment(this.dateOfAppointment).format('L')) {
            this.performActionForAppointment(timeAheadBy5);
          }
          else {
            this.performActionForDefaltValues();
          }
        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      }
    );
  }

  performActionForAppointment(timeAheadBy5) {
    if (this.isSameDayAppointment) {
      this.setMinMaxForTimePicker(timeAheadBy5);
      this.performActionForDefaltValues();
    }
    else {
      // TODO: Need to check with ananad unable to understand the logic and code
      // if(this.isApptScheduledToday)
      //   this.setMinMaxForTimePicker(timeAheadBy5);
      // let apptStartTime = this.setAppointmentStartTime(timeAheadBy5);
      // this.setAppointmentEndTime(apptStartTime);
      this.performActionForNonDefaultValues(this.appointmentData.appointmentData.date);
      this.performActionForDefaltValues();
    }
  }

  setMinMaxForTimePicker(timeAheadBy5) {
    if (this.is24hourFormat) {
      this.toMinTime = convertTime12to24(moment(timeAheadBy5, this.dateFormat.toUpperCase() + " HH:mm").add(15, "m").format("LT"));
      this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(this.todayDate, this.dateFormat.toUpperCase() + "HH:mm").add(5, "m")).format("LT"));
    }
    else {
      this.toMinTime = (moment(timeAheadBy5, this.dateFormat.toUpperCase() + "HH:mm A").add(15, 'm').format('LT'));
      this.fromMinTimeAppt = (this.roundToNumber(moment(this.todayDate, this.dateFormat.toUpperCase() + "HH:mm A").add(5, 'm')).format('LT'));
    }
  }

  performActionForDefaltValues() {
    // this.toMinTime = this.originalApptStartTime;
    // this.fromMinTimeAppt = this.originalApptEndTime;
    this.scheduleSecondForm.get('appointmentFromTime').setValue(this.originalApptStartTime);
    this.scheduleSecondForm.get('appointmentToTime').setValue(this.originalApptEndTime);
    this.scheduleSecondForm.updateValueAndValidity();
  }

  performActionForNonDefaultValues(event) {
    let timeStr = "07:00"
    let dateAndTimeFormat = moment(event).format(this.dateFormat.toUpperCase()) + ' ' + timeStr;
    let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm A"));
    if (this.is24hourFormat) {
      this.toMinTime = convertTime12to24(moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm").add(15, 'm').format('LT'));
      this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(event, this.dateFormat.toUpperCase() + "HH:mm")).format('LT'));
    }
    else {
      this.toMinTime = (moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm A").add(15, 'm').format('LT'));
      this.fromMinTimeAppt = (this.roundToNumber(moment(event, this.dateFormat.toUpperCase() + "HH:mm A")).format('LT'));
    }
    this.setAppointmentEndTime(apptStartTime);
  }


  onDate(event) {
    this.selectDate = moment(event);
    let todayDate = moment(this.todayDate);
    this.toMinTime = null;
    this.fromMinTimeAppt = null;
    this.resetTimePicker();
    this.isApptScheduledToday = (moment(this.selectDate).format('L') === this.todayDate.format('L')) ? true : false;
    if ((this.isApptScheduledToday && this.isSameDayAppointment) || (moment(this.appointmentData?.appointmentData.date, this.dateFormat.toLocaleUpperCase()).format(this.dateFormat.toLocaleUpperCase()) === moment(this.selectDate, this.dateFormat.toLocaleUpperCase()).format(this.dateFormat.toLocaleUpperCase()))) {
      this.performActionForDefaltValues();
    }
    else if (this.isApptScheduledToday && !this.isSameDayAppointment) {
      this.getCurrentTimeZone(this.currentTimeZone);
    }
    else {
      this.performActionForNonDefaultValues(event);
    }

    // if((moment(this.appointmentData?.appointmentData.date,this.dateFormat).format(this.dateFormat) === moment(new Date(),this.dateFormat).format(this.dateFormat))){
    //   this.performActionForAppointment(this.selectDate);
    // }
    // else{
    //   if(this.selectDate.format('L') === todayDate.format('L')){
    //     this.getCurrentTimeZone(this.currentTimeZone);
    //   }
    //   else{
    //     this.performActionForNonDefaultValues(event);
    //   }
    // }
  }

  resetTimePicker() {
    this.minTime = "00:00";
    this.fromMinTimeAppt = "00:00";
    this.scheduleSecondForm.get('appointmentFromTime').reset();
    this.scheduleSecondForm.get('appointmentToTime').reset();
  }

  roundToNumber(date) {
    // "2018-12-08 09:42"
    // const start = moment(date);
    // if(start.minute() % 5 != 0){
    //   const remainder = 5 - (start.minute() % 5);
    //   const dateTime = moment(start).add(remainder, "minutes").format("LT");
    //   return moment(start).add(remainder, "minutes");
    // }else{
    //   return moment(start)
    // }
    let start = moment(date);
    if (start.minute() % 5 != 0) {
      let remainder = 5 - (start.minute() % 5);
      if (remainder == 4) {
        return moment(start).add(remainder, "minutes");
      } else {
        remainder = 4;
        return moment(start).subtract(remainder, "minutes");
      }
    } else {
      return moment(start);
    }
  }

  setAppointmentStartTime(date) {
    if (this.is24hourFormat)
      this.fromMinTime = convertTime12to24(this.roundToNumber(moment(date)).format('LT'));
    else
      this.fromMinTime = (this.roundToNumber(moment(date, this.dateFormat.toUpperCase() + "HH:mm A")).format('LT'));
    this.scheduleSecondForm.get('appointmentFromTime').setValue(this.fromMinTime);
    // this.scheduleSecondForm.get('fromDate').setValue(moment(date));
    return this.scheduleSecondForm.get('appointmentFromTime').value;
  }
  setAppointmentEndTime(apptStartTime) {
    let timeStr = this.scheduleSecondForm.get('appointmentFromTime').value
    let dateAndTimeFormat = moment(this.scheduleSecondForm.get('fromDate').value, this.dateFormat.toUpperCase() + "HH:mm").format(this.dateFormat.toUpperCase()) + ' ' + timeStr;
    let endTime;
    if (this.is24hourFormat)
      endTime = convertTime12to24(moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm").add(this.addMinmumDurationTime, 'm').format('LT'));
    else
      endTime = (moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm A").add(this.addMinmumDurationTime, 'm').format('LT'));
    this.scheduleSecondForm.get('appointmentToTime').setValue(endTime);
  }

  onTimeChanged(timePicker) {
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.scheduleSecondForm && this.scheduleSecondForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if ((this.scheduleSecondForm.get(control).touched || this.scheduleSecondForm.get(control).dirty) && this.scheduleSecondForm.get(control).errors) {
          if (this.scheduleSecondForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  onEnter(event, type) {
    if (this.is24hourFormat) {
      let nativeElementValue = this.input1.nativeElement.value;
      if (type == 'appointmentFromTime') {
        nativeElementValue = this.input1.nativeElement.value;
        if (nativeElementValue) {
          let testResult = this.finalTimeFormat.test(nativeElementValue);
          this.isApptFromTimeInvalid = testResult ? false : true;
        }
        else {
          this.isApptFromTimeInvalid = false;
        }
      }
      else {
        nativeElementValue = this.input2.nativeElement.value;
        if (nativeElementValue) {
          let testResult = this.finalTimeFormat.test(nativeElementValue);
          this.isApptToTimeInvalid = testResult ? false : true;
        }
        else {
          this.isApptToTimeInvalid = false;
        }
      }
      this.scheduleSecondForm.updateValueAndValidity();
    }
  }

  get typeOfVisitor() {
    return this.scheduleSecondForm.get("typeOfVisitor");
  }
  get selectedPurpose() {
    return this.scheduleSecondForm.get("selectedPurpose");
  }
  get fromDate() {
    return this.scheduleSecondForm.get("fromDate");
  }
  // get toDate() { return this.scheduleSecondForm.get('toDate'); }
  get appointmentFromTime() {
    return this.scheduleSecondForm.get("appointmentFromTime");
  }
  get appointmentToTime() {
    return this.scheduleSecondForm.get("appointmentToTime");
  }
  get meetingNotes() {
    return this.scheduleSecondForm.get("meetingNotes");
  }

  getScheduledTime(data) {
    if (data && data.type == 'from') {
      this.scheduleSecondForm.get('appointmentFromTime').setValue(data.value)
      this.setTimeValue('startTime');
    }
    else {
      this.scheduleSecondForm.get('appointmentToTime').setValue(data.value);
      this.setTimeValue('endTime');
    }
  }
}
