import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  MatDialog,
} from "@angular/material/dialog";

import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";

import { environment } from "src/environments/environment";
import { AppointmentSchedule, shareAppointmentSchedule, Visitor } from "../models/appointment-schedule";
import {
  capitalizeFirstLetter,
  convertTime12to24,
  encode,
  formatPhoneNumber,
  getCountryCode,
  removeSpecialCharAndSpaces,
} from "src/app/core/functions/functions";
import { AppointmentService } from "../services/appointment.service";
import { countryDetails } from "../models/country-const";
import { first } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MY_FORMATS } from "src/app/core/models/users";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {noWhitespaceValidator } from 'src/app/core/functions/functions';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-share-appointment-schedule',
  templateUrl: './share-appointment-schedule.component.html',
  styleUrls: ['./share-appointment-schedule.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ShareAppointmentScheduleComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  formCompany: FormGroup;
  formCompanyforExcel: FormGroup;
  public phoneValidation: boolean = true;
  isExcelUser: boolean;
  locationName: any;
  dateFormat: string = "dd-MM-yyyy";
  timeFormat: any = "12";
  timeZone: string = "";
  minDate: string = formatDate(new Date(), "MM-dd-YYYY HH:mm:ss", "en");
  minTime: string = formatDate(new Date(), "HH:mm:ss", "en");
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  appointmentSchedule: shareAppointmentSchedule = new shareAppointmentSchedule();
  visitorDetails: Visitor = new Visitor();
  public selectedCountry: CountryISO;

  public hideOtherDetails = false;
  minValue: string = "11:30";
  minEndDate: any = new Date();
  maxEndDate: any = new Date();
  maxEndDateCount: any = null;
  isMultiDayApnt: string = null;
  defaultTime: string = "11:30";
  todayDate: any = moment(new Date());
  fromMinTime: string = "11:30";
  toMinTime: string = "11:30";
  fromMinTimeAppt: string = "11:30";
  currentTimeZone: any;
  userData: any;
  countryData: countryDetails;
  timeFormatForTimePicker: number = 24;
  is24hourFormat: boolean = true;
  format24Hr: RegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  format12Hr: RegExp = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/;
  @ViewChild("input1") input1: ElementRef;
  @ViewChild("input2") input2: ElementRef;
  isError: boolean = false;
  finalTimeFormat: RegExp = this.format24Hr;
  isApptFromTimeInvalid: boolean;
  isApptToTimeInvalid: boolean;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  isRecurreringAppointment: boolean;
  currentSlide: number = 1;
  invalidToken: boolean;
  appointmentData: any;
  token: string;
  employeeId: number;
  isApptScheduled: boolean;
  logoUrl: any = "";
  atLeast15min: boolean;
  isStartGreatThanEndTime: any;
  isEmailValid: boolean = false;
  isPhoneVaild: boolean = false;
  flagClass: string = "";
  visitorPhone: string;
  visitorPhoneIsd: string;
  callFrom: number;
  callTo:number;
  minDuration: number;
  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    private _sanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.validationMessages = {
      firstName: {
        whitespace: translate.instant('Schedule.FirstNameRequireError'),
        maxlength: translate.instant('Schedule.FirstNameMaxLengthError'),
      },
      lastName: {
        whitespace: translate.instant('Schedule.LastNamePlaceholder'),
        maxlength:translate.instant('Schedule.LastNameMaxlength'),
      },
      company: {
        maxlength: translate.instant('Schedule.CompanyMaxLength'),
      },
      emailId: {
        pattern: translate.instant('Schedule.EmailValid'),
        required: translate.instant('Schedule.EmailIdPlaceholder'),
        maxlength: translate.instant('Schedule.EmailMaxLengthError'),
      },
      department: {
        required: this.translate.instant("Department.name_placeholder"),
        maxlength: this.translate.instant("Department.departmentMaxlength"),
      },
      visitorMobileNumber: {
        required:translate.instant('Schedule.CellNumberValid'),
      },
      typeOfVisitor: {
        required: this.translate.instant("error_messages.select_visitor"),
      },
      purposeOfVisit: {
        required: this.translate.instant("error_messages.purpose_of_visit"),
      },
      appointmentStartDate: {
        required: this.translate.instant("error_messages.select_start_date"),
        invalidDate:this.translate.instant("error_messages.valid_date"),
      },
      appointmentEndDate: {
        required: this.translate.instant("error_messages.select_end_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      appointmentStartTime: {
        required: this.translate.instant("pop_up_messages.start_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time") ,
      },
      appointmentEndTime: {
        required: this.translate.instant("pop_up_messages.end_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time") 
      }
    };
  }

  ngOnInit() {
    this.token = this.router.url.split("/")[3];
    this.validateToken(this.token);

    if (environment.IsExcel) {
      this.isExcelUser = environment.IsExcel;
    }
    // this.logoUrl = "assets/images/login-vams-logo.png";
    console.log(environment);
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64?environment.LogoBase64:"assets/images/login-vams-logo.png"));
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  validateToken(tokenId) {
    this.appointmentService
      .validateToken(tokenId)
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            let visitorEmailId = response.data.visitorEmailId;
            this.visitorPhone = response.data.visitorPhone;
            this.visitorPhoneIsd = response.data.visitorIsdCode;
            this.isEmailValid = response.data.visitorEmailId ? true : false;
            this.isPhoneVaild = response.data.visitorPhone ? true : false;
            this.minDuration = response.data.minDuration;

            this.formInitForExcel(visitorEmailId);

            if (this.isPhoneVaild) {
              this.selectedCountry = getCountryCode(response.data.visitorIsdCode);
              this.formCompanyforExcel.get('visitorMobileNumber').setValue(this.visitorPhone);
              this.flagClass = `flag-icon-${this.selectedCountry}`;

              // this.formCompanyforExcel.get('visitorMobileNumber').disable();
            } else {
              this.selectedCountry = response.data.isdCode ? getCountryCode(response.data.isdCode) : CountryISO.India;
            }

            this.invalidToken = false;
            this.employeeId = response?.data?.hostId
            this.timeFormatForTimePicker = (response?.data?.timeFormat) ? (response?.data?.timeFormat) : 24;
            this.is24hourFormat = (this.timeFormatForTimePicker === 24) ? true : false;
            if (this.is24hourFormat) {
              this.formCompanyforExcel.get('appointmentStartTime').setValidators([Validators.pattern(this.format24Hr)]);
              this.formCompanyforExcel.get('appointmentEndTime').setValidators([Validators.pattern(this.format24Hr)])
            }
            else {
              this.formCompanyforExcel.get('appointmentStartTime').setValidators([Validators.pattern(this.format12Hr)]);
              this.formCompanyforExcel.get('appointmentEndTime').setValidators([Validators.pattern(this.format12Hr)])
            }
            this.currentTimeZone = response?.data?.timeZone;
            this.getCurrentTimeZone(this.currentTimeZone);
            this.dateFormat = response?.data?.dateFormat;
            this.maxEndDateCount = response?.data?.maxMultiDays || 5;
            this.isMultiDayApnt = response?.data?.isMultiDay || false;
            this.appointmentService.setDateFormat(
              response?.data?.dateFormat || "dd-MM-yyyy"
            );
          }
        },
        (error) => {
          this.invalidToken = true;
        }
      );
  }

 

  formInitForExcel(isEmail) {
    this.formCompanyforExcel = this.formBuilder.group({
      appointmentStartDate: [null, [Validators.required]],
      appointmentEndDate: [null],
      appointmentStartTime: [null, [Validators.required]],
      appointmentEndTime: [null, [Validators.required]],
      meetingNotes: [null, [Validators.maxLength(250)]],
      firstName: [null, [Validators.maxLength(50),noWhitespaceValidator]],
      lastName: [null, [Validators.maxLength(50),noWhitespaceValidator]],
      company: [null, [Validators.maxLength(100)]],
      visitorMobileNumber: [null],
      isRecurreringAppointment: [false],
      emailId: [isEmail ? isEmail : null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)],
      ]
    });
  }

  onSubmit() {
     if (this.formCompanyforExcel.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      return;
    }
    let apptStartTime = this.formCompanyforExcel.get("appointmentStartTime").value;
    let apptEndTime = this.formCompanyforExcel.get("appointmentEndTime").value;
    let apptStart = moment(moment(this.formCompanyforExcel.get("appointmentStartDate").value).format("YYYY-MM-DD") + " " + apptStartTime);
    let apptEnd = moment(moment(this.formCompanyforExcel.get("appointmentStartDate").value).format("YYYY-MM-DD") + " " + apptEndTime);
    this.isStartGreatThanEndTime = (apptEnd.diff(apptStart, 'minutes')) < 0 ? true : false;
    this.atLeast15min = (apptEnd.diff(apptStart, 'minutes')) < 15 ? true : false;
    if (this.isStartGreatThanEndTime) {
      this.toastr.warning(this.translate.instant("toster_message.appointment_time"), this.translate.instant("toster_message.warning"));
    }
    // else if (this.atLeast15min) {
    //   this.toastr.warning("Appointment must be at least 15 minutes", "Could Not Save");
    // } 
    else {
      this.appointmentService
        .shareAppointmentSchedule(this.dataSendToBackend())
        .pipe(first())
        .subscribe(
          (response) => {
            if (response.statusCode === 200 && response.errors == null) {
              this.formCompanyforExcel.reset();
              this.isApptScheduled = true;
              this.toastr.success(response.message);
            } else {
              this.toastr.error(response.message);
            }
          },
          (error) => {
            if ("errors" in error.error) {
              error.error.errors.forEach((element) => {
                this.toastr.error(element.errorMessages[0],  this.translate.instant('pop_up_messages.error'));
              });
            } else {
              this.toastr.error(error.error.Message,  this.translate.instant('pop_up_messages.error'));
            }
          }
        );

    }
  }

  private dataSendToBackend(): shareAppointmentSchedule {
    this.appointmentSchedule.visitors = [];
    const formData = this.formCompanyforExcel.value;
    let fromDate = new Date(formData.appointmentStartDate);
    let toDate = new Date(formData.appointmentEndDate || formData.appointmentStartDate)
    this.visitorDetails.firstName = capitalizeFirstLetter(formData.firstName);
    this.visitorDetails.lastName = capitalizeFirstLetter(formData.lastName);
    this.visitorDetails.email = formData.emailId;
    this.visitorDetails.visitorCompany = capitalizeFirstLetter(formData.company);
    this.visitorDetails.isdCode = this.visitorPhoneIsd == null ? formData.visitorMobileNumber?.dialCode.substring(1) : this.visitorPhoneIsd;
    this.visitorDetails.phone = this.visitorPhone == null ? removeSpecialCharAndSpaces(formData.visitorMobileNumber?.number.toString()): this.visitorPhone;

    this.appointmentSchedule.visitors.push(this.visitorDetails);
    this.appointmentSchedule.startDate = this.datePipe.transform(
      fromDate,
      this.dateFormat
    );
    this.appointmentSchedule.endDate = this.datePipe.transform(
      toDate,
      this.dateFormat
    );
    (this.appointmentSchedule.startTime =
      formData.appointmentStartTime.split(":")[0].length <= 1
        ? "0" + formData.appointmentStartTime
        : formData.appointmentStartTime),
      (this.appointmentSchedule.endTime =
        formData.appointmentEndTime.split(":")[0].length <= 1
          ? "0" + formData.appointmentEndTime
          : formData.appointmentEndTime),
      (this.appointmentSchedule.meetingNotes = formData.meetingNotes);

    this.appointmentSchedule.device = "WEB";
    this.appointmentSchedule.visitPurposeId = null;
    this.appointmentSchedule.visitorTypeId = null;
    this.appointmentSchedule.token = this.token;
    this.appointmentSchedule.employeeId = this.employeeId;
    return this.appointmentSchedule;
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.validationMessages[control]) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.formCompanyforExcel.get(control)?.touched ||
            this.formCompanyforExcel.get(control)?.dirty) &&
          this.formCompanyforExcel.get(control)?.errors
        ) {
          if (this.formCompanyforExcel.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          } else if (control == "appointmentEndDate" || "appointmentStartDate") {
            if (!moment(this.formCompanyforExcel.get(control).value, this.dateFormat, true)) {
              messages.push(this.validationMessages[control]["invalidDate"]);
            }
          }
        }
      });
    }
    return messages;
  }

  formReset() {
    this.formCompany.reset();
    this.formCompany
      .get("usersInfo")
    ["controls"][0].controls.emailId.setValidators([Validators.required]);
    this.formCompany
      .get("usersInfo")
    ["controls"][0].controls.emailId.updateValueAndValidity([
      Validators.required,
      Validators.email,
      Validators.maxLength(150),
    ]);
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  setTimeValue(event,type: string) {
    if (type == "endTime") {
      let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
      let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value ,'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      //let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat)
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(this.minDuration, "m").format("LT"));
      else
        this.toMinTime = (moment(dateAndTimeFormat).add(this.minDuration, "m").format("LT"));
      //this.setAppointmentEndTime(apptStartTime);
      this.callFrom = new Date().getTime();
    } else {
      let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
      let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value , 'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      let timeAheadBy5 = moment(dateAndTimeFormat,'YYYY-MM-DD H:m A');
      let aaptEndTime;
      if (this.is24hourFormat) {
        // aaptEndTime = convertTime12to24(this.roundToNumber(moment(timeAheadBy5)).format("LT"));
        aaptEndTime = convertTime12to24((moment(timeAheadBy5).add(this.minDuration, "m")).format("LT"));
      }
      else {
        // aaptEndTime = (this.roundToNumber(moment(timeAheadBy5)).format("LT"));
        aaptEndTime = ((moment(timeAheadBy5).add(this.minDuration, "m")).format("LT"));
      }
      this.formCompanyforExcel.get("appointmentEndTime").setValue(aaptEndTime);
      this.formCompanyforExcel.updateValueAndValidity();
      this.callTo = new Date().getTime();
    }
  }

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : "India Standard Time";
    this.appointmentService.getCurrentTimeByZone(timezone).subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.todayDate = moment(response?.data);
          this.minEndDate = moment(response?.data);
          let timeAheadBy5 = moment(this.todayDate).add(5, "m");
          let apptStartTime = this.setAppointmentStartTime(timeAheadBy5);
          if (this.is24hourFormat) {
            this.toMinTime = convertTime12to24(moment(timeAheadBy5).add(this.minDuration, "m").format("LT"));
            this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(this.todayDate).add(5, "m")).format("LT"));
          }
          else {
            this.toMinTime = (moment(timeAheadBy5).add(this.minDuration, 'm').format('LT'));
            this.fromMinTimeAppt = (this.roundToNumber(moment(this.todayDate).add(5, 'm')).format('LT'));
          }
          this.setAppointmentEndTime(apptStartTime);
          this.callFrom = new Date().getTime();
        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message,  this.translate.instant('pop_up_messages.error'));
        }
      }
    );
  }

  onDate(event) {
    let selectDate = moment(event);
    let todayDate = moment(this.todayDate);
    if (selectDate.format("L") != todayDate.format("L")) {
      // let timeStr = "00:00";
      let timeStr = "07:00";
      let dateAndTimeFormat = moment(event).format("YYYY-MM-DD") + " " + timeStr;
      let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat) {
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(this.minDuration, "m").format("LT"));
        this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(event)).format("LT"));
      }
      else {
        this.toMinTime = (moment(dateAndTimeFormat).add(this.minDuration, "m").format("LT"));
        this.fromMinTimeAppt = (this.roundToNumber(moment(event)).format("LT"));

      }
      this.setAppointmentEndTime(apptStartTime);
    } else {
      this.getCurrentTimeZone(this.currentTimeZone);
    }
  }

  roundToNumber(date) {
    const start = moment(date);
    if (start.minute() % 5 != 0) {
      const remainder = 5 - (start.minute() % 5);
      const dateTime = moment(start).add(remainder, "minutes").format("LT");
      return moment(start).add(remainder, "minutes");
    } else {
      return moment(start);
    }
  }

  setAppointmentStartTime(date) {
    if (this.is24hourFormat)
      this.fromMinTime = convertTime12to24(this.roundToNumber(moment(date)).format("LT"));
    else
      this.fromMinTime = (this.roundToNumber(moment(date)).format("LT"))
    this.formCompanyforExcel.get("appointmentStartTime").setValue(this.fromMinTime);
    this.formCompanyforExcel.get("appointmentStartDate").setValue(moment(date));
    return this.formCompanyforExcel.get("appointmentStartTime").value;
  }

  setAppointmentEndTime(apptStartTime) {
    let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
    let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value).format("YYYY-MM-DD") + " " + timeStr;
    let endTime;
    let format;
    if (this.is24hourFormat) {
      format = "YYYY-MM-DD" + "HH:mm"
      endTime = convertTime12to24(moment(dateAndTimeFormat, format).add(this.minDuration, "m").format("LT"));
    }
    else {
      format = "YYYY-MM-DD" + "hh:mm A"
      endTime = (moment(dateAndTimeFormat, format).add(this.minDuration, "m").format("LT"));
    }
    this.formCompanyforExcel.get("appointmentEndTime").setValue(endTime);
  }
  onEnter(event, type) {
    if (this.is24hourFormat) {
      let nativeElementValue = this.input1.nativeElement.value;
      if (type == 'appointmentStartTime') {
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
      this.formCompanyforExcel.updateValueAndValidity();
    }
  }

  goToNextSlide(currentSlide) {
    if (currentSlide === 1) {
      if (
        this.formCompanyforExcel.controls.firstName.status == "VALID" &&
        this.formCompanyforExcel.controls.emailId.status == "VALID" &&
        this.formCompanyforExcel.controls.lastName.status == "VALID" &&
        (this.formCompanyforExcel.controls.visitorMobileNumber.status == "VALID" || this.formCompanyforExcel.controls.visitorMobileNumber.status == "DISABLED")
      ) {
        this.currentSlide = 2;
      } else {
        this.showErrorOnClick();
      }
    }
  }

  showErrorOnClick() {
    Object.keys(this.formCompanyforExcel.controls).forEach((field) => {
      if (this.formCompanyforExcel.controls[field]["controls"]) {
        this.formCompanyforExcel.controls[field]["controls"].forEach(
          (formArrayField) => {
            Object.keys(formArrayField["controls"]).forEach((item) => {
              formArrayField["controls"][item].markAsDirty();
              formArrayField["controls"][item].markAsTouched();
            });
          }
        );
      } else {
        this.formCompanyforExcel.controls[field].markAsDirty();
        this.formCompanyforExcel.controls[field].markAsTouched();
      }
    });
  }

  goToPreviousSlide(currentSlide) {
    if (currentSlide === 2) {
      this.currentSlide = 1;
    }
  }

  getScheduledTime(data) {
    if (data && data.type == 'from') {
      this.formCompanyforExcel.get('appointmentStartTime').setValue(data.value)
      this.setTimeValue(null, 'startTime');
    }
    else {
      this.formCompanyforExcel.get('appointmentEndTime').setValue(data.value);
      this.setTimeValue(null, 'endTime');
    }
  }
}
