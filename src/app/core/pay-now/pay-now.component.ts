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
//import { CardService } from "../Services/card.service";
import s3ParseUrl from "s3-url-parser";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { Observable, Subject } from "rxjs";
//import { Constants } from "../constant/column";
import { defaultVal } from "src/app/core/models/app-common-enum";
import { DatePipe } from "@angular/common";
import { first } from "rxjs/operators";
import { getTime } from "ngx-bootstrap/chronos/utils/date-getters";
import { documentType } from "src/app/core/constants/pp_tc_nda";
declare var Razorpay: any;

@Component({
  selector: "app-pay-now",
  templateUrl: "./pay-now.component.html",
  styleUrls: ["./pay-now.component.scss"],
})
export class PayNowComponent implements OnInit {
  panelOpenState = false;
  permissionKeyObj = permissionKeys;
  public formCardDetails: FormGroup;
   public submitted: boolean = false;
  @Input() formData: any;
  //categoryType: any;
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
  //columns = Constants.documentCard;
  pageSize: number = defaultVal.pageSize;
  testDate: any;
  uploadAndCapture: boolean = false;
  dateFormat: string = "MM-DD-YYYY";
  public photoURLs;
  selectedCategory: any;
  docDetails: { documentType: any; documentUrl: any; testDate: any };
  //vehicleType: any;
  documentId: any;
  originalType:any;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PayNowComponent>,
    private translate: TranslateService,
    //private cartService: CardService,
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
      // categoryType: {
      //   required: translate.instant("card.cart_details.pleaseSelectCategory"),
      // },
      userName: {
        required: translate.instant("placeholders.add_name"),
        //pattern: translate.instant("card.cart_details.FirstNameValid"),
         pattern: translate.instant("card.cart_details.invalidUserName"),
        maxlength: translate.instant("card.cart_details.FirstNameMaxlength"),
      },
      userEmail: {
        required: translate.instant("UpdateProfile.email_Placeholder"),
        pattern: translate.instant('card.cart_details.EmailValid'),
         maxlength: translate.instant('Schedule.EmailMaxLengthError'),
       },
      userPhone: {
        required: translate.instant("EmployeeForm.RequiredCellNumber"),
      },
      orderAmount: {
        required: translate.instant("rateCard.enter_amount"),
        maxlength: translate.instant('rateCard.maxFour')
      },
      
    };
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formCardDetails = this.fb.group({
      //categoryType: [null, Validators.required],
      userName: [null, [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
      userEmail: [null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)]],
      userPhone: [null, Validators.required],
      orderAmount: [null, Validators.required]
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

  payNow(){
    console.log(this.formCardDetails)
    if( this.formCardDetails.status != 'VALID' ){
      this.showErrorOnClick();
      this.submitted = true;
      return;
    } else {
      this.submitted = false;
      let payObj = this.formCardDetails.value;
      payObj.userName = payObj.userName.trim();
      console.log(payObj)
      this.userService.getPaymentOrder(payObj).subscribe((res) => {
        console.log(res);
        res = res.data;
        console.log(res)
        var options = {
          "key": res.key, // Enter the Key ID generated from the Dashboard
          "amount": res.amountInSubUnits, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": res.currency,
          "name": res.name,
          "description": res.description,
          "image": "https://example.com/your_logo",
          "order_id": res.orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "handler": function (response){ console.log('Success',response)
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature);
              // let obj = {response:"success",order_id:response.razorpay_order_id,
              // payment_id:response.razorpay_payment_id,signature:response.razorpay_signature,
              // code:null,description:null,source:null,step:null,reason:null}
              let obj = {orderId:response.razorpay_order_id,
                paymentId:response.razorpay_payment_id,signature:response.razorpay_signature}
              this.paymentResponse(obj,'success')
          }.bind(this),
          "prefill": {
              "name": res.profileName,
              "email": res.profileEmail,
              "contact": res.profileContact.internationalNumber
          },
          "notes": {
              "address": res.notes.address
          },
          "theme": {
              "color": "#3399cc"
          }
        };
        var rzpl = new Razorpay(options);
        rzpl.on('payment.failed', (response) => {
          console.log('Error: ', response)
          // alert(response.error.code);
          // alert(response.error.description);
          // alert(response.error.source);
          // alert(response.error.step);
          // alert(response.error.reason);
          // alert(response.error.metadata.order_id);
          // alert(response.error.metadata.payment_id);
          // let obj = {response:"fail",order_id:response.razorpay_order_id,
          //     payment_id:response.razorpay_payment_id,code:response.error.code,
          //     description:response.error.description,source:response.error.source,
          //     step:response.error.step,reason:response.error.reason,signature:null}
          let obj = {orderId:response.error.metadata.order_id,
            paymentId:response.error.metadata.payment_id,signature:null}
          this.paymentResponse(obj, 'fail')
           this.dialogRef.close(null);
          //  rzpl.close()
        });
        rzpl.open();
      })
    }
  }

  paymentResponse(obj,response){
    this.userService.paymentDetail(obj).subscribe(
      (resp) => {
        console.log(resp)
        resp = resp.data;
        let convertPaiseToRupee = resp.amount / 100; console.log(convertPaiseToRupee);
        let moneyWithGst = (resp.amount+resp.tax) / 100; console.log(moneyWithGst)
        let obj = {amount:convertPaiseToRupee,amountIncludingGST:moneyWithGst,paymentMode:resp.method,orderId:resp.order_id,remark:""}
        if(response == 'success'){
          this.rechargeWalletUnit(obj)
        }
        if (response == 'fail') {
          
          this.dialogRef.close(resp);
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
    );
  }
  rechargeWalletUnit(obj){
    this.userService.rechargeUnitWallet(obj).subscribe(
      (resp) => {console.log(resp)
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(
            resp.message,
            this.translate.instant("pop_up_messages.success")
          );
          this.dialogRef.close(resp);
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
    );
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
  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  handleIamge(PhotoUrl, type) {}

  scanSuccessHandler(event) {}


  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
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
 

  changeCategory(value) {
    this.selectedCategory = value.name;
    this.categoryTypeLayout = value.layout;
  }
}
