import { DatePipe, formatDate } from "@angular/common";
import { Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { appendFile } from "fs";
import * as moment from "moment";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { NgxMaterialTimepickerTheme } from "ngx-material-timepicker";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import {
  capitalizeFirstLetter,
  convertTime12to24,
  getCountryCode,
  removeSpecialCharAndSpaces
} from "src/app/core/functions/functions";
import { MY_FORMATS } from "src/app/core/models/users";
import { UserService } from "src/app/core/services/user.service";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { environment } from "src/environments/environment";
import { AppointmentSchedule, Visitor } from "../models/appointment-schedule";
import { countryDetails } from "../models/country-const";
import { AppointmentService } from "../services/appointment.service";
import { DataService } from "../services/data.service";
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmVisitorRestrictionComponent } from "../confirm-visitor-restriction/confirm-visitor-restriction.component";


@Component({
  selector: "app-schedule",
  templateUrl: "./schedule.component.html",
  styleUrls: ["./schedule.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ScheduleComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  formCompany: FormGroup;
  formCompanyforExcel: FormGroup;
  addAdmin: boolean = false;
  multiAdmin: boolean;
  multiOffice: boolean;
  usersInfo: FormArray;
  currentForm: number = 0;
  currentFormPage: number = 1;

  adminCount: number = 1;
  currentSlide: number = 1;
  adminActivityLabel: string = "AddAdmin";
  adminData: any[] = [];
  officeData: any[] = [
    {
      office: "IT park",
      floor: "floor",
      building: "first",
      cell: "9789767654",
    },
  ];
  public questionsFields: any = [];
  public configObj: any;
  public phoneValidation: boolean = true;
  isExcelUser: boolean;

  locationName: any;
  // dateFormat: string = "dd-MM-yyyy";
  dateFormat: string = "DD-MM-YYYY";
  timeFormat: any = 12;
  timeZone: string = "";
  minDate: string = formatDate(new Date(), "MM-dd-YYYY HH:mm:ss", "en");
  minTime: string = formatDate(new Date(), "HH:mm:ss", "en");
  modalServiceReference: any;
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
  timePickerToTimeConfig = {
    showSeconds: false,
    minutesInterval: 5,
    timeSeparator: "",
    min: this.minTime,
    max: "23:59:59",
    format: this.timeFormat == "12" ? "hh:mm A" : "HH:mm",
    showTwentyFourHours: this.timeFormat == "12" ? false : true,
  };

  users = [
    { value: "me", viewValue: "me" },
    { value: "user-1", viewValue: "user1" },
    { value: "user-2", viewValue: "user2" },
  ];

  public otherQuestion: any = [
    { question: "me", mandatory: true },
    { question: "you", mandatory: false },
    { question: "we", mandatory: true },
  ];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  // preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  appointmentSchedule: AppointmentSchedule = new AppointmentSchedule();
  visitorDetails: Visitor = new Visitor();

  public selectedCountry: CountryISO = CountryISO.India;

  public hideOtherDetails = false;
  minValue: string = "11:30";
  minEndDate: any = new Date();
  maxEndDate: any = new Date();
  maxEndDateCount: any = null;
  isMultiDayApnt: string = null;
  darkTheme: NgxMaterialTimepickerTheme = {
   
  };
  defaultTime: string = "11:30";
  todayDate: any = new Date();
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
  isStartGreatThanEndTime: boolean;
  atLeast15min: boolean;
  cellFormat: any;
  visitorData: any;
  visitorName: any;
  visitorRole: any;
  visitorRemark: any;
  addEndTime: any;

  startTime: any;
  endTime: any;
  callTo: number;
  callFrom: number;
  fromTimePicker: boolean = false;
  isL1Roles: boolean = false;
  showStatus: string = null;
  visitorTypeData: any;
  purposeOfVisitorData: any;
  enterPrise: boolean;
  visitorAutnticationType: any;
  scheduleData: any;
  firstName: any;
  lastName: any;
  secndEditableBool: boolean;
  isAuthentication: any;
  userDatas:any;
  photoUrl = '';
  registeredUser: boolean = false;
  submitted:boolean =false

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private appointmentService: AppointmentService,
    public userService: UserService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dataService: DataService,
    public dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
    private translate: TranslateService,
    private fileUploadService: FileUploadService,
    private _sanitizer: DomSanitizer,
  ) {
    if (this.userService.isLevel1Host() || this.userService.isLevel1Admin() || this.userService.isLevel1Reception() || this.userService.isLevel1Security() || this.userService.isLevel1SecurityHead()) {
      this.isL1Roles = true;
    }


    this.validationMessages = {
      firstName: {
        required: translate.instant('Schedule.FirstNameRequireError'),
        maxlength: translate.instant('Schedule.FirstNameMaxLengthError'),
      },
      lastName: {
        required: translate.instant('Schedule.LastNamePlaceholder'),
        maxlength: translate.instant('Schedule.LastNameMaxlength'),
      },
      company: {
        required: translate.instant('Schedule.CompanyPlaceholder'),
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
        required: translate.instant('Schedule.CellNumberValid'),
      },
      typeOfVisitor: {
        required: this.translate.instant("error_messages.select_visitor"),
      },
      purposeOfVisit: {
        required: this.translate.instant("error_messages.purpose_of_visit"),
      },
      appointmentStartDate: {
        required: this.translate.instant("error_messages.select_start_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      appointmentEndDate: {
        required: this.translate.instant("error_messages.select_end_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      question0: {
        required: this.translate.instant("error_messages.enter_answer"),
      },
      question1: {
        required: this.translate.instant("error_messages.enter_answer"),
      },
      question2: {
        required: this.translate.instant("error_messages.appointment_location"),
      },
      meetingNotes: {
        maxlength: this.translate.instant("error_messages.name_maxlength"),
      },
      appointmentStartTime: {
        required: this.translate.instant("pop_up_messages.start_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time"),
      },
      appointmentEndTime: {
        required: this.translate.instant("pop_up_messages.end_time"),
        pattern: this.translate.instant("pop_up_messages.valid_time")
      },
      level2Id:{
        required: this.translate.instant("configure_email_server.building_name_placeholder"),
      }
    };
  }


  ngOnInit() {
    console.log(this.data)
    this.userDatas = this.userService.getUserData();
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
    if (this.userService.getProductType() == "Enterprise") {
      this.enterPrise=true
      this.getTypeVisitor();
      this.getPourposeOfVisittor();
      this.getAllLocation();
    }

    this.userData = this.userService.getUserData();
    this.getDetails();
    this.getSampleFormConfig();
    if (environment.IsExcel) {
      this.isExcelUser = environment.IsExcel;
    }
    this.formInitForExcel();
    if(!this.enterPrise){
      this.formCompanyforExcel.controls.purposeOfVisit.clearValidators()
      this.formCompanyforExcel.controls.purposeOfVisit.updateValueAndValidity()
      this.formCompanyforExcel.controls.typeOfVisitor.clearValidators()
      this.formCompanyforExcel.controls.typeOfVisitor.updateValueAndValidity()
      // this.formCompanyforExcel.controls.level2Id.setValidators([Validators.required])
      this.formCompanyforExcel.controls.level2Id.clearValidators()
      this.formCompanyforExcel.controls.level2Id.updateValueAndValidity()
      
    }else{
      this.visitorAutnticationType = this.data?.visitorSettings?.visitorAuthenticationType
      if (this.visitorAutnticationType == "Email") {
       
      } else if (this.visitorAutnticationType == "Both") {

      } else if (this.visitorAutnticationType == "Cell") {
        this.formCompanyforExcel.controls.emailId.clearValidators()
        this.formCompanyforExcel.controls.emailId.updateValueAndValidity()
        this.formCompanyforExcel.controls.visitorMobileNumber.setValidators([Validators.required])
        this.formCompanyforExcel.controls.visitorMobileNumber.updateValueAndValidity()
        this.formCompanyforExcel.controls.visitorMobileNumber.reset();
      }

    }
  }

  getAllLocation(){
    this.appointmentService.getAllLocation().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.data.buildingList = data.data?.list; 
        let a = this.data.buildingList;
        const toSelect = a.find(c => c?.id == this.userDatas.level2List[0].id);
        this.formCompanyforExcel.get('level2Id').setValue(toSelect);
      }

    })
  }
  onSelectEvent() {
    if(!this.enterPrise){
      if (this.formCompanyforExcel.value.level2Id == this.showStatus) {
        this.showStatus = null;
        this.formCompanyforExcel.controls['level2Id'].setValue(null);
      } else {
        this.showStatus = this.formCompanyforExcel.value.level2Id;
      }
    }else{
      if (this.formCompanyforExcel.value.level2Id == this.showStatus) {
        this.showStatus = this.formCompanyforExcel.value.level2Id;
      } else {
        this.showStatus = this.formCompanyforExcel.value.level2Id;
      }
    }
    
  }

  async getSampleFormConfig() {
    (await this.dataService.getSampleFormConfigData())
      .pipe(first())
      .subscribe(
        (data: any) => {
          let configObj = {};
          data.data.forEach((element) => {
            configObj[element.field] = element;
          });

          this.configObj = configObj;
          this.createForm();
        }
      );
  }

  public removeUserInfo(i: number) {
    const usersInfo = this.usersInfo;
    if (usersInfo.length > 1) {
      usersInfo.removeAt(i);
    }
  }

  formInitForExcel() {
    this.formCompanyforExcel = this.formBuilder.group({
      appointmentStartDate: [null, [Validators.required]],
      appointmentEndDate: [null],
      appointmentStartTime: [null, [Validators.required]],
      appointmentEndTime: [null, [Validators.required]],
      meetingNotes: [null, [Validators.maxLength(250)]],
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      company: [null, [Validators.maxLength(100)]],
      visitorMobileNumber: [null],
      isRecurreringAppointment: [false],
      purposeOfVisit: [null, [Validators.required]],
      typeOfVisitor: [null,  [ Validators.required]],
      emailId: [null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)],
      ],
      level2Id: [null,[Validators.required]],
      visitorPhotoUrl:['']
    });
  }

  createForm() {
    this.formCompany = this.formBuilder.group({
      appointmentStartDate: [null],
      appointmentEndDate: [null, [Validators.required]],
      appointmentStartTime: [null, [Validators.required]],
      appointmentEndTime: [null, [Validators.required]],
      typeOfVisitor: [null, [Validators.required]],
      purposeOfVisit: [null, [Validators.required]],
      meetingNotes: [null, [Validators.maxLength(250)]],
      usersInfo: this.formBuilder.array([this.createItem()]),
    });
    this.usersInfo = this.formCompany.get("usersInfo") as FormArray;
    this.checkForQuestions();
  }


  getTypeVisitor() {
    this.appointmentService.getVisitorType().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.visitorTypeData = data.data
      }

    })
  }

  getPourposeOfVisittor() {
    this.appointmentService.getVisitorPurpose().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.purposeOfVisitorData = data.data
      }

    })
  }


  createItem() {
    return this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      company: [null, [Validators.required, Validators.maxLength(100)]],
      visitorMobileNumber: [null, [Validators.required]],
      emailId: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(150)],
      ],
    });
  }

  setRequired() {
    if (
      this.configObj.visitorPurpose.isVisibility &&
      this.configObj.visitorPurpose.isManddatory
    ) {
      this.formCompany.controls["purposeOfVisit"].setValidators([
        Validators.required,
      ]);
      this.formCompany.controls["purposeOfVisit"].updateValueAndValidity();
    } else if (
      this.configObj.visitorType.isVisibility &&
      this.configObj.visitorType.isManddatory
    ) {
      this.formCompany.controls["typeOfVisitor"].setValidators([
        Validators.required,
      ]);
      this.formCompany.controls["typeOfVisitor"].updateValueAndValidity();
    } else {
    }
  }

  showOtherDetails() {
    this.hideOtherDetails = !this.hideOtherDetails;
    this.checkForQuestions();
  }

  clearEmail(item) {
    if (
      this.formCompany.get("usersInfo")["controls"][0].controls
        .visitorMobileNumber.valid
    ) {
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.setValidators(null);
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.updateValueAndValidity();
    } else {
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.setValidators([
        Validators.required,
        Validators.email,
        Validators.maxLength(150),
      ]);
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.updateValueAndValidity();
    }
  }

  clearMobile(item) {
    if (
      this.formCompany.get("usersInfo")["controls"][0].controls.emailId.valid
    ) {
      this.phoneValidation = false;
    } else {
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.setValidators([Validators.required]);
      this.formCompany
        .get("usersInfo")
      ["controls"][0].controls.emailId.updateValueAndValidity();
      this.phoneValidation = true;
    }
  }

  onSubmit() {
    let errorName = this.findInvalidControls();
    if (this.formCompanyforExcel.invalid || this.isApptToTimeInvalid || this.isApptFromTimeInvalid) {
      if( this.data.visitorSettings.visitorAuthenticationType == 'Both' &&
      errorName.length == 1 && errorName[0] == 'emailId' ){}else{
        this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
        return;
      }
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
   
    else { 
      this.appointmentService
        .appointmentSchedule(this.dataSendToBackend())
        .pipe(first())
        .subscribe(
          (response) => {
            if (response.statusCode === 200 && response.errors == null) {
              this.formCompanyforExcel.reset();
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

  onTimeChange(timeData) {
    this.startTime = timeData.startDate;
    this.endTime = timeData.endDate
  }

  private dataSendToBackend(): AppointmentSchedule {

   
    this.appointmentSchedule.visitors = [];
    const formData = this.formCompanyforExcel.value; 
    let fromDate = new Date(formData.appointmentStartDate);
    let toDate = new Date(formData.appointmentEndDate || formData.appointmentStartDate)

    this.visitorDetails.firstName = capitalizeFirstLetter(formData.firstName);
    this.visitorDetails.lastName = capitalizeFirstLetter(formData.lastName);
    this.visitorDetails.email = formData.emailId;
    this.visitorDetails.visitorCompany = capitalizeFirstLetter(formData.company);
    this.visitorDetails.isdCode =
      formData.visitorMobileNumber?.dialCode != null
        ? formData.visitorMobileNumber?.dialCode.substring(1)
        : null;
    this.visitorDetails.phone =
      formData.visitorMobileNumber?.number != null
        ? removeSpecialCharAndSpaces(
          formData.visitorMobileNumber?.number.toString()
        )
        : null;
     this.visitorDetails.visitorPhotoUrl = formData.visitorPhotoUrl;
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
    this.appointmentSchedule.visitPurposeId = formData.purposeOfVisit;
    this.appointmentSchedule.visitorTypeId = formData.typeOfVisitor;
    this.appointmentSchedule.employeeId =
      this.userService.getUserData().employeeId;
    this.appointmentSchedule.level2Id = formData.level2Id;
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

  showValidationMessageForDynamicContent(
    control: string,
    formCantrol: any
  ): string[] {
    const messages: any[] = [];
    if (this.validationMessages[control]) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          formCantrol &&
          (formCantrol.get(control)?.touched ||
            formCantrol.get(control)?.dirty) &&
          formCantrol.get(control)?.errors
        ) {
          if (formCantrol.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  cancel() {
    this.dialogRef.close();
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


  hideDiv(userInfo) {
    this.currentForm = userInfo;
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  checkForQuestions() {
    if (this.otherQuestion.length) {
      this.otherQuestion.forEach((element, index) => {
        let formName = `question${index}`;
        let test = this.usersInfo.controls[
          this.usersInfo.controls.length - 1
        ] as FormGroup;
        test.addControl(formName, this.formBuilder.control(null, null));

        if (element.mandatory) {
          test.controls[formName].setValidators([Validators.required]);
          test.controls[formName].updateValueAndValidity();
        }
      });
      this.questionsFields = this.otherQuestion;
    }
  }

  addMoreUsers() {
    this.usersInfo.push(this.createItem());
    // this.checkForQuestions();
    this.hideDiv(this.usersInfo.length - 1);
    this.hideOtherDetails = false;
  }

  selectedDateChanged(value: any) {
    if (value && value.date != "") {
      var selectedDate = moment(
        value.date,
        this.dateFormat.toUpperCase()
      ).toDate();
    }
  }

  checkForConfig() { }

  goToNextSlide(currentSlide) {
    if (currentSlide === 1) {
      if (
        this.formCompanyforExcel.controls.firstName.status == "VALID" &&
        this.formCompanyforExcel.controls.emailId.status == "VALID" &&
        this.formCompanyforExcel.controls.lastName.status == "VALID" &&
        this.formCompanyforExcel.controls.visitorMobileNumber.status == "VALID"
      ) {
        this.currentSlide = 2;
      } else {
        this.showErrorOnClick();
      }      

    }
  }

  goToPreviousSlide(currentSlide) {
    if (currentSlide === 2) {
      this.currentSlide = 1;
      let cellNumber = this.formCompanyforExcel.controls.visitorMobileNumber.value
      this.formCompanyforExcel.patchValue({visitorMobileNumber: cellNumber.number})
    }
  }
  goToPreviousSlide1(currentSlide) {
    if (currentSlide === 2) {
      this.currentSlide = 1;
      let cellNumber = this.formCompanyforExcel.controls.visitorMobileNumber.value
      this.formCompanyforExcel.patchValue({visitorMobileNumber: cellNumber.number})
    }
  }

  goToEnterprisePreviousSlide(currentSlide){
    if (currentSlide === 3) {
      this.currentSlide = 2;
      let cellNumber = this.formCompanyforExcel.controls.visitorMobileNumber.value
      this.formCompanyforExcel.setValue({visitorMobileNumber: cellNumber.number})
    }
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.formCompanyforExcel.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  confirmVisitorRestrictionStatus() {
    let errorName = this.findInvalidControls();
    console.log(this.findInvalidControls());
    console.log(this.formCompanyforExcel);
    // if(this.data.visitorSettings.visitorAuthenticationType == 'Both'){
    //   if(this.formCompanyforExcel.value.visitorMobileNumber != null){
    //     this.formCompanyforExcel.valid = false;   // = "VALID"
    //   }
    // }
    if (this.formCompanyforExcel.invalid) {
      if( this.data.visitorSettings.visitorAuthenticationType == 'Both' &&
      errorName.length == 1 && errorName[0] == 'emailId' ){ console.log('Both 1');
        let formData = this.formCompanyforExcel.value; 
        //console.log(formData);
      formData.firstName = capitalizeFirstLetter(formData.firstName);
      formData.level2Id = formData.level2Id?.id;
      formData.lastName = capitalizeFirstLetter(formData.lastName);
      formData.isd =
        formData.visitorMobileNumber?.dialCode != null
          ? formData.visitorMobileNumber?.dialCode.substring(1)
          : null;
      formData.mobileNo =
        formData.visitorMobileNumber?.number != null
          ? removeSpecialCharAndSpaces(
            formData.visitorMobileNumber?.number.toString()
          )
          : null;
      // formData.level2Id = this.userService.getLevel2Id();
      formData.level3Id = this.userService.getLevel3Id();
      formData.companyUnitId = this.userService.getCompanyUnitId();
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
                this.openDialog();
              } else {
                this.onSubmit();
              }
            }
          },
          (error) => {
            this.toastr.error(error.error.Message, 'Error');
          }
        );
      }else{ console.log('Both 2')
        this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
        this.showErrorOnClick();
      }
    }else{
      let formData = this.formCompanyforExcel.value; 
      formData.firstName = capitalizeFirstLetter(formData.firstName);
      formData.level2Id = formData.level2Id?.id;
      formData.lastName = capitalizeFirstLetter(formData.lastName);
      formData.isd =
        formData.visitorMobileNumber?.dialCode != null
          ? formData.visitorMobileNumber?.dialCode.substring(1)
          : null;
      formData.mobileNo =
        formData.visitorMobileNumber?.number != null
          ? removeSpecialCharAndSpaces(
            formData.visitorMobileNumber?.number.toString()
          )
          : null;
      // formData.level2Id = this.userService.getLevel2Id();
      formData.level3Id = this.userService.getLevel3Id();
      formData.companyUnitId = this.userService.getCompanyUnitId();
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
                this.openDialog();
              } else {
                this.onSubmit();
              }
            }
          },
          (error) => {
            this.toastr.error(error.error.Message, 'Error');
          }
        );
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmVisitorRestrictionComponent, {
      data: {
        apnt_type: "schedule",
        name: this.formCompanyforExcel.value.firstName && this.formCompanyforExcel.value.lastName ? this.formCompanyforExcel.value.
          firstName + " " + this.formCompanyforExcel.value.lastName : "",
        visitorData: this.visitorName + " - " + this.visitorRole,
        visitorRemark: this.visitorRemark,
        pop_up_type: "restricted_visitor",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onSubmit();
      }
    });
  }


  getDetails() {
    if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
      let locationId = this.userData?.level2List?.find(location => location.isDefault == true);
      this.getVisitorSettings(locationId.id);
    }
    else if (this.userData && this.userData?.level1Id) {
      this.getVisitorSettings(null);
    } else {
    }
  }

  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId)
      .pipe(first())
      .subscribe(
        (response) => {
          this.isAuthentication = response.data.isAuth;
          if (response.statusCode === 200 && response.errors == null) {
            this.addEndTime = response?.data.minDuration;
            this.timeFormatForTimePicker = (response?.data?.timeformat) ? (response?.data?.timeformat) : 24;
            this.is24hourFormat = (this.timeFormatForTimePicker === 24) ? true : false;
            if (this.is24hourFormat) {
              this.timeFormat = 24
              this.formCompanyforExcel.get('appointmentStartTime').setValidators([Validators.pattern(this.format24Hr)]);
              this.formCompanyforExcel.get('appointmentEndTime').setValidators([Validators.pattern(this.format24Hr)])
            }
            else {
              this.timeFormat = 12
              this.formCompanyforExcel.get('appointmentStartTime').setValidators([Validators.pattern(this.format12Hr)]);
              this.formCompanyforExcel.get('appointmentEndTime').setValidators([Validators.pattern(this.format12Hr)])
            }
            this.currentTimeZone = response?.data?.timeZone;

            this.getCurrentTimeZone(this.currentTimeZone);
            this.dateFormat = response?.data?.dateFormat;
            this.maxEndDateCount = parseInt(response?.data?.maxMultiDays) - 1 || 5;
            this.isMultiDayApnt = response?.data?.isMultiDay || false;
            this.appointmentService.setDateFormat(
              response?.data?.dateFormat || "DD-MM-YYYY"
            );
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
            this.toMinTime = convertTime12to24(moment(timeAheadBy5).add(15, "m").format("LT"));
            this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(this.todayDate).add(5, "m")).format("LT"));
          }
          else {
            this.toMinTime = (moment(timeAheadBy5).add(15, 'm').format('LT'));
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
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      }
    );
  }

  onDate(event) {
    let selectDate = moment(event);
    let todayDate = moment(this.todayDate);
    if (selectDate.format("L") != todayDate.format("L")) {
      let timeStr = "07:00";
      let dateAndTimeFormat = moment(event).format("YYYY-MM-DD") + " " + timeStr;
      let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat) {
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(15, "m").format("LT"));
        this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(event)).format("LT"));
      }
      else {
        this.toMinTime = (moment(dateAndTimeFormat).add(15, "m").format("LT"));
        this.fromMinTimeAppt = (this.roundToNumber(moment(event)).format("LT"));

      }
      this.setAppointmentEndTime(apptStartTime);
      if (this.isRecurreringAppointment) {
        this.formDateValidations()
      }
    } else {
      this.getCurrentTimeZone(this.currentTimeZone);
    }
  }

  roundToNumber(date) {
    let start = moment(date);
    if (start.minute() % 5 != 0) {
      let remainder = 5 - (start.minute() % 5);
      // let dateTime = moment(start).add(remainder, "minutes").format("LT");
      if (this.fromTimePicker) {
        if (remainder == 4) {
          return moment(start).add(remainder, "minutes");
        } else {
          remainder = 4;
          return moment(start).subtract(remainder, "minutes");
        }
      }
      else {
        return moment(start).add(remainder, "minutes")
      }
    } else {
      return moment(start);
    }
  }


  setAppointmentStartTime(date) {
    if (this.is24hourFormat)
      this.fromMinTime = convertTime12to24(this.roundToNumber(moment(date)).format("LT"));
    else
      this.fromMinTime = (this.roundToNumber(moment(date)).format("LT"));

    this.formCompanyforExcel.get("appointmentStartTime").setValue(this.fromMinTime);
    this.formCompanyforExcel.get("appointmentStartDate").setValue(moment(date));
    return this.formCompanyforExcel.get("appointmentStartTime").value;
  }
  setAppointmentEndTime(apptStartTime) {
    let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
    let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value).format(this.dateFormat.toUpperCase()) + " " + timeStr;
    let endTime;
    if (this.is24hourFormat) {
      endTime = convertTime12to24(moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm A").add(this.addEndTime, "m").format("LT"));
    }
    else {
      endTime = (moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + "HH:mm A").add(this.addEndTime, "m").format("LT"));
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

  checkAppointmentStatus(event) {
    this.formCompanyforExcel.get('isRecurreringAppointment').setValue(event?.checked);
    this.formCompanyforExcel.updateValueAndValidity();
    this.isRecurreringAppointment = event.checked;
    if (this.isRecurreringAppointment) {
      this.formCompanyforExcel.get('appointmentEndDate').setValidators([Validators.required])
    }
    this.formDateValidations()
  }

  formDateValidations() {
    let selectedDate = moment(this.formCompanyforExcel.get("appointmentStartDate").value ? this.formCompanyforExcel.get("appointmentStartDate").value : this.todayDate);
    this.formCompanyforExcel.get("appointmentEndDate").setValue(selectedDate.format())
    this.minEndDate = selectedDate.format();
    this.maxEndDate = moment(selectedDate.add(this.maxEndDateCount, 'days')).format();
  }

  getScheduledTime(data) {
    this.fromTimePicker = true
    if (data && data.type == 'from') {
      this.formCompanyforExcel.get('appointmentStartTime').setValue(data.value)
      this.setTimeValue(null, 'startTime');
    }
    else {
      this.formCompanyforExcel.get('appointmentEndTime').setValue(data.value);
      this.setTimeValue(null, 'endTime');
    }
  }

  setTimeValue(event, type: string) {
    if (type == "endTime") {
      let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
      let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value, 'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      //let apptStartTime = this.setAppointmentStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat)
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(this.addEndTime, "m").format("LT"));
      else
        this.toMinTime = (moment(dateAndTimeFormat).add(this.addEndTime, "m").format("LT"));
      //this.setAppointmentEndTime(apptStartTime);
      this.callFrom = new Date().getTime();
    } else {
      let timeStr = this.formCompanyforExcel.get("appointmentStartTime").value;
      let dateAndTimeFormat = moment(this.formCompanyforExcel.get("appointmentStartDate").value, 'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      let timeAheadBy5 = moment(dateAndTimeFormat, 'YYYY-MM-DD H:m A');
      let aaptEndTime;
      if (this.is24hourFormat) {
        // aaptEndTime = convertTime12to24(this.roundToNumber(moment(timeAheadBy5)).format("LT"));
        aaptEndTime = convertTime12to24((moment(timeAheadBy5)).add(this.addEndTime, "m").format("LT"));
      }
      else {
        // aaptEndTime = (this.roundToNumber(moment(timeAheadBy5)).format("LT"));
        aaptEndTime = ((moment(timeAheadBy5)).add(this.addEndTime, "m").format("LT"));
      }
      this.formCompanyforExcel.get("appointmentEndTime").setValue(aaptEndTime);
      this.formCompanyforExcel.updateValueAndValidity();
      this.callTo = new Date().getTime();
    }
  }

  removeValidator(emailOrPhone) {
    if (this.enterPrise) {
      if (emailOrPhone == "email") {
        this.formCompanyforExcel.controls.emailId.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
        this.formCompanyforExcel.controls.emailId.updateValueAndValidity()
        this.formCompanyforExcel.controls.visitorMobileNumber.reset();
        this.formCompanyforExcel.controls.visitorMobileNumber.clearValidators()
        this.formCompanyforExcel.controls.visitorMobileNumber.updateValueAndValidity()
      } else if (emailOrPhone == "cell") {
        this.formCompanyforExcel.controls.emailId.setValidators([Validators.required])
        this.formCompanyforExcel.controls.emailId.updateValueAndValidity()
        this.formCompanyforExcel.controls.emailId.reset();
        this.formCompanyforExcel.controls.emailId.clearValidators()
        this.formCompanyforExcel.controls.emailId.updateValueAndValidity()
      }
    }
  }

  goToNextSlideEnterprise(currentSlide){
    if (currentSlide === 1) {
      let contactMobile = this.formCompanyforExcel.value.visitorMobileNumber?.number != null ? removeSpecialCharAndSpaces(this.formCompanyforExcel.value.visitorMobileNumber?.number.toString()) : null
      let isdCode = this.formCompanyforExcel.value.visitorMobileNumber?.dialCode != null ? this.formCompanyforExcel.value.visitorMobileNumber?.dialCode.substring(1) : null

      let validat = false; 
    
      let mobile = this.formCompanyforExcel.controls['visitorMobileNumber'];
      let mail = this.formCompanyforExcel.controls['emailId']; 
      const validateData = {
        isd: isdCode,
        phone: contactMobile,
        emailId: this.formCompanyforExcel.controls.emailId.value,
    }
      if( mobile.value != null ){
        let rmvPlus = mobile.value?.dialCode.substring(1);
        this.selectedCountry = getCountryCode(rmvPlus);
      }
      if(this.visitorAutnticationType == "Both"){
        if( mobile.value == null && mail.value == null ){ 
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else if(mail.status == "INVALID" && mobile.value == null){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else if(mobile.status == "INVALID"){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else{ validat = true; }
      }else if( this.visitorAutnticationType == "Email" ){
        if(mail.value == null){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else if(mail.status == "INVALID"){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else{ validat = true; }
      }else if( this.visitorAutnticationType == "Cell" ){
        if(mobile.value == null){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else if(mobile.status == "INVALID"){
          if(!this.formCompanyforExcel.valid) { this.formCompanyforExcel.markAllAsTouched(); }
        }else{ validat = true; }
      }
      if( validat == true ){
        this.appointmentService.getVisitorByEmailPhone(mobile.value, mail.value, true).subscribe((resp) => {
          if (resp && resp.statusCode == 200) {
            if (resp && resp.data) {

              this.currentSlide = this.currentSlide + 1;
              this.scheduleData = resp.data;
              this.photoUrl = resp.data.photoUrl;             
              this.handleIamge(this.scheduleData.photoUrl);
              this.formCompanyforExcel.controls.visitorPhotoUrl.setValue(this.scheduleData.photoUrl)
              this.formCompanyforExcel.controls.firstName.setValue(this.scheduleData.firstName);
              this.formCompanyforExcel.controls.lastName.setValue(this.scheduleData.lastName);
              this.formCompanyforExcel.controls.company.setValue(this.scheduleData.company);
              this.registeredUser = true;
              setTimeout(() => {
                $("#ngxInput input").prop("readonly", true); 
              }, 8000);
            }
            else {
              this.toastr.error("Invalid Email Id or Phone", "Error");
            }
          }
          if (resp && resp.statusCode == 412) {
            this.currentSlide = this.currentSlide + 1;
            this.secndEditableBool = true;
            this.formCompanyforExcel.controls.firstName.setValue("");
            this.formCompanyforExcel.controls.lastName.setValue("");
            this.formCompanyforExcel.controls.company.setValue("");
            this.registeredUser = false;
            setTimeout(() => {
              $("#ngxInput input").prop("readonly", true); 
            }, 8000);
          }
        }, (error) => {
          if(error && error.error.StatusCode == 412){
            this.currentSlide = this.currentSlide + 1;
            this.secndEditableBool = true;
            this.formCompanyforExcel.controls.firstName.setValue("");
            this.formCompanyforExcel.controls.lastName.setValue("");
            this.formCompanyforExcel.controls.company.setValue("");
            this.registeredUser = false;
            setTimeout(() => {
              $("#ngxInput input").prop("readonly", true); 
            }, 8000);
          }else{
            this.toastr.error(error.error.Message);
          }
        })
      }
    }
    if(currentSlide === 2){
      console.log(this.formCompanyforExcel.controls.firstName.status)
      console.log(this.formCompanyforExcel.controls.lastName.status)
      if (
        this.formCompanyforExcel.controls.firstName.status == "VALID" &&
        this.formCompanyforExcel.controls.lastName.status == "VALID"
      ) {
        this.currentSlide = currentSlide + 1;
      } else {
        this.showErrorOnClick();
      } 
    }
    // if (currentSlide === 2) { 
    //   let fName = this.formCompanyforExcel.controls['firstName'].value;
    //   let lName = this.formCompanyforExcel.controls['lastName'].value;
    //   this.firstName = fName;
    //   this.lastName = lName;
    //   if(this.secndEditableBool == true){
    //     if(fName == null && lName == null){
    //       if(!this.formCompanyforExcel.valid) {
    //         this.formCompanyforExcel.markAllAsTouched();
    //       }
    //     }else if(fName == null && lName != null){
    //       if(!this.formCompanyforExcel.valid) {
    //         this.formCompanyforExcel.markAllAsTouched();
    //       }
    //     }else if(lName == null && fName != null ){
    //       if(!this.formCompanyforExcel.valid) {
    //         this.formCompanyforExcel.markAllAsTouched();
    //       }
    //     }else{
    //       this.currentSlide = this.currentSlide + 1;
    //     }
    //   }else{ 
    //     this.currentSlide = this.currentSlide + 1;
        
    //   }
    // }
  }

  async handleIamge(image) {
    try {
      let parserContent = s3ParseUrl(image);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.scheduleData.photoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch (e) {
      this.scheduleData.photoUrl = "assets/images/profile-pic.png";
    }
  }
  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }


  resetForm(){
    if(!this.isAuthentication){
      this.formCompanyforExcel.controls.emailId.reset();
      this.formCompanyforExcel.controls.visitorMobileNumber.reset();
      this.formCompanyforExcel.controls.firstName.reset();
      this.formCompanyforExcel.controls.lastName.reset();
      this.formCompanyforExcel.controls.company.reset();
    }else{
      this.formCompanyforExcel.controls.emailId.reset();
      this.formCompanyforExcel.controls.visitorMobileNumber.reset();
    }
  }
}
