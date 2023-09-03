import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Select2OptionData } from 'ng-select2';
import { first } from 'rxjs/operators';
import { calcTime, calcUTCTimeForSpecificDate, capitalizeFirstLetter, convertTime12to24, matchCustom, matcherResult, round5, templateResult, templateSelection } from 'src/app/core/functions/functions';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { AccountService } from 'src/app/core/services/account.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { HolidayService } from 'src/app/core/services/holiday.services';
import { IpConfigService } from 'src/app/core/services/ip-config.service';
import { atLeastOne } from 'src/app/core/validators/atleastOne.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shedule-modal',
  templateUrl: './shedule-modal.component.html',
  styleUrls: ['./shedule-modal.component.css']
})
export class SheduleModalComponent implements OnInit {
  public isdCodes: Array<Select2OptionData> = [];
  scheduleFirstForm: FormGroup;
  fullname: string = '';
  scheduleSecondForm: FormGroup;
  dateFormat: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  timeFormat: any = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeFormat;
  timeZone: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
  currentLocation: any = JSON.parse(localStorage.getItem("currentLocation")!);
  minDate: string = formatDate(new Date(), "dd-MM-YYYY HH:mm:ss", "en");
  minTime: string = formatDate(new Date(), "HH:mm:ss", "en");
  notificationType: number;
  isOnSecondScreen: boolean = false;
  datePickerConfig = {
    format: this.dateFormat.toUpperCase(),
    min: this.minDate
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
  //isdCodes: any[] = [];
  //holidayDetails: any[] = [];
  purposeOfVisits: any[] = [];
  locationId: number = 0;
  ipAddress: any = "110.111.1.12";
  allIsdCodes: any[] = [];
  visitorThumbnail: string = '';
  @Output() appointmentScheduled = new EventEmitter<boolean>();
  //@ViewChild('outOfHoursWarning') outOfHoursWarningModal: TemplateRef<any>;
  @ViewChild('scheduleSuccess') scheduleSuccessModal: TemplateRef<any>;
  modalServiceReference: any;
  fullnameTranslate: any;
  public options: any;
  // isExcel = environment.IsExcel;

  
  constructor(public activeModal: NgbActiveModal,
    private dashboardService: DashboardService,
    private errorService: ErrorsService,
    private _fb: FormBuilder,
    private holidayService: HolidayService,
    private commonService: CommonService,
    private ipconfigService: IpConfigService,
    private authenticationService: AccountService,
    private dialogService: NgbModal) {
    this.notificationType = authenticationService.currentUserValue.NotificationType;
    this.options = {
      templateResult: templateResult,
      templateSelection: templateSelection,
      dropdownCssClass: 'isd-space',
      width: '100%',
      matcher: matcherResult
    };
    this.dashboardService.getISDCodes()
      .pipe(first())
      .subscribe(
        (data: any) => {
          data.Data.forEach((element: any) => {
            this.isdCodes.push({
              id: element.IsdCode,
              text: "+" + element.IsdCode,
              additional: element.ISOCode
            });
          });
          this.allIsdCodes = data.Data;
        }, (error: any) => {
          this.dialogService.dismissAll("dd");
          this.errorService.handleError(error);
        });
    this.locationId = this.currentLocation.LocationId;
    this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
      this.timeZoneOffset = Number(res);
      var date = calcTime(Number(res));
      date = new Date(date.getTime() + 5 * 60000);
      this.minDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");
      this.minTime = formatDate(date, "HH:mm:ss", "en");
      // this.dashboardService.getLocation(this.locationId).subscribe((locationDetails: any) => {
      //   this.holidayService.getHolidays(this.locationId).subscribe((holidays: any) => {
      //    this.holidayDetails = holidays.Data;
      this.datePickerConfig = {
        format: this.dateFormat.toUpperCase(),
        min: this.minDate,
        // dayBtnCssClassCallback: (day: moment.Moment) => {
        //   var isHoliday = holidays.Data.filter((holiday: any) =>
        //     new Date(holiday.HolidayDate).toDateString() ===
        //     day.toDate().toDateString());
        //   if (isHoliday.length > 0) {
        //     return 'disabledDateColor'
        //   }
        //   return ''
        // },
      };
      //});
      // });
      this.appointmentDate?.patchValue(moment(date).format(this.dateFormat.toUpperCase()));

      var minutes = date.getMinutes();
      minutes = round5(minutes);
      date.setMinutes(minutes);
      this.appointmentFromTime?.patchValue(this.timeFormat == "12" ? moment(date).format('hh:mm A') : moment(date).format("HH:mm"));
      var addedTime = new Date(date.getTime() + 15 * 60000);
      var format = this.timeFormat == "12" ? moment(addedTime).format('hh:mm A') : moment(addedTime).format("HH:mm");
      this.appointmentToTime?.patchValue(format);

      this.timePickerFromTimeConfig = {
        showSeconds: false,
        minutesInterval: 5,
        timeSeparator: "",
        min: this.minTime,
        max: "23:59:59",
        format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
        showTwentyFourHours: this.timeFormat == "12" ? false : true,
      };

      this.timePickerToTimeConfig = {
        showSeconds: false,
        minutesInterval: 5,
        timeSeparator: "",
        min: this.minTime,
        max: "23:59:59",
        format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
        showTwentyFourHours: this.timeFormat == "12" ? false : true,
      };
    });

    this.ipconfigService.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });

    this.scheduleFirstForm = this._fb.group({
      email: ['', [Validators.email, Validators.maxLength(150)]],
      phonenumber: ['', [Validators.pattern("[0-9]{10}")]],
      isdCode: [JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode, [Validators.required]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      company: ['', [Validators.maxLength(100)]]
      // addToFavoirites: [false, []]
    }, { validator: atLeastOne(Validators.required, ['phonenumber', 'email']) });

    this.scheduleSecondForm = this._fb.group({
      selectedPurpose: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentFromTime: ['', [Validators.required]],
      appointmentToTime: ['', [Validators.required]],
      meetingNotes: ['', [Validators.maxLength(250)]],
    });


    this.dashboardService.getPurposeOfVisits(this.locationId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.purposeOfVisits = data.Data;
        }, (error: any) => {
          this.dialogService.dismissAll("dd");
          this.errorService.handleError(error);
        });
  }

  changedFromTime(event: any) {
    if (this.appointmentFromTime?.status != "INVALID") {
      var currentDate1 = formatDate(new Date(), "YYYY-MM-dd", "en")
        + "T" + (this.timeFormat == "12" ? convertTime12to24(this.appointmentFromTime?.value)
          : this.appointmentFromTime?.value) + ":00";
      var currentDate = new Date(currentDate1);
      var addedTime = new Date(currentDate.getTime() + 15 * 60000);
      var format = this.timeFormat == "12" ? moment(addedTime).format('hh:mm a') : moment(addedTime).format("HH:mm");
      this.appointmentToTime?.patchValue(format);
      this.timePickerToTimeConfig = {
        showSeconds: false,
        minutesInterval: 5,
        timeSeparator: "",
        min: format,
        max: "23:59:59",
        format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
        showTwentyFourHours: this.timeFormat == "12" ? false : true,
      };
    }
  }

  ngOnInit(): void {

  }

  nextClick() {
    if (this.email?.valid && this.phonenumber?.value == "") {
      this.phonenumber?.setErrors(null);
    }

    if (this.phonenumber?.valid && this.email?.value == "") {
      this.email?.setErrors(null);
    }

    if (this.scheduleFirstForm.invalid) {
      return;
    }
    this.isOnSecondScreen = true;
  }

  getAndSetVisitorInfo() {
    if ((this.email?.value != '' && this.email?.value != null && !this.email?.invalid) ||
      (this.phonenumber?.value != null && this.phonenumber?.value != '' && !this.phonenumber?.invalid && !this.isdCode?.invalid)) {
      this.dashboardService.getRegisteredUser(this.locationId, this.email?.value,
        this.isdCode?.value, this.phonenumber?.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.Data.IsRegisteredVisitor) {
              this.visitorThumbnail = data.Data.Data.VisitorThumbnail;
              this.email?.patchValue(data.Data.Data.Email);
              this.phonenumber?.patchValue(data.Data.Data.Mobile);

              this.firstName?.patchValue(data.Data.Data.FirstName);
              this.firstName?.disable({ onlySelf: true });
              if (data.Data.Data.LastName != '') {
                this.lastName?.patchValue(data.Data.Data.LastName);
                this.lastName?.disable({ onlySelf: true });
              }
              else {
                this.lastName?.patchValue('');
              }
              if (data.Data.Data.VisitorCompany != '') {
                this.company?.patchValue(data.Data.Data.VisitorCompany);
                this.company?.disable({ onlySelf: true });
              }
              else {
                this.company?.patchValue('');
              }


              if (data.Data.Data.IsdCode != '') {
                this.isdCode?.patchValue(data.Data.Data.IsdCode);
              }
              else {
                this.isdCode?.patchValue(JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode);
              }
            }
            else {
              this.visitorThumbnail = '';
              this.firstName?.patchValue('');
              this.firstName?.enable({ onlySelf: true });
              this.lastName?.patchValue('');
              this.lastName?.enable({ onlySelf: true });
              this.company?.patchValue('');
              this.company?.enable({ onlySelf: false });
            }
          }, (error: any) => {
            this.dialogService.dismissAll("dd");
            this.errorService.handleError(error);
          });
    }
  }

  isdCodeChange(event: any) {
    this.isdCode?.patchValue(event);
    var selectedISDCode = this.allIsdCodes.filter(item => item.IsdCode == this.isdCode?.value);
    this.phonenumber?.reset();
    this.phonenumber?.setValidators(Validators.pattern("[0-9]{" + selectedISDCode[0].MinMobileLength + "," + selectedISDCode[0].MaxMobileLength + "}"));
    this.phonenumber?.updateValueAndValidity();
  }

  scheduleAppointment() {
    if (this.scheduleSecondForm.invalid) {
      return;
    }

    var fromTime = (this.timeFormat == "12" ? convertTime12to24(this.appointmentFromTime?.value)
      : this.appointmentFromTime?.value) + ":00";
    var stringFromDate = this.appointmentDate?.value + " " + fromTime;
    var utcFromTime = moment(stringFromDate, this.dateFormat.toUpperCase() + " hh:mm:ss").toDate();

    this.commonService.getTimezone(utcFromTime, this.timeZone.trim()).subscribe((res: any) => {
      this.timeZoneOffset = Number(res);
      var utcFromDate2 = calcUTCTimeForSpecificDate(utcFromTime, this.timeZoneOffset);
      var stringUTCFromDate = formatDate(utcFromDate2, 'yyyy-MM-ddTHH:mm:ss', "en") + "Z";
      var toTime = (this.timeFormat == "12" ? convertTime12to24(this.appointmentToTime?.value)
        : this.appointmentToTime?.value) + ":00";
      var stringToDate = this.appointmentDate?.value + " " + toTime;
      var utcToDate = moment(stringToDate, this.dateFormat.toUpperCase() + " hh:mm:ss").toDate();
      var utcToDate2 = calcUTCTimeForSpecificDate(utcToDate, this.timeZoneOffset);
      var stringUTCToDate = formatDate(utcToDate2, 'yyyy-MM-ddTHH:mm:ss', "en") + "Z";

      var currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);

      this.dashboardService.scheduleAppointment(this.notificationType, capitalizeFirstLetter(this.firstName?.value), capitalizeFirstLetter(this.lastName?.value), this.isdCode?.value,
        this.phonenumber?.value, this.email?.value, this.selectedPurpose?.value, this.appointmentDate?.value,
        this.appointmentFromTime?.value, this.appointmentToTime?.value, stringUTCFromDate, stringUTCToDate, capitalizeFirstLetter(this.company?.value), this.meetingNotes?.value,
        currentLocation.LocationId, this.ipAddress, currentLocation.Persona, false)
        .pipe(first())
        .subscribe(
          (dbData: any) => {
            this.appointmentScheduled.emit(true);
            this.dialogService.dismissAll("");
            this.fullname = this.firstName?.value + " " + this.lastName?.value;
            this.fullnameTranslate = { fullname: this.fullname };
            this.modalServiceReference = this.dialogService.open(this.scheduleSuccessModal,
              {
                centered: true,
                backdrop: 'static',
                keyboard: false,
                windowClass: 'slideInUp'
              });

          }, (error: any) => {
            this.errorService.handleError(error);
          });
    });
  }

  isToday = (someDate: any, timezoneOffset: number) => {
    const today = calcTime(timezoneOffset);
    return someDate.getDay() == today.getDay() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  selectedDateChanged(value: any) {
    if (value && value.date != "") {
      var selectedDate = moment(value.date, this.dateFormat.toUpperCase()).toDate()
      this.commonService.getTimezone(selectedDate, this.timeZone.trim()).subscribe((res: any) => {
        this.timeZoneOffset = Number(res);
        var date = calcTime(Number(res));
        date = new Date(date.getTime() + 5 * 60000);
        this.minDate = formatDate(date, "dd-MM-YYYY HH:mm:ss", "en");
        this.minTime = formatDate(date, "HH:mm:ss", "en");
        this.appointmentFromTime?.reset();
        this.appointmentToTime?.reset();
        // var isHoliday = this.holidayDetails.filter((holiday: any) =>
        //   new Date(holiday.HolidayDate).toDateString() === new Date(value.date).toDateString());
        // if (isHoliday.length > 0) {
        //   this.modalServiceReference = this.dialogService.open(this.outOfHoursWarningModal,
        //     {
        //       centered: true,
        //       backdrop: 'static',
        //       keyboard: false,
        //       windowClass: 'slideInUp'
        //     });
        // }

        if (value && value.date != "" && !this.isToday(selectedDate, this.timeZoneOffset)) {
          var currentDate1 = formatDate(new Date(), "YYYY-MM-dd", "en") + "T" + "08:00:00";
          var currentDate = new Date(currentDate1);
          var addedTime = new Date(currentDate.getTime() + 15 * 60000);
          var toTime = this.timeFormat == "12" ? moment(addedTime).format('hh:mm A') : moment(addedTime).format("HH:mm");
          var fromTime = this.timeFormat == "12" ? moment(currentDate).format('hh:mm A') : moment(currentDate).format("HH:mm");
          this.appointmentFromTime?.patchValue(fromTime);
          this.appointmentToTime?.patchValue(toTime);

          this.timePickerFromTimeConfig = {
            showSeconds: false,
            minutesInterval: 5,
            timeSeparator: "",
            min: "00:00:00",
            max: "23:59:59",
            format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
            showTwentyFourHours: this.timeFormat == "12" ? false : true,
          };

          this.timePickerToTimeConfig = {
            showSeconds: false,
            minutesInterval: 5,
            timeSeparator: "",
            min: "00:00:00",
            max: "23:59:59",
            format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
            showTwentyFourHours: this.timeFormat == "12" ? false : true,
          };
        }
        else if (value && value.date != "") {
          var currentDate1 = formatDate(date, "YYYY-MM-dd", "en")
            + "T" + this.minTime;

          var currentDate = moment(currentDate1).toDate();
          var minutes = currentDate.getMinutes();
          minutes = round5(minutes);
          currentDate.setMinutes(minutes);
          var addedTime = moment(currentDate.getTime() + 15 * 60000).toDate();
          var toTime = this.timeFormat == "12" ? moment(addedTime).format('hh:mm A') : moment(addedTime).format("HH:mm");
          var fromTime = this.timeFormat == "12" ? moment(currentDate).format('hh:mm A') : moment(currentDate).format("HH:mm");

          this.appointmentFromTime?.patchValue(fromTime);
          this.appointmentToTime?.patchValue(toTime);

          this.timePickerFromTimeConfig = {
            showSeconds: false,
            minutesInterval: 5,
            timeSeparator: "",
            min: this.minTime,
            max: "23:59:59",
            format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
            showTwentyFourHours: this.timeFormat == "12" ? false : true,
          };

          this.timePickerToTimeConfig = {
            showSeconds: false,
            minutesInterval: 5,
            timeSeparator: "",
            min: this.minTime,
            max: "23:59:59",
            format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
            showTwentyFourHours: this.timeFormat == "12" ? false : true,
          };
        }
      });
    }
  }

  closeModal() {
    if (this.modalServiceReference) {
      this.modalServiceReference.close();
    }
    this.dialogService.dismissAll("")
  }

  clearCellNumber() {
    if (this.email?.valid
      && this.email?.value != ''
      && this.email.value != null) {
      this.phonenumber?.reset();
      this.getAndSetVisitorInfo();
    }
  }

  clearEmail() {
    if (this.phonenumber?.valid
      && this.phonenumber?.value != ''
      && this.phonenumber.value != null) {
      this.email?.reset();
      this.getAndSetVisitorInfo()
    }
  }

  get email() { return this.scheduleFirstForm.get('email'); }
  get isdCode() { return this.scheduleFirstForm.get('isdCode'); }
  get phonenumber() { return this.scheduleFirstForm.get('phonenumber'); }
  get firstName() { return this.scheduleFirstForm.get('firstName'); }
  get lastName() { return this.scheduleFirstForm.get('lastName'); }
  get company() { return this.scheduleFirstForm.get('company'); }
  // get addToFavoirites() { return this.scheduleFirstForm.get('addToFavoirites'); }

  get selectedPurpose() { return this.scheduleSecondForm.get('selectedPurpose'); }
  get appointmentDate() { return this.scheduleSecondForm.get('appointmentDate'); }
  get appointmentFromTime() { return this.scheduleSecondForm.get('appointmentFromTime'); }
  get appointmentToTime() { return this.scheduleSecondForm.get('appointmentToTime'); }
  get meetingNotes() { return this.scheduleSecondForm.get('meetingNotes'); }
}