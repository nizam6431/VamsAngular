import { Component, ElementRef, Inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms/';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { AccuantService } from '../../../core/services/accuant.service';
import { AppointmentService } from '../services/appointment.service';
import { DataService } from '../services/data.service';
import { convertToBlob } from 'src/app/core/functions/functions';
import { UserService } from 'src/app/core/services/user.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentDetails } from '../constants/enums';
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Observable, Subject } from 'rxjs';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { environment } from "src/environments/environment";
import s3ParseUrl from 's3-url-parser';
@Component({
  selector: 'app-driving-licence',
  templateUrl: './driving-licence.component.html',
  styleUrls: ['./driving-licence.component.scss']
})
export class DrivingLicenceComponent implements OnInit {
  apptDetailsKeys = Object.keys(AppointmentDetails);
  @ViewChildren("bypassPin") bypassPinControls: ElementRef<any>;
  @ViewChildren("otps") otpsControls: ElementRef<any>;
  public formCancel: FormGroup;
  idProofDetails: any;
  showdlpic: boolean = false;
  dlvisitorphotosrc: any;
  firstName: string;
  lastName: string;
  visitorDrivingLicencePhotoUrl: string;
  isS3UploadCompleted: boolean = false;
  userData: any;
  hasError:boolean = true;
  showByPass:boolean = false
  pinValue: string;
  notes: any;
  currentSlide: number = 1;
  showDl: boolean;
  appointmentData: any;
  capturePhoto: boolean = true;
  showWebcam = true;
  isPhotoCaptured: boolean;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  webcamImage: WebcamImage | undefined;
  errors: WebcamInitError[] = [];
  qrCode: any;
  visitorPhotoUrl: string;
  isAccessControlEnabled: boolean = true;
  scanners: boolean = false;
  productType: any;
  otp: any ;
  sendOtpFl: boolean = true;
  errorotp: boolean = false;
  ndaDocument: any;
  ndaDocumentUrl: any;
  ndaCheckin: any;
  errornda: boolean = false;
  subDomain: String;
  errorQR:boolean = false;
  printPassDocu: any;
  otpv: any ;
  ndaId; any;
  showSlide:boolean = false;


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DrivingLicenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: DataService,
    public appointmentService: AppointmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private accuantService: AccuantService,
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
    private userService: UserService,
    private errorService: ErrorsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log(this.data);
    if(this.data.checkinByFoo && this.data.checkinByFoo != undefined){
      this.showSlide = true;
      this.scanners = true;
      this.sendOtpFl = false;
      this.data.appointmentData = {"id":0};
    }   
    this.subDomain = environment.Subdomain.toLowerCase();
    this.productType = this.data.productType;
    this.currentSlide = this.data.slide;
    this.showDl = this.data.showDl;
    this.isAccessControlEnabled = this.data.isAccessControlEnabled,
    this.userData = this.userService.getUserData();
    this.accuantService.initialize("127.0.0.1", 1961, this.accuantCallBack);
    this.accuantService.connect();
    this.accuantService.AccuantDataEmitter.subscribe(
      (data: any) => {
        this.accuantCallBack(data);
      });
    if( this.productType == "Enterprise" || this.productType == "Hospital" ){
      if( !this.showSlide ){
        if( this.data.appointmentData.isAuthenticated == true ){
          if(this.data.sendNDAs == true){
            this.currentSlide = 2;
          }else{
            this.currentSlide = 4;
          }
        }else{
          this.currentSlide = 1;
        }
      } 
      if(this.data.sendNDAs == true){   
        if( !this.showSlide ){
          this.callPdfApi(this.data.appointmentData.level2Id, this.subDomain)
        }
      }
    }
  }

  callPdfApi(level2Id:any,subdomain:any){
    this.appointmentService.getNdaDocument(level2Id, subdomain).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.ndaDocument = response.data; console.log(this.ndaDocument);
        this.ndaId = this.ndaDocument.id;
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

  async getPdf() {
    this.ndaDocumentUrl = this.ndaDocument.docURL
    let parserContent = s3ParseUrl(this.ndaDocumentUrl);
    let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.ndaDocumentUrl = this._base64ToArrayBuffer(this.encode(data?.Body));
    console.log(this.ndaDocumentUrl)
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
  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
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
            this.firstName = this.idProofDetails.FirstName.trim();
          }

          if (this.idProofDetails.Surname != undefined && this.idProofDetails.Surname != null) {
            this.lastName = this.idProofDetails.Surname.trim();
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

  cancel() {
    this.dialogRef.close();
  }

  confrimationDailog() {
    if(!this.showByPass){
      const dialogRef = this.dialog.open(CommonPopUpComponent, {
        data: {
          pop_up_type: "drivingLicenceSubmitConfirm",
          icon: "assets/images/alert.png",
          name: this.firstName + ' ' + this.lastName
        },
        panelClass: ["vams-dialog-confirm"],
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == true) {
          this.onSubmit();
        }
      });
    }
    else{
      this.onSubmit()
    }
  }

  async getS3Url() {
    let fileName = this.firstName + this.lastName + '.jpeg';
    let bucketSavePath = "level1/" + this.userData?.level1DisplayId + "/Appointment/" + this.data.appointmentData.id + "/";
    let imageUri = 'data:image/jpeg;base64,' + this.idProofDetails.Photo;

    let filePath = convertToBlob(imageUri, { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam('image/jpeg', bucketSavePath, filePath, fileName).promise();

    if (response && response['key']) {
      this.isS3UploadCompleted = true;
      this.visitorDrivingLicencePhotoUrl = response['Location'];
    }
  }

  async onSubmit() {
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
            if(this.data.isAccessControlEnabled){
              this.dialogRef.close(response);
            }else{
            
              if(this.data.productType == "Enterprise" || this.data.productType == "Hospital" ){
                if( this.data.sendNDAs == true ){
                  this.currentSlide = this.currentSlide + 1;
                }else{
                  this.currentSlide = this.currentSlide + 3;
                }
              }else{
                this.currentSlide = this.currentSlide + 1;
              }
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
          console.log(response);
          if(this.data.isAccessControlEnabled){
            this.dialogRef.close(response);
          }
          //this.currentSlide = this.currentSlide + 1;
          if(this.data.productType == "Enterprise" && !this.data.isAccessControlEnabled ){
            if( this.data.sendNDAs == true ){
              this.currentSlide = this.currentSlide + 1;
            }else{
              this.currentSlide = this.currentSlide + 3;
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

  scanDrivingLicense() {
    this.idProofDetails = null;
    this.showByPass = false;
    this.hasError = (this.idProofDetails==null)?true:false;
    if (this.accuantService.getConnectedStatus() == true) {
      const scanReq = {
        "Controller": "Acuant",
        "Action": "DriversLicense",
        "ErrorMessage": "",
        "ResponseObj": ""
      };

      this.accuantService.doSend(scanReq);
    }
  }

  byPassActivate(){
    this.showByPass = true;
    this.hasError = true;
  }
  byPassActivated(){
    this.showByPass = true;
    this.sendOtpFl = false;
    this.scanners = false;
    this.hasError = true;
  }
  scanQrActivated(){
    this.showByPass = false;
    this.sendOtpFl = false;
    this.scanners = true;
    this.hasError = true;
  }
  sendOtpActivated(){
    this.showByPass = false;
    this.sendOtpFl = true;
    this.scanners = false;
    this.hasError = true;
  }

  onKeyUpEventByOtp(index, event, length) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) { console.log('yes')
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    // if (pos > -1 && pos < length) {
    //   let element = event.srcElement.nextElementSibling;
    //   if(element == null)  // check if its null
    //     return;
    // else
    //     element.focus();
    //     this.bypassPinControls["_results"][pos].nativeElement.focus();
    // }
    if (pos > -1 && pos < length) {
      this.otpsControls["_results"][pos].nativeElement.focus();
    }
    console.log(index,pos,length, event.key )
    if(pos == 4){
      //this.currentSlide = this.currentSlide+1;
      //this.checkByPassError();
      this.hasError = false;
      let votp = $("#otpcodeBox1").val()+''+$("#otpcodeBox2").val()+''+$("#otpcodeBox3").val()+''+$("#otpcodeBox4").val();
      this.otp = votp;
      console.log(this.otp)
    }
    else{
      this.hasError = true;
    }
  }
  formResetOtp( para: any ){
    this.hasError  = true;
    if( para == 'otp' ){
      $("#otpcodeBox1").val('');
      $("#otpcodeBox2").val('');
      $("#otpcodeBox3").val('');
      $("#otpcodeBox4").val('');
      this.otp = '';
    }
  }

  onKeyUpEventBypass(index, event, length) {
    let pos = index;
    if (event.keyCode === 8 && event.which === 8) {
      pos = index - 1;
    } else {
      pos = index + 1;
    }
    if (pos > -1 && pos < length) {
      this.bypassPinControls["_results"][pos].nativeElement.focus();
    }
    console.log(index,pos,length)
    if(pos == 6){
      this.checkByPassError();
    }
    else{
      this.hasError = true;
    }
  }

  checkByPassError() {
    this.pinValue = ""
    let error = false,pinValue = "";
    this.bypassPinControls["_results"].forEach((element) => {
      if (!element.nativeElement.value) {
        error = true;
      } else {
        pinValue += element.nativeElement.value;
      }
    });
    if (!error) {
      this.hasError =  false;
    } else {
      this.hasError = true
    }
    this.pinValue = pinValue;
    this.hasError = typeof(parseInt(pinValue))=='number'?false:true;
  }

  scanSuccessHandler(qrCode) {
    this.qrCode = qrCode;
    let appointmentId = (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0;
    this.callByQrCodeFun(qrCode,appointmentId);
  }
  callByQrCodeFun(qrCode,appointmentId){
    this.appointmentService.GetByQrCodeAsync(qrCode,appointmentId).subscribe((resp)=>{
      console.log(resp);
      if(resp.statusCode == 200 && resp.errors === null){
        this.appointmentData = resp?.data;
        if(this.data.productType == "Enterprise" ){
          if( this.data.sendNDAs == true ){
            if( this.showSlide == false ){
              this.currentSlide = this.currentSlide+1;
            }else{
              this.currentSlide = this.currentSlide+2;
              this.data.appointmentData.id = resp?.data?.appointmentId;
            }
            //this.ndaDocumentUrl = this.ndaDocument.docURL
          }else{
            if( this.showSlide == false ){
              this.currentSlide = this.currentSlide+3;
            }else{
              this.currentSlide = this.currentSlide+2;
              this.data.appointmentData.id = resp?.data?.appointmentId;
            }
          }
        }else{
          this.currentSlide = this.currentSlide+1;
        }
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
  formReset(){
    this.pinValue = null;
    this.hasError  = true;
    this.notes = null;
    this.idProofDetails = null;
  }

  takeSnapshot(): void {
    this.capturePhoto = false;
    this.isPhotoCaptured = true;
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }


  handleImage(webcamImage: WebcamImage) {
    //this.getPicture.emit(webcamImage);
    this.webcamImage = webcamImage;
    this.getS3UrlForWebCam()
    this.showWebcam = false;
  }

  async getS3UrlForWebCam() {
    let fileName = this.appointmentData?.data?.firstName + " " + this.appointmentData?.data?.lastName + '.jpeg';
    let bucketSavePath = "level1/" + this.userData?.level1DisplayId + "/Appointment/" + new Date().getTime() + "/";
    let filePath = convertToBlob(this.webcamImage['_imageAsDataUrl'], { 'type': 'image/jpg' });
    let response = await this.fileUploadService.fileUploadForWebCam(this.webcamImage, bucketSavePath, filePath, fileName).promise();
    if (response && response['key']) {
      // this.walkinProcess = true;
      this.visitorPhotoUrl = response['Location'];
      // let  resp = await this.fileUploadService.getContentFromS3Url(response['key']).promise();
      // this.visitorPhotoUrl =  this._sanitizer.bypassSecurityTrustUrl(JSON.parse(String.fromCharCode.apply(null, resp?.Body)));
    }
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  checkIn(){
    let dataSendToBackendObj;
    if( this.productType == "Enterprise" || this.productType == "Hospital" ){
      dataSendToBackendObj = {
        appointmentId: (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0,
        qrCode: this.qrCode,
        temprature: null,
        isMask: true,
        visitorId: null,
        VisitorPhotoURL:this.visitorPhotoUrl,
        otp:'',"isOTPValid": false,"ndaId": 0, "isNDAAccepted": false, "byPassById": 0, "isByPass": false
      };
      let otp = ( this.otp != undefined ) ? this.otp.toString() : '';
      let otpvalid = ( this.otp != undefined ) ? true : false;
      let qrcode = ( this.qrCode != undefined ) ? this.qrCode : '';
      dataSendToBackendObj.qrCode = qrcode;
      dataSendToBackendObj.otp = otp;
      dataSendToBackendObj.isOTPValid = otpvalid;
      console.log(this.pinValue);
      if( this.pinValue == '' || this.pinValue == undefined ){
        this.showByPass = false;
        dataSendToBackendObj.byPassById = 0;
        dataSendToBackendObj.isByPass = this.showByPass;
      }else{
        dataSendToBackendObj.byPassById = parseInt(this.pinValue);
        dataSendToBackendObj.isByPass = this.showByPass;
      }
      if(this.data.sendNDAs == true){
        dataSendToBackendObj.isNDAAccepted = true;
        dataSendToBackendObj.ndaId = this.ndaId;
      }else{
        dataSendToBackendObj.isNDAAccepted = false;
        dataSendToBackendObj.ndaId = 0;
      }
    }else{
      dataSendToBackendObj = {
        appointmentId: (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0,
        qrCode: this.qrCode,
        temprature: null,
        isMask: true,
        visitorId: null,
        VisitorPhotoURL:this.visitorPhotoUrl
      };
    }
    console.log(dataSendToBackendObj)
    this.appointmentService.checkInWithoutBioDevice(dataSendToBackendObj)
    .pipe()
    .subscribe((resp)=>{
      console.log(resp);
      this.toastr.success(resp.message);
      if(resp.statusCode === 200){
        resp.cardData = this.data.appointmentData;
        if(this.showSlide){
          resp.data = this.appointmentData;
        }
        this.dialogRef.close(resp);
          
      }
    },(error)=>{
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        });
      } else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }    })
  }

  getQrCode(qrCode){
    console.log(qrCode);
  }
  validateOtp(otp: any){
    console.log(otp.value);
      let data = {"appointmentId": this.data.appointmentData.id,
      "otp": otp.value}
    console.log(data)
      this.appointmentService.validateOTP(data).subscribe((resp)=>{
        console.log(resp);
        if(resp.statusCode == 200 && resp.errors === null){
          this.currentSlide = this.currentSlide+1;
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
  resendOTP(){
    let data = {"appointmentId": this.data.appointmentData.id,
    "isd": "",
    "phone": "",
    "email": ""}
    this.appointmentService.resendOtp(data).subscribe((resp)=>{
      console.log(resp);
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

  validateOTPndQRCODE(data){
    this.appointmentService.validateOTP(data).subscribe((resp)=>{ 
      //console.log(resp);
      if(resp.statusCode == 200 && resp.errors === null && resp.data.isValidUser == true ){
        if(this.data.sendNDAs == true){
          this.currentSlide = this.currentSlide+1;
        }else{
          this.currentSlide = this.currentSlide+3;
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

  confrimationDailogs(type: any){
    if(type == 'otp' ){
      console.log(typeof this.otp);
      if(this.otp.length < 4){
        this.errorotp = true;
      }else{
        this.errorotp = false;
        let otp = this.otp.toString();
        let data = {"appointmentId": this.data.appointmentData.id,
        "otp": otp}
        console.log(data)
        this.validateOTPndQRCODE(data);
      }
    }
    if( type == 'nda' ){
      console.log(this.ndaCheckin, type)
      if( this.ndaCheckin == false || this.ndaCheckin == undefined ){
        this.errornda = true;
      }else{
        this.currentSlide = this.currentSlide+2;
      }
    }
    if( type == 'scanner' ){ console.log(this.qrCode, type)
      if(this.qrCode == undefined || this.qrCode.length < 1){
        this.errorQR = true
      }else{
        this.scanSuccessHandler(this.qrCode.toString());
        this.errorQR = false
      }
      
    }
    if( type == 'showSlide' ){
      this.callPdfApi(this.data.visitorSettings.level2Id, this.subDomain);
      if( this.data.sendNDAs == true ){
        this.currentSlide = this.currentSlide-1;
      }else{
        this.currentSlide = this.currentSlide+1;
      }
    }
    
  }
  onClickExpandRx(checkbox){
    // console.log(checkbox)
    // if(checkbox == true){
    //   this.hasError = false;
    // }else{
    //   this.hasError = true;
    // }
  }

}
