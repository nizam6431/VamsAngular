import { Component, EventEmitter, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
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
import { DatePipe } from "@angular/common";
import { elementAt, first } from "rxjs/operators";
import { getTime } from "ngx-bootstrap/chronos/utils/date-getters";
import { documentType } from "src/app/core/constants/pp_tc_nda";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "src/app/core/models/users";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import { AppointmentService } from "src/app/feature/appointment/services/appointment.service";
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
  selfPhotoUrls: any = "assets/images/profile-pic.png";
  currentSlide: number = 1;
  maxDate = new Date();
  minDate = new Date();
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  bloodGroupFilter = [
    { value: "A+", viewValue: "A+" },
    { value: "A-", viewValue: "A-" },
    { value: "B+", viewValue: "B+" },
    { value: "B-", viewValue: "B-" },
    { value: "AB+", viewValue: "AB+" },
    { value: "AB-", viewValue: "AB-" },
    { value: "O+", viewValue: "O+" },
    { value: "O-", viewValue: "O-" },
  ];
  genderType = [
    { value: "Male", viewValues: "Male" },
    { value: "Female", viewValues: "Female" },
    { value: "Other", viewValues: "Other" },
  ];

  documentTypeData: any;
  originalpostDocumentData: any;
  tempDocumentType: any;
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
  passValiditycolumns = Constants.passValidity;
  pageSize: number = defaultVal.pageSize;
  testDate: any;
  uploadAndCapture: boolean = false;
  dateFormat: string = "DD-MM-YYYY";
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
  saveAndSendBool: boolean = true;
  balance: any;
  insufficiantBalance: boolean = false;
  diff: any;
  RateCardId: any;
  invalidValiditySelect: boolean = false;
  dateFormat1: any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CardDetailsComponent>,
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
    private apptService: AppointmentService
  ) {
    this.userDetails = this.userService.getUserData();
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());

    this.validationMessages = {
      categoryType: {
        required: translate.instant("card.cart_details.pleaseSelectCategory"),
      },
      firstName: {
        required: translate.instant("card.cart_details.PleaseEnterFirstName"),
        pattern: translate.instant("card.cart_details.FirstNameValid"),
        maxlength: translate.instant("card.cart_details.FirstNameMaxlength"),
        // minlength: translate.instant('card.cart_details.FirstNameValid'),
      },
      lastName: {
        required: translate.instant("card.cart_details.PleaseEnterLastName"),
        pattern: translate.instant("card.cart_details.LastNameValid"),
        maxlength: translate.instant("card.cart_details.LastNameMaxlength"),
      },
      MobileNo: {
        required: translate.instant("EmployeeForm.RequiredCellNumber"),
      },
      dateOfBirth: {
        required: this.translate.instant("card.cart_details.dateOfBirth"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      designation: {
        required: translate.instant("card.cart_details.designation"),
        pattern: translate.instant("card.cart_details.designation")
      },
      bloodGroup: {
        required: translate.instant("card.cart_details.bloodGroup"),
      },
      address: {
        required: translate.instant("card.cart_details.residentalAddress"),
        pattern: translate.instant("card.cart_details.residentalAddressPattern")
      },
      gender: {
        required: translate.instant("card.cart_details.add_filter"),
      },
      documentType: {
        required: translate.instant("card.cart_details.pleaseDocumentType"),
      },
      vehicleNumber: {
        required: translate.instant("card.cart_details.pleasevehicalNo"),
        pattern: translate.instant("card.cart_details.vehicleNumberPattern")
      },
      vehicleModel: {
        required: translate.instant(
          "card.cart_details.pleaseEnterVehicleModel"
        ),
        pattern: translate.instant("card.cart_details.pleaseEnterVehicleModel")
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
        maxlength: translate.instant("card.cart_details.nameOfCardLength"),
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
    this.getVisitorSettings(null)
    // check balance
    this.getAvailableBalance();
    let dte = new Date();
    // dte.setDate(dte.getDate() - 365);
    let thisYear = (new Date()).getFullYear() //Calculate year
    dte.setDate(dte.getDate() - thisYear);
    // console.log(dte.setDate,'setDate')
    this.minDate = dte;
  
    this.createForm();
    this.getCategoryType();
    this.getTypeOfDocuments();
    this.getVehicleType();
  }
  getAvailableBalance() {
   
    this.cartService.getBalance().subscribe((resp) => {
      if (!resp.error && resp.statusCode == 200) {
        this.balance = resp.data.currentBalance
      }
    });
  }
  createForm() {
    // let today = new Date();
    // var dd = String(today.getDate()).padStart(2, '0');
    // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    // var yyyy = today.getFullYear();
    this.formCardDetails = this.fb.group({
      categoryType: [null, Validators.required],
      firstName: [null,
        [Validators.required, Validators.minLength(2), Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      ],
      lastName: [null,
        [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9]")]
      ],
      MobileNo: [null, Validators.required],
      bloodGroup: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      designation: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      address: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9'\.\-\s\,():/ ]")]],
      // address: [null, [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9'\.\-\s\,()]")]],
      vehicleNumber: [null, [Validators.required, Validators.pattern("^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 $]*)?$")]],
      vehicleModel: [null, [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      vehicleType: [null, Validators.required],
      documentType: [null, Validators.required],
      documentUrl: [null, Validators.required],
      gender: [null, Validators.required],
      nameOfCard: [null, Validators.required],
      validFromDate: [new Date, Validators.required],
      photoURLs: [null, Validators.required],
      documentId: [null],
      layout: [null]
    });
  }
  keyFunc(event, key) {
    // console.log(event.target.value)
    let fname = event.target.value.replace(/[^a-zA-Z0-9 ]/g, "")
    this.formCardDetails.controls[key].setValue(fname)
    // console.log(fname);
  }
  keyFuncAddress(event, key) {
    // console.log(event.target.value)
    let fname = event.target.value.replace(/[^a-zA-z0-9'\.\-\s\,():/ ]/g, "")
    this.formCardDetails.controls[key].setValue(fname)
    // console.log(fname);
  }
  getCategoryType() {
    let obj = {
      passType: 'P',
      categoryType: ""
    }
    this.cartService.getPassCategoryType(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list;
        this.categoryTypeLayout = this.categoryType.sort(this.sortDataByString);
        //this.categoryTypeLayout = this.categoryType.sort((p1, p2) => (p1.name < p2.name) ? 1 : (p1.name > p2.name) ? -1 : 0);
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
        this.documentType = data.data.list;
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
    // get balance
    this.getAvailableBalance()
    this.submitted = true;
    if (currentSlide === 1) {
      if (!this.uploadAndCapture) {
        if (this.formCardDetails.controls.photoURLs.status == "VALID" && this.formCardDetails.controls.photoURLs.value == null) {
          this.formCardDetails.controls.photoURLs.setValidators([Validators.required]);
          this.formCardDetails.controls['photoURLs'].setErrors({ 'invalid': true });
          this.toastr.warning(this.translate.instant("card.cart_details.uploadCapturePhoto"));
          this.showErrorOnClick();
          return;
        }
        if (this.formCardDetails.controls.photoURLs.status == "INVALID" && this.formCardDetails.controls.photoURLs.value == null) {
          //this.toastr.warning(this.translate.instant("card.cart_details.uploadCapturePhoto"));
          this.showErrorOnClick();
          return;
        }
      }
      // if (this.categoryTypeLayout == "A") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
          this.formCardDetails.controls.bloodGroup.status == "VALID" &&
          this.formCardDetails.controls.dateOfBirth.status == "VALID" &&
          this.formCardDetails.controls.designation.status == "VALID" &&
          this.formCardDetails.controls.vehicleModel.status == "VALID" &&
          this.formCardDetails.controls.vehicleType.status == "VALID" &&
          this.formCardDetails.controls.vehicleNumber.status == "VALID" &&
          this.formCardDetails.controls.address.status == "VALID" && 
          this.formCardDetails.controls.photoURLs.status == "VALID"
        ) {
            this.currentSlide = 2;
          }
      // } 
      // else if (this.categoryTypeLayout == "B") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
          this.formCardDetails.controls.bloodGroup.status == "VALID" &&
          this.formCardDetails.controls.dateOfBirth.status == "VALID" &&
          this.formCardDetails.controls.designation.status == "VALID" &&
          this.formCardDetails.controls.address.status == "VALID" && 
          this.formCardDetails.controls.photoURLs.status == "VALID"
        ) {
          if(this.formCardDetails.controls.valid && this.selectedCategory == 'Employee Pass with Vehicle'){
            this.currentSlide = 2;
          }if(this.selectedCategory != 'Employee Pass with Vehicle'){
            this.currentSlide = 2;
          }
        }
      // }
      //  else if (this.categoryTypeLayout == "C") {
      if (
        this.formCardDetails.controls.vehicleModel.status == "VALID" &&
        this.formCardDetails.controls.vehicleType.status == "VALID" &&
        this.formCardDetails.controls.vehicleNumber.status == "VALID" &&
        this.formCardDetails.controls.MobileNo.status == "VALID" &&
        this.formCardDetails.controls.photoURLs.status == "VALID"
      ) {
        this.currentSlide = 2;
      }
      // } 
      else {
        if (this.formCardDetails.controls.photoURLs.status == "INVALID" &&
          this.formCardDetails.controls.photoURLs.value != null && this.uploadAndCapture) {
          this.currentSlide = 2;
          this.formCardDetails.get('photoURLs').clearValidators();
          this.formCardDetails.get('photoURLs').updateValueAndValidity();
        } else {
          this.showErrorOnClick();
        }
      }
    }
    if (currentSlide === 2) {
      if (this.postDocumentData.length > 0) {
        this.formCardDetails.controls.documentType.clearValidators();
        this.formCardDetails.controls.documentUrl.clearValidators();
        this.currentSlide = 3;
        let firstN = this.formCardDetails.get('firstName').value?.replace(/\s{2,}/g, ' ').trim() + " " + this.formCardDetails.get('lastName').value?.replace(/\s{2,}/g, ' ').trim()
        firstN = this.titleCase(firstN);
        this.formCardDetails.controls['nameOfCard'].setValue(firstN)
        //this.getPassValidity();
        this.getRateCardMaster();
        setTimeout(() => {
          if (this.formCardDetails.controls['nameOfCard'].status == 'INVALID') {
            this.showErrorOnClick();
          }
        }, 10);
       

      }
      else {
        this.showErrorOnClick();
        if (this.formCardDetails.get('documentType').value != null && this.formCardDetails.get('documentUrl').value) {
          this.toastr.warning(this.translate.instant("error_messages.add_document_error"));
        }
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
    // get balance
    this.getAvailableBalance()
    if (currentSlide === 3) {
      this.currentSlide = 2;
      this.passValiditySelection = 1;
    }
  }
  goToPreviousSlide1(currentSlide) {
    // get balance
    this.getAvailableBalance()
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

  handleIamge(PhotoUrl, type) { }

  onFileChange(event) {
    this.uploadAndCapture = false;
    this.capturePhoto = true;
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 2097152) {
      let mainfilePath = "level3/" + this.userDetails?.level1DisplayId + "/passDocument/";
      this.uploadService.fileUpload(file, mainfilePath + file.name)
        .promise().then(resp => {
          this.realImage = resp.Location
          this.selfPhotoUrl = this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
          this.formCardDetails.patchValue({ 'photoURLs': this.selfPhotoUrl })
        })
    } else {
      this.formCardDetails.patchValue({ 'photoURLs': null })
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
   
    if (this.formCardDetails.controls['documentUrl'].valid && this.formCardDetails.controls['documentUrl'].value == null) {
      this.toastr.warning('Choose file to Add')
      this.translate.instant("card.cart_details.uploadDocument")
      return;
    }
    if (this.formCardDetails.controls['documentType'].valid && this.formCardDetails.controls['documentUrl'].valid) {
      this.testDate = new Date().getTime()
      this.docDetails = {
        documentType: this.formCardDetails.value.documentType.documentType,
        documentUrl: this.file,
        testDate: this.testDate,
      };
      let index1 = this.postDocumentData.findIndex(ele => ele.documentType == this.docDetails.documentType)
      if (index1 == -1) {
        // this.documentType.splice(index1,1)
        this.postDocumentData.push(this.docDetails);
      }

      this.formCardDetails.controls['documentUrl'].setValue(null);
      this.formCardDetails.get('documentUrl').clearValidators()
      this.formCardDetails.get('documentUrl').updateValueAndValidity();
    
      let index = this.documentType.findIndex(ele => ele.documentType == this.formCardDetails.value.documentType.documentType)
      if (index >= 0) {
        this.documentType.splice(index, 1)
      }
      this.originalpostDocumentData = JSON.parse(JSON.stringify(this.postDocumentData));
    }
    // this.formCardDetails.controls['documentUrl'].setValue(null);
  }
  docTypeFunOnclick() {
    $('body').on('click', '#selectedDocType', function () {
      // console.log($(this));
      $(".cdk-overlay-container mat-option").removeClass('mat-active')
    });
  }
  changeDocumentList(event) {
    let index = this.originalType.findIndex(ele => ele.documentType == event)
    if (index >= 0) {
      // this.documentType.push(this.originalType[index])
      this.documentType.splice(index, 0, this.originalType[index])
    }
    let index1 = this.postDocumentData.findIndex(ele => ele.documentType == event)
    if (index1 >= 0) {
      this.postDocumentData.splice(index1, 1)
    }
    // let temparray = JSON.parse(JSON.stringify(this.postDocumentData))
    let docArray = this.postDocumentData
    let temparray = JSON.parse(JSON.stringify(this.postDocumentData))
    for (let i = 0; i < this.postDocumentData.length; i++) {
      temparray[i].documentUrl = docArray[i].documentUrl
    }
    this.postDocumentData = []
    this.postDocumentData = temparray;
  }
  scanSuccessHandler(event) { }


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  takeSnapshot(): void {
    this.formCardDetails.patchValue({ 'photoURLs': null })
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    this.uploadAndCapture = true;
    this.showWebcam = true;
    this.capturePhoto = false;
    this.isPhotoCaptured = true;
    setTimeout(() => {
      this.trigger.next();
    }, 100);
    setTimeout(() => {
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
    this.getS3Url();
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
      let photo = response.Location.toString();
      //this.formCardDetails.patchValue({'photoURLs':photo})
      this.formCardDetails.controls['photoURLs'].setValue(photo);
      this.formCardDetails.get('photoURLs').setValue(photo)
      
    }
  }
  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cancel() {
    this.dialogRef.close();
  }
 
  uploadFileOnS3() {
    if (this.formCardDetails.controls['nameOfCard'].status == 'INVALID') {
      return;
    }
    if (this.passValidityData.length > 0) {
      if (this.passValiditySelection != 2) {
        this.passValiditySelection = 0;
      } else {
        if (!this.insufficiantBalance && !this.invalidValiditySelect) {
          if (this.formCardDetails.controls['validFromDate'].status == 'INVALID') {
            this.toastr.warning(this.translate.instant("card.cart_details.validFromDate"));
            return;
          }
          let count = 0;
          let documentS3Urls = [];
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
                  if (this.saveAndSendBool == true) {
                    this.saveAndSendForApproval(documentS3Urls);
                    //this.saveAndSendBool = false;
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
    }
    
  }
  saveAndSendForApproval(documentS3Urls) {
    this.RateCardId = (this.passValidityData.map(element => {
      if (element.checked) {
        return element.id
      }
    })).filter(ele => ele != null)
    this.RateCardId = this.RateCardId[0]
    this.saveAndSendBool = false;
    let reqBody = {
      firstName: this.formCardDetails.value.firstName ? this.formCardDetails.value.firstName.replace(/\s{2,}/g, ' ').trim() : null,
      lastName: this.formCardDetails.value.lastName ? this.formCardDetails.value.lastName.replace(/\s{2,}/g, ' ').trim() : null,
      gender: this.formCardDetails.value.gender,
      bloodGroup: this.formCardDetails.value.bloodGroup,
      dateOfBirth: this.datePipe.transform(this.formCardDetails.value.dateOfBirth, "yyyy-MM-dd"),
      designation: this.formCardDetails.value.designation,
      address: this.formCardDetails.value.address,
      photoURLs: [this.realImage],
      categoryName: this.formCardDetails.value.categoryType.name,
      categoryId: this.formCardDetails.value.categoryType.id,
      documents: documentS3Urls,
      vehicleNumber: this.formCardDetails.value.vehicleNumber,
      vehicleType: this.formCardDetails.value.vehicleType?.vehicleType,
      vehicleModel: this.formCardDetails.value.vehicleModel,
      passType: this.passType,
      passName: this.formCardDetails.value.nameOfCard,
      validFromDate: this.datePipe.transform(this.formCardDetails.value.validFromDate, "yyyy-MM-dd"),
      layout: this.categoryTypeLayout,
      price: this.price,
      validity: this.validity.toString(),
      level1Id: 0,
      level2Id: 0,
      level3Id: this.userDetails.employeeOfId,
      RateCardId: this.RateCardId
    };
    console.log(reqBody, 'reqbody')
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

  changeCategory(value) {
    // check balance
    this.getAvailableBalance();
    this.selectedCategory = value.name;
    this.categoryTypeLayout = value.layout;
    this.formCardDetails.controls['firstName'].setValue(null)
    this.formCardDetails.controls['lastName'].setValue(null)
    this.formCardDetails.controls['gender'].setValue(null)
    this.formCardDetails.controls['bloodGroup'].setValue(null)
    this.formCardDetails.controls['dateOfBirth'].setValue(null)
    this.formCardDetails.controls['vehicleNumber'].setValue(null)
    this.formCardDetails.controls['designation'].setValue(null)
    this.formCardDetails.controls['address'].setValue(null)
    this.formCardDetails.controls['vehicleType'].setValue(null)
    this.formCardDetails.controls['vehicleModel'].setValue(null)
    this.formCardDetails.controls['MobileNo'].setValue(null)
    this.formCardDetails.controls['photoURLs'].setValue(null)
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    // this.webcamImage = undefined;
    this.uploadAndCapture = false;
    this.postDocumentData = []
    this.capturePhoto = true;
  }
  onChange(event) {
  }
  // onDate(value) {
  //   this.passValiditySelection = 3;
  //   this.currentDate = new Date(value)
  //   for (let i = 0; i < this.passValidityData.length; i++){
  //     console.log(this.passValidityData.length)
  //     if (i == 0) {
  //       let diff = this.passValidityData[i].validityInDays - 1;
  //       console.log(diff,'difff')
  //       let newDate = this.currentDate.setDate(this.currentDate.getDate() + diff);
  //       this.passValidityData[i].formatedExpireDate = newDate
  //     } else {
  //       let diff = this.passValidityData[i].validityInDays - this.passValidityData[i - 1].validityInDays;
  //       let newDate = this.currentDate.setDate(this.currentDate.getDate() + diff);
  //       this.passValidityData[i].formatedExpireDate = newDate
  //     }
  //   }
  //   this.currentDate = this.formCardDetails.get('validFromDate').value;
    
  //   this.expire = true;
  //    this.passValidityData.map(element => {
  //      element.format = false;
  //      element.checked = false;
  //       })
  
  // }
  addMonths(date, months) {
    let newDate = new Date(date)
    let monthNumber = date.getMonth()
    newDate.setMonth(monthNumber + months);
    return newDate;
  }
 
  onDate(value) {
    console.log(value);
    this.invalidValiditySelect = false;
    this.passValiditySelection = 3;
    this.currentDate = new Date(value)
    let newIssueDate = this.currentDate
    for (let i = 0; i < this.passValidityData.length; i++) {
      if (this.passValidityData[i].validity === '1 Month') {
        let diff1 = this.addMonths(newIssueDate, 1)
        this.diff = diff1
      }
      else if (this.passValidityData[i].validity === '6 Months') {
        let diff1 = this.addMonths(newIssueDate, 6)
        this.diff = diff1
      }
      else if (this.passValidityData[i].validity === '1 Year') {
        let diff1 = this.addMonths(newIssueDate, 12)
        this.diff = diff1
      }
      else if (this.passValidityData[i].validity === '3 Years') {
        let diff1 = this.addMonths(newIssueDate, 36)
        this.diff = diff1
        console.log(this.diff)
      }
      
      if (i == 0) {
        let newDate = this.diff;
        this.passValidityData[i].formatedExpireDate = newDate
      } else {
        let newDate = + this.diff;
        this.passValidityData[i].formatedExpireDate = newDate
      }
      newIssueDate = this.currentDate
    }
    this.currentDate = this.formCardDetails.get('validFromDate').value;
    
    this.expire = true;
    this.passValidityData.map(element => {
      element.format = false;
      element.checked = false;
    })
  }

  getDateChane() {

  }
  // getPassValidity() {
  //   let obj = {
  //     passType: "Permanent"
  //   }
  //    this.cartService.getPassValidity(obj).subscribe((data) => {
  //     if (!data.error && data.statusCode == 200) {
  //       this.passValidityData = data.data;
  //       this.passValidityData.map(element => {
  //         element.expireDate = "--/--/----";
  //         element.format = false;
  //         element.checked = false;
  //         element.passType = "Permanent";
  //       })
  //       this.onDate(this.currentDate)
  //     }
  //   });
  // }
  getRateCardMaster() {
    let obj = {
      categoryId: this.formCardDetails.value.categoryType.id
    }
    this.cartService.getRateCardCategory(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.passValidityData = data.data;

        // for(let i in  data.data)
        //   {
        //     this.RateCardId = data.data[i].id
        //     console.log(this.RateCardId,'ratecard id')
        //   }
        this.passValidityData.map(element => {
          element.expireDate = "--/--/----";
          element.format = false;
          element.checked = false;
          element.passType = "Permanent"
        })
        this.onDate(this.currentDate)
      }
    });
  }
  passValidity(event) {
    let validateDate = new Date(event.formatedExpireDate)
    let issueDate = new Date();
   
    console.log(validateDate, issueDate);
    if (validateDate > issueDate) {
      this.invalidValiditySelect = false;
    } else {
      this.invalidValiditySelect = true;
    }
    if (this.balance < event.price) {
      this.insufficiantBalance = true;
      console.log("==============insufficiantBalance===========")
    } else {
      this.insufficiantBalance = false;
    }
    this.passValiditySelection = 2;
    this.price = event.price
    //this.validity = event.validityInDays
    this.validity = event.validity
    this.passType = event.passType
  }
  resetForm() {
    this.submitted = false;
    this.selfPhotoUrl = "assets/images/profile-pic.png";
    this.uploadAndCapture = false;
    this.capturePhoto = true;
    this.webcamImage = undefined;
    this.formCardDetails.reset();
    this.selectedCategory = null;
    this.postDocumentData = [];
    this.getTypeOfDocuments();
    //this.minDate = '';
    this.formCardDetails.controls['validFromDate'].setValue(new Date())
    // this.formCardDetails.controls['validFromDate'].setValue(null);
    // this.formCardDetails.controls.validFromDate.setValidators([Validators.required]);
  }
  getVisitorSettings(locationId) {
    this.apptService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        console.log(response);
        this.dateFormat1=response.data.dateFormat
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
