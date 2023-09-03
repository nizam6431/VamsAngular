import { Component, EventEmitter, Input, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { calcTime, calcUTCTimeForSpecificDate, capitalizeFirstLetter, convertTime12to24, matchCustom, matcherResult, round5, templateResult, templateSelection } from 'src/app/core/functions/functions';
import {
  base64ToBufferAsync,
  getCountryCode,
  isImageType,
  removeSpecialCharAndSpaces,
  resizeImage,
  convertToBlob,
  documentsType,
} from "src/app/core/functions/functions";
import { CommonService } from "src/app/core/services/common.service";
import { UserService } from "src/app/core/services/user.service";
import { ConfigureService } from "src/app/feature/configure/services/configure.service";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { CardService } from "../Services/card.service";
import s3ParseUrl from "s3-url-parser";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { Observable, Subject } from "rxjs";
import { Constants } from "../constant/column";
import { defaultVal } from "src/app/core/models/app-common-enum";
import { DatePipe, formatDate } from "@angular/common";
import { first } from "rxjs/operators";
import { getTime } from "ngx-bootstrap/chronos/utils/date-getters";
import { documentType } from "src/app/core/constants/pp_tc_nda";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "src/app/core/models/users";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { lt } from "lodash";
import { AppointmentService } from "../../appointment/services/appointment.service";
@Component({
  selector: "app-card-details",
  templateUrl: "./card-details.component.html",
  styleUrls: ["./card-details.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CardDetailsComponent implements OnInit {
  panelOpenState = false;
  permissionKeyObj = permissionKeys;
  public formCardDetails: FormGroup;
  public submitted: boolean = false;
  @Input() formData: any;
  categoryType: any;
  documentType: any;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  public phoneValidation: boolean = true;
  public selectedCountry: CountryISO = CountryISO.India;
  maxLength: string = "15";
  selectedValue: string;
  private validationMessages: { [key: string]: { [key: string]: string } };
  showStatus: string = "";
  showStatus1: string = "";
  todayDate: any = new Date();
  selfPhotoUrl: any = "assets/images/profile-pic.png";
  selfPhotoUrls:any = "assets/images/profile-pic.png";
  currentSlide: number = 1;
  maxDate = new Date();
  minDate = new Date();
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  bloodGroupFilter = [
    { value: "A", viewValue: "A+" },
    { value: "A+", viewValue: "A-" },
    { value: "B", viewValue: "B+" },
    { value: "B+", viewValue: "B-" },
    { value: "AB", viewValue: "AB+" },
    { value: "AB+", viewValue: "AB-" },
    { value: "O", viewValue: "O+" },
    { value: "O+", viewValue: "O-" },
  ];
  genderType = [
    { value: "Male", viewValues: "Male" },
    { value: "Female", viewValues: "Female" },
    { value: "Other", viewValues: "Other" },
  ];

  documentTypeData: any;
  originalpostDocumentData:any;
  tempDocumentType:any;
  userDetails: any;
  realImage: string;
  imagePriview: boolean = false;
  userLogo: string;
  postDocumentData: any[] = [];
  timeZoneOffset: number;
  showWebcam = true;
  isPhotoCaptured: boolean | undefined;
  webcamImage: WebcamImage | undefined;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  visitorId: number = 0;
  capturePhoto: boolean = true;
  categoryTypeLayout: any;
  file: any;
  realDocumentImage: any;
  dataSource: any;
  columns = Constants.documentCard;
  // passValiditycolumns = Constants.passValidity;
  pageSize: number = defaultVal.pageSize;
  testDate: any;
  uploadAndCapture: boolean = false;
  dateFormat: string = "DD-MM-YYYY";
  // dateFormat:string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  //  datePickerConfig = {
  //   format: this.dateFormat.toUpperCase(),
  //   // min: this.minDate
  // };
  public photoURLs;
  selectedCategory: any;
  docDetails: { documentType: any; documentUrl: any; testDate: any };
  vehicleType: any;
  documentId: any;
  originalType: any;
  passValidityData: any;
  expire: boolean = false;
  price: any;
  validity: any;
  currentDate: any = new Date();
  passValiditySelection: number = 3;
  passType: any;
  timeFormatForTimePicker: number = 12;
  defaultTime: string = "03:00";
  callFrom = new Date().getTime();
 hostName:any=[]
  orignalHostNameList: any;
  visitorSetting: any;
  saveAndSendBool: boolean = true;
  // balance check
  balance: number=0
  insufficiantBalance: boolean = false;
  dailyPassCharge: number = 0
  timeZone: any;
  categoryInRateCardAvailable: boolean = true;
  // timeZone: string = JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CardDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private cartService: CardService,
    private commonService: CommonService,
    private userService: UserService,
    private uploadService: FileUploadService,
    private toastr: ToastrService,
    private configureService: ConfigureService,
    private dashboardService: DashboardService,
    private datePipe: DatePipe,
    private fileUploadService: FileUploadService,
    private apptService:AppointmentService
  ) {
    console.log(this.dateFormat);
    this.userDetails = this.userService.getUserData();
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
    console.log(this.userDetails)
    this.validationMessages = {
      categoryType: {
        required: translate.instant("card.cart_details.pleaseSelectCategory"),
      },
      firstName: {
        required: translate.instant("card.cart_details.PleaseEnterFirstName"),
        pattern: translate.instant("card.cart_details.FirstNameValid"),
        minLength: translate.instant("card.cart_details.FirstNameMaxlength"),
      },
      lastName: {
        required: translate.instant("card.cart_details.PleaseEnterLastName"),
        pattern: translate.instant("card.cart_details.LastNameValid"),
        minLength: translate.instant("card.cart_details.LastNameMaxlength"),
      },
      MobileNo: {
        required: translate.instant("EmployeeForm.RequiredCellNumber"),
      },
      startDate: {
        required: this.translate.instant("error_messages.startDate"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
     
       purpose: {
        required: translate.instant("card.cart_details.enterPurpose"),
        pattern: translate.instant("card.cart_details.enterPurpose"),
        maxlength: translate.instant("card.cart_details.enterPurpose"),
      },
        nameOfPersonToMeet: {
        required: translate.instant("card.cart_details.enterNameOfPersonToMeet"),
        pattern: translate.instant("card.cart_details.enterNameOfPersonToMeet"),
        maxlength: translate.instant("card.cart_details.enterPurpose"),
      },
        gmail: {
       pattern: translate.instant('card.cart_details.EmailValid'),
        maxlength: translate.instant('Schedule.EmailMaxLengthError'),
      },
         startTime: {
        required: translate.instant("card.cart_details.startTime"),
       
      },
         contractorName: {
        required: translate.instant("card.cart_details.enterContractorName"),
         pattern: translate.instant("card.cart_details.enterContractorName")
      },
      address: {
        required: translate.instant("card.cart_details.residentalAddress"),
         pattern: translate.instant("card.cart_details.residentalAddress")
      },
      gender: {
        required: translate.instant("card.cart_details.add_filter"),
      },
      documentType: {
        required: translate.instant("card.cart_details.pleaseDocumentType"),
      },
      vehicleNumber: {
        required: translate.instant("card.cart_details.pleasevehicalNo"),
        pattern:translate.instant("card.cart_details.vehicleNumberPattern")
      },
      vehicleModel: {
        required: translate.instant(
          "card.cart_details.pleaseEnterVehicleModel"
        ),
        pattern:translate.instant("card.cart_details.pleaseEnterVehicleModel")
      },
      vehicleType: {
        required: translate.instant(
          "card.cart_details.pleaseSelectVehicleType"
        ),
      },
      documentUrl: {
        required: translate.instant("card.cart_details.uploadDocument"),
      },
      nameOfCard: {
        required: translate.instant("card.cart_details.enterNameOfCard"),
        maxlength: translate.instant("card.cart_details.NameOfCardMaxLengthValidation"),
      },
      validFromDate: {
        required: translate.instant("card.cart_details.validFromDate"),
      },
       photoURLs: {
        required: translate.instant("card.cart_details.uploadCapturePhoto"),
      }
    };
  }

  ngOnInit() {
     this.getVisitorSettings(null);
    // for get time by timezone
//  this.appointmentService.getCurrentTimeByZone(timezone).subscribe((response) => {
//       if (response.statusCode === 200 && response.errors == null) {
//         this.todayDateTime = moment(response?.data);
//         this.onSelectEvent();
//       }
//     }
// test
    // this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
    //   this.timeZoneOffset = Number(res);
    //   var date = calcTime(Number(res));
    //   date = new Date(date.getTime() + 5 * 60000);
    //   let minDate = formatDate(date, "dd-MM-YYYY HH:mm:ss", "en");
    //   minDate = formatDate(date, "HH:mm:ss", "en");
    //   console.log(minDate);
    // });

     // check balance
    this.getAvailableBalance();
    console.log(this.data.visitorSettings);
    console.log(this.data.visitorSettings.timeZone);
    this.timeZone = this.data.visitorSettings.timeZone;
    this.timeFormatForTimePicker = this.data.visitorSettings.timeformat;
    console.log(this.timeFormatForTimePicker)
    // let str = new Date().toLocaleString(['en-US'], { timeZone: this.timeZone, day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })
    // console.log()
    // console.log(moment(this.data.visitorSettings.timeZone, Date().slice(16, 21)))
    // console.log(Date().slice(16,21))


    this.defaultTime = Date().slice(16,21);
    let defaultTime1 = new Date(new Date().getTime() + 5 * 60000);
    this.defaultTime=defaultTime1.getHours()+":"+defaultTime1.getMinutes()



    let dte = new Date();
    dte.setDate(dte.getDate() - 365);
    this.minDate = dte;
    this.createForm();
    this.getCategoryType();
    this.getTypeOfDocuments();
    this.getHostName();
    this.getVehicleType();
  }
   getAvailableBalance() {
   
    this.cartService.getBalance().subscribe((resp) => {
      if (!resp.error && resp.statusCode == 200) {
        this.balance = resp.data.currentBalance
        console.log(this.balance);
      }
    });
  }

  createForm() {
    this.formCardDetails = this.fb.group({
      categoryType: [null, Validators.required],
      firstName: [null,
        [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      ],
      lastName: [null,
        [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      ], 
       contractorName: [null,
        [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      ],
      MobileNo: [null, Validators.required],
      gmail: [null, [ Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)]],
      purpose: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      nameOfPersonToMeet:[null,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]"),Validators.minLength(3)]],
      startDate: [new Date, Validators.required],
      startTime: [this.defaultTime, Validators.required],
      // vehicleNumber: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      vehicleNumber: [null, [Validators.required, Validators.pattern("^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 $]*)?$")]],
      documentType: [null, Validators.required],
      documentUrl: [null, Validators.required],
      gender: [null, Validators.required],
      photoURLs: [null, Validators.required],
      documentId:[null],
      layout:[null]
    });
  }
   keyFunc(event,key) {
    // console.log(event.target.value)
    let fname = event.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
    this.formCardDetails.controls[key].setValue(fname)
    // console.log(fname);
  }
  getCategoryType() {
    let obj = {
      passType : 'D',
      categoryType:""
    }
    this.cartService.getPassCategoryType(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list;
        let temp = this.categoryType
       // this.categoryType = [];
        // temp.map(ele => {
        //   if(ele.passType == 'Daily'){
        //     this.categoryType.push(ele)
        //   }
        // })

        this.categoryTypeLayout = this.categoryType.sort(this.sortDataByString);
        // this.categoryTypeLayout = this.categoryType.map(
        //   (element) => element.layout
        // );
      }
    });
  }
  sortDataByString(a, b) {
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
  getTypeOfDocuments() {
    this.cartService.getDocumentType().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.documentType = data.data.list; console.log(this.documentType)
        this.originalType = JSON.parse(JSON.stringify(this.documentType))
        this.tempDocumentType = data.data.list;
      }
    });
  }
  getVehicleType() {
    this.cartService.getVehicleType().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.vehicleType = data.data.list;
      }
    });
  }
  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach((validator) => {
      if (
        (this.formCardDetails.get(control).touched ||
          this.formCardDetails.get(control).dirty) &&
        this.formCardDetails.get(control).errors
      ) {
        if (this.formCardDetails.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  showErrorOnClick() {
    Object.keys(this.formCardDetails.controls).forEach((field) => {
      if (this.formCardDetails.controls[field]["controls"]) {
        this.formCardDetails.controls[field]["controls"].forEach(
          (formArrayField) => {
            Object.keys(formArrayField["controls"]).forEach((item) => {
              formArrayField["controls"][item].markAsDirty();
              formArrayField["controls"][item].markAsTouched();
            });
          }
        );
      } else {
        this.formCardDetails.controls[field].markAsDirty();
        this.formCardDetails.controls[field].markAsTouched();
      }
    });
  }
  goToNextSlide(currentSlide) {
     // check balance
    this.getAvailableBalance();

    this.submitted = true;

    if (currentSlide === 1) {
      if(!this.uploadAndCapture){
        if( this.formCardDetails.controls.photoURLs.status == "VALID" && this.formCardDetails.controls.photoURLs.value == null ){
          this.formCardDetails.controls.photoURLs.setValidators([Validators.required]);
          //this.formCardDetails.setErrors({ 'invalid': true });
          this.formCardDetails.controls['photoURLs'].setErrors({'invalid': true});
          //this.showErrorOnClick()
          this.toastr.warning(this.translate.instant("card.cart_details.uploadCapturePhoto"));
          return;
        }
        if( this.formCardDetails.controls.photoURLs.status == "INVALID" && this.formCardDetails.controls.photoURLs.value == null ){
          this.toastr.warning(this.translate.instant("card.cart_details.uploadCapturePhoto"));
        }
      }
      let meetOfPerson = this.formCardDetails.controls.nameOfPersonToMeet.value;
      if( typeof meetOfPerson == 'string' ){
        let nameofpObj = {name:meetOfPerson, email:""}
        this.formCardDetails.controls['nameOfPersonToMeet'].setValue(nameofpObj)
     
      }

      if (this.categoryTypeLayout == "D") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
           this.formCardDetails.controls.purpose.status == "VALID" &&
          this.formCardDetails.controls.nameOfPersonToMeet.status == "VALID" &&
          this.formCardDetails.controls.startDate.status == "VALID" &&
          this.formCardDetails.controls.startTime.status == "VALID" &&
           this.formCardDetails.controls.photoURLs.status == "VALID" 
        ) {
          this.formCardDetails.controls['contractorName'].setValue(null)
          this.formCardDetails.controls['vehicleNumber'].setValue(null)
          this.currentSlide = 2;
        } else {
          if( this.formCardDetails.controls.photoURLs.status == "INVALID" && 
          this.formCardDetails.controls.photoURLs.value != null && this.uploadAndCapture ){
            this.formCardDetails.controls['contractorName'].setValue(null)
            this.formCardDetails.controls['vehicleNumber'].setValue(null)
            this.currentSlide = 2;
            this.formCardDetails.get('photoURLs').clearValidators();
            this.formCardDetails.get('photoURLs').updateValueAndValidity();
          }else{
           this.showErrorOnClick();
          }
        }
      } 
      else if (this.categoryTypeLayout == "E") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
          this.formCardDetails.controls.purpose.status == "VALID" &&
          this.formCardDetails.controls.nameOfPersonToMeet.status == "VALID" &&
           this.formCardDetails.controls.contractorName.status == "VALID" &&
          this.formCardDetails.controls.startDate.status == "VALID" &&
          this.formCardDetails.controls.startTime.status == "VALID" &&
           this.formCardDetails.controls.photoURLs.status == "VALID" 
        ) {
          this.currentSlide = 2;
          this.formCardDetails.controls['vehicleNumber'].setValue(null)
        }else {
          if( this.formCardDetails.controls.photoURLs.status == "INVALID" && 
          this.formCardDetails.controls.photoURLs.value != null && this.uploadAndCapture ){
            this.currentSlide = 2;
            this.formCardDetails.controls['vehicleNumber'].setValue(null);
            this.formCardDetails.get('photoURLs').clearValidators();
            this.formCardDetails.get('photoURLs').updateValueAndValidity();
          }else{
           this.showErrorOnClick();
          }
        }
      }
       else if (this.categoryTypeLayout == "F") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
          this.formCardDetails.controls.purpose.status == "VALID" &&
          this.formCardDetails.controls.contractorName.status == "VALID" &&
           this.formCardDetails.controls.vehicleNumber.status == "VALID" &&
          this.formCardDetails.controls.nameOfPersonToMeet.status == "VALID" &&
          this.formCardDetails.controls.startDate.status == "VALID" &&
          this.formCardDetails.controls.startTime.status == "VALID" &&
           this.formCardDetails.controls.photoURLs.status == "VALID" 
        ) {
          this.currentSlide = 2;
        }else {
          if( this.formCardDetails.controls.photoURLs.status == "INVALID" && 
          this.formCardDetails.controls.photoURLs.value != null && this.uploadAndCapture ){
            this.currentSlide = 2;
            this.formCardDetails.get('photoURLs').clearValidators();
            this.formCardDetails.get('photoURLs').updateValueAndValidity();
          }else{
           this.showErrorOnClick();
          }
        }
      
      } 
      else {
        this.showErrorOnClick();
      }
     
      if (this.postDocumentData.length > 0) {
        this.formCardDetails.controls.documentType.clearValidators();
        this.formCardDetails.controls.documentUrl.clearValidators();
      }
      else {
        this.showErrorOnClick();
        if( this.formCardDetails.get('documentType').value != null && this.formCardDetails.get('documentUrl').value ){
          this.toastr.warning(this.translate.instant("error_messages.add_document_error"));
        }
      }
      // if (currentSlide === 2) {   
      //   if (this.postDocumentData.length > 0) {
      //     this.formCardDetails.controls.documentType.clearValidators();
      //     this.formCardDetails.controls.documentUrl.clearValidators();
      //   }
      //   else {
      //     this.showErrorOnClick();
      //     if( this.formCardDetails.get('documentType').value != null && this.formCardDetails.get('documentUrl').value ){
      //       this.toastr.warning(this.translate.instant("error_messages.add_document_error"));
      //     }
      //   }
      // }

    }
    if (currentSlide === 2) {
      if(this.postDocumentData.length > 0){
        this.formCardDetails.controls.documentType.clearValidators();
        this.formCardDetails.controls.documentUrl.clearValidators();
        this.currentSlide = 3;
        // string.replace(/\s{2,}/g, ' ').trim() 
        let firstN = this.formCardDetails.get('firstName').value.replace(/\s{2,}/g, ' ').trim()  + " " + this.formCardDetails.get('lastName').value.replace(/\s{2,}/g, ' ').trim() 
       firstN= this.titleCase(firstN);
        this.formCardDetails.controls['nameOfCard'].setValue(firstN)
      }
      else {
        this.showErrorOnClick();
      }
    }
  }
  titleCase(str1) {
  str1 = str1.toLowerCase().split(' ');
  for (var i = 0; i < str1.length; i++) {
    str1[i] = str1[i].charAt(0).toUpperCase() + str1[i].slice(1);
  }
  return str1.join(' ');
}
  
  goToPreviousSlide(currentSlide) {
     // check balance
    this.getAvailableBalance();
    if (currentSlide === 2) {
      this.currentSlide = 1;
       let cellNumber = this.formCardDetails.controls.MobileNo.value;
       let dialcode = this.formCardDetails.controls.MobileNo.value.dialCode;
      this.formCardDetails.patchValue({ MobileNo: cellNumber.number });
      dialcode = dialcode.split('+')[1]
      this.selectedCountry = getCountryCode(dialcode);
     
  
    }
  }
  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  handleIamge(PhotoUrl, type) {}

  onFileChange(event) {
    this.uploadAndCapture = false;
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 2097152) {
      let mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/passDocument/";
      this.uploadService.fileUpload(file, mainfilePath + file.name)
        .promise().then(resp => {
          this.realImage = resp.Location
          this.selfPhotoUrl = this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
          this.formCardDetails.patchValue({'photoURLs':this.selfPhotoUrl})
        })
    } else {
      this.formCardDetails.patchValue({'photoURLs':null})
      this.selfPhotoUrl = "assets/images/profile-pic.png";
      this.showErrorOnClick()
      this.toastr.error(
        this.translate.instant("dyanamic_email_template.ristrict_images"),
        this.translate.instant("pop_up_messages.error")
      );
    }
  }
  onFileChanges(event) {
    this.file = event.target.files[0];
    if (!documentsType(event.target.files[0]) && this.file.size < 2097152) {
    } else {
      event.value = null 
      this.formCardDetails.controls['documentUrl'].setValue(null)
      this.toastr.error(
        this.translate.instant("dyanamic_email_template.docUpload"),
        this.translate.instant("pop_up_messages.error")
      );
    }
  }
  addDocument() {
    if(this.formCardDetails.controls['documentUrl'].valid && this.formCardDetails.controls['documentUrl'].value == null){
      this.toastr.warning('Choose file to Add')
      this.translate.instant("card.cart_details.uploadDocument")
      return ;
    }
    if(this.formCardDetails.controls['documentType'].valid && this.formCardDetails.controls['documentUrl'].valid){
   this.testDate = new Date().getTime()
    this.docDetails = {
      documentType: this.formCardDetails.value.documentType.documentType,
      documentUrl: this.file,
      testDate: this.testDate,
    };
      let index1 =  this.postDocumentData.findIndex(ele => ele.documentType == this.docDetails.documentType)
    if(index1==-1){
       this.postDocumentData.push(this.docDetails);
    }

     this.formCardDetails.controls['documentUrl'].setValue(null);
     this.formCardDetails.get('documentUrl').clearValidators()
     this.formCardDetails.get('documentUrl').updateValueAndValidity();
    
    let index =  this.documentType.findIndex(ele => ele.documentType == this.formCardDetails.value.documentType.documentType)
    if(index >= 0){
      this.documentType.splice(index,1)
    }
    this.originalpostDocumentData = JSON.parse(JSON.stringify(this.postDocumentData));
    }
  }

  docTypeFunOnclick(){
    $('body').on('click', '#selectedDocType', function() {
      // console.log($(this));
      $(".cdk-overlay-container mat-option").removeClass('mat-active')
    });
  }
  changeDocumentList(event){console.log(event)
   let index =  this.originalType.findIndex(ele => ele.documentType == event);
    if(index >= 0){
      this.documentType.splice(index,0,this.originalType[index])
    }
    let index1 =  this.postDocumentData.findIndex(ele => ele.documentType == event)
    if(index1 >= 0){
       this.postDocumentData.splice(index1,1)
    }
    let docArray = this.postDocumentData
    let temparray = JSON.parse(JSON.stringify(this.postDocumentData))
    for(let i=0 ; i<this.postDocumentData.length ; i++){
      temparray[i].documentUrl = docArray[i].documentUrl
    }
    this.postDocumentData = []
    this.postDocumentData = temparray;
  
  }
  scanSuccessHandler(event) {}


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  takeSnapshot(): void {
    this.formCardDetails.patchValue({'photoURLs':null});
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    this.uploadAndCapture = true;
    this.showWebcam = true;
    this.capturePhoto = false;
    this.isPhotoCaptured = true;
    setTimeout(() => {
      this.trigger.next();
    }, 100);
    setTimeout(() => {
      console.log(this.formCardDetails)
      this.formCardDetails.get('photoURLs').clearValidators();
      this.formCardDetails.get('photoURLs').updateValueAndValidity();
    }, 300);
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
    this.webcamImage = webcamImage;
    this.getS3Url() ;
    this.showWebcam = false;
  }

  async getS3Url() {
    let fileName = this.formCardDetails.value?.firstName + " " + this.formCardDetails.value?.lastName + '.jpeg';
    let bucketSavePath = "level3/" + this.userDetails?.level1DisplayId + "/passDocument/" + new Date().getTime() + "/";
    let filePath = convertToBlob(this.webcamImage['_imageAsDataUrl'], { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam(this.webcamImage, bucketSavePath, filePath, fileName).promise();
    if (response && response['key']) {
      this.realImage = response['Location']
      this.selfPhotoUrl = "assets/images/profile-pic.png";
      this.formCardDetails.controls['photoURLs'].setValue(response['Location'])
    }
  }
  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cancel() {
    this.dialogRef.close();
  }
 
  uploadFileOnS3() {
    // check balance
    console.log(this.balance,"=========", this.dailyPassCharge)
    if (this.balance < this.dailyPassCharge) {
      this.insufficiantBalance = true;
    }
    // this.insufficiantBalance = true;
      if(!this.insufficiantBalance){
        let count = 0;
        let documentS3Urls = [];
        if( this.postDocumentData.length == 0 ){
          if( this.formCardDetails.get('documentType').value != null && this.formCardDetails.get('documentUrl').value ){
            this.toastr.warning(this.translate.instant("error_messages.add_document_error"));
          }
        }
        // if(this.formCardDetails.controls['documentUrl'].valid && this.formCardDetails.controls['documentUrl'].value == null){
        //   this.toastr.warning('Choose file to Add')
        //   this.translate.instant("card.cart_details.uploadDocument")
        //   return ;
        // }
      for (let i = 0; i < this.postDocumentData.length; i++) {
        this.file = this.postDocumentData[i].documentUrl
        let mainfilePath = "level3/" + this.userDetails?.level1DisplayId + "/passDocument/";
        let fileName = this.postDocumentData[i].documentType + '-' + this.file.name
        this.uploadService.fileUpload(this.file, mainfilePath + fileName).promise()
          .then((resp) => {
            var str = resp?.Location.split('/')[6].split('-')[0]
            let doc = {
              documentType: str.replace("%20", " "),
              documentUrl: resp.Location
            }
            documentS3Urls.push(doc)
            count = count + 1;
            if (this.postDocumentData.length == count) {
              if( this.saveAndSendBool == true ){
                this.saveAndSendForApproval(documentS3Urls);
              }
            }
            this.realDocumentImage = resp.Location;
            this.selfPhotoUrls = this.uploadService.getS3File(
              s3ParseUrl(resp.Location).key
            );
          });
      } 
     }
  }
  saveAndSendForApproval(documentS3Urls) {
    this.saveAndSendBool = false;
    let startTime = this.formCardDetails.value.startTime;
    startTime = startTime.split(' ')
    let isAmPm=startTime[1]
    startTime = startTime[0].split(':')

    if (startTime[0] > 12) {
      let t1 = startTime[0] - 12;
      let t2=startTime[1]
      if (t2 < 10) {
        t2='0'+t2
      }
      startTime = t1 + ":" + t2 + " " + "PM"
      
    } else {
      if (isAmPm) {
         startTime=startTime[0]+":"+startTime[1]+" "+isAmPm
      } else {
         startTime=startTime[0]+":"+startTime[1]+" "+"AM"
      }
    }
    console.log(startTime)
    if (this.timeFormatForTimePicker == 24) {
      let timeType = startTime.split(' ')[1]
      console.log(timeType)
      if (timeType == 'PM') {
        console.log(startTime)
        startTime = startTime.split(' ')[0]
        console.log(startTime)
        startTime = startTime.split(':')
        console.log(startTime)
        let finalTime=parseInt(startTime[0])+12
        startTime=finalTime+":"+startTime[1]
      } else {
         startTime = startTime.split(' ')[0]
      }
    }
    console.log(startTime)
    let reqBody = {
      firstName: this.formCardDetails.value.firstName ? this.formCardDetails.value.firstName.replace(/\s{2,}/g, ' ').trim()  : null,
      lastName: this.formCardDetails.value.lastName?this.formCardDetails.value.lastName.replace(/\s{2,}/g, ' ').trim() :null,
      gender: this.formCardDetails.value.gender,
      purpose: this.formCardDetails.value.purpose,
      hostName:this.formCardDetails.value.nameOfPersonToMeet.name?this.formCardDetails.value.nameOfPersonToMeet.name:this.formCardDetails.value.nameOfPersonToMeet,
      validFromDate: this.datePipe.transform(this.formCardDetails.value.startDate, "yyyy-MM-dd"),
      email: this.formCardDetails.value.gmail,
      contractorName: this.formCardDetails.value.contractorName,
      startTime: startTime,
      photoURLs: [this.realImage],
      categoryName: this.formCardDetails.value.categoryType.name,
      categoryId: this.formCardDetails.value.categoryType.id,
      documents: documentS3Urls,
      vehicleNumber: this.formCardDetails.value.vehicleNumber,
      layout: this.selectedCategory,
      employeeOf:this.userDetails.employeeOf,
      level1Id: 0,
      level2Id: 0,
      level3Id: this.userDetails.employeeOfId,
      passType:"Daily",
    };
    this.selfPhotoUrl = null;
    if (
      this.formCardDetails.value.MobileNo &&
      this.formCardDetails.value.MobileNo.dialCode
    ) {
      reqBody["isdCode"] = this.formCardDetails.value.MobileNo.dialCode.slice(1);
      reqBody["MobileNo"] = removeSpecialCharAndSpaces(
        this.formCardDetails.value.MobileNo.number.toString()
      );
    }
    this.cartService.createPass(reqBody).pipe(first()).subscribe(
        (resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(
              resp.message,
              this.translate.instant("pop_up_messages.success")
            );
            this.dialogRef.close(resp);
          }
        },
        (error) => {
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
      );
    // }
  }
  getDailyPassData(value) {
    let obj = {
     "categoryId": value.id
   }
   this.cartService.dailyPassAmount(obj).subscribe((resp) => {
      if (!resp.error && resp.statusCode == 200) {
        this.dailyPassCharge = resp.data
        console.log(this.dailyPassCharge);
      }
    });
  }
  
  checkCategoryRateConfigure(value) {

    console.log(value.id)
     let obj = {
     "categoryId": value.id
   }
   this.cartService.checkRateCardConfigure(obj).subscribe((resp) => {
     if (!resp.error && resp.statusCode == 200) {
       this.categoryInRateCardAvailable = resp.data;
        // this.dailyPassCharge = resp.data
        // console.log(this.dailyPassCharge);
      }
    });
  }
  changeCategory(value) {
    // call api for check category is added or not in rate card master.
    this.checkCategoryRateConfigure(value)
    // this.categoryInRateCardAvailable = false;

    // check balance
    this.getDailyPassData(value);

    this.selectedCategory = value.name;


    this.categoryTypeLayout = value.layout;
    this.formCardDetails.controls['firstName'].setValue(null)
    this.formCardDetails.controls['lastName'].setValue(null)
    this.formCardDetails.controls['gender'].setValue(null)
    this.formCardDetails.controls['gmail'].setValue(null)
    this.formCardDetails.controls['contractorName'].setValue(null)
    this.formCardDetails.controls['vehicleNumber'].setValue(null)
    this.formCardDetails.controls['purpose'].setValue(null) 
    this.formCardDetails.controls['nameOfPersonToMeet'].setValue(null)

    this.formCardDetails.controls['photoURLs'].setValue(null)
    this.formCardDetails.controls['MobileNo'].setValue(null)
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    // this.webcamImage = undefined;
    this.uploadAndCapture = false;
    console.log(this.formCardDetails)
    $('#nameOfPerson').val('');
    this.postDocumentData = []
    this.capturePhoto = true;
  }
  onChange(event) {
  }
  onDate(value) {
    this.passValiditySelection = 3;
    this.currentDate = new Date(value)
    
    for (let i = 0; i < this.passValidityData.length; i++){
      if (i == 0) {
        let diff = this.passValidityData[i].validityInDays - 1;
        let newDate = this.currentDate.setDate(this.currentDate.getDate() + diff);
        this.passValidityData[i].formatedExpireDate = newDate
      } else {
        let diff = this.passValidityData[i].validityInDays - this.passValidityData[i - 1].validityInDays;
        let newDate = this.currentDate.setDate(this.currentDate.getDate() + diff);
        this.passValidityData[i].formatedExpireDate = newDate
      }
    }
    this.currentDate = this.formCardDetails.get('validFromDate').value;
    
    this.expire = true;
     this.passValidityData.map(element => {
       element.format = false;
       element.checked = false;
        })
  }
 
  passValidity(event) {
    this.passValiditySelection = 2;
    this.price = event.price
    this.validity = event.validityInDays
    this.passType=event.passType
  }
  resetForm() {
    this.submitted =false
    this.formCardDetails.reset();
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    this.selectedCategory = null;
    this.uploadAndCapture = false;
    this.capturePhoto = true;
    this.webcamImage = undefined;
    this.postDocumentData = [];
    this.getTypeOfDocuments();
     this.defaultTime = new Date().getHours() + ":" + new Date().getMinutes()
     this.formCardDetails.controls['startTime'].setValue(this.defaultTime)
    this.formCardDetails.controls['startDate'].setValue(new Date)
    this.formCardDetails.controls['nameOfPersonToMeet'].setValue(null);
    // this.postDocumentData = [];
  }
  getScheduledTime(data) { console.log(data)
      this.formCardDetails.get('startTime').setValue(data.value)
   
  }
  getHostName() {
    let obj = {
   
      Level3DisplayId: this.userDetails.employeeOfDisplayId,
      status: "ACTIVE"
    }
     this.cartService.getHostName(obj).subscribe((data) => {
       if (!data.error && data.statusCode == 200) {
         this.hostName = data.data.list;
         this.orignalHostNameList = this.hostName;
         console.log( this.orignalHostNameList)
      }
    });
  }
  
  displayWith(user){
    if( user.email != '' ){    
      return user && user.name ? user.name + ' - ' + user.email : '';
    }else{
      return user && user.name ? user.name : '';
    } 
  }
  getValue(filterValue) { 
    if (filterValue.length == 0) {
      this.hostName = this.orignalHostNameList;
    }
    this.hostName = this._filter(filterValue);
    if (this.hostName.length==0) {
    }
  
  }
  getHostCompanyValue(data) {
  
  }
  private _filter(value: string): string[] {
    if (typeof (value) == 'string') {
        
      const filterValue = value.toLowerCase();
      console.log(filterValue);
        return this.orignalHostNameList.filter(option => option.name.toLowerCase().search(filterValue.toLowerCase()) !== -1 || option.email.toLowerCase().search(filterValue.toLowerCase()) !== -1);
      }
      else {
        return []
      }
  }


  getVisitorSettings(locationId) {
    this.apptService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.apptService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
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


  
}
