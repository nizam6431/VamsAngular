import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms/';
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { handleIamge, handleIamgeCummertial, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { AccountService } from '../services/account.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/core/services/common.service';
import { regex } from "src/app/shared/constants/regexValidation";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { DomSanitizer } from '@angular/platform-browser';
import s3ParseUrl from 's3-url-parser';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';
import {isImageType} from 'src/app/core/functions/functions'
import { BooleanColumnStatisticsData } from 'aws-sdk/clients/glue';
import { documentType } from 'src/app/core/constants/pp_tc_nda';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  public accountForm: FormGroup;
  isExcel: boolean = true;
  productTypes = [
    { name: this.translate.instant("product_type.commercial"), id: 0 },
    { name: this.translate.instant("product_type.enterprise"), id: 1 },
    { name: this.translate.instant("product_type.educational"), id: 2 }
  ]
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  SearchCountryField = SearchCountryField;
  public selectedCountry: CountryISO;
  separateDialCode = true;
  maxLength: string = "15";
  isCommercial: boolean = true;
  private validationMessages: { [key: string]: { [key: string]: string } };
  ComplexDetailsForQRCode: any;
  currentSlide: number = 1;

  imgpreview: boolean = false;
  QRCodeImage: string = "";
  QRCodeImageUrl: any;
  QRCodeLocation: string = "";
  userDetails: any;
  poweredByImage: any = ''
  partnerImage:string=''
  powerByRealImage: any = null;
  partnerByRealImage: any = null;
  isPartnerImage: Boolean = false;
  isPoweredByImage: Boolean = false;
  constructor(
    public dialogRef: MatDialogRef<AccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private uploadService: FileUploadService,
    private _sanitizer: DomSanitizer,
    private userService:UserService

  ) {
    let errorMessages = translate.instant('error_messages');
    this.validationMessages = {

      firstName: {
        required: errorMessages?.first_name_required,
        maxlength: errorMessages?.first_name_maxlength,
        pattern: errorMessages?.first_name_pattern,
      },
      lastName: {
        required: errorMessages?.last_name_required,
        maxlength: errorMessages?.last_name_maxlength,
        pattern: errorMessages?.last_name_pattern,
      },
      name: {
        required: errorMessages?.name_required,
        maxlength: errorMessages?.name_maxlength,
        pattern: errorMessages?.name_pattern,
      },
      shortName: {
        required: errorMessages.short_name_required,
        maxlength: errorMessages.short_name_maxlength,
        pattern: errorMessages.short_name_pattern,
        whitespace: errorMessages.whitespace_not_allowed,
      },
      subDomain: {
        required: errorMessages.sub_domain_required,
        maxlength: errorMessages.sub_domain_maxlength,
        pattern: errorMessages.sub_domain_pattern,
      },
      DBDomain: {
        required: errorMessages.db_domain_required,
        maxlength: errorMessages.db_domain_maxlength,
        pattern: errorMessages.sub_domain_pattern,
      },
      email: {
        required: errorMessages.email_required,
        maxlength: errorMessages.email_maxlength,
        pattern: errorMessages.email_pattern,
      },
      licenseCount: {
        required: errorMessages.license_count_required,
        maxlength: errorMessages.license_count_maxlength,
        pattern: errorMessages.license_count_pattern,
      },
      productType: {
        required: errorMessages.product_type_required,
      },
      adminEmail: {
        required: errorMessages.email_required,
        maxlength: errorMessages.email_maxlength,
        pattern: errorMessages.email_pattern,
      },
      contactDetails: {
        required: errorMessages.contact_format_required,
      },
      userName: {
        required: translate.instant('EmployeeForm.PleaseEnterUserName'),
        maxlength: translate.instant('EmployeeForm.usernameMaxlength'),
        minlength: translate.instant('EmployeeForm.usernameMinlength'),
        pattern: translate.instant('EmployeeForm.usernameValid'),
      },
      contactNumber: {
        required: translate.instant('complex_Details.contactNumberRequiredError'),
      },
      // partnerShipImageURL: {
      //   required: translate.instant('EmployeeForm.poweredby_image'),
      // },
      // poweredByImageURL: {
      //   required: translate.instant('EmployeeForm.partner_image'),
      // }
    }
  }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserData();
    this.selectedCountry = CountryISO.India;
    this.createForm();
  }
  createForm() {
    this.accountForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(250), Validators.pattern("[a-zA-Z ]*") ]],
      shortName: [null, [Validators.required, Validators.maxLength(10)]],
      subDomain: [null, [Validators.required, Validators.pattern(regex.FIRST_ALPHA), Validators.maxLength(10)]],
      DBDomain: [null, [Validators.required, Validators.maxLength(10),Validators.pattern(regex.FIRST_ALPHA)]],
      // email: [null, [Validators.required, Validators.pattern(regex.EMAIL), Validators.maxLength(150)]],
      licenseCount: [null, [Validators.required, Validators.pattern(regex.ONLY_NUMBER)]],
      productType: [0, Validators.required],
      isExcel: [this.isExcel],
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]],
      adminEmail: [null, [Validators.required, Validators.pattern(regex.EMAIL), Validators.maxLength(150)]],
      contactDetails: [null, [Validators.required]],
      userName: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9.#_-]+$")]],
      // partnerShipImageURL: [null, [Validators.required]],
      // poweredByImageURL: [null, [Validators.required]]
      // isdCode: [null, [Validators.required]],
      // mobileNumber: [null, [Validators.required]],
    });
  }
  cancel() {
    this.dialogRef.close();
  }

  checkNumber(event) {
    this.accountForm.get("contactDetails").setValue(null);
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  onProductChanges(val) {
    if (val == 0) {
      this.updateValidators(true);
    } else {
      this.updateValidators(false);
    }
  }

  updateValidators(event?, isexcelClicked?) {
    if (event) {
      this.accountForm.controls["userName"].setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9.#_-]+$")]);
      this.accountForm.controls['isExcel'].setValue(true);
      this.accountForm.get('userName').updateValueAndValidity();
      this.isCommercial = true;
      this.isExcel = true;
    } else {
      if (!isexcelClicked) {
        this.isCommercial = false;
      }
      this.isExcel = false;
      this.accountForm.controls['isExcel'].setValue(false);
      this.accountForm.controls['userName'].setValue(null);
      this.accountForm.get('userName').clearValidators()
      this.accountForm.get('userName').updateValueAndValidity();
    }
  }

  showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.accountForm && this.accountForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.accountForm.get(control).touched ||
            this.accountForm.get(control).dirty) &&
          this.accountForm.get(control).errors
        ) {
          if (this.accountForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  onSubmit() {
    // this.currentSlide = 2;
    if (this.accountForm.invalid) {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
      Object.keys(this.accountForm.controls).forEach(field => {
        if (this.accountForm.controls[field]['controls']) {
          this.accountForm.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.accountForm.controls[field].markAsDirty();
          this.accountForm.controls[field].markAsTouched();
        }
      });
    } else {
      this.createComplex()
    }
  }

  createComplex() {
    // console.log(this.accountReqObj());
    this.accountService.addAccount(this.accountReqObj()).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
          this.ComplexDetailsForQRCode = {
            complexName: this.accountForm.value.name,
            subdomain: this.accountForm.value.subDomain,
            did: resp.data.did,
            level1Did: resp.data.level1Did,
            accountId: resp.data.accountId
          }
          this.currentSlide = 2;
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          })
        }
        else {
          this.toastr.error(error.message, this.translate.instant('pop_up_messages.error'));
        }
      });
  }

  updateQrCodeLink() {
    if (this.QRCodeLocation) {
      let reqObj = {    
        "displayId": this.ComplexDetailsForQRCode.did,
        "setupQRCodeUrl": this.QRCodeLocation,
        "poweredByImageURL": this.powerByRealImage?this.powerByRealImage:environment.DefaultPoweredByImage,
        "partnerShipImageURL": this.partnerByRealImage?this.partnerByRealImage:environment.DefaultPartnerImage,
        "level1Did": this.ComplexDetailsForQRCode.level1Did,
        "bannerImageURL": environment.DefaultBannerImage,

        "policyDocuments": [
          {
            docURL: environment.DefaultPrivacyPolicyforEmployee,
            docType: documentType.privacyPolicy,
          } ,
         {
           docURL: environment.DefaultTermsConditionforEmployee,
           docType: documentType.termdCondition,
         },
         {
           docURL: environment.DefaultPrivacyPolicyforVisitor,
           docType: documentType.visitorPrivacyPolicy,
         },
         {
           docURL: environment.DefaultTermsConditionforVisitor,
           docType: documentType.visitorTermsCondition,
         }
      ]
      }
//       console.log(reqObj,'ReObjet')
//       console.log(environment,'env')
      this.accountService.updateQrCodeLink(reqObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
            this.dialogRef.close({ type: 'account', status: true });
          }
        }, error => {
          if ('errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
            })
          }
          else {
            this.toastr.error(error.message, this.translate.instant('pop_up_messages.error'));
          }
        });
    } else {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
    }
  }

  isExcelclick() {
    this.isExcel = !this.isExcel;
    if (this.isExcel) {
      this.updateValidators(true, true);
    } else {
      this.updateValidators(false, true);
    }
  }

  accountReqObj() {
    return {
      name: this.accountForm.value.name,
      subDomain: this.accountForm.value.subDomain,
      dbDomain: this.accountForm.value.DBDomain,
      licenseCount: parseInt(this.accountForm.value.licenseCount),
      productType: this.accountForm.value.productType,
      isExcel: this.accountForm.value.isExcel,
      shortName: this.accountForm.value.shortName,
      emailId: this.accountForm.value.adminEmail,
      firstName: this.accountForm.value.firstName,
      lastName: this.accountForm.value.lastName,
      userName: this.accountForm.value.userName ? this.accountForm.value.userName : null,
      isd: this.accountForm.value.contactDetails.dialCode.slice(1),
      mobileNo: removeSpecialCharAndSpaces(this.accountForm.value.contactDetails.number.toString()),
      lightThemeLogoUrl: environment.DefaultLightTheamLogoUrl,
      darkThemeLogoUrl: environment.DefaultDarkTheamLogoUrl,
      brandingQRCodeUrl : environment.BrandingQRImage
      // poweredByImageURL: this.powerByRealImage,
      // partnerShipImageURL: this.partnerByRealImage

    }
  }

  resetForm() {
    this.accountForm.reset();
  }

  onFileChange(event) {
    let file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let tempFileName = (file?.name) ? file.name.split(".")[0] + "_" + this.ComplexDetailsForQRCode.did + "." + file.name.split(".")[1] : new Date().getTime + file.name.split("/")[1];
      // file.name = tempFileName;
      let mainfilePath = "account/" + this.ComplexDetailsForQRCode.accountId + "/qrcode/" + tempFileName;
      this.uploadService.fileUpload(file, mainfilePath)
        .promise().then(async resp => {
          if (resp && resp.Location) {
            this.QRCodeLocation = resp.Location;
            this.handleIamge(resp.Location, 'QR code', file.type);
            this.imgpreview = true;
          } else {
            this.toastr.error(this.translate.instant('error_messages.upload_failed'), this.translate.instant('pop_up_messages.error'));

          }
        })
    } else {
      this.toastr.error(this.translate.instant('dyanamic_email_template.ristrict_image'), this.translate.instant('pop_up_messages.error'));
    }
  }

  async handleIamge(url, type, imageType?) {
    let newUrl;
    let imgType = imageType ? 'data:' + imageType +';base64,' : 'data:image/png;base64,';
    try {
      let parserContent = s3ParseUrl(url);
      let resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      this.QRCodeImageUrl = this._sanitizer.bypassSecurityTrustUrl(imgType + this.encode(resp?.Body));
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
  poweredbyImageUpload(event) {
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0])  && file.size < 1048576) {
      let mainfilePath = "account/" + this.ComplexDetailsForQRCode.accountId + "/emailasset/poweredBy/";
      this.uploadService.imageUplod(file, mainfilePath)
        .promise().then(resp => {
          if (resp && resp.Location) {
            this.powerByRealImage = resp.Location;
            this.getS3ImagePoweredBy(resp.Location);
          }
        })
    } else {
      this.toastr.error(this.translate.instant('dyanamic_email_template.ristrict_image'), this.translate.instant('pop_up_messages.error'));
    }
  }
  async getS3ImagePoweredBy(url){
    this.poweredByImage = await handleIamgeCummertial(url, this.uploadService, this._sanitizer)
    console.log(this.poweredByImage)
  }
  async getS3PartnerImage(url) {
    this.partnerImage = await handleIamgeCummertial(url, this.uploadService, this._sanitizer)
  }

  partnerImageUpload(event) {
    this.isPartnerImage = false;
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let mainfilePath = "account/" + this.ComplexDetailsForQRCode.accountId + "/emailasset/partner/";
      this.uploadService.imageUplod(file, mainfilePath)
        .promise().then(resp => {
          if (resp && resp.Location) {
            this.partnerByRealImage = resp.Location;
            this.getS3PartnerImage(resp.Location);
          }
        })
    } else {
      this.toastr.error(this.translate.instant('dyanamic_email_template.ristrict_image'), this.translate.instant('pop_up_messages.error'));
    }
  }

}
