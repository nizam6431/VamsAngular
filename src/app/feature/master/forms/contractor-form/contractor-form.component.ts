import { Component, Inject, Input, OnInit } from '@angular/core';
import { DatePipe, formatDate } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { first } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { CountryData } from "../../models/country-and-time-zone";
import { CommonTabService } from '../../services/common-tab.service';
import { MasterService } from '../../services/master.service';
import { CommonService } from 'src/app/core/services/common.service';
import { regex } from "src/app/shared/constants/regexValidation";
import { ToastrService } from 'ngx-toastr';
import { Observable, OperatorFunction, Subject } from "rxjs";
import { convertToBlob } from "src/app/core/functions/functions";
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { isImageType, removeSpecialCharAndSpaces, convertTime12to24, formatPhoneNumber } from 'src/app/core/functions/functions';
import s3ParseUrl from 's3-url-parser';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { timeStamp } from 'console';
import { ConfigService } from 'aws-sdk';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import moment from 'moment';
import { countryDetails } from 'src/app/feature/appointment/models/country-const';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MY_FORMATS } from "src/app/core/models/users";
import { timeFormat } from 'src/app/core/models/app-common-enum';
import { Status } from "../../constants/dropdown-enums";

@Component({
  selector: 'app-contractor-form',
  templateUrl: './contractor-form.component.html',
  styleUrls: ['./contractor-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ContractorFormComponent implements OnInit {

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  permissionKeyObj = permissionKeys;
  @Input() formData: any;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formContractor: FormGroup;
  public file;
  public imgpreview = false;
  public imageURL;
  public base64textString = [];
  public fileName: string;
  isShow = false;
  isFileTypeError = false;
  selectedIso: any = CountryISO.India;
  separateDialCode = true;
  contractorData: any;
  profileImageUrl: string = "";
  profileImage: any;
  isPhotoCaptured: boolean | undefined;
  webcamImage: WebcamImage | undefined;
  showWebcam = true;
  showImage: boolean = false;

  flagClass: string = "";
  maxLength: string = "15";
  country: string;
  public countries: CountryData;
  public selectedCountry: CountryISO;
  departmentList: any;
  checkMobileNumberRequried = false

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  level3Id: any;
  level2Id: any;
  locations: any;
  sublocations: any = [];
  capturePhoto: boolean = true;
  userData: any;
  dynamicFields: any = {};
  dynamicFieldsKey: any = [];
  contractorCompanyId: string = "";
  contractorCompanyName: string = "";
  location: any;
  subLocation: any;
  department: any;
  runningAppointment: boolean = false;

  statusList = Object.keys(Status);

  //for create pass
  activeAppointment: boolean = false;
  dateFormat: string = "DD-MM-YYYY";
  todayDate: any = new Date();
  fromMinTime: string = "11:30";
  toMinTime: string = "11:30";
  fromMinTimeAppt: string = "11:30";
  currentTimeZone: any;
  countryData: countryDetails;
  timeFormatForTimePicker: number = 24;
  is24hourFormat: boolean = true;
  format24Hr: RegExp = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  format12Hr: RegExp = /^(1[0-2]|0?[1-9]):[0-5][0-9] (AM|PM)$/;
  callTo: number;
  callFrom: number;
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
    format: this.timeFormat == "12" ? timeFormat.format_12_hr : timeFormat.format_24_hr,
    showTwentyFourHours: this.timeFormat == "12" ? false : true,
  };
  timePickerToTimeConfig = {
    showSeconds: false,
    minutesInterval: 5,
    timeSeparator: "",
    min: this.minTime,
    max: "23:59:59",
    format: this.timeFormat == "12" ? timeFormat.format_12_hr : timeFormat.format_24_hr,
    showTwentyFourHours: this.timeFormat == "12" ? false : true,
  };
  minEndDate: any = new Date();
  maxEndDate: any = new Date();
  addEndTime: any = 0;
  fromTimePicker: any;
  doNotSet: any;
  startDateToShow: string;
  locationId: any;
  showTimePicker: boolean = false;

  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    private translate: TranslateService,
    private commonTabService: CommonTabService,
    private commonService: CommonService,
    private masterService: MasterService,
    private toastr: ToastrService,
    private fileUploadService: FileUploadService,
    private uploadService: FileUploadService,
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private configureService: ConfigureService,
    public dialogRef: MatDialogRef<ContractorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.formData = this.data;
    this.contractorData = this.data.data;
    this.validationMessages = {
      firstName: {
        required: translate.instant('EmployeeForm.PleaseEnterFirstName'),
        pattern: translate.instant('EmployeeForm.FirstNameValid'),
        maxlength: translate.instant('EmployeeForm.FirstNameMaxlength'),
      },
      lastName: {
        required: translate.instant('EmployeeForm.PleaseEnterLastName'),
        pattern: translate.instant('EmployeeForm.LastNameValid'),
        maxlength: translate.instant('EmployeeForm.LastNameMaxlength'),
      },
      phone: {
        required: translate.instant('EmployeeForm.RequiredCellNumber'),
      },
      email: {
        required: translate.instant('EmployeeForm.PleaseEnterEmailAddress'),
        email: translate.instant('EmployeeForm.EmailVaild'),
        maxlength: translate.instant('EmployeeForm.EmailMaxlength'),
        pattern: translate.instant('EmployeeForm.EmailPattern'),
      },
      status: {
        required: translate.instant('EmployeeForm.PleaseSelectStatus'),
      },
      departmentId: {
        required: translate.instant('EmployeeForm.PleaseSelectDepartment'),
      },
      level2Id: {
        required: "Please select location",
      },

      level3Id: {
        required: translate.instant('EmployeeForm.PleaseSelectDepartment'),
      },

      contractorPhotoURL: {
        required: "Contractor's photo is required",
      },
      startDate: {
        required: this.translate.instant("error_messages.select_start_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      endDate: {
        required: this.translate.instant("error_messages.select_end_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      startTime: {
        required: this.translate.instant("error_messages.select_start_date"),
        pattern: this.translate.instant("error_messages.valid_date"),
      },
      endTime: {
        required: this.translate.instant("error_messages.select_end_date"),
        pattern: this.translate.instant("error_messages.valid_date"),
      },
    };
  }

  ngOnInit() {
    if (this.formData.mode != "print_pass") {
      this.selectedCountry = CountryISO.India
      if (this.formData.mode == 'add') {
        this.contractorCompanyId = this.formData.companyData.rowData.id;
        this.contractorCompanyName = this.formData.companyData.rowData.companyName;
      }
      this.userData = this.userService.getUserData();
      if (this.formData.mode == 'edit' || this.formData.mode == 'show' || this.formData.mode == 'create_pass') {
        this.activeAppointment = (this.formData.mode == 'create_pass' || (this.formData?.data?.printPass)) ? true : false;
        this.getContractorData()
      } else {
        this.getDetails();
        this.getAllContractorConfig();
        this.createForm();
      }
    }
    // this.formContractor.setValue(this.formData.data)

  }

  getContractorData() {
    this.commonTabService.getContractor({ id: this.formData.data.id }).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.contractorData = resp.data;
        this.dynamicFieldsKey = Object.keys(this.contractorData.contractorDynamic)
        this.dynamicFields = this.contractorData.contractorDynamic;
        this.contractorCompanyId = this.contractorData.contractorCompanyId ? this.contractorData.contractorCompanyId : null;
        this.locationId = this.contractorData.level2Id;
        if (this.contractorData.contractorPhotoURL) {
          this.profileImageUrl = this.contractorData.contractorPhotoURL;
          this.capturePhoto = false;
          this.showWebcam = false;
          this.handleUploadedIamge(this.profileImageUrl)
        }
        this.createForm();
        this.getDetails();
        if (this.formData.mode == "edit" && this.activeAppointment) {
          this.contractorData['startDate'] = this.formData.data?.startDate ? this.formData.data?.startDate : this.todayDate;
          this.contractorData['endDate'] = this.formData.data?.endDate ? this.formData.data?.endDate : this.todayDate;
          this.contractorData['startTime'] = this.formData.data?.startTime ? this.formData.data?.startTime : this.todayDate;
          this.contractorData['endTime'] = this.formData.data?.endTime ? this.formData.data?.endTime : this.todayDate;
          this.setEditData();
        }
      } else {
        this.toastr.error(resp.message ? resp.message : "Something went wrong please try again.", this.translate.instant("pop_up_messages.error"));
      }
    }, error => {
      this.showError(error);
    })
  }

  getAllContractorConfig() {
    let reqBody = {
      "pageSize": 0,
      "pageIndex": 0,
      "orderBy": "name",
      "orderDirection": "ASC",
      "level2Id": null,
      "globalSearch": "",
      "level3Id": null,
      "searchByStatus": null
    }
    this.configureService.getAllContractorConfig(reqBody).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        for (let r of resp['data']['list']) {
          this.dynamicFieldsKey.push(r['configFieldName'])
          this.dynamicFields[r['configFieldName']] = r['configValue'] ? r['configValue'] : "";
        }

      }
    }, (error) => {
      this.showError(error)
    })
  }

  createForm() {
    this.formContractor = this.formBuilder.group({
      contractorCompanyId: [this.contractorCompanyId ? this.contractorCompanyId : null,[Validators.required]],
      level2Id: [this.contractorData?.level2Id ? this.contractorData?.level2Id : null, [Validators.required],],
      level3Id: [this.contractorData?.level3Id ? this.contractorData?.level3Id : null],
      firstName: [this.contractorData?.firstName ? this.contractorData?.firstName : null, [Validators.required, Validators.maxLength(50)]],
      lastName: [this.contractorData?.lastName ? this.contractorData?.lastName : null, [Validators.required, Validators.maxLength(50)],],
      email: [this.contractorData?.email ? this.contractorData?.email : null, [Validators.required, Validators.pattern(regex.EMAIL), Validators.maxLength(250)],],
      isdCode: [this.contractorData?.isdCode ? this.contractorData?.isdCode : null],
      phone: [this.contractorData?.phone ? this.contractorData?.phone : null, [Validators.required]],
      status: [this.contractorData?.status ? this.contractorData?.status : "ACTIVE", [Validators.required],],
      departmentId: [this.contractorData?.departmentId ? this.contractorData?.departmentId : null, [Validators.required],],
      contractorPhotoURL: [this.contractorData?.contractorPhotoURL ? this.contractorData?.contractorPhotoURL : null, [Validators.required],],
      contractorDynamic: [this.contractorData?.contractorDynamic ? this.contractorData?.contractorDynamic : null, [],],
      startDate: [this.contractorData?.startDate ? this.contractorData?.startDate : null],
      endDate: [this.contractorData?.endDate ? this.contractorData?.endDate : null],
      startTime: [this.contractorData?.startTime ? this.contractorData?.startTime : null],
      endTime: [this.contractorData?.endTime ? this.contractorData?.endTime : null],
    });

    if (this.formData.mode == "create_pass") {
      this.formContractor.get('startDate').setValidators([Validators.required])
      this.formContractor.get('endDate').setValidators([Validators.required])
      // this.formContractor.get('startTime').setValidators([Validators.required])
      // this.formContractor.get('endTime').setValidators([Validators.required])
    }
  }

  setEditData() {
    this.doNotSet = true;
    let startDate = moment(this.contractorData?.startDate, this.dateFormat).isValid() ? moment(this.contractorData?.startDate + " " + this.contractorData?.startTime, this.dateFormat) : moment(this.todayDate, this.dateFormat)
    let endDate = moment(this.contractorData?.endDate, this.dateFormat).isValid() ? moment(this.contractorData?.endDate + " " + this.contractorData?.startTime, this.dateFormat) : moment(this.todayDate, this.dateFormat)
    this.todayDate = startDate;
    this.minEndDate = startDate;
    this.formContractor.get('startDate').setValue(startDate)
    this.formContractor.get('endDate').setValue(endDate)
    this.formContractor.get('startTime').setValue(this.contractorData?.startTime)
    this.formContractor.get('endTime').setValue(this.contractorData?.endTime)
    this.formContractor.get('startDate').setValidators([Validators.required])
    this.formContractor.get('endDate').setValidators([Validators.required])
    this.formContractor.get('startTime').setValidators([Validators.required])
    this.formContractor.get('endTime').setValidators([Validators.required])
  }

  getDetails() {
    let apiCall = [];
    this.getVisitorSettings()
    let departmentApiCall = this.commonTabService
      .getDepartments({ pageSize: 0, pageIndex: 0, levelId: null })
      .pipe(first());
    let buildingApiCall = this.masterService
      .getBuildingsForFilter({
        pageSize: 0,
        pageIndex: 0,
        searchStatus: "",
        orderBy: "name",
        sortBy: "ASC",
        globalSearch: "",
      })
      .pipe(first());
    apiCall = [departmentApiCall, buildingApiCall];
    forkJoin(apiCall).subscribe((resp) => {
      this.departmentList = resp[0]["data"]["list"];
      this.department = (this.contractorData && this.contractorData.departmentId) ? this.departmentList.filter(d => d.id == this.contractorData.departmentId)[0] : "";
      if (this.level2Id == null) {
        this.locations = resp[1]["data"]["list"];
        this.location = (this.contractorData && this.contractorData.level2Id) ? this.locations.filter(d => d.id == this.contractorData.level2Id)[0] : "";
      } else {
        this.location = resp[1]["data"]["list"].level2Id ? this.locations.filter(d => d.id == resp[1]["data"]["list"].level2Id)[0] : ""
      }
    });
  }

  checkNumber(event) {
    this.formContractor.controls['phone'].setValue(null);
    // this.formContractor.get("phoneNum").patchValue(null, { emitEvent: false, onlySelf: true });
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }
  createRequestBody() {
    return {
      contractorCompanyId: this.formContractor.value.contractorCompanyId,
      level2Id: this.formContractor.value.level2Id,
      level3Id: null,
      firstName: this.formContractor.value.firstName,
      lastName: this.formContractor.value.lastName,
      email: this.formContractor.value.email,
      isdCode: this.formContractor.value.phone.dialCode.slice(1),
      phone: removeSpecialCharAndSpaces(this.formContractor.value.phone.number.toString()),
      status: this.formContractor.value.status,
      departmentId: this.formContractor.value.departmentId,
      contractorPhotoURL: this.profileImageUrl,
      contractorDynamic: this.dynamicFields
    }
  }
  checkEmpty(event: any) {
    if (event.target.value == '') {
      this.checkMobileNumberRequried = true
    }
    else {
      this.checkMobileNumberRequried = false
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formContractor.get(control).touched || this.formContractor.get(control).dirty) && this.formContractor.get(control).errors) {
        if (this.formContractor.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }


  onSubmit() {
    if (this.profileImageUrl && this.profileImageUrl.length > 0) {
      this.formContractor.controls['contractorPhotoURL'].setValue(this.profileImageUrl);
      // this.formContractor.value.contractorPhotoURL = this.profileImageUrl;
    }
    if (this.formData.mode == 'add') {
      this.formContractor.controls['status'].setValue(this.formContractor.value.status || "ACTIVE");
      this.formContractor.controls['contractorCompanyId'].setValue(this.contractorCompanyId || null);
    }
    if (this.formContractor.invalid) {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
      Object.keys(this.formContractor.controls).forEach(field => {
        if (this.formContractor.controls[field]['controls']) {
          this.formContractor.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.formContractor.controls[field].markAsDirty();
          this.formContractor.controls[field].markAsTouched();
        }
      });
    } else {
      if (this.formData.mode == "add") {
        this.addContractor()
      } else {
        if (this.activeAppointment) {
          this.updatePass()
        } else {
          this.updateContractor()
        }
      }
    }
  }

  addContractor() {
    this.commonTabService.addContractor(this.createRequestBody()).pipe(first()).subscribe((resp) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close({ type: "contractors", status: true });
      }
    },
      (error) => {
        this.showError(error);
      }
    );
  }

  setMobileFileds() {
    let tempPhone = removeSpecialCharAndSpaces(this.formContractor.value.phoneNum.number.toString())
    this.formContractor.controls['isdCode'].setValue(this.formContractor.value['phoneNum'].dialCode.substring(1));
    this.formContractor.value['phone'].setValue(removeSpecialCharAndSpaces(this.formContractor.value.phoneNum.number.toString()),);
  }

  updateContractor() {
    let reqObj = this.createRequestBody();
    reqObj['id'] = this.contractorData.id;
    // delete reqObj.contractorCompanyId;
    // this.formContractor.addControl('id', this.formBuilder.control('', [Validators.required]))
    // this.formContractor.controls['id'].setValue(this.contractorData.id);
    this.commonTabService.updateContractor(reqObj).pipe(first()).subscribe((resp) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close({ type: "contractors", status: true });
      }
    },
      (error) => {
        this.showError(error);
      }
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  dynamicValues(key, event) {
    this.dynamicFields[key] = event;
  }

  resetForm() {
    this.onRemovePhoto();
    this.formContractor.reset();
  }

  selectedSublocation(sublocation) {

  }

  showError(error) {
    if ("errors" in error.error) {
      error.error.errors.forEach((element) => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
      });
    } else if ("Message" in error.error) {
      this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
    } else {
      this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
    }
  }

  onFileChange(event) {
    let file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let tempFileName = (file?.name) ? file.name.split(".")[0] + "_" + new Date().getTime() + "." + file.name.split(".")[1] : new Date().getTime() + file.name.split("/")[1];
      // file.name = tempFileName;
      let mainfilePath = "level1/" + this.userData?.level1DisplayId + "/Contractor/photo/" + tempFileName;

      this.uploadService.fileUpload(file, mainfilePath)
        .promise().then(async resp => {
          if (resp && resp.Location) {
            this.profileImageUrl = resp.Location;

            this.handleUploadedIamge(resp.Location, file.type);
            this.imgpreview = true;
            this.showWebcam = false;
          } else {
            this.toastr.error(this.translate.instant('error_messages.upload_failed'), this.translate.instant('pop_up_messages.error'));

          }
        })
    } else {
      this.toastr.error(this.translate.instant('dyanamic_email_template.ristrict_image'), this.translate.instant('pop_up_messages.error'));
    }
  }

  handleImage(webcamImage: WebcamImage) {
    //this.getPicture.emit(webcamImage);
    this.webcamImage = webcamImage;
    this.profileImage = webcamImage.imageAsDataUrl;
    this.showWebcam = false;
    this.showImage = true;
    this.getS3Url()
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  takeSnapshot(): void {
    this.capturePhoto = false;
    this.isPhotoCaptured = true;
    this.trigger.next();
  }

  onRemovePhoto() {
    this.showWebcam = true;
    this.webcamImage = undefined;
    this.capturePhoto = true;
    this.isPhotoCaptured = undefined;
    this.showImage = false
    this.profileImage = undefined;
    this.profileImageUrl = null;
    this.formContractor.controls['contractorPhotoURL'].setValue(this.profileImageUrl);

  }

  async getS3Url() {
    let fileName = "contractor_" + new Date().getTime() + '.jpeg';
    let bucketSavePath = "level1/" + this.userData?.level1DisplayId + "/Contractor/photo/";
    let filePath = convertToBlob(this.webcamImage['_imageAsDataUrl'], { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam(this.webcamImage, bucketSavePath, filePath, fileName).promise();
    if (response && response['key']) {
      this.profileImageUrl = response['Location'];
      // let  resp = await this.fileUploadService.getContentFromS3Url(response['key']).promise();
      // this.visitorPhotoUrl =  this._sanitizer.bypassSecurityTrustUrl(JSON.parse(String.fromCharCode.apply(null, resp?.Body)));
    }
  }

  async handleUploadedIamge(url, imageType?) {
    let newUrl;
    let imgType = imageType ? 'data:' + imageType + ';base64,' : 'data:image/png;base64,';
    try {
      let parserContent = s3ParseUrl(url);
      let resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      this.profileImage = this._sanitizer.bypassSecurityTrustUrl(imgType + this.encode(resp?.Body));
      this.showImage = true;
    }
    catch (e) {
      newUrl = null;
      this.toastr.error(this.translate.instant("pop_up_messages.failed_qr_code"), this.translate.instant('pop_up_messages.error'))
    }
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  onDate(event) {
    let selectDate = moment(event);
    let todayDate = moment(this.todayDate);
    if (selectDate.format("L") != todayDate.format("L")) {
      //let timeStr = "00:00";
      let timeStr = "07:00";
      let dateAndTimeFormat = moment(event).format("YYYY-MM-DD") + " " + timeStr;
      let apptStartTime = this.setStartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat) {
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(15, "m").format(timeFormat.format_24_hr));
        this.fromMinTimeAppt = convertTime12to24(this.roundToNumber(moment(event)).format(timeFormat.format_24_hr));
      }
      else {
        this.toMinTime = (moment(dateAndTimeFormat).add(15, "m").format(timeFormat.format_12_hr));
        this.fromMinTimeAppt = (this.roundToNumber(moment(event)).format(timeFormat.format_12_hr));

      }
      this.setEndTime(apptStartTime);
      this.formDateValidations()
    } else {
      this.getCurrentTimeZone(this.currentTimeZone);
    }
  }
  formDateValidations() {
    let selectedDate = moment(this.formContractor.get("startDate").value ? this.formContractor.get("startDate").value : this.todayDate);
    this.formContractor.get("endDate").setValue(selectedDate.format())
    this.minEndDate = selectedDate.format();
  }

  getVisitorSettings() {
    if (this.formData.mode == "add") {
      return;
    }
    // if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
    //   locationId = this.userData?.level2List?.find(location => location.isDefault == true)['id'];
    // }
    this.masterService.getBuildingDetail(this.locationId)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            // this.addEndTime = response?.accountConfig?.data.minDuration;
            this.timeFormatForTimePicker = (response?.data?.accountConfig?.timeFormat) ? (response?.data?.accountConfig?.timeFormat) : 24;
            this.is24hourFormat = (this.timeFormatForTimePicker === 24) ? true : false;
            this.showTimePicker = true;
            if (this.is24hourFormat) {
              this.timeFormat = 24
              this.formContractor.get('startTime').setValidators([Validators.pattern(this.format24Hr)]);
              this.formContractor.get('endTime').setValidators([Validators.pattern(this.format24Hr)])
            }
            else {
              this.timeFormat = 12
              this.formContractor.get('startTime').setValidators([Validators.pattern(this.format12Hr)]);
              this.formContractor.get('endTime').setValidators([Validators.pattern(this.format12Hr)])
            }
            this.currentTimeZone = response?.data?.accountConfig?.timezone;

            this.getCurrentTimeZone(this.currentTimeZone);
            this.dateFormat = response?.data?.accountConfig?.dateFormat.toUpperCase();
            this.masterService.setDateFormat(
              // response?.data?.dateFormat || "dd-MM-yyyy"
              response?.data?.accountConfig?.dateFormat || "DD-MM-YYYY"
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
    this.masterService.getCurrentTimeByZone(timezone).subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {
          if (this.formData.mode !== "edit") {

            this.todayDate = this.formData.mode == "edit" ? this.formContractor.get('startDate').value : moment(response?.data);
            this.minEndDate = this.formData.mode == "edit" ? this.formContractor.get('startDate').value : moment(response?.data);

            let timeAheadBy5 = moment(this.todayDate).add(5, "m");
            let apptStartTime = this.setStartTime(timeAheadBy5);
            if (this.is24hourFormat) {
              this.toMinTime = moment(timeAheadBy5).add(15, "m").format(timeFormat.format_24_hr);
              this.fromMinTimeAppt = this.roundToNumber(moment(this.todayDate).add(5, "m")).format(timeFormat.format_24_hr);
            }
            else {
              this.toMinTime = (moment(timeAheadBy5).add(15, 'm').format(timeFormat.format_12_hr));
              this.fromMinTimeAppt = (this.roundToNumber(moment(this.todayDate).add(5, 'm')).format(timeFormat.format_12_hr));
            }
            this.setEndTime(apptStartTime);
          } else {
            let apptStart = moment(moment(this.formContractor.get("startDate").value).format("YYYY-MM-DD") + " " + this.formContractor.get("startTime").value);
            let current = moment(moment(response?.data));
            this.runningAppointment = (apptStart.diff(current, 'minutes')) < 0 ? true : false;
            this.todayDate = this.formData.mode == "edit" && this.runningAppointment ? this.formContractor.get('startDate').value : moment(response?.data);
            
            this.startDateToShow = this.formContractor.get('startDate').value ? this.formContractor.get('startDate').value.format(this.dateFormat) : "";
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

  setStartTime(date) {
    if (this.is24hourFormat)
      this.fromMinTime = this.roundToNumber(moment(date)).format(timeFormat.format_24_hr);
    else
      this.fromMinTime = (this.roundToNumber(moment(date)).format(timeFormat.format_12_hr));

    this.formContractor.get("startTime").setValue(this.fromMinTime);
    this.formContractor.controls["startDate"].setValue(moment(date));
    return this.formContractor.get("startTime").value;
  }

  setEndTime(apptStartTime) {
    let timeStr = this.formContractor.get("startTime").value;
    let dateAndTimeFormat = moment(this.formContractor.get("startDate").value).format(this.dateFormat.toUpperCase()) + " " + timeStr;
    let endTime;
    if (this.is24hourFormat) {
      endTime = (moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + timeFormat.format_12_hr).add(this.addEndTime, "m").format(timeFormat.format_24_hr));
    }
    else {
      endTime = (moment(dateAndTimeFormat, this.dateFormat.toUpperCase() + timeFormat.format_12_hr).add(this.addEndTime, "m").format(timeFormat.format_12_hr));
    }
    this.formContractor.get("endTime").setValue(endTime);
  }

  getScheduledTime(data) {
    this.fromTimePicker = true
    let currentTimeFormat = this.is24hourFormat ? timeFormat.format_24_hr : timeFormat.format_12_hr;
    if (data && data.type == 'from') {
      this.formContractor.get('startTime').setValue(moment(data.value, currentTimeFormat).format(currentTimeFormat))
      this.setTimeValue(null, 'startTime');
    }
    else {
      this.formContractor.get('endTime').setValue(moment(data.value, currentTimeFormat).format(currentTimeFormat));
      this.setTimeValue(null, 'endTime');
    }
  }

  setTimeValue(event, type: string) {
    if (type == "endTime") {
      let timeStr = this.formContractor.get("startTime").value;
      let dateAndTimeFormat = moment(this.formContractor.get("startDate").value, 'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      //let apptStartTime = this.setstartTime(moment(dateAndTimeFormat));
      if (this.is24hourFormat)
        this.toMinTime = convertTime12to24(moment(dateAndTimeFormat).add(this.addEndTime, "m").format(timeFormat.format_24_hr));
      else
        this.toMinTime = (moment(dateAndTimeFormat).add(this.addEndTime, "m").format(timeFormat.format_24_hr));
      //this.setAppointmentEndTime(apptStartTime);
      this.callFrom = new Date().getTime();
    } else {
      let timeStr = this.formContractor.get("startTime").value;
      let dateAndTimeFormat = moment(this.formContractor.get("startDate").value, 'YYYY-MM-DD').format("YYYY-MM-DD") + " " + timeStr;
      let timeAheadBy5 = moment(dateAndTimeFormat, 'YYYY-MM-DD H:m A');
      let aaptEndTime;
      if (this.is24hourFormat) {
        // aaptEndTime = convertTime12to24(this.roundToNumber(moment(timeAheadBy5)).format(timeFormat.format_12_hr));
        aaptEndTime = convertTime12to24((moment(timeAheadBy5)).add(this.addEndTime, "m").format(timeFormat.format_12_hr));
      }
      else {
        // aaptEndTime = (this.roundToNumber(moment(timeAheadBy5)).format(timeFormat.format_12_hr));
        aaptEndTime = ((moment(timeAheadBy5)).add(this.addEndTime, "m").format(timeFormat.format_12_hr));
      }
      this.formContractor.get("endTime").setValue(aaptEndTime);
      this.formContractor.updateValueAndValidity();
      this.callTo = new Date().getTime();
    }
  }

  roundToNumber(date) {
    // "2018-12-08 09:42"
    let start = moment(date);
    if (start.minute() % 5 != 0) {
      let remainder = 5 - (start.minute() % 5);
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

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  createPassRequest() {
    return {
      "contractorId": this.contractorData.id,
      "startDate": moment(this.formContractor.get("startDate").value).format(this.dateFormat),
      "endDate": moment(this.formContractor.get("endDate").value).format(this.dateFormat),
      "startTime": this.formContractor.get("startTime").value,
      "endTime": this.formContractor.get("endTime").value,
      "device": "WEB"
    }
  }

  createNewPass() {
    if (this.formContractor.invalid) {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
      Object.keys(this.formContractor.controls).forEach(field => {
        if (this.formContractor.controls[field]['controls']) {
          this.formContractor.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.formContractor.controls[field].markAsDirty();
          this.formContractor.controls[field].markAsTouched();
        }
      });
    } else {
      this.commonTabService.createContractorPass(this.createPassRequest()).pipe(first()).subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.dialogRef.close({ status: true, type: 'contractors' });
          this.toastr.success(resp.message ? resp.message : "", this.translate.instant("pop_up_messages.success"))
        }
      }, (error) => {
        this.showError(error);
      })
    }
  }

  updatePass() {
    if (this.formContractor.invalid) {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
      Object.keys(this.formContractor.controls).forEach(field => {
        if (this.formContractor.controls[field]['controls']) {
          this.formContractor.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.formContractor.controls[field].markAsDirty();
          this.formContractor.controls[field].markAsTouched();
        }
      });
    } else {
      let reqBody = this.createPassRequest();
      reqBody['contractorPassId'] = this.formData?.data?.contractorPassId;
      reqBody["contractorId"] = this.formData?.data?.id;
      this.commonTabService.updateContractorPass(reqBody).pipe(first()).subscribe((resp) => {
        if (resp.statusCode == 200) {
          this.toastr.success(resp.message ? resp.message : "", this.translate.instant("pop_up_messages.success"))
          this.dialogRef.close({ type: "contractors", status: true });
        }
      }, (error) => {
        this.showError(error);
      })
    }
  }
}