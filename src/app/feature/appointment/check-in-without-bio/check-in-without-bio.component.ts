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
@Component({
  selector: 'app-check-in-without-bio',
  templateUrl: './check-in-without-bio.component.html',
  styleUrls: ['./check-in-without-bio.component.scss']
})
export class CheckInWithoutBioComponent implements OnInit {
  apptDetailsKeys = Object.keys(AppointmentDetails);
  @ViewChildren("bypassPin") bypassPinControls: ElementRef<any>;
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


  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CheckInWithoutBioComponent>,
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
    // console.log(this.data);
    this.currentSlide = this.data.slide;
    this.showDl = this.data.showDl;
    this.userData = this.userService.getUserData();
    this.accuantService.initialize("127.0.0.1", 1961, this.accuantCallBack);
    this.accuantService.connect();
    this.accuantService.AccuantDataEmitter.subscribe(
      (data: any) => {
        this.accuantCallBack(data);
      });
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
            if(this.data.isAccessControlEnabled)
              this.dialogRef.close(response);
            this.currentSlide = this.currentSlide + 1;
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
          if(this.data.isAccessControlEnabled)
            this.dialogRef.close(response);
          this.currentSlide = this.currentSlide + 1;
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
    this.appointmentService.GetByQrCodeAsync(qrCode,appointmentId).subscribe((resp)=>{
        console.log(resp);
        if(resp.statusCode == 200 && resp.errors === null){
          this.appointmentData = resp?.data;
          this.currentSlide = this.currentSlide+1;
        }
    },
    (error)=>{
      this.toastr.error(this.translate.instant("toster_message.invalidQrCode"), this.translate.instant("toster_message.error"))
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
    let dataSendToBackendObj = {
      appointmentId: (this.data && this.data.appointmentData && this.data.appointmentData.id)?(this.data.appointmentData.id):0,
      qrCode: this.qrCode,
      temprature: null,
      isMask: true,
      visitorId: 0,
      visitorPhotoUrl:this.visitorPhotoUrl
    }
    this.appointmentService.checkInWithoutBioDevice(dataSendToBackendObj)
    .pipe()
    .subscribe((resp)=>{
      console.log(resp);
      if(resp.statusCode === 200){
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
}


