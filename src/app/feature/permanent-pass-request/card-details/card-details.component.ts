import { Component, Input, OnInit } from "@angular/core";
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
import { first } from "rxjs/operators";
import { getTime } from "ngx-bootstrap/chronos/utils/date-getters";
import { documentType } from "src/app/core/constants/pp_tc_nda";
@Component({
  selector: "app-card-details",
  templateUrl: "./card-details.component.html",
  styleUrls: ["./card-details.component.scss"],
})
export class CardDetailsComponent implements OnInit {
  panelOpenState = false;
  permissionKeyObj = permissionKeys;
  public formCardDetails: FormGroup;
  //  public submitted: boolean = false;
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
  todayDate: any = moment(new Date());
  selfPhotoUrl: any = "assets/images/profile-pic.png";
  selfPhotoUrls:any = "assets/images/profile-pic.png";
  currentSlide: number = 1;
  maxDate = new Date();
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
  pageSize: number = defaultVal.pageSize;
  testDate: any;
  uploadAndCapture: boolean = false;
  dateFormat: string = "MM-DD-YYYY";
  public photoURLs;
  selectedCategory: any;
  docDetails: { documentType: any; documentUrl: any; testDate: any };
  vehicleType: any;
  documentId: any;
  originalType:any;
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
    private fileUploadService: FileUploadService
  ) {
    this.userDetails = this.userService.getUserData();
    this.selectedCountry = getCountryCode(
      this.userService.getUserCountryCode()
    );

    this.validationMessages = {
      categoryType: {
        required: translate.instant("card.cart_details.pleaseSelectCategory"),
      },
      firstName: {
        required: translate.instant("card.cart_details.PleaseEnterFirstName"),
        pattern: translate.instant("card.cart_details.FirstNameValid"),
        maxlength: translate.instant("card.cart_details.FirstNameMaxlength"),
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
        required: this.translate.instant("error_messages.select_start_date"),
        invalidDate: this.translate.instant("error_messages.valid_date"),
      },
      designation: {
        required: translate.instant("card.cart_details.designation"),
      },
      bloodGroup: {
        required: translate.instant("card.cart_details.bloodGroup"),
      },
      address: {
        required: translate.instant("card.cart_details.residentalAddress"),
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
      },
      validFromDate: {
        required: translate.instant("card.cart_details.validFromDate"),
      },
    };
  }

  ngOnInit() {
    this.createForm();
    this.getCategoryType();
    this.getTypeOfDocuments();
    this.getVehicleType();
  }

  createForm() {
    this.formCardDetails = this.fb.group({
      categoryType: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      MobileNo: [null, Validators.required],
      bloodGroup: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      designation: [null, Validators.required],
      address: [null, Validators.required],
      vehicleNumber: [null, Validators.required],
      vehicleModel: [null, Validators.required],
      vehicleType: [null, Validators.required],
      documentType: [null, Validators.required],
      documentUrl: [null, Validators.required],
      gender: [null, Validators.required],
      nameOfCard: [null, Validators.required],
      validFromDate: [null, Validators.required],
      photoURLs: [null],
      documentId:[null],
      layout:[null]
    });
  }
  getCategoryType() {
    this.cartService.getPassCategoryType().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list;
        this.categoryTypeLayout = this.categoryType.map(
          (element) => element.layout
        );
      }
    });
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
    // if (this.formCardDetails.valid) {
    //    this.submitted = false;
    // }

    if (currentSlide === 1) {
      if (this.categoryTypeLayout == "A") {
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
          this.formCardDetails.controls.address.status == "VALID"
        ) {
          this.currentSlide = 2;
        }
      } else if (this.categoryTypeLayout == "B") {
        if (
          this.formCardDetails.controls.firstName.status == "VALID" &&
          this.formCardDetails.controls.lastName.status == "VALID" &&
          this.formCardDetails.controls.gender.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID" &&
          this.formCardDetails.controls.bloodGroup.status == "VALID" &&
          this.formCardDetails.controls.dateOfBirth.status == "VALID" &&
          this.formCardDetails.controls.designation.status == "VALID" &&
          this.formCardDetails.controls.address.status == "VALID"
        ) {
          this.currentSlide = 2;
        }
      } else if (this.categoryTypeLayout == "C") {
        if (
          this.formCardDetails.controls.vehicleModel.status == "VALID" &&
          this.formCardDetails.controls.vehicleType.status == "VALID" &&
          this.formCardDetails.controls.vehicleNumber.status == "VALID" &&
          this.formCardDetails.controls.MobileNo.status == "VALID"
        ) {
          this.currentSlide = 2;
        }
      } else {
        this.showErrorOnClick();
      }
    }
    if (currentSlide === 2) {
      if(this.postDocumentData.length > 0){
        this.formCardDetails.controls.documentType.clearValidators();
        this.formCardDetails.controls.documentUrl.clearValidators();
        this.currentSlide = 3;
      }
      // if (this.formCardDetails.controls.documentType.status == "VALID") {
      //   this.currentSlide = 3;
      // } 
      else {
        this.showErrorOnClick();
      }
    }
    // this.currentSlide = this.currentSlide + 1;
  }
  goToPreviousSlide(currentSlide) {
    if (currentSlide === 3) {
      this.currentSlide = 2;
    }
  }
  goToPreviousSlide1(currentSlide) {
    if (currentSlide === 2) {
      this.currentSlide = 1;
      let cellNumber = this.formCardDetails.controls.MobileNo.value;
      this.formCardDetails.patchValue({ MobileNo: cellNumber.number });
    }
  }
  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  handleIamge(PhotoUrl, type) {}

  onFileChange(event) {
    this.uploadAndCapture = false;
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let mainfilePath =
        "level3/" + this.userDetails?.level1DisplayId + "/passDocument/";
      this.uploadService
        .fileUpload(file, mainfilePath + file.name)
        .promise()
        .then((resp) => {
          this.realImage = resp.Location;
          this.selfPhotoUrl = this.uploadService.getS3File(
            s3ParseUrl(resp.Location).key
          );
        });
    } else {
      this.toastr.error(
        this.translate.instant("dyanamic_email_template.ristrict_image"),
        this.translate.instant("pop_up_messages.error")
      );
    }
  }
  onFileChanges(event) {
    this.file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && this.file.size < 1048576) {
      // let mainfilePath ="level3/" + this.userDetails?.level1DisplayId + "/passDocument/";
      // this.uploadService.fileUpload(this.file, mainfilePath + this.file.name).promise()
      //   .then((resp) => {
      //     this.realDocumentImage = resp.Location;
      //     this.selfPhotoUrls = this.uploadService.getS3File(
      //       s3ParseUrl(resp.Location).key
      //     );
      //   });
    } else {
      event.value = null 
      this.formCardDetails.controls['documentUrl'].setValue(null)
      this.toastr.error(
        this.translate.instant("dyanamic_email_template.ristrict_image"),
        this.translate.instant("pop_up_messages.error")
      );
    }
  }
  addDocument() {
    if(this.formCardDetails.controls['documentType'].valid && this.formCardDetails.controls['documentUrl'].valid){
   this.testDate = new Date().getTime()
    this.docDetails = {
      documentType: this.formCardDetails.value.documentType.documentType,
      documentUrl: this.file,
      testDate: this.testDate,
    };
    this.postDocumentData.push(this.docDetails);

    // this.formCardDetails.controls['documentType'].setValue(null);
    this.formCardDetails.controls['documentUrl'].setValue(null);
    
    let index =  this.documentType.findIndex(ele => ele.documentType == this.formCardDetails.value.documentType.documentType)
    if(index >= 0){
      this.documentType.splice(index,1)
    }
    this.originalpostDocumentData = JSON.parse(JSON.stringify(this.postDocumentData));
   }
  }

  changeDocumentList(event){
   let index =  this.originalType.findIndex(ele => ele.documentType == event)
    if(index >= 0){
      this.documentType.push(this.originalType[index])
    }

   
    let index1 =  this.postDocumentData.findIndex(ele => ele.documentType == event)
    if(index1 >= 0){
       this.postDocumentData.splice(index1,1)
    }
    let temparray = JSON.parse(JSON.stringify(this.postDocumentData))
    this.postDocumentData = []
    this.postDocumentData = temparray;
  }
  scanSuccessHandler(event) {}


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  takeSnapshot(): void {
    this.uploadAndCapture = true;
    //this.showWebcam = false;
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
    this.webcamImage = webcamImage;
    //this.getS3Url()
    this.showWebcam = false;
  }

  async getS3Url() {
    let fileName = this.formCardDetails.value?.firstName + " " + this.formCardDetails.value?.lastName + '.jpeg';
    let bucketSavePath = "level3/" + this.userDetails?.level1DisplayId + "/passDocument/" + new Date().getTime() + "/";
    let filePath = convertToBlob(this.webcamImage['_imageAsDataUrl'], { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam(this.webcamImage, bucketSavePath, filePath, fileName).promise();
    if (response && response['key']) {
      // this.walkinProcess = true;
      this.photoURLs = response['Location'];
    }
  }
  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  cancel() {
    this.dialogRef.close();
  }
 
  uploadFileOnS3(file){
    this.file = file
      let mainfilePath ="level3/" + this.userDetails?.level1DisplayId + "/passDocument/";
      this.uploadService.fileUpload(this.file, mainfilePath + this.file.name).promise()
        .then((resp) => {
          this.realDocumentImage = resp.Location;
          this.selfPhotoUrls = this.uploadService.getS3File(
            s3ParseUrl(resp.Location).key
          );
        });
  }
  saveAndSendForApproval() {
    let documents = []
    this.postDocumentData.map(ele =>{
      let doc = {
        documentType:ele.documentType,
        documentUrl: "https://vams-development.s3.ap-south-1.amazonaws.com/level1/5e76b062-d607-4b1d-bff0-2f12132f70d5/Appointment/1663176408522/test1%20y.jpeg"
      }  
      documents.push(doc)      
    })
    let reqBody = {
      firstName: this.formCardDetails.value.firstName,
      lastName: this.formCardDetails.value.lastName,
      gender: this.formCardDetails.value.gender,
      bloodGroup: this.formCardDetails.value.bloodGroup,
      dateOfBirth:moment(
        this.formCardDetails.value.dateOfBirth,
        this.dateFormat.toUpperCase()
      ).toDate(),
      designation: this.formCardDetails.value.designation,
      address: this.formCardDetails.value.address,
      photoURLs: [this.formCardDetails.value.photoURLs],
      categoryName: this.formCardDetails.value.categoryType.name,
      documents: documents,
      vehicleNumber: this.formCardDetails.value.vehicleNumber,
      vehicleType: this.formCardDetails.value.vehicleType?.vehicleType,
      vehicleModel: this.formCardDetails.value.vehicleModel,
      passType: this.formCardDetails.value.passType,
      nameOfCard: this.formCardDetails.value.nameOfCard,
      validFromDate:moment(
        this.formCardDetails.value.validFromDate,
        this.dateFormat.toUpperCase()
      ).toDate(),
      layout:this.categoryTypeLayout,
      price: 0,
      level1Id: 0,
      level2Id: 0,
      level3Id: 0,
      
    };
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
    this.selectedCategory = value.name;
    this.categoryTypeLayout = value.layout;
  }
}
