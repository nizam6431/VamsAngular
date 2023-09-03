
import { Component, ElementRef, Inject, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { getCountryCode, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { UserService } from 'src/app/core/services/user.service';
import { DataService } from '../services/data.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../services/appointment.service';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

@Component({
  selector: 'app-reauthenticate',
  templateUrl: './reauthenticate.component.html',
  styleUrls: ['./reauthenticate.component.scss']
})
export class ReauthenticateComponent implements OnInit {
  @Input() formData: any;
  @ViewChildren('otpVal') otpControls: ElementRef<any>;
  email: string;
  cell: string;
  contactDetails: any[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  currentSlide: number = 1;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public reAuthenticateForm: FormGroup;
  authData: any;
  checkinForm: FormGroup;
  timeLeft: number = 30;
  interval: any;
  isResent: boolean;
  isOTPError: boolean = false;
  public selectedCountry: CountryISO = CountryISO.India;
  public phoneValidation: boolean = true;
  isEmailMandatory: boolean;
  isCellMandatory: boolean;
  reauthenticateData:any;
  selfPhotoUrl: any = "assets/images/profile-pic.png";
  public submitted: boolean = false;
  visitorAutnticationType: any;
  userData: any;
  Reauthenticate: any;
  otps: any ;
  hasError:boolean = true;
  pinValue: string = "";
  @ViewChildren("otps") otpsControls: ElementRef<any>;
  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ReauthenticateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private userService : UserService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private appointmentService: AppointmentService,) {
      this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
      
    this.validationMessages = {
      cell: {
        required: translate.instant('Reauthenticate.CellNumberPlaceholder'),
      },
      email: {
        required: translate.instant('Reauthenticate.EmailPlaceholder'),
        email: translate.instant('Reauthenticate.EmailValid'),
        maxlength: translate.instant('Reauthenticate.EmailMaxlength'),
      },
    };
  }

  ngOnInit() {
   
    this.userData = this.userService.getUserData();
    this.getDetails();

    this.reauthenticateData = this.data;
    if(this.reauthenticateData && this.reauthenticateData.imageURLLink){
      this.selfPhotoUrl = this.reauthenticateData.imageURLLink;
    }

    this.createForm();
     this.visitorAutnticationType = this.data?.visitorSettings?.visitorAuthenticationType
      if (this.visitorAutnticationType == "Email") {
      } else if (this.visitorAutnticationType == "Both") {

      } else if (this.visitorAutnticationType == "Cell") {
        this.reAuthenticateForm.controls.email.clearValidators()
        this.reAuthenticateForm.controls.email.updateValueAndValidity()
        this.reAuthenticateForm.controls.cell.setValidators([Validators.required])
        this.reAuthenticateForm.controls.cell.updateValueAndValidity()
        this.reAuthenticateForm.controls.cell.reset();
      }
  }
 

  createForm() {
    this.reAuthenticateForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      cell: [null, [Validators.required, Validators.maxLength(54), Validators.minLength(10)]],
    });
    this.checkinForm = this.formBuilder.group({
      otp: ['', [Validators.required, Validators.pattern("[0-9]{4}")]],
      pin: ['', [Validators.required, Validators.pattern("[0-9]{6}")]]
    });
  }

  onSubmit() {
    this.currentSlide = 2;
    setTimeout(() => {
      this.dialogRef.close();
    }, 2000);
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.reAuthenticateForm.get(control).touched || this.reAuthenticateForm.get(control).dirty) && this.reAuthenticateForm.get(control).errors) {
        if (this.reAuthenticateForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  cancel() {
    this.dialog.closeAll();
  }

  next() {
    this.currentSlide = this.currentSlide + 1;
    if (this.currentSlide == 2) {
      this.performOtpValidation()
    }
  }
  performOtpValidation() {

  }
  back() {
    this.currentSlide = this.currentSlide - 1;
  }
  getData() {
    if(this.reAuthenticateForm.valid){
      this.submitted = false;
    }
    if (this.reAuthenticateForm.controls.cell.invalid && this.reAuthenticateForm.controls.email.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));  
    }
   else{
    let contactMobile = this.reAuthenticateForm.value.cell?.number != null ? removeSpecialCharAndSpaces(this.reAuthenticateForm.value.cell?.number.toString()) : null
    let isdCode = this.reAuthenticateForm.value.cell?.dialCode != null ? this.reAuthenticateForm.value.cell?.dialCode.substring(1) : null
    const reAuthenticateData = {
        isd: isdCode,
        phone: contactMobile,
        email: this.reAuthenticateForm.controls.email.value
    }
    this.appointmentService.getReautneticateSync(reAuthenticateData).subscribe((response) => {
      this.Reauthenticate = response.data
      if (response.statusCode === 200 && response.errors === null) {
        this.currentSlide = this.currentSlide + 1;
        let photo = response.data.photoUrl;
        this.selfPhotoUrl = this.handleIamge(photo,'');
      }
      else{
        this.toastr.error(response.Message);
      }
    },(error)=>{
      try{
        this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))
      }
      catch(e){
        this.toastr.error(this.translate.instant("Visitor not found."), this.translate.instant("toster_message.error"))
      }
    }
    )
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
      this.otpControls['_results'][pos].nativeElement.focus();
    }
  }
  validateOTP() {
    if (this.checkinForm.invalid) {
      return;
    }
  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
        clearInterval(this.interval);
      }
    }, 1000)
  }
  resendOTP() {
    this.startTimer();
    this.isResent = false;
    let contactMobile = this.reAuthenticateForm.value.cell?.number != null ? removeSpecialCharAndSpaces(this.reAuthenticateForm.value.cell?.number.toString()) : null
    let isdCode = this.reAuthenticateForm.value.cell?.dialCode != null ? this.reAuthenticateForm.value.cell?.dialCode.substring(1) : null
    const reAuthenticateData = {
        isd: isdCode,
        phone: contactMobile,
        email: this.reAuthenticateForm.controls.email.value
    }
    this.appointmentService.getReautneticateSync(reAuthenticateData).subscribe((response)=>{
      this.Reauthenticate = response.data
      console.log(this.Reauthenticate,'Reauthenticate otp')
    })
  }
  get otp() { return this.checkinForm.get('otp'); }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }
  close() {
    this.dialogRef.close();
  }
  async handleIamge(PhotoUrl,type){
    let parserContent = s3ParseUrl(PhotoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.selfPhotoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  removeValidator(emailOrPhone) {
      if (emailOrPhone == "email") {
        this.reAuthenticateForm.controls.email.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
        this.reAuthenticateForm.controls.email.updateValueAndValidity()
        this.reAuthenticateForm.controls.cell.reset();
        this.reAuthenticateForm.controls.cell.clearValidators()
        this.reAuthenticateForm.controls.cell.updateValueAndValidity()
      } else if (emailOrPhone == "cell") {
        this.reAuthenticateForm.controls.email.setValidators([Validators.required])
        this.reAuthenticateForm.controls.email.updateValueAndValidity()
        this.reAuthenticateForm.controls.email.reset();
        this.reAuthenticateForm.controls.email.clearValidators()
        this.reAuthenticateForm.controls.email.updateValueAndValidity()
      }
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
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
       this.visitorAutnticationType = response.data?.visitorAuthenticationType
      } else {
        this.toastr.error(response.message);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      }
      else {
        this.toastr.error(error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
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
      
      console.log(cnt2,'cnt2')
      console.log()
      if( extra > 1 && cnt2 !== 'NaN' && cnt2 !== 'e'){
        console.log(extra,cnt2,'**')
        extra = extra.toString().substring(1, 0);
        $("#"+event.target.id).val(extra);
        this.otpsControls["_results"][pos].nativeElement.focus();
      }else if( cnt2 !== 'NaN'){
        this.otpsControls["_results"][pos].nativeElement.focus();
      }
    }
    if(pos > -1 && event.key == 'Backspace'){
      this.otpsControls["_results"][pos].nativeElement.focus();
    }
   
    if(pos == 4){
      if( extra > 1 ){
        extra = extra.toString().substring(1, 0);
        $("#"+event.target.id).val(extra);
      }
      this.hasError = false;
      let votp = $("#otpcodeBox1").val()+''+$("#otpcodeBox2").val()+''+$("#otpcodeBox3").val()+''+$("#otpcodeBox4").val();
      this.otps = votp;
      
    }
    else{
      this.hasError = true;
    }
  }
  validateReauthticate(){
    let contactMobile = this.reAuthenticateForm.value.cell?.number != null ? removeSpecialCharAndSpaces(this.reAuthenticateForm.value.cell?.number.toString()) : null
    let isdCode = this.reAuthenticateForm.value.cell?.dialCode != null ? this.reAuthenticateForm.value.cell?.dialCode.substring(1) : null
    const validateReAuthenticateData = {
      isd: isdCode,
      phone: contactMobile,
      email: this.reAuthenticateForm.controls.email.value,
      otp:this.otps
  }
  this.appointmentService.getReautneticateValidateAsync(validateReAuthenticateData).subscribe((response)=>{
    if (response.statusCode === 200 && response.errors === null) {
      this.toastr.success(response.message, this.translate.instant("pop_up_messages.success"));
      this.dialogRef.close(response);
    }
    else{
      this.toastr.error(response.Message);
    }
  },(error)=>{
    try{
      this.toastr.error(this.translate.instant(error.error.Message), this.translate.instant("toster_message.error"))
    }
    catch(e){
      this.toastr.error(this.translate.instant("Something went wrong"), this.translate.instant("toster_message.error"))
    }
  }
  )
  }
}