import { ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Select2OptionData } from "ng-select2";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { UserService } from "../../../../core/services/user.service";
import { ComplexDetailsUpdate, RootObject, AppEvent } from "../../models/complex-details";
import {
  CountryData,
  TimeZoneObject,
} from "../../models/country-and-time-zone";
import { CommonTabService } from "../../services/common-tab.service";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import {
  formatPhoneNumber,
  getCountryCode,
  isImageType,
  removeSpecialCharAndSpaces,
} from "src/app/core/functions/functions";
import { environment } from "src/environments/environment";
import { CommonService } from "src/app/core/services/common.service";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
// const parseS3Url = require('parse-s3-url');
import s3ParseUrl from 's3-url-parser';

import { TranslateService } from "@ngx-translate/core";
import { DomSanitizer } from "@angular/platform-browser";
import { add } from "lodash";

@Component({
  selector: "app-complex-details-form",
  templateUrl: "./complex-details-form.component.html",
  styleUrls: ["./complex-details-form.component.scss"],
})
export class ComplexDetailsFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formComplex: FormGroup;
  public file;
  public imgpreview = false;
  public darkLogoPreview = false;
  public imageURL;
  public base64textString = [];
  public base64textStringForDarkImg = [];
  public profileImageOld = null;
  public fileName: string;
  isShow = false;
  isFileTypeError = false;
  public isEdit: boolean = false;
  public complexData: RootObject;
  private complexDetailsUpdate: ComplexDetailsUpdate =
    new ComplexDetailsUpdate();
  public countries: CountryData;
  public timeZones: TimeZoneObject;
  public isdCodes: Array<Select2OptionData> = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  country: string = "";
  flagClass: string = "";
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  public timeFormats = [
    { value: 12, viewValue: "12hr" },
    { value: 24, viewValue: "24hr" },
  ];
  public selectedCountry: CountryISO;
  // countryListIsd: CountryISO[] = [CountryISO];
  //TODO: Bind available date formats
  public dateFormats = [
    { value: "dd-MM-yyyy", viewValue: "DD-MM-YYYY" },
    { value: "MM-dd-yyyy", viewValue: "MM-DD-YYYY" },
    // { value: "dd-MMM-yyyy", viewValue: "DD-MMM-YYYY" },
  ];
  // TODO: Get all ISD codes from backend and bind it.
  allIsdCodes: any[] = [];
  maxLength: string = "15";
  enviroment = environment
  userDetails: any;
  LightLogoUrl: any = environment.DefaultLightTheamLogoUrl;
  darkLogoUrl: any = environment.DefaultDarkTheamLogoUrl;
  lightLogoImageUrl:any = environment.DefaultLightTheamLogoUrl;
  darkLogoImageUrl:any = environment.DefaultDarkTheamLogoUrl;
  QRCodeImage:any = "";
  QRCodeImageUrl = "";
  brandingQRUrl ="";

  cellFormat: any;
  originalCountryList: any;
  countryList: any;
  QRCodeuploaded: boolean = false;
  countryCodeList: any;
  previousCountry: any;
  BrandingQrCodeImage: any;
  qrLogoImageUrl: string;
  qrLogiUpload: boolean;
  SeepzWorkFlow: any;
  constructor(
    private _sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private commonTabService: CommonTabService,
    private cd: ChangeDetectorRef,
    private commonService: CommonService,
    private uploadService:FileUploadService,
    private translate:TranslateService
  ) {
    this.validationMessages = {
      name: {
        required: translate.instant('complex_Details.NameRequireError'),
        pattern: translate.instant('complex_Details.NameValidation'),
        maxlength: translate.instant('complex_Details.NameMaxlength'),
      },
      visitorsPassPrefix: {
        required: translate.instant('complex_Details.VisitorPassRequiredError'),
        pattern: translate.instant('complex_Details.VisitorPassValid'),
        maxlength:translate.instant('complex_Details.VisitorPassMaxlength'),
      },
      shortName: {
        required: translate.instant('complex_Details.shortNameRequiredError'),
        pattern:  translate.instant('complex_Details.shortNameValid'),
        maxlength: translate.instant('complex_Details.shortNameMaxlength'),
      },
      contractorPassPrefix: {
        required: translate.instant('complex_Details.contractorPassPrefixRequiredError'),
        pattern: translate.instant('complex_Details.contractorPassPrefixValid'),
        maxlength: translate.instant('complex_Details.contractorPassPrefixMaxlength'),
      },
      contactNumber: {
        required: translate.instant('complex_Details.contactNumberRequiredError'),
      },
      // officeNumber: {
      //   required: 'Please enter cell number.',
      //   pattern: 'Please enter 10 digit number separated by comma.',
      //   minlength: 'Minimum digits required: 10',
      //   maxlength: 'Maximum digits allowed: 54'
      // },
      email: {
        required: translate.instant('complex_Details.emailRequiredError'),
        email: translate.instant('complex_Details.EmailValid'),
        maxlength: translate.instant('complex_Details.EmailMaxlength'),
      },
      // status: {
      //   required: 'Please select status.',
      // },
      addressLine1: {
        required: translate.instant('complex_Details.addressLine1Error'),
        pattern: translate.instant('complex_Details.addressLine1Error'),
      },
      // NOTE: Enable if require.
      // addressLine2: {
      //   required: 'Please enter address.',
      // },
      city: {
        required: translate.instant('complex_Details.cityRequired'),
        pattern: translate.instant('complex_Details.cityRequired'),
      },
      zipCode: {
        required: translate.instant('complex_Details.zipCodeError'),
        maxlength: translate.instant('complex_Details.zipCodeMaxlength'),
        pattern: translate.instant('complex_Details.zipCodeError'),
      },
      state: {
        required: translate.instant('complex_Details.stateRequired'),
        pattern: translate.instant('complex_Details.stateRequired'),
      },
      country: {
        selectValidBuilding:translate.instant('complex_Details.selectValidBuilding'),
        required: translate.instant('complex_Details.countryRequired'),
      },
      mapLink: {
        required: translate.instant('complex_Details.mapLinkRequired'),
        pattern: translate.instant('complex_Details.mapLinkRequired'),
      },
      timeZone: {
        required: translate.instant('complex_Details.timeZoneRequired'),
        maxlength: translate.instant('complex_Details.timeZoneMaxlength'),
      },
      // licenseCount: {
      //   required: 'Please maximum user allowed.',
      //   maxlength: 'Maximum characters allowed: 30'
      // },
      floorNo: {
        required: translate.instant('complex_Details.floorNoRequried'),
        pattern: translate.instant('complex_Details.floorNoRequried'),
      },
      productType: {
        required: translate.instant('complex_Details.productTypeRequired'),
      },
      lightLogo: {
        required: translate.instant('complex_Details.lightLogoRequired'),
      },
      darkLogo: {
        required: translate.instant('complex_Details.darkLogoRequired'),
      },
      // isdCode: {
      //   required: 'Please select isd code.'
      // },
      dateFormat: {
        required: translate.instant('complex_Details.dateFormatRequired'),
      },
      timeFormat: {
        required: translate.instant('complex_Details.timeFormatRequired'),
      },
      officeNo: {
        required: translate.instant('complex_Details.officeNoRequried'),
        pattern: translate.instant('complex_Details.officeNoRequried')
      },
      setupQRCodeUrl: {
        required: translate.instant('complex_Details.QRCodeRequired'),
      },
      qrLogo: {
        required: translate.instant('complex_Details.QRCodeRequired'),
      }
    };
  }

  ngOnInit() {
    this.QRCodeImageUrl = "";
    this.QRCodeImage = "";
    this.userDetails = this.userService.getUserData();
    this.getComplexDetails();
    // this.getTimeZone("countryId");
    this.SeepzWorkFlow = this.userService.getWorkFlow();
  }

  getCountry() {
    this.commonTabService
      .getCounrty()
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.countries = response;
            this.originalCountryList = response.data;
            this.countryList = response.data;
            this.countryCodeList = response.data;
            this.onStateChange(this.complexData?.data?.address.country, false);
          } else {
            this.toastr.error(response.message, this.translate.instant("pop_up_messages.error"));
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
        }
      );
  }

  onStateChange(countryName, resetNumberField: boolean) {
    if (resetNumberField) {
      this.formComplex.get("contactNumber").setValue(null);
      this.formComplex.get("state").setValue(null);
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
    this.getTimeZone(country[0].did);
  }

  getTimeZone(countryId: any) {
    this.commonTabService
      .getTimeZone(countryId)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.timeZones = response;
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
        }
      );
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  checkNumber(event) {
     this.formComplex.get("contactNumber").patchValue(null, { emitEvent: false, onlySelf: true });
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.trim() == object2.trim();
  }

  getComplexDetails() {
    this.commonTabService
      .getComplexDetails()
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.complexData = response;
            let LightLogoUrl = (this.complexData && this.complexData?.data && this.complexData?.data?.lightThemeLogoUrl)?(this.complexData?.data?.lightThemeLogoUrl):environment.DefaultLightTheamLogoUrl;
            let darkLogoUrl = (this.complexData && this.complexData?.data && this.complexData?.data?.darkThemeLogoUrl)?(this.complexData?.data?.darkThemeLogoUrl):environment.DefaultDarkTheamLogoUrl;
            let QRCode = (this.complexData && this.complexData?.data && this.complexData?.data?.setupQRCodeUrl)?(this.complexData?.data?.setupQRCodeUrl):null;
            let brandingQRCode =(this.complexData && this.complexData?.data && this.complexData?.data?.qrLogo)?(this.complexData?.data?.qrLogo):null;
            // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(LightLogoUrl).key);
            // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(darkLogoUrl).key);
            // this.darkLogoPreview = (this.complexData && this.complexData?.data && this.complexData?.data?.darkThemeLogoUrl)?true:false;
            // this.imgpreview = (this.complexData && this.complexData?.data && this.complexData?.data?.lightThemeLogoUrl)?true:false;
            this.lightLogoImageUrl = LightLogoUrl;
            this.darkLogoImageUrl = darkLogoUrl;
            this.QRCodeImageUrl = QRCode;
            this.brandingQRUrl = brandingQRCode;
            console.log(this.lightLogoImageUrl,this.darkLogoImageUrl);
            // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(LightLogoUrl).key);
            // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(darkLogoUrl).key);
            this.handleIamge(this.darkLogoImageUrl,'darklogo');
            this.handleIamge(this.lightLogoImageUrl,'lightLogo');
            this.handleIamge(this.brandingQRUrl,'BrandingQrCodeImage');
            if(this.qrLogoImageUrl) {
              this.qrLogiUpload = true;
              this.handleIamge(this.QRCodeImageUrl,'qrCodeLog');
            }
            if(this.QRCodeImageUrl) {
              this.QRCodeuploaded = true;
              this.handleIamge(this.QRCodeImageUrl,'QrCodeImage');
            }
            this.createForm();
            this.formComplex.controls['country'].valueChanges.subscribe((value)=>{
              this.countryList = this._filter(value);
            });
            //this is for new complex as we are set it default for now: (Date: 25 march,2022)
            // this.complexData.data.address.contactIsd = this.complexData.data.address.contactIsd || "91";
            this.complexData.data.address.country = this.complexData.data.address.country || "India";
            this.selectedCountry = getCountryCode(this.complexData.data.address.contactIsd || "91", this.complexData.data.address.country || "India");
            this.commonService.setComplexContact(this.selectedCountry);
            this.flagClass = `flag-icon-${this.selectedCountry}`;
            this.getCountry();
            let cellFormat = this.complexData.data.address.contactMobile ? this.complexData.data.address.contactMobile.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3") : this.complexData.data.address.contactMobile;
            this.formComplex.controls.contactNumber.patchValue(cellFormat, { emitEvent: false, onlySelf: true })
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
        }
      );
  }
  // TODO: Logo upload on amazon s3
  // TODO: Remove unused code if no longer require
  createForm() {
    this.formComplex = this.formBuilder.group({
      name: [
        this.complexData?.data.name ? this.complexData?.data.name.trim() : null,
        [
          Validators.required,
          Validators.maxLength(250),
          Validators.pattern("[a-zA-Z ]*"),
        ],
      ],
      // licenseCount: [{value:this.complexData.data?.licenseCount ? this.complexData.data.licenseCount : null, disabled: true}, [Validators.required]],
      shortName: [
        this.complexData.data?.shortName
          ? this.complexData.data.shortName
          : null,
        [Validators.required, Validators.maxLength(10),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      visitorsPassPrefix: [
        this.complexData.data?.accountConfig?.prefix
          ? this.complexData.data.accountConfig.prefix
          : 'VR',
        [Validators.required, Validators.maxLength(30),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      contractorPassPrefix: [
        this.complexData.data.accountConfig?.contractorPrefix
          ? this.complexData.data.accountConfig.contractorPrefix
          : 'CR',
        [Validators.required, Validators.maxLength(30),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      addressLine1: [
        this.complexData.data?.address
          ? this.complexData.data.address.line1
          : null,
        [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      addressLine2: [
        this.complexData.data?.address?.line2
          ? this.complexData.data.address.line2
          : null,
      ],
      zipCode: [
        this.complexData.data?.address
          ? this.complexData.data.address.zipCode
          : null,
        [Validators.required, Validators.maxLength(10),Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      // officeNumber: [this.complexData.data?.address ? this.complexData.data?.address?.officeNo : null, [Validators.required]],
      city: [
        this.complexData.data?.address?.city
          ? this.complexData.data.address.city
          : null,
        [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      state: [
        this.complexData.data?.address
          ? this.complexData.data.address.state
          : null,
        [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      country: [
        this.complexData.data?.address && this.complexData.data.address.country
          ? this.complexData.data.address.country
          : "India",
        [Validators.required],
      ],
      mapLink: [
        this.complexData.data?.address
          ? this.complexData.data.address.mapLink
          : null,
        [Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")],
      ],
      productType: [
        this.complexData?.data ? this.complexData.data.productType : null,
        [Validators.required],
      ],
      timeZone: [
        this.complexData.data?.accountConfig?.timezone
          ? this.complexData.data.accountConfig.timezone
          : null,
        [Validators.required, Validators.maxLength(100)],
      ],
      email: [
        this.complexData.data.address?.contactEmail
          ? this.complexData.data.address.contactEmail
          : null,
        [Validators.required, Validators.maxLength(200), Validators.email],
      ],
      contactNumber: [
        this.complexData.data.address?.contactMobile
          ? this.complexData.data.address.contactMobile
          : null,[Validators.required]
      ],
      // floorNo: [
      //   this.complexData.data?.address
      //     ? this.complexData.data?.address?.floorNo
      //     : null,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      // ],
      floorNo: [
        this.complexData.data?.address
          ? this.complexData.data?.address?.floorNo
          : null,[Validators.required]
      ],
      // lightLogo: [this.complexData.data?.lightThemeLogoUrl ? this.complexData.data.lightThemeId : null, [Validators.required]],
      // darkLogo: [this.complexData.data?.darkThemeLogoUrl ? this.complexData.data.darkThemeLogoUrl : null, [Validators.required]],
      timeFormat: [
        this.complexData.data?.accountConfig
          ? this.complexData.data.accountConfig.timeFormat
          : null,
        [Validators.required],
      ],
      dateFormat: [
        this.complexData.data?.accountConfig?.dateFormat
          ? this.complexData.data.accountConfig.dateFormat
          : null,
        [Validators.required],
      ],
      // officeNo: [
      //   this.complexData.data.address.officeNo
      //     ? this.complexData.data.address.officeNo
      //     : null,[Validators.required,Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]
      // ],
      officeNo: [
        this.complexData.data.address.officeNo
          ? this.complexData.data.address.officeNo
          : null,[Validators.required]
      ],
      lightLogo: ["",[]],
      darkLogo: ["",[]],
      setupQRCodeUrl: [this.complexData.data.setupQRCodeUrl
        ? this.complexData.data.setupQRCodeUrl
        : null, []],
      qrLogo: [this.complexData.data.qrLogo
          ? this.complexData.data.qrLogo
          : null, []],   
    });

    if (!this.complexData.data.setupQRCodeUrl) {
      this.formComplex.get('setupQRCodeUrl').setValidators([Validators.required]);
    }
    if (!this.complexData.data.qrLogo) {
      this.formComplex.get('qrLogo').setValidators([Validators.required]);
    }
  }

  onCancel() {
    this.getComplexDetails();
    this.isEdit = false;
  }

  isEditClick() {
    this.isEdit = true;
    // this.imgpreview = false;
    // this.darkLogoPreview = false;
  }

  onSubmit() {
    let formValue = this.formComplex.value;
    console.log(this.formComplex)
    if(formValue && formValue['country']){
      let element =this.countryList.find((element)=>(element.niceName === formValue['country']))
      if(element == undefined){
        this.formComplex.controls['country'].setErrors({'selectValidBuilding': this.translate.instant("Configure.selectValidBuilding")});
      }
    }

    if (this.formComplex.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.could_not_save"));
      Object.keys(this.formComplex.controls).forEach((field) => {
        this.formComplex.controls[field].markAsDirty();
        this.formComplex.controls[field].markAsTouched();
      });
    } else {
      this.commonTabService
        .updateCompplexDetail(this.dataSendToBackend())
        .subscribe(
          (result) => {
            if (result.statusCode === 200 && result.errors == null) {
              this.commonService.dispatch(new AppEvent("LOGO_CHANGED", { light: this.lightLogoImageUrl, dark: this.darkLogoImageUrl }));
              this.toastr.success(result.message, this.translate.instant("pop_up_messages.success"));
              this.getComplexDetails();
              this.isEdit = false;
            } else {
              this.toastr.error(result.message);
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
          }
        );
    }
  }

  private dataSendToBackend(): ComplexDetailsUpdate {
    const formData = this.formComplex.value;
    let timeZoneObject  = this.timeZones.data.find(timezone=> timezone.displayName == formData.timeZone);

    this.complexDetailsUpdate.name = formData.name.trim();
    this.complexDetailsUpdate.shortName = formData.shortName.trim();
    this.complexDetailsUpdate.darkThemeDisplayId = environment.DefaultThemeId;
    this.complexDetailsUpdate.lightThemeDisplayId = environment.DefaultThemeId;
    this.complexDetailsUpdate.licenseCount = this.complexData.data.licenseCount;
    this.complexDetailsUpdate.productType = formData.productType;
    // this.complexDetailsUpdate.lightThemeLogoUrl =
    //   formData.lightLogo == null
    //     ? this.complexData.data.lightThemeLogoUrl
    //     : formData.lightLogo;
    // this.complexDetailsUpdate.darkThemeLogoUrl =
    //   formData.darkLogo == null
    //     ? this.complexData.data.darkThemeLogoUrl
    //     : formData.lightLogo;

    //   this.complexDetailsUpdate.lightThemeLogoUrl =
    //   this.LightLogoUrl == null
    //     ? this.complexData.data.lightThemeLogoUrl
    //     : this.LightLogoUrl;
    // this.complexDetailsUpdate.darkThemeLogoUrl =
    //   this.darkLogoUrl == null
    //     ? this.complexData.data.darkThemeLogoUrl
    //     : this.darkLogoUrl;

    this.complexDetailsUpdate.lightThemeLogoUrl = this.lightLogoImageUrl;
    this.complexDetailsUpdate.darkThemeLogoUrl = this.darkLogoImageUrl;
    this.complexDetailsUpdate.setupQRCodeUrl = this.QRCodeImageUrl;
    this.complexDetailsUpdate.qrLogo = this.brandingQRUrl;

    this.complexDetailsUpdate.accountConfig.contractorPrefix =
      formData.contractorPassPrefix.trim();
    this.complexDetailsUpdate.accountConfig.prefix =
      formData.visitorsPassPrefix.trim();
    this.complexDetailsUpdate.accountConfig.dateFormat = formData.dateFormat;
    this.complexDetailsUpdate.accountConfig.timeFormat = parseInt(
      formData.timeFormat
    );
    this.complexDetailsUpdate.accountConfig.timezone = formData.timeZone;
    this.complexDetailsUpdate.accountConfig.timeZoneId = timeZoneObject.id;

    this.complexDetailsUpdate.address.line1 = formData.addressLine1.trim();
    this.complexDetailsUpdate.address.line2 = formData.addressLine2 ? formData.addressLine2.trim() : formData.addressLine2;
    this.complexDetailsUpdate.address.city = formData.city.trim();
    this.complexDetailsUpdate.address.zipCode = formData.zipCode.trim();
    this.complexDetailsUpdate.address.contactEmail = formData.email;
    this.complexDetailsUpdate.address.contactIsd =
      formData.contactNumber?.dialCode.substring(1);
    this.complexDetailsUpdate.address.contactMobile =
      removeSpecialCharAndSpaces(formData.contactNumber?.number.toString());
    this.complexDetailsUpdate.address.officeNo = formData.officeNo.trim();
    this.complexDetailsUpdate.address.mapLink = formData.mapLink;
    this.complexDetailsUpdate.address.state = formData.state.trim();
    this.complexDetailsUpdate.address.country = formData.country;
    this.complexDetailsUpdate.address.floorNo = formData.floorNo.trim();

    return this.complexDetailsUpdate;
  }

  isdCodeChange() {
    // var selectedISDCode = this.allIsdCodes.filter(item => item.IsdCode == this.isdCode?.value);
    // this.phonenumber?.reset();
    // this.phonenumber?.setValidators(Validators.pattern("[0-9]{" + selectedISDCode[0].MinMobileLength + "," + selectedISDCode[0].MaxMobileLength + "}"));
    // this.phonenumber?.updateValueAndValidity();
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach((validator) => {
      if (
        (this.formComplex.get(control).touched ||
          this.formComplex.get(control).dirty) &&
        this.formComplex.get(control).errors
      ) {
        if (this.formComplex.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  onFileChangeNew(event, type?) {
    let mainfilePath = "";

    const file = event.target.files[0]; 
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      if (type == 'lightlogo' || type == 'darklogo') {
        mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/logo/";
      } else if (type == 'QrCodeImage') {
        mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/QRCode/";
      }
      else if (type == 'BrandingQrCodeImage') {
        mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/BrandingQrCode/";
      }

      this.uploadService.fileUpload(file, mainfilePath + file.name)
        .promise().then(resp => {
          let imageUrl = resp.Location;
          switch (type) {
            case 'lightlogo':
              this.lightLogoImageUrl = imageUrl;
              break;
            case 'darklogo':
              this.QRCodeImageUrl = imageUrl;
              break;
            case 'QrCodeImage':
              this.QRCodeImageUrl = imageUrl;
              break;
            case 'BrandingQrCodeImage':
              this.brandingQRUrl = imageUrl;
              break;
          }
          this.handleIamge(imageUrl, type);
          if (type == "QrCodeImage") {
            this.imgpreview = true;
          }
        })
    // const file = event.target.files[0];

    if (type == 'lightlogo' || type == 'darklogo') {
      mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/logo/";
    } else if(type == 'QrCodeImage') {
      mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/QRCode/";
    }
    else if(type == 'BrandingQrCodeImage') {
      mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/BrandingQrCode/";
    }

    this.uploadService.fileUpload(file,mainfilePath+file.name)
      .promise().then(resp=>{
        let imageUrl = resp.Location;
        switch (type) {
          case 'lightlogo':
            this.lightLogoImageUrl = imageUrl;
            break;
          case 'darklogo':
            this.QRCodeImageUrl = imageUrl;
            break;
          case 'QrCodeImage':
            this.QRCodeImageUrl = imageUrl;
            break;
          case 'BrandingQrCodeImage':
            this.brandingQRUrl = imageUrl;
            break; 
        }
        this.handleIamge(imageUrl,type);
        if(type ==  "QrCodeImage"){
          this.imgpreview = true;
        }
      })
    }
    else{
      this.toastr.error(this.translate.instant('branding_image.imgageRequiredSize'), this.translate.instant('pop_up_messages.error'));
    }
  }

  onFileChange(event) {
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/logo/";
      this.uploadService.fileUpload(file, mainfilePath + file.name)
        .promise().then(resp => {
          this.lightLogoImageUrl = resp.Location;
          this.handleIamge(this.lightLogoImageUrl, 'lightlogo');
          // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
          this.imgpreview = true;
        })
    }
    else {
      this.toastr.error(this.translate.instant('branding_image.imgageRequiredSize'), this.translate.instant('pop_up_messages.error'));
    }
  }

  onFileChangeForDarkLogo(event) {
    const file = event.target.files[0];
    if (!isImageType(event.target.files[0]) && file.size < 1048576) {
      let mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/logo/";
      this.uploadService.fileUpload(file, mainfilePath + file.name)
        .promise().then(resp => {
          this.darkLogoImageUrl = resp.Location;
          this.handleIamge(this.darkLogoImageUrl, 'darklogo');
          // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
          this.darkLogoPreview = true;
        })
    } else {
      this.toastr.error(this.translate.instant('branding_image.imgageRequiredSize'), this.translate.instant('pop_up_messages.error'));
    }
  }


  onRemoveAttachment() {
    this.fileName = null;
    this.formComplex.get("file").setValue("");
    this.isFileTypeError = false;
    this.file = null;
  }

  handleReaderLoaded(e) {
    this.base64textString.push(
      "data:image/png;base64," + btoa(e.target.result)
    );
    this.imgpreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  handleReaderForDarkImg(e) {
    this.base64textStringForDarkImg.push(
      "data:image/png;base64," + btoa(e.target.result)
    );
    this.darkLogoPreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  // handleImage(error){
  //   this.LightLogoUrl = environment.DefaultLightTheamLogoUrl;
  //   this.darkLogoUrl = environment.DefaultDarkTheamLogoUrl;
  // }

  async handleIamge(url, type, imageType?) {
    console.log(url);
    let newUrl;
    let imgType = imageType ? 'data:' + imageType +';base64,' : 'data:image/png;base64,';
    try{
      let parserContent = s3ParseUrl(url);
      let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      //newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.encode(resp?.Body));
      newUrl = this._sanitizer.bypassSecurityTrustUrl(imgType + this.encode(resp?.Body));
    }
    catch(e){
      if(type == 'QrCodeImage') {
        newUrl = null;
      } else {
        let parserContent = s3ParseUrl(type == 'darklogo'?environment.DefaultDarkTheamLogoUrl:environment.DefaultLightTheamLogoUrl);
        let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
        newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
      }
    }
    if(type == 'darklogo')
      {this.darkLogoUrl =  newUrl;}
    else if (type == 'QrCodeImage')
      {this.QRCodeImage = newUrl;}
    else if(type =='BrandingQrCodeImage')
      {this.BrandingQrCodeImage = newUrl; }
    else
      {this.LightLogoUrl = newUrl;}
  }

  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  async handleErrorInImage(url,type){
    try{
      this.handleIamge(url,type)
    }
    catch(e){
      if(type == 'darklogo'){
        let parserContent = s3ParseUrl(environment.DefaultDarkTheamLogoUrl);
        let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
        this.darkLogoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
      }
      else{
        let parserContent = s3ParseUrl(environment.DefaultLightTheamLogoUrl);
        let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
        this.darkLogoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.originalCountryList.filter(option =>option.niceName.toLowerCase().startsWith(filterValue));
  }

  formatAddress() {
    let address=''
    if (this.complexData?.data.address.line1) {
      address = address + this.complexData?.data.address.line1 + " "
      if (this.complexData?.data?.address?.line2) {
        address=address + this.complexData?.data?.address?.line2 + " " 
      }
      address=address+this.complexData.data.address.officeNo + " " + this.complexData.data.address.state
    }
    
    return address;                        
  }
}
