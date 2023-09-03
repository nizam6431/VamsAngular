import s3ParseUrl from 's3-url-parser';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { Status } from '../../constants/dropdown-enums';
import { MasterService } from '../../services/master.service';
import { getCountryCode, formatPhoneNumber, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { CountryData } from './../../models/country-and-time-zone';
import { CommonTabService } from 'src/app/feature/master/services/common-tab.service';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
import { AddContractorCompany, ContractorCompanyObject } from '../../models/contractor-company';
@Component({
  selector: 'app-contractor-company-form',
  templateUrl: './contractor-company-form.component.html',
  styleUrls: ['./contractor-company-form.component.scss']
})
export class ContractorCompanyFormComponent {
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formContractorCompany: FormGroup;
  public countries: CountryData;
  @Input() formData: any;
  permissionKeyObj = permissionKeys;
  statusList = Object.keys(Status);
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;

  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];

  selectedIso: any = CountryISO.India;
  checkMobileNumberRequried = false
  maxLength: string = "15";
  cellFormat: any;
  originalCountryList: any;
  countryList: any;
  QRCodeuploaded: boolean = false;
  countryCodeList: any;
  selectedCountry
  previousCountry;
  addContractorCompany: AddContractorCompany = new AddContractorCompany();
  getContractorCompany: any;

  base64textString: any[];
  imgpreview: boolean;
  imageURL: string;
  imageNameUrl: any;
  file: any;
  selfPhotoUrl: any = "assets/images/profile-pic.png";
  selfPhotoUrlByBase64: any;

  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ContractorCompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UserService,
    private commonService: CommonService,
    private fileUploadService: FileUploadService,
    private commonTabService: CommonTabService,
    private _sanitizer: DomSanitizer
  ) {
    this.formData = data;
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());

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
      contactMobile: {
        required: translate.instant('EmployeeForm.RequiredCellNumber'),
      },
      emailId: {
        required: translate.instant('EmployeeForm.PleaseEnterEmailAddress'),
        email: translate.instant('EmployeeForm.EmailVaild'),
        maxlength: translate.instant('EmployeeForm.EmailMaxlength'),
        pattern: translate.instant('EmployeeForm.EmailPattern'),
      },
      companyName: {
        required: translate.instant('contractorCompany.PleaseEnterCompanyName'),
      },
      companUrl: {
        required: translate.instant('EmployeeForm.PleaseEnterContractorCompanyUrl'),
      },
      addressLine1: {
        required: translate.instant('complex_Details.addressLine1Error'),
      },
      addressLine2: {
        required: translate.instant('complex_Details.addressLine1Error'),
      },
      city: {
        required: translate.instant('complex_Details.cityRequired'),
      },
      zipCode: {
        required: translate.instant('complex_Details.zipCodeError'),
        maxlength: translate.instant('complex_Details.zipCodeMaxlength'),
        pattern: translate.instant('complex_Details.zipPattern'),
      },
      state: {
        required: translate.instant('complex_Details.stateRequired'),
      },
      country: {
        selectValidBuilding: translate.instant('complex_Details.selectValidBuilding'),
        required: translate.instant('contractorCompany.countryRequired'),
      },
      uniqueId: {
        required: translate.instant('contractorCompany.PleaseEnterUniqueId'),
        pattern: translate.instant('contractorCompany.uniqueIdPattern'),
      },
      status: {
        required: translate.instant('contractorCompany.PleaseEnterUniqueId')
      },
      logo: {
        required: translate.instant('contractorCompany.compnayLogoRequired')
      }
    };
  }

  ngOnInit() {
    console.log(this.formData,'formDataformDataformData');
    
    this.getCountry();
    if (this.formData.mode == "show" || this.formData.mode == "edit") {
      this.getContractorCompanyById();
    } else {
      this.createForm()
    }
  }

  createForm() {
    // console.log(this.getContractorCompany.data);

    this.formContractorCompany = this.formBuilder.group({
      firstName: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany?.data ? this.getContractorCompany?.data.contactFirstName : null,
      [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.contactLastName : null,
      [Validators.required, Validators.maxLength(50)],
      ],
      emailId: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data?.email : null, [Validators.required, Validators.maxLength(150), Validators.email]
      ],
      contactMobile: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.phone : null, [Validators.required]],
      companyName: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.companyName : null, [Validators.required]],
      companUrl: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.url : null],
      addressLine1: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.line1 : null, [Validators.required]],
      addressLine2: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.line2 : null,],
      zipCode: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.zipCode : null, [Validators.required, Validators.pattern("^[0-9]*$"),Validators.maxLength(10)]],
      city: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.city : null, [Validators.required]],
      state: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.state : null, [Validators.required]],
      country: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.address.country : null, [Validators.required]],
      uniqueId: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.uniqueId : null, [Validators.required,Validators.pattern('[a-zA-Z0-9-_]*')]],
      status: [this.getContractorCompany && this.getContractorCompany?.data && this.getContractorCompany.data ? this.getContractorCompany.data.status : null],
      logo: [null, [Validators.required]],
    });
  }

  updateContractorCompanyDetails() {
    this.masterService.updateContractorCompany(this.dataToBackend()).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close({ type: resp, status: true });
        }
      }, error => {
        if (error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        } else {
          this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
        }
        // this.dialogRef.close({ type: 'level2', status: false });
      });
  }

  async handleIamge(PhotoUrl, type) {
    let parserContent = s3ParseUrl(PhotoUrl);
    let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.selfPhotoUrlByBase64 = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formContractorCompany.get(control).touched || this.formContractorCompany.get(control).dirty) && this.formContractorCompany.get(control).errors) {
        if (this.formContractorCompany.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  onStateChange(countryName, resetNumberField: boolean) {
    if (resetNumberField) {
      this.formContractorCompany.get("contactMobile").setValue(null);
    }
    let country = this.countries.data.filter((el) => {
      return el.niceName == countryName;
    });
    this.previousCountry = country[0].isoCode.trim()
    if (resetNumberField) {
      let countryIso: string = country[0].isoCode.trim();
      let isdCountryCode = Object.values(CountryISO).filter(
        (countryIsoCode) => countryIsoCode.toUpperCase() == countryIso
      );
      this.selectedCountry = isdCountryCode[0];
    }
  }

  getContractorCompanyById() {
    let obj = {
      contractorCompanyId: this.formData.data.id
    }

    this.masterService.getContractorCompanyById(obj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.getContractorCompany = resp;
          if (this.getContractorCompany && this.getContractorCompany.data.companyLogo) {
            this.selfPhotoUrl = this.getContractorCompany.data.companyLogo;
            this.handleIamge(this.selfPhotoUrl, null);
          }
          this.selectedCountry = getCountryCode(this.getContractorCompany.data.isdCode || "91", this.getContractorCompany.data.address.country || "India");
          this.createForm();
          this.removeValidators('logo');
        } else {
          this.toastr.error(resp.message, this.translate.instant("pop_up_messages.error"));
          this.createForm();
          this.removeValidators('logo');
        }
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
          }
        });
  }

  onFileChange(event) {
    this.file = event.target.files[0];
    this.base64textString = [];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.file);
    }
  }

  handleReaderLoaded(e) {
    this.base64textString.push(
      "data:image/png;base64," + btoa(e.target.result)
    );
    this.imgpreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  uploadImage() {
    // File path name
    // <S3-bucketname>/level1/<level1 id>/Contractor/logo/<file> 
    let userDetails = this.userService.getUserData();

    if (this.file) {
      const buketPath = "level1/" + userDetails?.level1Id + "/contractor/logo/" + new Date().getTime() + "/"
      this.fileUploadService.imageUplod(this.file, buketPath).promise().then(data => {
        this.imageNameUrl = data.Location;

        if (this.formData?.mode == 'edit') {
          this.updateContractorCompanyDetails();
        } else {
          this.sendDataToBackend();
        }
      })
    } else {
      if (this.formData?.mode == 'edit') {
        this.imageNameUrl = this.getContractorCompany.data.companyLogo;
        this.updateContractorCompanyDetails();
      } else {
        this.sendDataToBackend();
      }
    }
  }

  getCountry() {
    this.commonTabService.getCounrty().pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.countries = response;
        this.originalCountryList = response.data;
        this.countryList = response.data;
        this.countryCodeList = response.data;
        // this.onStateChange(this.complexData?.data?.address.country, false);
        // if (this.formData.mode != "show" || this.formData.mode != "edit") {
        // this.createForm();
        // }
      } else {
        this.toastr.error(response.message, this.translate.instant("pop_up_messages.error"));
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
        }
      });
  }

  dataToBackend(): AddContractorCompany {
    const formData = this.formContractorCompany.value;

    this.addContractorCompany.uniqueId = formData.uniqueId;
    this.addContractorCompany.companyName = formData.companyName;
    this.addContractorCompany.url = formData.companUrl;
    this.addContractorCompany.email = formData.emailId;
    this.addContractorCompany.contactFirstName = formData.firstName;
    this.addContractorCompany.contactLastName = formData.lastName;
    this.addContractorCompany.companyLogo = null;
    this.addContractorCompany.level2Id = null;
    this.addContractorCompany.level3Id = null;
    this.addContractorCompany.phone = formData.contactMobile.number != null ? removeSpecialCharAndSpaces(formData.contactMobile.number.toString()) : null;
    this.addContractorCompany.IsdCode = formData.contactMobile?.dialCode != null ? formData.contactMobile?.dialCode.substring(1) : this.formData.mode == "edit" ? this.getContractorCompany?.data?.isdCode : null;
    this.addContractorCompany.companyLogo = this.imageNameUrl;

    this.addContractorCompany.address.line1 = formData.addressLine1.trim();
    this.addContractorCompany.address.line2 = formData.addressLine2 ? formData.addressLine2.trim() : formData.addressLine2;
    this.addContractorCompany.address.city = formData.city.trim();
    this.addContractorCompany.address.zipCode = formData.zipCode.trim();
    this.addContractorCompany.address.state = formData.state.trim();
    this.addContractorCompany.address.country = formData.country;
    this.addContractorCompany.address.contactEmail = null;
    this.addContractorCompany.address.contactIsd = null;
    this.addContractorCompany.address.contactMobile = null;
    this.addContractorCompany.address.mapLink = null;
    this.addContractorCompany.address.officeNo = null;
    this.addContractorCompany.address.floorNo = null;
    this.addContractorCompany.id = this.formData.mode == "edit" ? this.formData.data.id : null;
    this.addContractorCompany.status = this.formData.mode == "edit" ? formData.status : null;

    return this.addContractorCompany;
  }


  checkEmpty(event: any) {
    console.log(event.target.value)
    if (event.target.value == '') {
      this.checkMobileNumberRequried = true
    }
    else {
      this.checkMobileNumberRequried = false
    }
  }

  submitContractorCompany() {
    if (this.formContractorCompany.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.formContractorCompany.controls).forEach(field => {
        this.formContractorCompany.controls[field].markAsDirty();
        this.formContractorCompany.controls[field].markAsTouched();
      });
    } else {
      this.uploadImage();
    }
  }

  sendDataToBackend() {
    this.masterService.addContractorCompanies(this.dataToBackend()).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close({ type: resp, status: true });
        }
      }, error => {
        if (error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
        //this.dialogRef.close({ type: 'level2', status: false });
      });
  }

  removeValidators(name: string) {
    this.formContractorCompany.get(name).clearValidators();
    this.formContractorCompany.get(name).updateValueAndValidity();
  }

  setValidators(name: string, validatorArray: any) {
    this.formContractorCompany.get(name).setValidators(validatorArray);
    this.formContractorCompany.get(name).updateValueAndValidity();
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  checkNumber(event) {
    this.formContractorCompany.get("cell").setValue(null);
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.imgpreview = false;
    this.file = null;
    this.formContractorCompany.reset();
  }
}