import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  Inject
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, OperatorFunction, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  first,
  startWith,
  switchMap,
  tap,
} from "rxjs/operators";
import { ErrorsService } from "src/app/core/handlers/errorHandler";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { IpConfigService } from "src/app/core/services/ip-config.service";
import { of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  atLeastOne,
  showValidationMessageForDynamicContent,
  showValidationMessages,
} from "src/app/core/validators/atleastOne.validator";
import { CommonService } from "src/app/core/services/common.service";
import {
  base64ToBufferAsync,
  calcTime,
  calcUTCTimeForSpecificDate,
  capitalizeFirstLetter,
  convertTime12to24,
  convertToBlob,
  matcherResult,
  PrintPDF,
  resizeImage,
  templateResult,
  templateSelection,
} from "src/app/core/functions/functions";
import { formatDate } from "@angular/common";
import moment from "moment";
import { DomSanitizer } from '@angular/platform-browser';
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Select2OptionData } from "ng-select2";
import { AppointmentDetailService } from "src/app/core/services/appointment-detail.service";

import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../../../core/services/user.service";
import { excel_walkin_screens, ProductTypes } from "../../../core/models/app-common-enum";
import {
  formatPhoneNumber,
  removeSpecialCharAndSpaces,
  getCountryCode
} from "src/app/core/functions/functions";
import { environment } from "src/environments/environment";
import { AppointmentService } from "../services/appointment.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScanDrivingLicenceComponent } from "../scan-driving-licence/scan-driving-licence.component";
import { AccuantService } from "src/app/core/services/accuant.service";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
// import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { FileUploadService } from '../../../shared/services/file-upload.service'
import { regex } from "src/app/shared/constants/regexValidation";
import { TranslateService } from "@ngx-translate/core";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import s3ParseUrl from 's3-url-parser';
import { ConfirmVisitorRestrictionComponent } from "../confirm-visitor-restriction/confirm-visitor-restriction.component";

declare var $: any;
@Component({
  selector: 'app-walkin-new',
  templateUrl: './walkin-new.component.html',
  styleUrls: ['./walkin-new.component.scss']
})
export class WalkinNewComponent implements OnInit {
  public isExcel = environment.IsExcel;
  loginUser: any;
  public excelWalkinForm: FormGroup;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  SearchCountryField = SearchCountryField;
  separateDialCode = true;
  hostCompanyList;
  originalHostCompanyList;
  selectedBuilding: number = null;
  showPage: string = "";
  idProofDetails: any;
  dlvisitorphotosrc: any;
  visitorData: any;
  visitorName: any;
  visitorRole: any;
  visitorRemark: any;
  isShown: boolean = false;
  permissionKeyObj = permissionKeys;

  @Input() locationId: number = 0;
  validationMessages = {
    level2DisplayId: {
      required: "Please enter host company.",
    },
    hostCompany: {
      required: "Please enter host company.",
    },
    hostType: {
      required: "Pleaser select host"
    },
    visitPurposeId: {
      required: "Pleaser select visit purpose"
    },
    visitorTypeId: {
      required: "Pleaser select visitor type"
    },
    duration: {
      required: "Pleaser select Duration"
    },
    firstName: {
      required: "Please enter first name.",
      maxlength: "Maximum characters allowed: 50",
    },
    lastName: {
      required: "Please enter last name.",
      maxlength: "Maximum characters allowed: 50",
    },
    visitorCompany: {
      required: 'Please enter company name.',
      maxlength: "Maximum characters allowed: 100",
    },
    email: {
      pattern: "Please enter valid email.",
      // required: 'Please enter valid email or phone number.',
      maxlength: "Maximum characters allowed: 100",
    },
    visitorMobileNumber: {
      required: "Enter valid cell number.",
    },
    emailId: {
      required: "Enter Email ID.",
      pattern: "Please enter valid email.",
      // required: 'Please enter valid email or phone number.',
      maxlength: "Maximum characters allowed: 100",
    },
    question0: {
      required: "Please enter answer",
    },
    question1: {
      required: "Please enter answer",
    },
    question2: {
      required: "Please enter answer",
    },
  };
  notificationType: number;
  public isdCodes: Array<Select2OptionData> = [];
  allIsdCodes: any[] = [];
  purposeOfVisits: any[] = [];
  currentSlide: number = 1;
  fullname: string = "";
  fullnameTranslate: any;
  showdlpic: boolean = false;
  walkinFirstForm: FormGroup;
  walkinSecondForm: FormGroup;
  capturePhoto: boolean = true;
  //TODO: question list from api
  public otherQuestion: any = [
    { question: "me", mandatory: true },
    { question: "you", mandatory: false },
    { question: "we", mandatory: true },
  ];
  durationOptions: any[] = [
    { id: 15, value: "00:15" },
    { id: 30, value: "00:30" },
    { id: 45, value: "00:45" },
    { id: 60, value: "01:00" },
    { id: 75, value: "01:15" },
    { id: 90, value: "01:30" },
    { id: 105, value: "01:45" },
    { id: 120, value: "02:00" },
    { id: 135, value: "02:15" },
    { id: 150, value: "02:30" },
    { id: 165, value: "02:45" },
    { id: 180, value: "03:00" },
    { id: 195, value: "03:15" },
    { id: 210, value: "03:30" },
    { id: 225, value: "03:45" },
    { id: 240, value: "04:00" },
    { id: 255, value: "04:15" },
    { id: 270, value: "04:30" },
    { id: 285, value: "04:45" },
    { id: 300, value: "05:00" },
    { id: 315, value: "05:15" },
    { id: 330, value: "05:30" },
    { id: 345, value: "05:45" },
    { id: 360, value: "06:00" },
    { id: 375, value: "06:15" },
    { id: 390, value: "06:30" },
    { id: 405, value: "06:45" },
    { id: 420, value: "07:00" },
    { id: 435, value: "07:15" },
    { id: 450, value: "07:30" },
    { id: 465, value: "07:45" },
    { id: 480, value: "08:00" },
    { id: 495, value: "08:15" },
    { id: 510, value: "08:30" },
    { id: 525, value: "08:45" },
    { id: 540, value: "09:00" },
  ];
  searchUser: any;
  searching: boolean = false;
  searchFailed: boolean = false;

  hostId: number = 0;
  hostFirstName: string;
  hostLastName: string;
  hostEmail: string;
  hostIsdCode: string;
  hostMobile: string;
  hostCompany: string;

  isResent: boolean = false;
  isOTPError: boolean = false;
  isPINError: boolean = false;
  checkinForm: FormGroup;
  bypassPinForm: FormGroup;

  timeLeft: number = 30;
  interval: any;
  // timezone: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
  // dateFormat: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  // timeFormat: any = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeFormat;
  // printerType: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).PrinterType;
  // locationName: string = JSON.parse(localStorage.getItem("currentLocation")!).LocationName;
  // currentLocation: any = JSON.parse(localStorage.getItem("currentLocation")!);

  timeZoneOffset: number;

  showWebcam = true;
  isPhotoCaptured: boolean | undefined;
  webcamImage: WebcamImage | undefined;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  visitorsInfo: FormArray;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  visitorThumbnail: string = "";
  visitorId: number = 0;
  isShowWalkin: boolean = true;
  permissions: any[] = [];
  isBypassMode: boolean = false;
  questionsFields: any = [];
  showPassData: any;
  @ViewChild("firstform") firstForm: NgForm;
  @ViewChild("secondform") secondform: NgForm;
  @ViewChild("thirdform") thirdform: NgForm;
  @ViewChild("fourthform") fourthform: NgForm;
  @ViewChild("cancelAppointment") cancelAppointmentModal: TemplateRef<any>;
  @ViewChildren("otpVal") otpControls: ElementRef<any>;
  @ViewChildren("bypassPin") bypassPinControls: ElementRef<any>;
  @Output() walkinActionCompleted = new EventEmitter<boolean>();
  modalServiceReference: any;
  hideOtherDetails: boolean = false;
  options: any;
  isHSQAlreadyFilled: boolean = false;
  HSQAlreadyFilledErrorMessage: string = "";
  currentForm: number = 0;
  buildingName: string = "";
  public selectedCountry: CountryISO = CountryISO.India;
  walkinProcess: boolean = false;
  public visitorPhotoUrl;
  userData: any;
  visitorDrivingLicencePhotoUrl: string;
  isS3UploadCompleted: boolean;
  filteredOptions: Observable<string[]>;
  selectedHostCompanyId: any;
  showByPass: boolean;
  hasError: boolean = true;
  notes: any;
  pinValue: string = "";
  otpValue: string = "";
  nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  walkinWithBioAuth: boolean;
  isEmailMandatory: boolean;
  isCellMandatory: boolean;
  isLevel1Reception:boolean = false;
  isBuildingHasError: boolean = false;
  showStatus:number = null;
  ProductType = ProductTypes;
  productType: any;
  visitorAutnticationType: any;
  enterPrise: boolean;
  public phoneValidation: boolean = true;
  walkVisitorData: any;
  secndEditableBool: boolean = false;
  purposeOfVisitorData: any;
  visitorTypeData: any;
  appointmentDurationTypeData = [
    {"id":'1', "value":1},
    {"id":'2', "value":2},
    {"id":'3', "value":3},
    {"id":'4', "value":4},
    {"id":'5', "value":5},
    {"id":'6', "value":6},
    {"id":'7', "value":7},
    {"id":'8', "value":8},
    {"id":'9', "value":9}
  ];
  errornda: boolean = false;
  ndaCheckin: any;
  ndaDocumentUrl: any;
  otpv: any ;
  sendOtpFl: boolean = true;
  errorotp: boolean = false;
  ndaDocument: any;
  @ViewChildren("otps") otpsControls: ElementRef<any>;
  qrCode: any;
  scanners: boolean = false;
  firstName: any;
  lastName: any;
  hostNamePlace = '';
  hostTypeData = [];
  originalBuildingList = [];
  subDomain: string;
  //originalBuildingList: Observable<string[]>;
  //originalBuildingList: any[] = [];
  allFieldRequired:boolean = false;
  photoUrl = '';
  errorQR: boolean = false;
  registeredUser: boolean = false;
  hostNameFlag: boolean;
  feature:any;
  defaultTime: string = "03:00";
  timeFormatForTimePicker: number = 12;
  callFrom = new Date().getTime();
  isStartGreatThanEndTime: boolean = false;
  SeepzWorkFlow:any;
  mobileNumberValid: boolean = false;
  atLeast15min: boolean;

  constructor(
    private dashboardService: DashboardService,
    private errorService: ErrorsService,
    private ipconfigService: IpConfigService,
    private _fb: FormBuilder,
    private commonService: CommonService,
    private appointmentDetailService: AppointmentDetailService,
    private dialogService: NgbModal,
    private toastr: ToastrService,
    private userService: UserService,
    private appointmentService: AppointmentService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WalkinNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accuantService: AccuantService,
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
    private translate: TranslateService
  ) {
    this.isLevel1Reception = this.userService.isLevel1Reception();
   
    this.userData = this.userService.getUserData();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
 
    this.getDetails();
    // this.validationMessagesForExcel = {
    //   hostCompanyName: {
    //     required: 'Please enter host company.',
    //   },
    //   firstName: {
    //     required: 'Please enter first name.',
    //     maxlength: 'Maximum characters allowed: 50'
    //   },
    //   lastName: {
    //     required: 'Please enter last name.',
    //     maxlength: 'Maximum characters allowed: 50'
    //   },
    //   visitorCompany: {
    //     // required: 'Please enter company name.',
    //     maxlength: 'Maximum characters allowed: 100'
    //   },
    //   email: {
    //     email: 'Please enter valid email.',
    //     // required: 'Please enter valid email or phone number.',
    //     maxlength: 'Maximum characters allowed: 150'
    //   },
    // };

    if (!this.isExcel) {
      this.options = {
        templateResult: templateResult,
        templateSelection: templateSelection,
        dropdownCssClass: "isd-space",
        width: "100%",
        matcher: matcherResult,
      };
      // commonService.getPermissions().then((value: any) => {
      //   this.permissions = value;
      // });
      this.dashboardService
        .getISDCodes()
        .pipe(first())
        .subscribe(
          (data: any) => {
            data.Data.forEach((element: any) => {
              this.isdCodes.push({
                id: element.IsdCode,
                text: "+" + element.IsdCode,
                additional: element.ISOCode,
              });
            });
            this.allIsdCodes = data.Data;
          },
          (error: any) => {
            //this.errorService.handleError(error);
          }
        );

      // this.ipconfigService.getIPAddress().subscribe((res: any) => {
      //   this.ipAddress = res.ip;
      // });
    }
  }
  getDetails() {
    if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
      let locationId = this.userData?.level2List?.find(location => location.isDefault == true);
      if (locationId) {
        this.getVisitorSettings(locationId.id);
      } else {
        this.toastr.error(this.translate.instant('pop_up_messages.defalut_location_not_found'));
      }
    }
    else if (this.userData && this.userData?.level1Id) {
      this.getVisitorSettings(null);
    }
  }

  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.walkinWithBioAuth = response.data.walkinWithBioAuth;
      } else {
        this.toastr.error(response.message);
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

  getPurposeOfVisit() {
    this.dashboardService
      .getPurposeOfVisits(this.locationId)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.purposeOfVisits = data.Data;
        },
        (error: any) => {
          this.dialogService.dismissAll("dd");
          //this.errorService.handleError(error);
        }
      );
  }

  private _filter(value: string): string[] {
    if (typeof (value) == 'string') {
      const filterValue = value.toLowerCase();
      return this.originalHostCompanyList.filter(option => option.name.toLowerCase().startsWith(filterValue) || option.shortName.toLowerCase().startsWith(filterValue) || option.officeNumber.toLowerCase().startsWith(filterValue));
    }
    else {
      return []
    }
  }

  ngOnInit(): void { 
    if( this.userData.feature != undefined || this.userData.feature != null ){
      this.feature = this.userData.feature;
    }
    // increment by 1hours 
   let formatDate= new Date(new Date().getTime() + 60 * 60000);

    this.defaultTime = formatDate.getHours() + ":" + formatDate.getMinutes();

    
    this.timeFormatForTimePicker = this.data.visitorSettings.timeformat;
    this.subDomain = environment.Subdomain.toLowerCase();
    this.hostNamePlace = this.translate.instant('VisitorsDetails.HostName');
    this.productType = this.data.productType;
    this.visitorAutnticationType = this.data?.visitorSettings?.visitorAuthenticationType;
    if ( this.feature.workFlow == 'SEEPZ' || this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital ) {
      this.enterPrise=true;
      this.getPourposeOfVisittor();
      this.getTypeVisitor();
      //this.getAllEmployee();
    }
    //this.formInitForExcel();

    // this.excelWalkinForm = this._fb.group({
    //   firstName: ["", [Validators.required, Validators.maxLength(50)]],
    //   lastName: ["", [Validators.required, Validators.maxLength(50)]],
    //   hostType: ["", [Validators.required, Validators.maxLength(250)]],
    //   visitPurposeId: ["", [Validators.required]],
    //   visitorTypeId: ["", [Validators.required]],
    //   duration: ["", [Validators.required]]
    // });


    this.accuantService.initialize("127.0.0.1", 1961, this.accuantCallBack);

    this.accuantService.connect();

    this.accuantService.AccuantDataEmitter.subscribe(
      (data: any) => {

        this.accuantCallBack(data);
      });

    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
    // this.getPurposeOfVisit();
    this.createForm(null);
    this.excelWalkinForm.controls['hostCompany'].valueChanges.subscribe((value) => {
      if (typeof (value) == 'string') {
        if (value.includes('|')) {
          let arrayOfcmp = value.split('|');
          if (arrayOfcmp && arrayOfcmp.length > 0) {
            arrayOfcmp.forEach((element) => {
              this.hostCompanyList = this._filter(element);
            })
          }
        }
        else {
          this.hostCompanyList = this._filter(value);
        }
      }
      else {
        if (value && value.name && value.officeNumber && value.shortName) {
          this.hostCompanyList = this._filter(value.name);
          this.hostCompanyList = this._filter(value.shortName);
          this.hostCompanyList = this._filter(value.officeNumber);
        }
      }
    });
    if (this.isExcel) {
      this.showPage = excel_walkin_screens.walkin_form;
    }

    this.loginUser = this.userService.getUserData();
    if (this.loginUser && !this.isLevel1Reception) {
      this.buildingName = this.loginUser?.selectedBuilding?.name;
      this.selectedBuilding = this.loginUser?.selectedBuilding?.id;
      this.companiesFromBuilding(this.selectedBuilding);
    }

    // this.walkinSecondForm = this._fb.group({
    //   emailSecond: ['', [Validators.email, Validators.maxLength(250)]],
    //   cellnumber: ['', [Validators.pattern("[0-9]{10}")]],
    //   isdCodeSecond: [JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode, [Validators.required]],
    //   firstname: ['', [Validators.required, Validators.maxLength(50)]],
    //   lastname: ['', [Validators.required, Validators.maxLength(50)]],
    //   company: ['', [Validators.maxLength(100)]],
    //   host: ['', [Validators.required]],
    //   duration: ['', [Validators.required]],
    //   selectedPurpose: ['', [Validators.required]],
    //   meetingNotes: ['', [Validators.maxLength(256)]],
    // }, { validator: atLeastOne(Validators.required, ['cellnumber', 'emailSecond']) });

    this.walkinSecondForm = this._fb.group({
      hostCompany: ["", [Validators.required, Validators.maxLength(250)]],
      // hostName: ['', [Validators.required, Validators.maxLength(250)]],
      firstName: ["", [Validators.required, Validators.maxLength(50)]],
      lastName: ["", [Validators.required, Validators.maxLength(50)]],
      email: ["", [Validators.maxLength(250), Validators.pattern(regex.EMAIL)]],
      phonenumber: ["", [Validators.pattern("[0-9]{10,10}")]],
      visitorCompany: ["", [Validators.required]],
    });
    this.visitorsInfo = this.walkinSecondForm.get("usersInfo") as FormArray;

    this.checkinForm = this._fb.group({
      otp: ["", [Validators.required, Validators.pattern("[0-9]{4}")]],
      pin: ["", [Validators.required, Validators.pattern("[0-9]{6}")]],
    });

    this.bypassPinForm = this._fb.group({});

    // if (this.isLevel1Reception) {
    //   this.toggleToShowCompany();
    // } else{
    //   this.toggleShow();
    // }
    if( this.data.visitorSettings.sendNDA == true ){
      this.appointmentService.getNdaDocument(this.data.visitorSettings.level2Id, this.subDomain).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.ndaDocument = response.data; 
          this.getPdf();
        }
      }, (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message,this.translate.instant('pop_up_messages.error'));
        }
      });
    }
    let allempl = {"pageSize": 0,"pageIndex": 0,"orderBy": null,"orderDirection": null,"name": null,"mobileno": null,"email": null,"company": null,"department": null,"status": null,"role": null,"level3DisplayId": null,"globalSearch": null,
    "level2Id": this.data.visitorSettings.level2Id}
    this.appointmentService.getAllEmployee(allempl).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.hostTypeData = data.data.list;
        this.originalBuildingList = data.data.list;
       
      }

    });
    //setTimeout(() => {
      this.excelWalkinForm.controls['hostType'].valueChanges.subscribe((value)=>{
        this.hostTypeData = this._filters(value);
      });
    //}, 500);
      
    // this.originalBuildingList = this.excelWalkinForm.valueChanges
    // .pipe(
    //   startWith(''),
    //   map(val => this.filterVal(val))
    // );
    if( this.userData.feature.workFlow == 'SEEPZ' ){
      this.excelWalkinForm.get('duration').setValue(this.defaultTime)
    }
    //console.log(this.excelWalkinForm)
  }
  getScheduledTime(data) {
     let formatDate= new Date(new Date().getTime() + 1 * 60000);
    let defaultTime = formatDate.getHours() + ":" + formatDate.getMinutes();

    let apptStartTime = defaultTime;
    let apptEndTime = data.value;
 
    let apptStart = moment(moment(new Date()).format("YYYY-MM-DD") + " " + apptStartTime);
    let apptEnd = moment(moment(new Date).format("YYYY-MM-DD") + " " + apptEndTime);
    this.isStartGreatThanEndTime = (apptEnd.diff(apptStart, 'minutes')) < 0 ? true : false;
    let atLeast15min = (apptEnd.diff(apptStart, 'minutes')) < 15 ? true : false;
    
    console.log(this.isStartGreatThanEndTime,'isStartGreatThanEndTime11')
    // if (this.isStartGreatThanEndTime) {
    //   this.toastr.warning(this.translate.instant("toster_message.appointment_time"), this.translate.instant("toster_message.warning"));
    // }

    this.excelWalkinForm.get('duration').setValue(data.value)
  }

  filterVal(val: string): string[] {
    return this.hostTypeData.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  displayWithus(user){ 
    return user && user.name ? user.name + ' - ' + user.email : '';  
  }

  private _filters(value: string): string[] {
    let filterValue;
    if(value && JSON.stringify(value).includes('name'))
      filterValue = value['name'].toLowerCase();
    else
      filterValue = value.toLowerCase();
    return this.originalBuildingList.filter(option =>
         option.firstName.toLowerCase().startsWith(filterValue) 
      || option.lastName.toLowerCase().startsWith(filterValue)
      || option.name.toLowerCase().startsWith(filterValue)
      );
  }

  getValuees(event) {
    this.hostNameFlag = false;
    
  }

  async getPdf() {
    this.ndaDocumentUrl = this.ndaDocument.docURL
    let parserContent = s3ParseUrl(this.ndaDocumentUrl);
    let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.ndaDocumentUrl = this._base64ToArrayBuffer(this.encode(data?.Body));
  }
  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  byPassActivated(){
    this.showByPass = true;
    this.sendOtpFl = false;
    this.scanners = false;
    this.hasError = true;
  }

  sendOtpActivated(){
    this.showByPass = false;
    this.sendOtpFl = true;
    this.scanners = false;
    this.hasError = true;
  }

  scanQrActivated(){
    this.showByPass = false;
    this.sendOtpFl = false;
    this.scanners = true;
    this.hasError = true;
  }

  scanSuccessHandler(qrCode) { 
    this.qrCode = qrCode;
    let appointmentId = (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0;
    if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital || this.SeepzWorkFlow){
      if( this.excelWalkinForm.value.emailId == null ){
        this.excelWalkinForm.value.emailId = '';
      }
      let userMobileIsd = ''; let userMobile = '';
      if( this.excelWalkinForm.value.visitorMobileNumber !== null ){
        userMobileIsd = this.excelWalkinForm.value.contactNumber.dialCode.substring(1);
        userMobile = this.excelWalkinForm.value.visitorMobileNumber.number.replace(/[^0-9]/g, '');
      }
      let data = {"appointmentId":null,"otp":"","isdCode":userMobileIsd,"phone":userMobile,"email":this.excelWalkinForm.value.emailId,"qrCode":this.qrCode }
      this.appointmentService.GetByQrCodeAsync_(data).subscribe((resp)=>{
         
          if(resp.statusCode == 200 && resp.errors === null && resp.data.isValidUser){
            //this.appointmentData = resp?.data;
            if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
              if( this.data.visitorSettings.sendNDA == true ){
                this.currentSlide = this.currentSlide+1;
                //this.ndaDocumentUrl = this.ndaDocument.docURL
              }else{
                this.currentSlide = this.currentSlide+2;
              }
            } else if(this.SeepzWorkFlow){
              this.currentSlide = this.currentSlide+2;
            }
            else{
              this.currentSlide = this.currentSlide+1;
            }
          }else{
            this.toastr.error(this.translate.instant(resp.message))
          }
      },
      (error)=>{
        try{
          this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))

        }
        catch(e){
          this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
        }
      })
    }
  }

  scanSuccessHandlers(val, event = null) { 
    if(event.keyCode===13 && event != null){
      // if(val.length < 1){
      //   return;
      // }
      //let idVal = $("#"+event.target.id).val();
     
      this.scanQrCode(val)
    }else{
      //this.scanQrCode(val)
    }
  }

  scanQrCode(val){

    this.qrCode = val;
      let appointmentId = (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0;
      if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital || this.SeepzWorkFlow){
        if( this.excelWalkinForm.value.emailId == null ){
          this.excelWalkinForm.value.emailId = '';
        }
        let userMobileIsd = ''; let userMobile = '';
        if( this.excelWalkinForm.value.visitorMobileNumber !== null ){
          userMobileIsd = this.excelWalkinForm.value.contactNumber.dialCode.substring(1);
          userMobile = this.excelWalkinForm.value.visitorMobileNumber.number.replace(/[^0-9]/g, '');
        }
        let data = {"appointmentId":null,"otp":"","isdCode":userMobileIsd,"phone":userMobile,"email":this.excelWalkinForm.value.emailId,"qrCode":this.qrCode }
        this.appointmentService.GetByQrCodeAsync_(data).subscribe((resp)=>{

            if(resp.statusCode == 200 && resp.errors === null && resp.data.isValidUser == true){
              //this.appointmentData = resp?.data;
              if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
                if( this.data.visitorSettings.sendNDA == true ){
                  this.currentSlide = this.currentSlide+1;
                  //this.ndaDocumentUrl = this.ndaDocument.docURL
                }else{
                  this.currentSlide = this.currentSlide+2;
                }
              }else if(this.SeepzWorkFlow){
                this.currentSlide = this.currentSlide+2;
              }
              else{
                this.currentSlide = this.currentSlide+1;
              }
            }else{
              this.toastr.error(this.translate.instant(resp.message));
              this.scanQrActivated()
            }
        },
        (error)=>{
          try{
            this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))
          }
          catch(e){
            this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
          }
        })
      }
  }
  
  onKeyUpEventByOtp(index, event, length) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) { 
      pos = index - 1;
    } else {      
      pos = index + 1;
    }
    let extra = $("#"+event.target.id).val();
    if (pos > -1 && pos < length) { 
      let cnt = parseInt(event.key);
      let cnt2 = cnt.toString();
      
      // if( cnt2 !== 'NaN'){
      //   this.otpsControls["_results"][pos].nativeElement.focus();
      // }
      if( extra.length > 1 && cnt2 !== 'NaN' ){
        extra = extra.substring(1, 0);
        $("#"+event.target.id).val(extra);
        this.otpsControls["_results"][pos].nativeElement.focus();
      }else if( cnt2 !== 'NaN' ){
        this.otpsControls["_results"][pos].nativeElement.focus();
      }
    }
    if(pos > -1 && event.key == 'Backspace'){
      this.otpsControls["_results"][pos].nativeElement.focus();
    }
   
    if(pos == 4){
      if( extra.length > 1 ){
        extra = extra.substring(1, 0);
        $("#"+event.target.id).val(extra);
      }
      //this.currentSlide = this.currentSlide+1;
      //this.checkByPassError();
      this.hasError = false;
      let votp = $("#otpcodeBox1").val()+''+$("#otpcodeBox2").val()+''+$("#otpcodeBox3").val()+''+$("#otpcodeBox4").val();
      this.otpv = votp;
      
    }
    else{
      this.hasError = true;
    }
  }

  getPourposeOfVisittor() {
    this.appointmentService.getVisitorPurpose().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.purposeOfVisitorData = data.data; 
      }

    })
  }

  getTypeVisitor() {
    this.appointmentService.getVisitorType().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.visitorTypeData = data.data;
      }

    })
  }

  // getAllEmployee() {
  //   this.appointmentService.getAllEmployee().subscribe(data => {
  //     if (!data.error && data.statusCode == 200) {
  //       this.hostTypeData = data.data.list;
  //     }

  //   })
  // }


  removeValidator(emailOrPhone) {
    this.mobileNumberValid = false;
    if (this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital) {
      if (emailOrPhone == "email") {
       
        this.excelWalkinForm.controls.emailId.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
        this.excelWalkinForm.controls.emailId.updateValueAndValidity()
        this.excelWalkinForm.controls.visitorMobileNumber.reset();
        this.excelWalkinForm.controls.visitorMobileNumber.clearValidators()
        this.excelWalkinForm.controls.visitorMobileNumber.updateValueAndValidity()
      } else if (emailOrPhone == "cell") {
        this.excelWalkinForm.controls.emailId.setValidators([Validators.required])
        this.excelWalkinForm.controls.emailId.updateValueAndValidity()
        this.excelWalkinForm.controls.emailId.reset();
        this.excelWalkinForm.controls.emailId.clearValidators()
        this.excelWalkinForm.controls.emailId.updateValueAndValidity()
      }else if (emailOrPhone == "emailId") {

        this.excelWalkinForm.controls.emailId.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
        this.excelWalkinForm.controls.emailId.updateValueAndValidity()
        this.excelWalkinForm.controls.visitorMobileNumber.reset();
        // this.excelWalkinForm.controls.visitorMobileNumber.clearValidators()
        // this.excelWalkinForm.controls.visitorMobileNumber.updateValueAndValidity()
      }
    }
  }

  // formInitForExcel() {
  //   this.formCompanyforExcel = this.formBuilder.group({
  //     appointmentStartDate: [null, [Validators.required]],
  //     appointmentEndDate: [null],
  //     appointmentStartTime: [null, [Validators.required]],
  //     appointmentEndTime: [null, [Validators.required]],
  //     meetingNotes: [null, [Validators.maxLength(250)]],
  //     firstName: [null, [Validators.required, Validators.maxLength(50)]],
  //     lastName: [null, [Validators.required, Validators.maxLength(50)]],
  //     company: [null, [Validators.maxLength(100)]],
  //     visitorMobileNumber: [null],
  //     isRecurreringAppointment: [false],
  //     purposeOfVisit: [null, [Validators.required]],
  //     typeOfVisitor: [null,  [ Validators.required]],
  //     emailId: [null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)],
  //     ],
  //     level2Id: [null,[Validators.required]]
  //   });
  // }


  companiesFromBuilding(selectedBuildingId) {
    this.appointmentDetailService.getCompniesList(selectedBuildingId).subscribe(
      (res: any) => {
        if (res.statusCode == 200 && res.data) {
          this.hostCompanyList = res.data;
          // console.log(this.hostCompanyList)
          this.originalHostCompanyList = res.data;
        } else this.toastr.warning("Companies not available", "Warning");
      },
      (error: any) => {
        this.toastr.error("something went wrong", "Error");
      }
    );
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.excelWalkinForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }

  confirmVisitorRestrictionStatus() { 
    if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
      this.excelWalkinForm.patchValue({
        level2Id: this.data.visitorSettings.level2Id 
        // formControlName2: myValue2 (can be omitted)
      });
      if( this.secndEditableBool == false ){ 
        this.excelWalkinForm.patchValue({
          hostCompany: ''
          // formControlName2: myValue2 (can be omitted)
        });
      }
    }
  
    if (!this.isLevel1Reception){
      this.excelWalkinForm.get('level2Id').clearValidators();
      this.excelWalkinForm.get('level2Id').updateValueAndValidity();
    }
    if( this.userData.feature.workFlow == 'SEEPZ' ){
      this.callBackEndApi()
    }
    if (this.excelWalkinForm.invalid && this.userData.feature.workFlow != 'SEEPZ') {
      this.toastr.warning("There are errors in the form", "Could Not Save");
      Object.keys(this.excelWalkinForm.controls).forEach((field) => {
        if (this.excelWalkinForm.controls[field]["controls"]) {
          this.excelWalkinForm.controls[field]["controls"].forEach(
            (formArrayField) => {
              Object.keys(formArrayField["controls"]).forEach((item) => {
                formArrayField["controls"][item].markAsDirty();
                formArrayField["controls"][item].markAsTouched();
              });
            }
          );
        } else {
          this.excelWalkinForm.controls[field].markAsDirty();
          this.excelWalkinForm.controls[field].markAsTouched();
        }
      });
    } else if(this.userData.feature.workFlow != 'SEEPZ') {
      // let reqBody;
      // if(this.data.productType == "Enterprise"){
      //   reqBody = {
      //     "firstName": this.excelWalkinForm.value?.firstName,
      //     "lastName": this.excelWalkinForm.value?.lastName,
      //     "emailId": (this.excelWalkinForm.value.email) ? this.excelWalkinForm.value.email : "",
      //     "level2Id": this.excelWalkinForm.value?.level2Id,
      //     "level3Id": this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
      //     "companyUnitId": this.userService.getCompanyUnitId(),
      //     "duration": this.excelWalkinForm.value?.duration,
      //     "visitorTypeId": this.excelWalkinForm.value?.visitorTypeId,
      //     "visitPurposeId": this.excelWalkinForm.value?.visitPurposeId
      //   }
      // }else{
      //   reqBody = {
      //     "firstName": this.excelWalkinForm.value?.firstName,
      //     "lastName": this.excelWalkinForm.value?.lastName,
      //     "emailId": (this.excelWalkinForm.value.email) ? this.excelWalkinForm.value.email : "",
      //     "level2Id": this.excelWalkinForm.value?.level2Id,
      //     "level3Id": this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
      //     "companyUnitId": this.userService.getCompanyUnitId()
      //   }
      // }
      let reqBody = {
        "firstName": this.excelWalkinForm.value?.firstName,
        "lastName": this.excelWalkinForm.value?.lastName,
        "emailId": (this.excelWalkinForm.value.email) ? this.excelWalkinForm.value.email : "",
        "level2Id": this.excelWalkinForm.value?.level2Id,
        "level3Id": this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
        "companyUnitId": this.userService.getCompanyUnitId()
      }

      if (this.excelWalkinForm.value.contactNumber && this.excelWalkinForm.value.contactNumber.dialCode) {
        reqBody['isd'] = this.excelWalkinForm.value.contactNumber.dialCode.slice(1);
        reqBody['mobileNo'] = removeSpecialCharAndSpaces(this.excelWalkinForm.value.contactNumber.number.toString());
      }

      this.appointmentService.restrictThisVisitor(reqBody).subscribe((resp) => {
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
          this.toastr.error("something went wrong", "Error");
        })
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmVisitorRestrictionComponent, {
      data: {
        apnt_type: "schedule",
        name: this.excelWalkinForm.value.firstName && this.excelWalkinForm.value.lastName ? this.excelWalkinForm.value.
          firstName + " " + this.excelWalkinForm.value.lastName : "",
        visitorData: this.visitorName + " - " + this.visitorRole,
        visitorRemark: this.visitorRemark,
        pop_up_type: "restricted_visitor",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSubmit();
      }
      else {
        this.dialogRef.close();
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.walkinWithBioAuth) {
      if (this.excelWalkinForm.get('email').value == null && this.excelWalkinForm.get('contactNumber').value == null) {
        this.toastr.warning("Please enter at least one contact detail", "Could Not Save");
      }
      else {
        this.callBackEndApi();
      }
    }
    else {
      this.callBackEndApi();
    }
  }

  async callBackEndApi() {
    if (this.excelWalkinForm.invalid && this.userData.feature.workFlow != 'SEEPZ') {
      this.toastr.warning("There are errors in the form", "Could Not Save");
    } else {

      if (this.idProofDetails && this.idProofDetails.Photo != undefined && this.idProofDetails.Photo != null) {
        await this.getS3UrlFroDLUpload();
      }
console.log(this.createReqForExcel());
    if( this.userData.feature.workFlow != 'SEEPZ' ){
      this.appointmentDetailService
        .createWalkin(this.createReqForExcel())
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data) {
              // this.showPage = excel_walkin_screens.pass_screen;
              this.showPassData = {
                visitor_image: "assets/images/profile-pic.png",
                visitor_name: `${res.data["firstName"]} ${res.data["lastName"]}`,
                date: res.data["appointmentDate"],
                time: res.data["startTime"],
                host_company: res.data["company"],
                badge_number: res.data["badgeNumber"],
                complex_name: res.data["complex"],
                qr_link: res.data["qrCodeLink"],
              };
              this.toastr.success(
                "Walk in appointment created successfully",
                "Success"
              );
              this.close();
              this.dialogRef.close(res);
            } else this.toastr.warning("Companies not available", "Warning");
          },
          (error: any) => {
            if (error && error.error && error.error.Message)
              this.toastr.error(error.error.Message, "Error");
          }
        );
      }else{
        this.appointmentDetailService
        .createWalkinSeepz(this.createReqForExcel())
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data) {
              // this.showPage = excel_walkin_screens.pass_screen;
              this.showPassData = {
                visitor_image: "assets/images/profile-pic.png",
                visitor_name: `${res.data["firstName"]} ${res.data["lastName"]}`,
                date: res.data["appointmentDate"],
                time: res.data["startTime"],
                host_company: res.data["company"],
                badge_number: res.data["badgeNumber"],
                complex_name: res.data["complex"],
                qr_link: res.data["qrCodeLink"],
              };
              this.toastr.success(
                "Walk in appointment created successfully",
                "Success"
              );
              this.close();
              this.dialogRef.close(res);
            } else this.toastr.warning("Companies not available", "Warning");
          },
          (error: any) => {
            if (error && error.error && error.error.Message)
              this.toastr.error(error.error.Message, "Error");
          }
        );
      }
    }
  }

  createReqForExcel() { //console.log(typeof this.excelWalkinForm.value.duration)
    let isd = null;
    let mobNo = null;
    if (
      this.excelWalkinForm.value.contactNumber &&
      this.excelWalkinForm.value.contactNumber.dialCode
    ) {
      isd = this.excelWalkinForm.value.contactNumber.dialCode.slice(1);
      mobNo = removeSpecialCharAndSpaces(
        this.excelWalkinForm.value.contactNumber.number.toString()
      );
    }

    if (this.idProofDetails && this.idProofDetails.Photo != undefined && this.idProofDetails.Photo != null) {
      delete this.idProofDetails.Photo;
      this.idProofDetails.idProofVisitorPhoto = this.visitorDrivingLicencePhotoUrl;
    }

    if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
     
      let otp = ( this.otpv != undefined ) ? this.otpv.toString() : '';
      if( this.pinValue == '' ){
        this.showByPass = false;
      }
        return {
          device: "WEB",
          // "visitorTypeId": 0,
          // "visitPurposeId": 0,
          // "meetingNotes": "string",
          duration: parseInt(this.excelWalkinForm.value.duration),
          employeeId: this.excelWalkinForm.value.hostType.employeeId,
          otp: otp,
          level2Id: this.excelWalkinForm.value.level2Id?this.excelWalkinForm.value.level2Id:this.selectedBuilding,
          level3Id: this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
          // level3Id: JSON.parse(this.excelWalkinForm.value.hostCompany ? this.excelWalkinForm.value.hostCompany :null),
          visitorTypeId: this.excelWalkinForm.value.visitorTypeId,
          visitPurposeId: this.excelWalkinForm.value.visitPurposeId,
          hostCompany: this.excelWalkinForm.value.hostCompany,
          AcuantDLDetails: this.idProofDetails,
          IdProofType: "Driving Licence",
          visitorPhotoUrl: this.visitorPhotoUrl,
          isComplexHost: this.isShown,
          isBypass: this.showByPass,
          userPin: this.pinValue,
          meetingNotes: this.notes,
          visitors: [
            {
              firstName: capitalizeFirstLetter(this.excelWalkinForm.value.firstName),
              lastName: capitalizeFirstLetter(this.excelWalkinForm.value.lastName),
              isdCode: isd,
              phone: mobNo,
              email: this.excelWalkinForm.value.email
                ? this.excelWalkinForm.value.email
                : "",
              visitorCompany: this.excelWalkinForm.value.visitorCompany
                ? capitalizeFirstLetter(this.excelWalkinForm.value.visitorCompany)
                : "",
            },
          ],
        };
      //}
    }else{
      if( this.userData.feature.workFlow != 'SEEPZ' ){
      return {
        device: "WEB",
        // "visitorTypeId": 0,
        // "visitPurposeId": 0,
        // "meetingNotes": "string",
        // "duration": 0,
        //employeeId: this.loginUser.employeeId,
        employeeId: this.excelWalkinForm.value.hostType.employeeId,
        level2Id: this.excelWalkinForm.value.level2Id?this.excelWalkinForm.value.level2Id:this.selectedBuilding,
        level3Id: this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
        // level3Id: JSON.parse(this.excelWalkinForm.value.hostCompany ? this.excelWalkinForm.value.hostCompany :null),
        AcuantDLDetails: this.idProofDetails,
        IdProofType: "Driving Licence",
        visitorPhotoUrl: this.visitorPhotoUrl,
        isComplexHost: this.isShown,
        isBypass: this.showByPass,
        userPin: this.pinValue,
        meetingNotes: this.notes,
        visitors: [
          {
            firstName: capitalizeFirstLetter(this.excelWalkinForm.value.firstName),
            lastName: capitalizeFirstLetter(this.excelWalkinForm.value.lastName),
            isdCode: isd,
            phone: mobNo,
            email: this.excelWalkinForm.value.email
              ? this.excelWalkinForm.value.email
              : "",
            visitorCompany: this.excelWalkinForm.value.visitorCompany
              ? capitalizeFirstLetter(this.excelWalkinForm.value.visitorCompany)
              : "",
          },
        ],
      };
      }else{
        let otp = ( this.otpv != undefined ) ? this.otpv.toString() : '';
        if( this.pinValue == '' ){
          this.showByPass = false;
        }
        return {
          device: "WEB",
          // "visitorTypeId": 0,
          // "visitPurposeId": 0,
          // "meetingNotes": "string",
          meetingEndTime: this.excelWalkinForm.value.duration,
          //employeeId: this.userData.employeeId,
          employeeId: this.excelWalkinForm.value.hostType.employeeId,
          otp: otp,
          //level2Id: this.excelWalkinForm.value.level2Id?this.excelWalkinForm.value.level2Id:this.selectedBuilding,
          level3Id: this.selectedHostCompanyId ? this.selectedHostCompanyId : null,
          // level3Id: JSON.parse(this.excelWalkinForm.value.hostCompany ? this.excelWalkinForm.value.hostCompany :null),
          visitorTypeId: this.excelWalkinForm.value.visitorTypeId,
          visitPurposeId: this.excelWalkinForm.value.visitPurposeId,
          hostCompany: this.excelWalkinForm.value.hostCompany,
          //AcuantDLDetails: this.idProofDetails,
          IdProofType: "Driving Licence",
          visitorPhotoUrl: this.visitorPhotoUrl,
          isComplexHost: this.isShown,
          isBypass: this.showByPass,
          userPin: this.pinValue,
          meetingNotes: this.notes,
          visitors: [
            {
              firstName: capitalizeFirstLetter(this.excelWalkinForm.value.firstName),
              lastName: capitalizeFirstLetter(this.excelWalkinForm.value.lastName),
              isdCode: isd,
              phone: mobNo,
              email: this.excelWalkinForm.value.email
                ? this.excelWalkinForm.value.email
                : "",
              visitorCompany: this.excelWalkinForm.value.visitorCompany
                ? capitalizeFirstLetter(this.excelWalkinForm.value.visitorCompany)
                : "",
            },
          ],
        };
      }
    }
  }

  showOtherDetails() {
    this.hideOtherDetails = !this.hideOtherDetails;
    this.checkForQuestions();
  }

  // goToNextSlide(currentSlide) {
  //   // if (this.walkinSecondForm.invalid) {
  //   //   return;
  //   // } else {

  //   // }

  //   if (currentSlide === 2) {
  //     if (this.email.value) {
  //       this.walkinSecondForm.controls.email.setValue(this.email.value);
  //       this.walkinSecondForm.controls.phonenumber.setValue("");
  //       this.walkinSecondForm.controls.phonenumber.setErrors(null);
  //     }
  //     if (this.phonenumber.value) {
  //       this.walkinSecondForm.controls.phonenumber.setValue(
  //         this.phonenumber.value
  //       );
  //       this.walkinSecondForm.controls.email.setValue("");
  //       this.walkinSecondForm.controls.email.setErrors(null);
  //     }
  //     if (this.walkinSecondForm.invalid) {
  //       return;
  //     }
  //     this.walkinSecondForm.addControl(
  //       "duration",
  //       this._fb.control(null, null)
  //     );
  //     this.walkinSecondForm.controls["duration"].setValidators([
  //       Validators.required,
  //     ]);
  //     this.walkinSecondForm.addControl(
  //       "typeOfVisitor",
  //       this._fb.control(null, null)
  //     );
  //     this.walkinSecondForm.controls["typeOfVisitor"].setValidators([
  //       Validators.required,
  //     ]);
  //     this.walkinSecondForm.addControl(
  //       "purposeOfVisit",
  //       this._fb.control(null, null)
  //     );
  //     this.walkinSecondForm.controls["purposeOfVisit"].setValidators([
  //       Validators.required,
  //     ]);
  //     this.currentSlide = 3;
  //   } else if (currentSlide === 3) {
  //     if (this.walkinSecondForm.invalid) {
  //       return;
  //     }
  //     this.currentSlide = 4;
  //   } else if (currentSlide === 4) {
  //     if (this.checkinForm.controls["pin"].value) {
  //       this.checkinForm.controls["otp"].setValue("");
  //       this.checkinForm.controls["otp"].setErrors(null);
  //     } else {
  //       let errorFound = false,
  //         otpValue = "";
  //       this.otpControls["_results"].forEach((element) => {
  //         if (!element.nativeElement.value) {
  //           this.checkinForm.controls["otp"].setErrors({ required: true });
  //           errorFound = true;
  //         } else {
  //           otpValue += element.nativeElement.value;
  //         }
  //       });
  //       if (!errorFound) {
  //         let otp = this.checkinForm.controls["otp"].setValue(otpValue);
  //       } else {
  //         return;
  //       }
  //     }
  //     if (this.checkinForm.controls["otp"].value) {
  //       this.checkinForm.controls["pin"].setValue("");
  //       this.checkinForm.controls["pin"].setErrors(null);
  //     } else {
  //       let error = false,
  //         pinValue = "";
  //       this.bypassPinControls["_results"].forEach((element) => {
  //         if (!element.nativeElement.value) {
  //           this.checkinForm.controls["otp"].setErrors({ required: true });
  //           error = true;
  //         } else {
  //           pinValue += element.nativeElement.value;
  //         }
  //       });
  //       if (!error) {
  //         let pin = this.checkinForm.controls["pin"].setValue(pinValue);
  //       } else {
  //         return;
  //       }
  //     }
  //     this.currentSlide = 5;
  //   }

  //   //this.currentSlide = 5;
  // }
  getCompanyList(event){
    if (event.value){
      this.isBuildingHasError = false;
      this. companiesFromBuilding(event.value);
      this.excelWalkinForm.controls['hostCompany'].setValue(null);
    }
  }

  async handleIamge(image) {
    try {
      let parserContent = s3ParseUrl(image);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.walkVisitorData.photoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch (e) {
      this.walkVisitorData.photoUrl = "assets/images/profile-pic.png";
    }
  }

  showErrorOnClick() {
    Object.keys(this.excelWalkinForm.controls).forEach((field) => {
      if (this.excelWalkinForm.controls[field]["controls"]) {
        this.excelWalkinForm.controls[field]["controls"].forEach(
          (formArrayField) => {
            Object.keys(formArrayField["controls"]).forEach((item) => {
              formArrayField["controls"][item].markAsDirty();
              formArrayField["controls"][item].markAsTouched();
            });
          }
        );
      } else {
        this.excelWalkinForm.controls[field].markAsDirty();
        this.excelWalkinForm.controls[field].markAsTouched();
      }
    });
  }

  goToNextSlides(currentSlide) {
    console.log(this.excelWalkinForm.get("duration").value)
     
    if (currentSlide == 3 && this.hostTypeData.length == 0) { 
      //if( this.userData.feature.workFlow != 'SEEPZ' ){
        this.currentSlide = this.currentSlide - 1;
        currentSlide = currentSlide - 1;
        this.hostNameFlag = true;
      //}
      //  this.excelWalkinForm.controls['hostType'].setErrors({'message': 'Please select valid building'});
    } else {
      this.hostNameFlag = false;
      // if( this.userData.feature.workFlow == 'SEEPZ' && this.excelWalkinForm.controls['hostType'].value == null ){
      //   this.hostNameFlag = true;
      //   return;
      // }
    }

    if (currentSlide === 1) {
      let validat = false; 
      let mobile = this.excelWalkinForm.controls['visitorMobileNumber'];
      let mail = this.excelWalkinForm.controls['emailId']; 
      if(mobile.value == null && mail.value == null){
        //this.showErrorOnClick();
        this.excelWalkinForm.controls.emailId.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
        this.excelWalkinForm.controls.emailId.updateValueAndValidity()
      }
     
      if( mobile.value != null ){
        let rmvPlus = mobile.value?.dialCode.substring(1);
        this.selectedCountry = getCountryCode(rmvPlus);
        
      }
      if(this.visitorAutnticationType == "Both"){
        if( mobile.value == null && mail.value == null ){ 
          if(!this.excelWalkinForm.valid) { 
            this.excelWalkinForm.markAllAsTouched(); 
          }
        }else if(mail.status == "INVALID"){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else if(mobile.status == "INVALID"){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else{ validat = true; }
      }else if( this.visitorAutnticationType == "Email" ){
        if(mail.value == null){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else if(mail.status == "INVALID"){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else{ validat = true; }
      }else if( this.visitorAutnticationType == "Cell" ){
        if(mobile.value == null){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else if(mobile.status == "INVALID"){
          if(!this.excelWalkinForm.valid) { this.excelWalkinForm.markAllAsTouched(); }
        }else{ validat = true; }
      }
      if( validat == true && this.feature.workFlow != 'SEEPZ' ){
        this.appointmentService.getVisitorByEmailPhone(mobile.value, mail.value, false).subscribe((resp) => {
          if (resp && resp.statusCode == 200) {
            if (resp && resp.data) {
              this.currentSlide = this.currentSlide + 1;
              
              this.walkVisitorData = resp.data;
          
              this.photoUrl = resp.data.photoUrl;
              this.handleIamge(this.walkVisitorData.photoUrl);
              //this.walkVisitorData.phone = "4781549300";
              this.excelWalkinForm.controls.contactNumber.setValue(this.walkVisitorData.phone);
              //this.excelWalkinForm.controls.visitorMobileNumber.setValue(mobile.value.number);
              //this.preferredCountries = mobile.value.countryCode;
              this.excelWalkinForm.controls.firstName.setValue(this.walkVisitorData.firstName);
              this.excelWalkinForm.controls.lastName.setValue(this.walkVisitorData.lastName);
              this.excelWalkinForm.controls.visitorCompany.setValue(this.walkVisitorData.company);
              this.excelWalkinForm.controls.email.setValue(this.walkVisitorData.email);
              this.registeredUser = true;
              
              setTimeout(() => {
                $("#ngxInput input").prop("readonly", true); 
              }, 1000);
            }
            else {
              this.toastr.error("Invalid Email Id or Phone", "Error");
            }
          }
          if (resp && resp.statusCode == 412) {
            //this.toastr.error(resp.message);
            //this.toastr.error(resp.Message);
            this.currentSlide = this.currentSlide + 1;
            this.secndEditableBool = true;
            this.excelWalkinForm.controls.email.setValue(mail.value);
            this.excelWalkinForm.setValue({firstName:'',lastName:'',hostCompany:''});
            this.registeredUser = false;
            setTimeout(() => {
              $("#ngxInput input").prop("readonly", true); 
            }, 1000);
            this.excelWalkinForm.controls.contactNumber.setValue(mobile.value.number);
            //this.excelWalkinForm.controls.visitorMobileNumber.setValue(mobile.value.number);
            //this.preferredCountries = mobile.value.countryCode;
          }
        }, (error) => {
          if(error && error.error.StatusCode == 412){

            //this.toastr.error(error.error.Message);
            this.currentSlide = this.currentSlide + 1;
            this.secndEditableBool = true;
            this.excelWalkinForm.controls.email.setValue(mail.value);
            this.excelWalkinForm.get("firstName").setValue("");
            this.excelWalkinForm.get("lastName").setValue("");
            this.excelWalkinForm.get("hostCompany").setValue("");
            this.registeredUser = false;
            setTimeout(() => {
              $("#ngxInput input").prop("readonly", true); 
            }, 1000);
            this.excelWalkinForm.controls.contactNumber.setValue(mobile.value.number);
            //this.excelWalkinForm.controls.visitorMobileNumber.setValue(mobile.value.number);
            //this.excelWalkinForm.value.visitorMobileNumber = this.excelWalkinForm.controls.contactNumber;
           
            //this.preferredCountries = mobile.value.countryCode;
          }else{
            this.toastr.error(error.error.Message);
          }
        })
      }
      if(this.feature.workFlow == 'SEEPZ'){
      
        if (this.excelWalkinForm.controls['visitorMobileNumber'].value != null && this.excelWalkinForm.controls['visitorMobileNumber'].status != 'INVALID') {
          this.mobileNumberValid = false;
          this.appointmentService.getVisitorByPhone(mobile.value, false).subscribe((resp) => {
            if (resp && resp.statusCode == 200) {
              this.currentSlide = this.currentSlide + 1;
              this.secndEditableBool = true;
              this.excelWalkinForm.controls.contactNumber.setValue(mobile.value.number);
            }
          },
            (error) => {
              //this.passValTrue = false;
              if (error && error.error && "errors" in error.error) {
                error.error.errors.forEach((element) => {
                  this.toastr.error(
                    element.errorMessages[0],
                    this.translate.instant("pop_up_messages.error")
                  );
                });
              } else {
                this.toastr.error(
                  error.error.Message,
                  this.translate.instant("pop_up_messages.error")
                );
              }
            }
          )
        }
        else{
          console.log("error")
          this.mobileNumberValid = true;
        }
      }
    }
    if (currentSlide === 2) { 
      let fName = this.excelWalkinForm.controls['firstName'].value;
      let lName = this.excelWalkinForm.controls['lastName'].value;
      let vCompany = this.excelWalkinForm.controls['visitorCompany'].value; console.log(vCompany)
      this.firstName = fName;
      this.lastName = lName;
      console.log(fName,lName,vCompany)
      console.log(this.secndEditableBool)
      if(this.secndEditableBool == true){
        if (fName == '' && lName == '') {
          console.log(fName, lName)
          if(!this.excelWalkinForm.valid) {
            this.excelWalkinForm.markAllAsTouched();
          }
          this.excelWalkinForm.controls.firstName.setValidators([Validators.required, Validators.maxLength(50)]);
          this.excelWalkinForm.controls.lastName.setValidators([Validators.required, Validators.maxLength(50)]);
          //this.excelWalkinForm.controls.firstName.updateValueAndValidity()
          //this.excelWalkinForm.controls.lastName.updateValueAndValidity()
          return;
        }else if(fName == '' && lName != ''){
          if(!this.excelWalkinForm.valid) {
            this.excelWalkinForm.markAllAsTouched();
          }
          this.excelWalkinForm.controls.firstName.setValidators([Validators.required, Validators.maxLength(50)]);
        }else if(lName == '' && fName != '' ){
          if(!this.excelWalkinForm.valid) {
            this.excelWalkinForm.markAllAsTouched();
          }
          this.excelWalkinForm.controls.lastName.setValidators([Validators.required, Validators.maxLength(50)]);
        } else if ((!fName.replace(/\s/g, '').length || !lName.replace(/\s/g, '').length || !vCompany.replace(/\s/g, '').length || fName == '' || fName == null || lName == '' || lName == null|| vCompany == null || vCompany =='') && this.userData.feature.workFlow == 'SEEPZ') {
          this.toastr.warning(this.translate.instant("pop_up_messages.dont_add_only_space"));
          return;
        }
        else {
          if(vCompany == null && this.userData.feature.workFlow == 'SEEPZ'){
            return;
          }
          this.currentSlide = this.currentSlide + 1;
        }
        
      }else{ 
        this.currentSlide = this.currentSlide + 1;
        
      }
    }
    if (currentSlide === 3) { 
     if(this.userData.feature.workFlow == 'SEEPZ' && this.excelWalkinForm.get("duration").value == '11:59 PM' ){
      this.toastr.warning(this.translate.instant("toster_message.appointment_ent_time"), this.translate.instant("toster_message.warning"));
     }
     else{
      if (!this.isStartGreatThanEndTime) {
        // console.log(this.excelWalkinForm.value.hostType);
        // console.log(this.hostCompanyList)
        // console.log(this.hostTypeData);
        let host = this.excelWalkinForm.controls['hostType'].value;
        let dura = this.excelWalkinForm.controls['duration'].value;
        let visitId = this.excelWalkinForm.controls['visitPurposeId'];
        let visitorId = this.excelWalkinForm.controls['visitorTypeId'];
        // if (host.constructor === Array || dura.constructor === Array || visitId.constructor === Array || visitorId.constructor === Array) {
        //   this.excelWalkinForm.markAsTouched();
        //   this.allFieldRequired = true;
        //   return;
        // }
        if (host.constructor === Array || dura.constructor === Array || visitId.constructor === Array || visitorId.constructor === Array) {
          //this.excelWalkinForm.markAsTouched();
          //return false;
          if (this.userData.feature.workFlow != 'SEEPZ') {
            this.allFieldRequired = true; console.log(host, host.constructor === Array);
            return;
          } else if (this.userData.feature.workFlow == 'SEEPZ') {
            this.allFieldRequired = true;
            return;
            // if (this.secndEditableBool == true) {
            //   this.currentSlide = this.currentSlide + 1;
            // } else {
            //   if (this.data.visitorSettings.sendNDA == true) {
            //     this.currentSlide = this.currentSlide + 2;
            //   } else {
            //     this.currentSlide = this.currentSlide + 3;
            //   }
            // }
          }
        } else {
          this.allFieldRequired = false;
          if (this.secndEditableBool == true) {console.log('host name empty 3', visitId.value, visitorId.value, host)
            if( visitId.value.constructor === Array || 
            visitorId.value.constructor === Array && 
            this.userData.feature.workFlow == 'SEEPZ'){
              //this.hostNameFlag = true;
              this.allFieldRequired = true;
              return;
            }else if(host == ''){
              this.hostNameFlag = true;
              //this.allFieldRequired = true;
              return;
            }else{
              this.currentSlide = this.currentSlide + 1;
            }
          } else {
            if (this.data.visitorSettings.sendNDA == true) {
              this.currentSlide = this.currentSlide + 2;
            } else {
              this.currentSlide = this.currentSlide + 3;
            }
          }
        }
      }
     }

    
    }
    if (currentSlide === 4) {

    }
    if (currentSlide === 5) { 
      if( this.ndaCheckin == false || this.ndaCheckin == undefined ){
        this.errornda = true;
      }else{
        this.currentSlide = this.currentSlide+1;
      }
    }
  }

  goToNextSlide(currentSlide) {
    //debugger;
    if (currentSlide === 1) {
      if(this.showByPass){
        this.appointmentDetailService.validateByPassPin(this.pinValue).subscribe((resp) => {
          if (resp && resp.statusCode == 200) {
            if (resp && resp.data) {
              this.currentSlide = this.currentSlide + 1;
            }
            else {
              this.toastr.error("Invalid By Pass Pin", "Error");
            }
          }
        }, (error) => {
          console.log(error)
        })
      }
      else{
        this.currentSlide = this.currentSlide + 1;
      }
    }

    if (currentSlide === 2) {
      if (this.excelWalkinForm.get('level2Id').errors){
      this.isBuildingHasError = true;
      } else {
        this.isBuildingHasError = false;
      }
      // TODO: Remove if need to removed validation for hostcompany
      // if (this.isLevel1Reception && !this.isShown) {
      //  this.excelWalkinForm.get('hostCompany').clearValidators();
      //  this.excelWalkinForm.get('hostCompany').updateValueAndValidity();
      // }

      if (!this.isLevel1Reception){
        this.excelWalkinForm.get('level2Id').clearValidators();
        this.excelWalkinForm.get('level2Id').updateValueAndValidity();
      }

      if (
        this.excelWalkinForm.controls.firstName.status == "VALID" &&
        (this.excelWalkinForm.controls.hostCompany.status == "VALID") &&
        ( this.excelWalkinForm.controls.level2Id.status == "VALID") &&
        this.excelWalkinForm.controls.lastName.status == "VALID"
        // this.excelWalkinForm.controls.visitorMobileNumber.status == "VALID"
      ) {
        console.log("test")
        this.currentSlide = 3;
      } else {
        // this.showErrorOnClick();
        if (this.excelWalkinForm.invalid) {
          this.toastr.warning("There are errors in the form", "Could Not Save");
          this.formValidation();
        }
      }
    }
  }

  formValidation() {
    Object.keys(this.excelWalkinForm.controls).forEach(field => {
      if (this.excelWalkinForm.controls[field]['controls']) {
        this.excelWalkinForm.controls[field]['controls'].forEach(formArrayField => {
          Object.keys(formArrayField['controls']).forEach(item => {
            formArrayField['controls'][item].markAsDirty();
            formArrayField['controls'][item].markAsTouched();
          });
        });
      } else {
        this.excelWalkinForm.controls[field].markAsDirty();
        this.excelWalkinForm.controls[field].markAsTouched();
      }
    });
  }

  goToPreviousSlide(currentSlide) {
    if (currentSlide === 3) {
      this.currentSlide = this.currentSlide - 1;
      let cellNumber = this.excelWalkinForm.controls.contactNumber.value
      let toggleValue = this.excelWalkinForm.controls.toggleBtnValue.value
      if(cellNumber &&  cellNumber.number)
        this.excelWalkinForm.patchValue({ contactNumber: cellNumber.number })
      this.excelWalkinForm.patchValue(toggleValue)
    }
    // if (currentSlide === 3) {
    //   this.currentSlide = this.currentSlide - 1;
    // }
    if (currentSlide === 2) {
      this.currentSlide = this.currentSlide - 1;
    }
  }
  goToPreviousSlides(currentSlide){
    if(this.SeepzWorkFlow){
      this.hasError = true
    }
    if (currentSlide === 2) {
      this.currentSlide = this.currentSlide - 1;
      if(!this.SeepzWorkFlow){
        let cellNumber = this.excelWalkinForm.controls.contactNumber.value;
        this.excelWalkinForm.patchValue({ visitorMobileNumber: cellNumber.number })
      }else{
        this.excelWalkinForm.controls.firstName.reset()
        this.excelWalkinForm.controls.lastName.reset()
        this.excelWalkinForm.controls.visitorCompany.reset()
      }
    }
    if (currentSlide === 4) {
      this.currentSlide = this.currentSlide - 1;
    }
    if (currentSlide === 5) {
      if( this.secndEditableBool == true ){
        this.currentSlide = this.currentSlide - 1;
      }else{
        this.currentSlide = this.currentSlide - 2;
      }
    }
    if (currentSlide === 6) {
      if(this.data.visitorSettings.sendNDA == true){
        this.currentSlide = this.currentSlide - 1;
      }
      if(this.secndEditableBool == true && this.data.visitorSettings.sendNDA == false){
        this.currentSlide = this.currentSlide - 2;
      }else if(this.secndEditableBool == false && this.data.visitorSettings.sendNDA == false){
        this.currentSlide = this.currentSlide - 3;
      }
      if(this.SeepzWorkFlow){
        this.currentSlide = 4 ;
      }
    }
  }

  hideDiv(userInfo) {
    this.currentForm = userInfo;
  }

  onSelectEvent(){
    if (this.excelWalkinForm.value.level2Id == this.showStatus) {
      this.showStatus = null;
      this.excelWalkinForm.controls['level2Id'].setValue(null);
      this.excelWalkinForm.controls['hostCompany'].setValue(null);
    } else {
      this.showStatus = this.excelWalkinForm.value.level2Id;
    }
  }

  checkForQuestions() {
    if (this.otherQuestion.length) {
      this.otherQuestion.forEach((element, index) => {
        let formName = `question${index}`;
        //let test = this.visitorsInfo.controls[this.visitorsInfo.controls.length-1] as FormGroup;
        this.walkinSecondForm.addControl(
          formName,
          this._fb.control(null, null)
        );

        if (element.mandatory) {
          this.walkinSecondForm.controls[formName].setValidators([
            Validators.required,
          ]);
          this.walkinSecondForm.controls[formName].updateValueAndValidity();
        }
      });
      this.questionsFields = this.otherQuestion;
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
      this.otpControls["_results"][pos].nativeElement.focus();
    }
  }


  ngOnChanges(currentItem: SimpleChanges) {
    // if (currentItem.locationId != undefined) {
    //   if (!currentItem.locationId.firstChange) {
    //     if (currentItem.locationId.previousValue != currentItem.locationId.currentValue) {
    //       this.currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);
    //       this.locationName = JSON.parse(localStorage.getItem("currentLocation")!).LocationName;
    //       this.dateFormat = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
    //       this.timeFormat = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeFormat;
    //       this.timezone = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
    //       this.printerType = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).PrinterType;
    //       this.isdCode?.patchValue(JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode);
    //       this.isdCodeSecond?.patchValue(JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode);
    //     }
    //   }
    // }
  }

  formatMatches = (value: any) =>
    value.FirstName + " " + value.LastName + "-" + value.Email || "";
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        term.length < 3
          ? []
          : this.dashboardService.searchUser(this.locationId, term).pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => {
        this.hostId = 0;
        this.searching = false;
      })
    );

  assignselectedUser(event: any) {
    this.hostId = event.item.UserId;
    this.hostFirstName = event.item.FirstName;
    this.hostLastName = event.item.LastName;
    this.hostEmail = event.item.Email;
    this.hostIsdCode = event.item.IsdCode;
    this.hostMobile = event.item.CellNumber;
    this.hostCompany = event.item.HostCompany;
    this.notificationType = event.item.NotificationType;
  }

  isdCodeChange(event: any) {
    this.isdCode?.patchValue(event);
    var selectedISDCode = this.allIsdCodes.filter(
      (item) => item.IsdCode == this.isdCode?.value
    );
    this.phonenumber?.reset();
    this.phonenumber?.setValidators(
      Validators.pattern(
        "[0-9]{" +
        selectedISDCode[0].MinMobileLength +
        "," +
        selectedISDCode[0].MaxMobileLength +
        "}"
      )
    );
    this.phonenumber?.updateValueAndValidity();
  }

  isdCodeChangeSecond(event: any) {
    this.isdCodeSecond?.patchValue(event);
    var selectedISDCode = this.allIsdCodes.filter(
      (item) => item.IsdCode == this.isdCodeSecond?.value
    );
    this.cellnumber?.reset();
    this.cellnumber?.setValidators(
      Validators.pattern(
        "[0-9]{" +
        selectedISDCode[0].MinMobileLength +
        "," +
        selectedISDCode[0].MaxMobileLength +
        "}"
      )
    );
    this.cellnumber?.updateValueAndValidity();
  }

  getAndSetVisitorInfo() {
    if (
      (this.email?.value != "" &&
        this.email?.value != null &&
        !this.email?.invalid) ||
      (this.phonenumber?.value != null &&
        this.phonenumber?.value != "" &&
        !this.phonenumber?.invalid &&
        !this.isdCode?.invalid)
    ) {
      this.dashboardService
        .getRegisteredUserForWalkin(
          this.locationId,
          this.email?.value,
          this.isdCode?.value,
          this.phonenumber?.value
        )
        .pipe(first())
        .subscribe(
          (data: any) => {
            this.secondform?.resetForm();
            if (data.Data.IsRegisteredVisitor) {
              this.visitorThumbnail = data.Data.Data.VisitorThumbnail;
              if (data.Data.Data.Email != "") {
                this.emailSecond?.patchValue(data.Data.Data.Email);
                this.emailSecond?.disable({ onlySelf: true });
              } else {
                this.emailSecond?.patchValue("");
                this.emailSecond?.disable({ onlySelf: true });
              }
              if (data.Data.Data.IsdCode != "") {
                this.isdCodeSecond?.patchValue(data.Data.Data.IsdCode);
              } else {
                this.isdCodeSecond?.patchValue(
                  JSON.parse(localStorage.getItem("defaultValuesForLocation")!)
                    .IsdCode
                );
              }
              if (data.Data.Data.Mobile != "") {
                this.cellnumber?.patchValue(data.Data.Data.Mobile);
                this.cellnumber?.disable({ onlySelf: true });
                this.isdCodeSecond?.disable({ onlySelf: true });
              } else {
                this.cellnumber?.patchValue("");
                this.cellnumber?.disable({ onlySelf: true });
                this.isdCodeSecond?.disable({ onlySelf: true });
              }
              this.firstname?.patchValue(data.Data.Data.FirstName);
              this.firstname?.disable({ onlySelf: true });

              if (data.Data.Data.LastName != "") {
                this.lastname?.patchValue(data.Data.Data.LastName);
                this.lastname?.disable({ onlySelf: true });
              } else {
                this.lastname?.patchValue("");
              }

              if (data.Data.Data.VisitorCompany != "") {
                this.company?.patchValue(data.Data.Data.VisitorCompany);
                this.company?.disable({ onlySelf: true });
              } else {
                this.company?.patchValue("");
                this.company?.disable({ onlySelf: true });
              }

              this.selectedPurpose?.patchValue("");
              this.duration?.patchValue("");

              // var hostDetails = {
              //   FirstName: data.Data.Data.HostFirstName,
              //   LastName: data.Data.Data.HostLastName,
              //   Email: data.Data.Data.HostEmail
              // }
              // this.host?.patchValue(hostDetails);
              // this.hostId = data.Data.Data.HostId;
              // this.hostFirstName = data.Data.Data.HostFirstName;
              // this.hostLastName = data.Data.Data.HostLastName;
              // this.hostEmail = data.Data.Data.HostEmail;
              // this.hostMobile = data.Data.Data.HostMobile;
              // this.hostIsdCode = data.Data.Data.HostIsdCode;
              // this.hostCompany = data.Data.Data.HostCompany;

              // this.selectedPurpose?.patchValue(data.Data.Data.PurposeOfVisit);
            } else {
              this.visitorThumbnail = "";
              this.firstname?.enable({ onlySelf: true });
              this.emailSecond?.enable({ onlySelf: true });
              this.lastname?.enable({ onlySelf: true });
              this.company?.enable({ onlySelf: true });
              this.cellnumber?.enable({ onlySelf: true });
              this.isdCodeSecond?.enable({ onlySelf: true });
              this.secondform?.resetForm();
              this.isdCodeSecond?.patchValue(
                JSON.parse(localStorage.getItem("defaultValuesForLocation")!)
                  .IsdCode
              );
              this.selectedPurpose?.patchValue("");
              this.duration?.patchValue("");
              this.isdCodeSecond?.patchValue(this.isdCode?.value);
              this.cellnumber?.patchValue(this.phonenumber?.value);
              this.emailSecond?.patchValue(this.email?.value);

              if (this.email?.value != "" && this.email?.value != null) {
                this.emailSecond?.disable({ onlySelf: true });
                this.cellnumber?.disable({ onlySelf: true });
                this.isdCodeSecond?.disable({ onlySelf: true });
              }

              if (
                this.phonenumber?.value != "" &&
                this.phonenumber?.value != null
              ) {
                this.emailSecond?.disable({ onlySelf: true });
                this.cellnumber?.disable({ onlySelf: true });
                this.isdCodeSecond?.disable({ onlySelf: true });
              }
            }
          },
          (error: any) => {
            //this.errorService.handleError(error);
          }
        );
    }
  }

  firstSlideNextClick() {
    if (this.email?.valid && this.phonenumber?.value == "") {
      this.phonenumber?.setErrors(null);
    }

    if (this.phonenumber?.valid && this.email?.value == "") {
      this.email?.setErrors(null);
    }

    if (this.walkinFirstForm.invalid) {
      return;
    }
    this.currentSlide = 2;

    // this.appointmentDetailService.validateHSQWalkin(this.isdCode?.value,
    //   this.phonenumber?.value, this.email?.value, this.locationId).subscribe((res: any) => {
    //     this.currentSlide = 2;
    //     this.secondform?.resetForm();
    //     this.host?.patchValue("");
    //     this.selectedPurpose?.patchValue("");
    //     this.duration?.patchValue("");
    //     this.isdCodeSecond?.patchValue(JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode);
    //     this.getAndSetVisitorInfo();
    //   }, (error: any) => {
    //     this.isHSQAlreadyFilled = true;
    //     this.HSQAlreadyFilledErrorMessage = error.error.ErrorMessages[0];
    //   });
  }

  clearCellNumber() {
    if (
      this.email?.valid &&
      this.email.value != null &&
      this.email?.value != ""
    ) {
      this.phonenumber?.reset();
    }
  }

  clearEmail() {
    if (
      this.phonenumber?.valid &&
      this.phonenumber.value != null &&
      this.phonenumber?.value != ""
    ) {
      this.email?.reset();
    }
  }

  secondSlideNextClick() {
    // if ((this.emailSecond?.disabled || this.emailSecond?.valid) && (this.cellnumber?.value == "" || this.cellnumber?.value == null)) {
    //   this.cellnumber?.setErrors(null);
    // }

    // if ((this.cellnumber?.disabled || this.cellnumber?.valid) && (this.emailSecond?.value == "" || this.emailSecond?.value == null)) {
    //   this.emailSecond?.setErrors(null);
    // }

    // if (this.walkinSecondForm.invalid) {
    //   return;
    // }
    if (this.walkinSecondForm.invalid) {
      // this.toastrService.warning('There are errors in the formCompany', 'Could Not Save');
      Object.keys(this.walkinSecondForm.controls).forEach((field) => {
        if (this.walkinSecondForm.controls[field]["controls"]) {
          this.walkinSecondForm.controls[field]["controls"].forEach(
            (formArrayField) => {
              Object.keys(formArrayField["controls"]).forEach((item) => {
                formArrayField["controls"][item].markAsDirty();
                formArrayField["controls"][item].markAsTouched();
              });
            }
          );
        } else {
          this.walkinSecondForm.controls[field].markAsDirty();
          this.walkinSecondForm.controls[field].markAsTouched();
        }
      });
    } else {
      this.walkinVisitor();
    }
  }

  resendOTP(){ 
   $('#otpcodeBox1').val(null)
    $('#otpcodeBox2').val(null)
     $('#otpcodeBox3').val(null)
      $('#otpcodeBox4').val(null)
    let emailid = (this.excelWalkinForm.value.emailId == null) ? '' : this.excelWalkinForm.value.emailId;
    let userMobileIsd = ''; let userMobile = '';
    if( this.excelWalkinForm.value.visitorMobileNumber !== null ){
      userMobileIsd = this.excelWalkinForm.value.contactNumber.dialCode.substring(1);
      //userMobile = this.excelWalkinForm.value.contactNumber.nationalNumber;
      userMobile = this.excelWalkinForm.value.visitorMobileNumber.number.replace(/[^0-9]/g, '');
    }
    let data = {"appointmentId": null,
    "isd": userMobileIsd,
    "phone": userMobile,
    "email": emailid}
    this.appointmentService.resendOtp(data).subscribe((resp)=>{
     
      if(resp.statusCode == 200 && resp.errors === null){
        //this.appointmentData = resp?.data;
        //this.currentSlide = this.currentSlide+1;
        this.toastr.success(this.translate.instant(resp.message))
      }
  },
  (error)=>{
    try{
      this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))

    }
    catch(e){
      this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
    }
  })
  }

  validateOTP() {
    this.isResent = false;
    this.fullname = this.firstname?.value + " " + this.lastname?.value;
    this.fullnameTranslate = { fullname: this.fullname };
    if (this.checkinForm.invalid) {
      return;
    }

    this.dashboardService
      .validateOtp(
        this.locationId,
        this.otp?.value,
        this.isdCodeSecond?.value,
        this.cellnumber?.value,
        this.emailSecond?.value
      )
      .subscribe(
        (res: any) => {
          if (this.hasPermission("CaptureVisitorPhoto")) {
            WebcamUtil.getAvailableVideoInputs().then(
              (mediaDevices: MediaDeviceInfo[]) => {
                this.isCameraExist = mediaDevices && mediaDevices.length > 0;
              }
            );
            this.currentSlide = 5;
          } else {
            this.checkIn();
          }
        },
        (error: any) => {
          if (error.error.StatusCode == 400) {
            this.isOTPError = true;
          }
        }
      );
  }

  validatePIN() {
    this.fullname = this.firstname?.value + " " + this.lastname?.value;
    this.fullnameTranslate = { fullname: this.fullname };
    this.isResent = false;
    if (this.bypassPinForm.invalid) {
      return;
    }

    this.dashboardService
      .validateBypassPin(this.pin?.value, this.visitorId)
      .subscribe(
        (res: any) => {
          if (res.Data.IsValidated) {
            this.isBypassMode = true;
            if (this.hasPermission("CaptureVisitorPhoto")) {
              WebcamUtil.getAvailableVideoInputs().then(
                (mediaDevices: MediaDeviceInfo[]) => {
                  this.isCameraExist = mediaDevices && mediaDevices.length > 0;
                }
              );
              this.currentSlide = 5;
            } else {
              this.checkIn();
            }
          } else {
            this.isPINError = true;
          }
        },
        (error: any) => {
          //this.errorService.handleError(error);
        }
      );
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
        clearInterval(this.interval);
      }
    }, 1000);
  }

  openBypassPin() {
    this.currentSlide = 4;
  }

  showOTPScreen() {
    this.currentSlide = 3;
  }

  walkinVisitor() {
    // this.commonService.getTimezone(new Date(), this.timezone.trim()).subscribe((res: any) => {
    //   this.timeZoneOffset = Number(res);
    //   var currentDate = calcTime(Number(res));
    //   var formattedCurrentDate = formatDate(currentDate, this.dateFormat, "en");
    //   var fromTime = this.timeFormat == "12" ? convertTime12to24(moment(currentDate).format('hh:mm a')) : moment(currentDate).format("HH:mm");
    //   var stringFromDate = formattedCurrentDate + " " + fromTime + ":00";
    //   var utcFromTime = moment(stringFromDate, this.dateFormat.toUpperCase() + " hh:mm:ss").toDate();
    //   var utcFromDate2 = calcUTCTimeForSpecificDate(utcFromTime, this.timeZoneOffset);
    //   var stringUTCFromDate = formatDate(utcFromDate2, 'yyyy-MM-ddTHH:mm:ss', "en") + "Z";
    //   var addedTime = new Date(currentDate.getTime() + this.duration?.value * 60000);
    //   var toTime = this.timeFormat == "12" ? convertTime12to24(moment(addedTime).format('hh:mm a')) : moment(addedTime).format("HH:mm");
    //   var formattedToDate = formatDate(addedTime, this.dateFormat, "en");
    //   var stringToDate = formattedToDate + " " + toTime + ":00";
    //   var utcToDate = moment(stringToDate, this.dateFormat.toUpperCase() + " hh:mm:ss").toDate();
    //   var utcToDate2 = calcUTCTimeForSpecificDate(utcToDate, this.timeZoneOffset);
    //   var stringUTCToDate = formatDate(utcToDate2, 'yyyy-MM-ddTHH:mm:ss', "en") + "Z";
    //   var currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);
    //   this.dashboardService.scheduleAppointment(this.notificationType, capitalizeFirstLetter(this.firstname?.value), capitalizeFirstLetter(this.lastname?.value), this.isdCodeSecond?.value,
    //     this.cellnumber?.value, this.emailSecond?.value, this.selectedPurpose?.value, formattedCurrentDate,
    //     fromTime, toTime, stringUTCFromDate, stringUTCToDate, capitalizeFirstLetter(this.company?.value), null,
    //     currentLocation.LocationId, this.ipAddress, currentLocation.Persona, false, true, this.hostId,
    //     this.hostFirstName, this.hostLastName, this.hostEmail, this.hostIsdCode, this.hostMobile, this.hostCompany)
    //     .pipe(first())
    //     .subscribe(
    //       (dbData: any) => {
    //         this.visitorId = dbData.Data.VisitorId;
    //         this.visitorThumbnail = dbData.Data.ThumbnailUrl;
    //         this.thirdform?.resetForm();
    //         this.showWebcam = true;
    //         this.fullname = this.firstname?.value + " " + this.lastname?.value;
    //         this.fullnameTranslate = { fullname: this.fullname };
    //         //this.currentSlide = dbData.Data.ValidateOTP ? 3 : 5;
    //         var currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);
    //         if (!dbData.Data.ValidateOTP ||
    //           !(currentLocation.Persona == "Reception" || currentLocation.Persona == "Security Guard")) {
    //           this.isBypassMode = true;
    //           if (this.hasPermission("CaptureVisitorPhoto")) {
    //             WebcamUtil.getAvailableVideoInputs()
    //               .then((mediaDevices: MediaDeviceInfo[]) => {
    //                 this.isCameraExist = mediaDevices && mediaDevices.length > 0;
    //               });
    //             this.currentSlide = 5;
    //           }
    //           else {
    //             this.checkIn();
    //           }
    //         }
    //         else {
    //           this.currentSlide = 3;
    //         }
    //       }, (error: any) => {
    //         this.errorService.handleError(error);
    //       });
    // });
  }

  takeSnapshot(): void {
    this.capturePhoto = false;
    this.isPhotoCaptured = true;
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    //this.getPicture.emit(webcamImage);
    this.webcamImage = webcamImage;
    this.getS3Url()
    this.showWebcam = false;
  }


  // convertToBlob(imgData){
  //   var byteString = atob(imgData.split(',')[1]);
  //   var ab = new ArrayBuffer(byteString.length);
  //   var ia = new Uint8Array(ab);
  //    for (var i = 0; i < byteString.length; i++)
  //     {
  //      ia[i] = byteString.charCodeAt(i);
  //     }
  //    return new Blob([ab], { 'type': 'image/jpg' });
  //  }

  async getS3Url() {
    let fileName = this.excelWalkinForm.value?.firstName + " " + this.excelWalkinForm.value?.lastName + '.jpeg';
    let bucketSavePath = "level1/" + this.userData?.level1DisplayId + "/Appointment/" + new Date().getTime() + "/";
    let filePath = convertToBlob(this.webcamImage['_imageAsDataUrl'], { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam(this.webcamImage, bucketSavePath, filePath, fileName).promise();
    if (response && response['key']) {
      this.walkinProcess = true;
      this.visitorPhotoUrl = response['Location'];
      // let  resp = await this.fileUploadService.getContentFromS3Url(response['key']).promise();
      // this.visitorPhotoUrl =  this._sanitizer.bypassSecurityTrustUrl(JSON.parse(String.fromCharCode.apply(null, resp?.Body)));
    }
  }

  async getS3UrlFroDLUpload() {
    let fileName = 'DL-' + this.excelWalkinForm.value?.firstName + " " + this.excelWalkinForm.value?.lastName + '.jpeg';
    let bucketSavePath = "level1/" + this.userData?.level1DisplayId + "/Appointment/" + +new Date().getTime() + "/";
    let imageUri = 'data:image/jpeg;base64,' + this.idProofDetails.Photo;

    let filePath = convertToBlob(imageUri, { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam('image/jpeg', bucketSavePath, filePath, fileName).promise();

    if (response && response['key']) {
      this.isS3UploadCompleted = true;
      this.visitorDrivingLicencePhotoUrl = response['Location'];
    }
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  upload() {
    this.isPhotoCaptured = true;
    if (this.webcamImage == undefined) {
      this.isPhotoCaptured = false;
      return;
    }
    resizeImage(this.webcamImage.imageAsDataUrl, 250, 250).then(
      (value: any) => {
        base64ToBufferAsync(value).then((byteArray: any) => {
          this.dashboardService
            .uploadThumbnail(byteArray, this.visitorId)
            .subscribe(
              (res: any) => {
                this.checkIn();
              },
              (error: any) => {
                //this.errorService.handleError(error);
              }
            );
        });
      }
    );
  }

  showPrintBadge() {
    this.currentSlide = 7;
    // this.dashboardService.GetFileBadge(this.printerType, this.visitorId).subscribe((res: any) => {
    //   var pdfFile = new Blob([res.body], {
    //     type: "application/pdf"
    //   });
    //   var pdfUrl = URL.createObjectURL(pdfFile);
    //   var thisObj = this;
    //   PrintPDF(pdfUrl, function () {
    //     thisObj.resetWalkin();
    //   });
    // }, (error: any) => {
    //   this.errorService.handleError(error);
    // });
  }

  checkIn() {
    // this.dashboardService.checkIn(this.locationName, this.locationId,
    //   this.timezone.trim(), this.notificationType, this.visitorId, this.isBypassMode).subscribe((res: any) => {
    //     this.currentSlide = 6;
    //     this.isBypassMode = false;
    //     this.fullname = this.firstname?.value + " " + this.lastname?.value;
    //     this.fullnameTranslate = { fullname: this.fullname };
    //     if (this.hasPermission("printBadge")) {
    //       setTimeout(() => {
    //         this.showPrintBadge();
    //       }, 5000);
    //     }
    //     else {
    //       setTimeout(() => {
    //         this.resetWalkin();
    //       }, 5000);
    //     }
    //     this.walkinActionCompleted.emit(true);
    //   }, (error: any) => {
    //   });
  }

  toggleWalkin() {
    this.resetWalkin();
    this.isShowWalkin = !this.isShowWalkin;
  }

  resetWalkin() {
    this.HSQAlreadyFilledErrorMessage = "";
    this.isHSQAlreadyFilled = false;
    this.visitorId = 0;
    this.currentSlide = 1;
    this.email?.patchValue("");
    this.phonenumber?.patchValue("");
    this.firstForm?.resetForm();
    this.isdCode?.patchValue(
      JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode
    );
    this.secondform?.resetForm();
    this.isdCodeSecond?.patchValue(
      JSON.parse(localStorage.getItem("defaultValuesForLocation")!).IsdCode
    );
    this.thirdform?.resetForm();
    this.fourthform?.resetForm();
    this.showWebcam = false;
    this.visitorThumbnail = "";
  }

  actionCompleted(event: any) {
    this.resetWalkin();
  }

  showCancelAppointmentModal(dialog: TemplateRef<any>) {
    this.modalServiceReference = this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  dismissAll() {
    this.dialogService.dismissAll("dd");
  }

  hasPermission(action: string) {
    return this.permissions.find((element) => {
      return element.PermissionKey == action;
    })?.IsPermissible;
  }

  formReset() {
    if (this.currentSlide == 2) {
      if (this.isExcel) {
      this.isBuildingHasError = false;
        this.showdlpic = false;
        this.dlvisitorphotosrc = null;
        this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());;
        this.excelWalkinForm.reset();

      } else {
        this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());;
        this.walkinSecondForm.reset();
      }
    }
    if (this.currentSlide == 1) {
      if (this.showByPass) {
        this.pinValue = null;
      }
      else {
        this.idProofDetails = null;
      }
      this.hasError = true; 
      if( this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital ){
        //this.removeValidator('visitorMobileNumber')
        //this.removeValidator('emailId')
        this.excelWalkinForm.controls.emailId.reset();
        this.excelWalkinForm.controls.visitorMobileNumber.reset();
      }
      if (this.userData.feature.workFlow == 'SEEPZ') {
         this.excelWalkinForm.controls.visitorMobileNumber.reset();
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get otp() {
    return this.checkinForm.get("otp");
  }
  get pin() {
    return this.checkinForm.get("pin");
  }

  get email() {
    return this.walkinFirstForm.get("email");
  }
  get isdCode() {
    return this.walkinFirstForm.get("isdCode");
  }
  get phonenumber() {
    return this.walkinFirstForm.get("phonenumber");
  }

  get emailSecond() {
    return this.walkinSecondForm.get("emailSecond");
  }
  get isdCodeSecond() {
    return this.walkinSecondForm.get("isdCodeSecond");
  }
  get cellnumber() {
    return this.walkinSecondForm.get("cellnumber");
  }
  get firstname() {
    return this.walkinSecondForm.get("firstname");
  }
  get lastname() {
    return this.walkinSecondForm.get("lastname");
  }
  get selectedPurpose() {
    return this.walkinSecondForm.get("selectedPurpose");
  }
  get company() {
    return this.walkinSecondForm.get("company");
  }
  get duration() {
    return this.walkinSecondForm.get("duration");
  }
  get host() {
    return this.walkinSecondForm.get("host");
  }
  get meetingNotes() {
    return this.walkinSecondForm.get("meetingNotes");
  }
  // get showValidationMessages() {
  //   return showValidationMessages;
  // }
  get showValidationMessageForDynamicContent() {
    return showValidationMessageForDynamicContent;
  }

  accuantCallBack(resp) {
    var service = this.accuantService.getConnectedStatus();

    if (this.accuantService.getConnectedStatus() == false) {
      return;
    }

    if (resp == undefined || resp == null) {
      return;
    }

    try {
      if (resp.status === "MessageReceived" && resp.data != undefined && resp.data != null) {

        let message = JSON.parse(resp.data);

        if (message.Status == "ScanCompleted") {
          this.idProofDetails = message.Visitor;
          this.hasError = false;
          if (this.idProofDetails.FirstName != undefined && this.idProofDetails.FirstName != null) {

            this.excelWalkinForm.controls['firstName'].setValue(this.idProofDetails.FirstName.trim());
          }

          if (this.idProofDetails.Surname != undefined && this.idProofDetails.Surname != null) {
            this.excelWalkinForm.controls['lastName'].setValue(this.idProofDetails.Surname.trim());
          }

          if (this.idProofDetails.Photo != undefined && this.idProofDetails.Photo != null) {
            this.showdlpic = true;
            this.dlvisitorphotosrc = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.idProofDetails.Photo);
          }
        }
      }
    } catch (e) {
    }
  }

  scanDrivingLicense() { 
    this.idProofDetails = null;
    this.showByPass = false;
    this.hasError = (this.idProofDetails == null) ? true : false;
    if (this.accuantService.getConnectedStatus() == true) {

      const scanReq = {
        "Controller": "Acuant",
        "Action": "DriversLicense",
        "ErrorMessage": "",
        "ResponseObj": ""
      };


      this.accuantService.doSend(scanReq);
    }
    // const dialogRef = this.dialog.open(ScanDrivingLicenceComponent, {
    //   data:null,
    //   height: "100%",
    //   position: { right: "0" },
    //   // panelClass: [
    //   //   "animate__animated",
    //   //   "vams-dialog-sm",
    //   //   "vams-dialog-confirm",
    //   // ],
    //   panelClass: ["animate__animated","vams-dialog","animate__slideInRight"],
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //       this.createForm(result?.driverData);
    //   } else {
    //   }
    // });
  }
  createForm(walkinData: any) {
    this.excelWalkinForm = this._fb.group({
      hostCompany: [walkinData ? (walkinData?.hostCompany) : null],
      firstName: [walkinData ? (walkinData?.firstName) : null, [Validators.required]],
      lastName: [walkinData ? (walkinData?.lastName) : null, [Validators.required]],
      visitorCompany: [walkinData ? (walkinData?.visitorCompany) : null],
      email: [walkinData ? (walkinData?.email) : null, [Validators.pattern(regex.EMAIL), Validators.maxLength(250)]],
      contactNumber: [walkinData ? (walkinData?.contactNumber) : null],
      visitorMobileNumber: [walkinData ? (walkinData?.visitorMobileNumber) : null],
      emailId: [walkinData ? (walkinData?.emailId) : null, [Validators.pattern(regex.EMAIL), Validators.maxLength(250)]],
      hostType: [walkinData ? (walkinData?.visitorMobileNumber) : [Validators.required]],
      visitPurposeId: [walkinData ? (walkinData?.visitorMobileNumber) : [Validators.required]],
      visitorTypeId: [walkinData ? (walkinData?.visitorMobileNumber) : [Validators.required]],
      duration: [walkinData ? (walkinData?.visitorMobileNumber) : [Validators.required]],
      toggleBtnValue: [''],
      notes:[],
      level2Id:[null, [Validators.required]]
    });
    if( this.userData.feature.workFlow == 'SEEPZ' ){
      this.excelWalkinForm.get('visitorCompany').setValidators([Validators.required]);
    
    }
  }
  handleError(event) {
  }
  displayWith(company) {
    return company && company.name && company.shortName && company.officeNumber ? (company.name + "|" + company.shortName + "|" + company.officeNumber) : ""
  }

  getHostCompanyValue(company) {

     // let formValue = this.formCompany.value;
    // this.errorInBuilding = false;
    // if(formValue && formValue['level3Address'] && formValue['level3Address']['building']){
    //   let element =this.buildingList.find((element)=>(element.id === formValue['level3Address']['building']['id'] || element.level2Id === formValue['level3Address']['building'] ))
    //   if(element == undefined){
    //     this.errorInBuilding = true;
    //     this.formCompany.controls['building'].setErrors({'message': 'Please select valid building'});
    //   }
    setTimeout(() => {
      //console.log(this.excelWalkinForm.value);
      if (company && company.companyId && this.excelWalkinForm.value.hostCompany.companyId == company.companyId){
        this.selectedHostCompanyId = company.companyId
      }
     
    }, 1);
    //console.log(this.excelWalkinForm.value);

    // if(this.excelWalkinForm && this.excelWalkinForm.controls['hostCompany']){
    //   let element =this.hostCompanyList.find((element)=>(element.buildingId === ))
    //   if(element == undefined){
    //     this.excelWalkinForm.controls['hostCompany'].setErrors({'message': 'Please select valid building'});
    //   }
    // }
    
  }

  toggleToShowCompany(){    
    this.isShown = !this.isShown;
    this.selectedHostCompanyId = !this.isShown ? this.selectedHostCompanyId : null;
    if(!this.isShown){
      this.excelWalkinForm.get('level2Id').setValidators([Validators.required]);
      this.excelWalkinForm.get('hostCompany').setValidators([Validators.required]);

    } else {
      // this.excelWalkinForm.get('level2Id').clearValidators();
      this.excelWalkinForm.get('level2Id').setValidators([Validators.required]);
      this.excelWalkinForm.get('hostCompany').clearValidators();
    }
    this.excelWalkinForm.get('level2Id').updateValueAndValidity();
    this.excelWalkinForm.get('hostCompany').updateValueAndValidity();
  }

  toggleShow() {
    this.isShown = !this.isShown;
    this.selectedHostCompanyId = !this.isShown ? this.selectedHostCompanyId : null;
    if(!this.isShown){
      this.excelWalkinForm.get('hostCompany').setValidators([Validators.required]);
    }
    else{
      this.excelWalkinForm.get('hostCompany').clearValidators();
    }
    this.excelWalkinForm.get('hostCompany').updateValueAndValidity();
  }

  getValue(event: string) {
    if (event.includes('|')) {
      event = event.trim();
      let hostCompanySplited = event.split('|');
      if (hostCompanySplited.length == 3 && (this.hostCompanyList.findIndex((element) => (JSON.stringify(element.name).trim() === JSON.stringify(hostCompanySplited[0]).trim()))) >= 0 && (this.hostCompanyList.findIndex((element) => (JSON.stringify(element.shortName).trim() === JSON.stringify(hostCompanySplited[1]).trim()))) >= 0 && (this.hostCompanyList.findIndex((element) => (JSON.stringify(element.officeNumber).trim() === JSON.stringify(hostCompanySplited[2]).trim()))) >= 0) {
        this.excelWalkinForm.controls['hostCompany'].setErrors({ 'buildingValidation': null });
      }
      else {
        this.excelWalkinForm.controls['hostCompany'].setErrors({ 'buildingValidation': 'Please select valid host company' });
      }
    }
    else {
      this.excelWalkinForm.controls['hostCompany'].setErrors({ 'buildingValidation': 'Please select valid host company' });
    }
  }

  byPassActivate() {
    this.showByPass = true;
    this.hasError = true;
  }

  // onKeyUpEventBypass(index, event, length) {
  //   let pin = event.target.value;
  //   if(index == 0 && this.pinValue.length == 0){
  //     this.pinValue = pin;
  //   }
  //   if (/[a-z\d]/i.test(pin) || event.key == 'Backspace') {
  //     if (this.pinValue) {
  //       if(this.pinValue[index]){
  //         this.pinValue.replace(this.pinValue[index],pin);
  //       }
  //       else{
  //         this.pinValue = this.pinValue + pin;
  //       }
  //     }
  //     let pos = index;
  //     if (event.keyCode === 8 && event.which === 8) {
  //       pos = index - 1;
  //     } else {
  //       pos = index + 1;
  //     }
  //     if (pos > -1 && pos < length) {
  //       this.bypassPinControls["_results"][pos].nativeElement.focus();
  //     }
  //   }
  // }

  confrimationDailog() {
    // console.log(this.excelWalkinForm.value.visitorCompany)
    // debugger;
    if(this.showByPass){
      this.currentSlide,"current slide"
  
      this.appointmentDetailService.validateByPassPin(this.pinValue).subscribe((resp) => {
        if (resp && resp.statusCode == 200) {
          if (resp && resp.data) {
            if(this.data.visitorSettings.sendNDA == false && this.walkVisitorData == undefined && this.walkVisitorData == null){
              this.currentSlide = this.currentSlide + 2;
            }else{
              this.currentSlide = this.currentSlide + 1;
            }
            
          }
          else {
            this.toastr.error("Invalid By Pass Pin", "Error");
          }
        }
      }, (error) => {
        console.log(error)
      })
    }
    // else{
    //   this.currentSlide = this.currentSlide + 1;
    // }
  }
  async onSubmits() {
    if(!this.showByPass){
      await this.getS3Url();

      if (this.isS3UploadCompleted && this.visitorDrivingLicencePhotoUrl) {
        delete this.idProofDetails.Photo;
        this.idProofDetails.idProofVisitorPhoto = this.visitorDrivingLicencePhotoUrl;

        const requestObject = {
          appointmentId: this.data.appointmentData.id,
          idProofDetails: null,
          acuantDLDetails: this.idProofDetails,
          idProofType: "Driving Licence",
          notes: this.notes,
        }

        this.appointmentService.drivingLicenseUpdate(requestObject).subscribe((response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.toastr.success(response.message,this.translate.instant('pop_up_messages.success'));
            // this.cancel();
            if(this.data.isAccessControlEnabled)
              this.dialogRef.close(response);
            
            if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital ){
              if( this.data.visitorSettings.sendNDA == true ){
                this.currentSlide = this.currentSlide + 1;
              }else{
                this.currentSlide = this.currentSlide + 2;
              }
            }else{
              this.currentSlide = this.currentSlide + 1;
            }
          } else {
            this.toastr.error(response.message,this.translate.instant('pop_up_messages.error'));
          }
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
            });
          } else {
            this.toastr.error(error.error.Message,this.translate.instant('pop_up_messages.error'));
          }
        });
      }
    }
    else{
      const requestObject = {
        "appointmentId": this.data.appointmentData.id,
        "userPin": this.pinValue,
        "notes": this.notes,
      }

      this.appointmentService.ByPassAsync(requestObject).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          if(this.data.isAccessControlEnabled)
            this.dialogRef.close(response);
          //this.currentSlide = this.currentSlide + 1;
          if(this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital ){
            if( this.data.visitorSettings.sendNDA == true ){
              this.currentSlide = this.currentSlide + 1;
            }else{
              this.currentSlide = this.currentSlide + 2;
            }
          }else{
            this.currentSlide = this.currentSlide + 1;
          }
        } else {
          this.toastr.error(response.message);
        }
      }, (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      });
    }
  }
  confrimationDailogs(type: any){
    let emailid = (this.excelWalkinForm.value.emailId == null) ? '' : this.excelWalkinForm.value.emailId;
    let userMobileIsd = ''; let userMobile = '';
    if( this.excelWalkinForm.value.visitorMobileNumber !== null ){
      userMobileIsd = this.excelWalkinForm.value.contactNumber.dialCode.substring(1);
      //userMobile = this.excelWalkinForm.value.contactNumber.nationalNumber;
      userMobile = this.excelWalkinForm.value.visitorMobileNumber.number.replace(/[^0-9]/g, '');
    }
    if(type == 'otp' ){
      // if( $("#otpcodeBox1").val() == '' || $("#otpcodeBox2").val() == '' || $("#otpcodeBox3").val() == '' || $("#otpcodeBox4").val() == '' ){
      //   this.errorotp = true;
      //   return;
      // }
      if(this.otpv.length < 4){
        this.errorotp = true;
      }else{
        this.errorotp = false;
        let otp = this.otpv.toString();
        let data = {};
        if( this.userData.feature.workFlow != 'SEEPZ' ){
          data = {"appointmentId": null, "otp": otp, "isdCode": userMobileIsd, "phone": userMobile, "email": emailid}
        }else{
          data = {"appointmentId": null, "otp": otp, "isdCode": userMobileIsd, "phone": userMobile, "email": emailid, "qrCode":""}
        }
        this.appointmentService.validateOTP(data).subscribe((resp)=>{
        
          if(resp.statusCode == 200 && resp.errors === null && resp.data.isValidUser == true ){
            if(this.data.visitorSettings.sendNDA == true){
              this.currentSlide = this.currentSlide+1;
            }else{
              this.currentSlide = this.currentSlide+2;
            }
            // setTimeout(() => {
            //   this.hasError = false;
            // }, 100);
            //this.ndaDocumentUrl = this.ndaDocument.docURL
          }else{
            this.formResetOtp('otp'); 
            this.toastr.error(this.translate.instant(resp.message))
          }
        },
        (error)=>{
          try{
            this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))
          }
          catch(e){
            this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
          }
        })
      }
    }
    if( type == 'nda' ){

      if( this.ndaCheckin == false || this.ndaCheckin == undefined ){
        this.errornda = true;
      }else{
        this.currentSlide = this.currentSlide+2;
      }
    }
    if( type == 'scanner' ){
      if(this.qrCode == undefined || this.qrCode.length < 1){
        this.errorQR = true
      }else{
       
        this.scanQrCode(this.qrCode.toString());
        this.errorQR = false
      }
      //this.scanSuccessHandlers(this.qrCode);
      
      // if( this.ndaCheckin == false || this.ndaCheckin == undefined ){
      //   this.errornda = true;
      // }else{
      //   this.currentSlide = this.currentSlide+2;
      // }
    }
  }
  formResetOtp( para: any ){
    this.hasError  = true;
    if( para == 'otp' ){
      $("#otpcodeBox1").val('');
      $("#otpcodeBox2").val('');
      $("#otpcodeBox3").val('');
      $("#otpcodeBox4").val('');
      this.otpv = '';
    }
  }

  onKeyUpEventBypass(index, event, length) { 
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }

    let extra = $("#"+event.target.id).val();
    if (pos > -1 && pos < length) { 
      let cnt = parseInt(event.key);
      let cnt2 = cnt.toString();
      
      // if( cnt2 !== 'NaN'){
      //   this.otpsControls["_results"][pos].nativeElement.focus();
      // }
      if( extra.length > 1 && cnt2 !== 'NaN' ){
        extra = extra.substring(1, 0);
        $("#"+event.target.id).val(extra);
        this.bypassPinControls["_results"][pos].nativeElement.focus();
      }else if( cnt2 !== 'NaN' ){
        this.bypassPinControls["_results"][pos].nativeElement.focus();
      }
    }
    if(pos > -1 && event.key == 'Backspace'){
      this.bypassPinControls["_results"][pos].nativeElement.focus();
    }


    // if (pos > -1 && pos < length) {
    //   let cnt = parseInt(event.key);
    //   let cnt2 = cnt.toString();
    //   if( cnt2 !== 'NaN'){
    //     this.bypassPinControls["_results"][pos].nativeElement.focus();
    //   }
    // }
    if (pos == 6) {
      if( extra.length > 1 ){
        extra = extra.substring(1, 0);
        $("#"+event.target.id).val(extra);
      }
      this.checkByPassError();
    }
    else {
      this.hasError = true;
    }
    if(event.key == 'Enter'){ 
    event.stopPropagation();
      this.showByPass = true;
      return;
    }
  }

  checkByPassError() {
    this.pinValue = ""
    let error = false, pinValue = "";
    this.bypassPinControls["_results"].forEach((element) => {
      if (!element.nativeElement.value) {
        error = true;
      } else {
        pinValue += element.nativeElement.value;
      }
    });
    if (!error) {
      this.hasError = false;
    } else {
      this.hasError = true
    }
    this.pinValue = pinValue;
    this.hasError = typeof (parseInt(pinValue)) == 'number' ? false : true;
  }

  getEmailId(event) {
    if (this.walkinWithBioAuth) {
      if (event.target.value) {
        this.isEmailMandatory = true;
        this.excelWalkinForm.get('email').setValidators([Validators.required]);
      }
      else {
        this.isEmailMandatory = false;
        this.excelWalkinForm.get('email').clearValidators();
        this.excelWalkinForm.get('email').setValue(null);
      }
      // Validators.pattern(regex.EMAIL), Validators.maxLength(250)
      this.excelWalkinForm.get('email').setValidators([Validators.pattern(regex.EMAIL), Validators.maxLength(250)]);
      this.excelWalkinForm.get('email').updateValueAndValidity();
    }
  }

  getCellInfo(event) {
    if (this.walkinWithBioAuth) {
      if (event.target.value) {
        this.isCellMandatory = true;
      }
      else {
        this.isCellMandatory = false;
        this.excelWalkinForm.get('contactNumber').setValue(null);
      }
    }
    // if (this.productType == 'Enterprise') {
    //   if (event.target.value) {
    //     this.isCellMandatory = true;
    //   }
    //   else {
    //     this.isCellMandatory = false;
    //     this.excelWalkinForm.get('visitorMobileNumber').setValue(null);
    //   }
    // }
  }

  public showValidationMessages(control: string): string[] { 
    const messages: any[] = [];
    if (this.excelWalkinForm && this.excelWalkinForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.excelWalkinForm.get(control).touched ||
            this.excelWalkinForm.get(control).dirty) &&
          this.excelWalkinForm.get(control).errors
        ) {
          if (this.excelWalkinForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  onClickExpandRx(checkbox){}

  showError(){
    // let formValue = this.formCompany.value;
    // this.errorInBuilding = false;
    // if(formValue && formValue['level3Address'] && formValue['level3Address']['building']){
    //   let element =this.buildingList.find((element)=>(element.id === formValue['level3Address']['building']['id'] || element.level2Id === formValue['level3Address']['building'] ))
    //   if(element == undefined){
    //     this.errorInBuilding = true;
    //     this.formCompany.controls['building'].setErrors({'message': 'Please select valid building'});
    //   }
  }

}
