import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { getCountryCode, noWhitespaceValidator, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { CommonService } from 'src/app/core/services/common.service';
import { CountryData, TimeZoneObject } from '../../models/country-and-time-zone';
import { CommonTabService } from '../../services/common-tab.service';
import { first } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../services/master.service';
import { Status } from '../../constants/dropdown-enums';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { BuildingObject } from '../../models/building-details';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;
  public formLocation: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  @Input() formData: any;
  CountryISO = CountryISO;
  SearchCountryField = SearchCountryField;
  public selectedCountry: CountryISO = CountryISO.India;
  separateDialCode = true;
  maxLength: string = "15";
  public timeZones: TimeZoneObject;
  public countries: CountryData;
  countryCodeList: any;
  originalCountryList: any;
  previousCountry: any;
  countryList: any;
  statusList = Object.keys(Status);
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  public level2Object: any;
  public timeFormats = [
    { value: 12, viewValue: "12hr" },
    { value: 24, viewValue: "24hr" },
  ];
  //TODO: Bind available date formats
  public dateFormats = [
    { value: "dd-MM-yyyy", viewValue: "DD-MM-YYYY" },
    { value: "MM-dd-yyyy", viewValue: "MM-DD-YYYY" },
    // { value: "dd-MMM-yyyy", viewValue: "DD-MMM-YYYY" },
  ];
  locationData: any;
  level2Id :any;
  // loctionObject: any;
  public loctionObject: BuildingObject;
  public submitted: boolean = false;
  selectedCountryISO: any;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<LocationFormComponent>,
    private translate:TranslateService,
    private commonService: CommonService,
    private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private masterService: MasterService,
    private userService:UserService
  ) {
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
    this.validationMessages = {
      name: {
        whitespace: translate.instant('level2_details.name_placeholder'),
        pattern: translate.instant('level2_validation.LoctionVaildation'),
        maxlength: translate.instant('level2_max_length.LoctionMaxlength'),
      },
      addressLine1:{
        required: translate.instant('level2_details.address_placeholder'),
        // pattern: translate.instant('level2_details.address_validation'),
      },
      contactMobile: {
        required: translate.instant('level2_details.contactNumberRequiredError'),
      },
      dateFormat: {
        required: translate.instant('level2_details.dateFormatRequired'),
      },
      timeFormat: {
        required: translate.instant('level2_details.timeFormatRequired'),
      },
      timeZone: {
        required: translate.instant('level2_details.timeZoneRequired'),
        maxlength: translate.instant('level2_details.timeZoneMaxlength'),
      },
      country: {
        selectValidBuilding:translate.instant('level2_details.selectValidBuilding'),
        required: translate.instant('level2_details.countryRequired'),
      },
      mapLink: {
        required: translate.instant('level2_details.mapLinkRequired'),
        pattern: translate.instant('level2_details.maplinkValidators'),
      },
      status: {
        required: translate.instant('level2_details.status_required'),
      }
    };
   }

  ngOnInit(): void {
    // this.selectedCountryISO = this.formData?.data?.address?.country;
    this.selectedCountry = getCountryCode(this.formData?.data?.address?.contactIsd || "91", this.formData?.data?.address?.country || "India");
    this.createForm();
    this.getCountry();
    if (this.level2Id) {
      this.getLocationDetails(this.level2Id);
    }
  }

  createForm() {
    this.formLocation = this.formBuilder.group({
      name: [this.formData.data?.name ? this.formData.data.name : null, [Validators.required, Validators.maxLength(50),noWhitespaceValidator]],
      addressLine1: [this.formData.data?.address?.line1 ? this.formData.data.address?.line1 : null,[Validators.required]],
      addressLine2: [this.formData.data?.address?.line2 ? this.formData.data.address?.line2 : null,[]],
      // contactMobile:[this.formData.data?.address?.contactMobile?.number ?this.formData.data?.address?.contactMobile?.number : null,[Validators.required]],
      contactMobile:[this.formData.data?.address?.contactMobile ?this.formData.data?.address?.contactMobile : null,[Validators.required]],
      dateFormat:[this.formData.data?.accountConfig?.dateFormat ? this.formData.data.accountConfig?.dateFormat : null,[Validators.required]],
      timeFormat:[this.formData.data?.accountConfig?.timeFormat ? this.formData.data.accountConfig?.timeFormat : null,[Validators.required]],
      timeZone: [this.formData.data?.accountConfig?.timezone ? this.formData.data.accountConfig?.timezone : null,[Validators.required, Validators.maxLength(100)]],
      country: [this.formData.data?.address?.country ? this.formData.data.address?.country : null,[Validators.required]],
      // mapLink:[this.formData.data?.address ? this.formData.data.address.mapLink: null,[Validators.required,
      //   Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      mapLink:[this.formData.data?.address ? this.formData.data.address.mapLink: null,[Validators.required,
        Validators.pattern("^(https?://)?[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]")]],
      status: [this.formData.data?.status ? this.formData.data.status : null],
      
    });
    if (this.formData.data)
      this.formLocation.controls.status.setValidators([Validators.required]);
    else
      this.formLocation.controls.status.setValidators(null);
      
      this.level2Id = this.formData.data?.id;

      this.formLocation.controls['country'].valueChanges.subscribe((value)=>{
        this.countryList = this._filter(value);
      });
  }


checkNumber(event) {
  this.selectedCountry = event.iso2;
}
 

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formLocation.get(control).touched || this.formLocation.get(control).dirty) && this.formLocation.get(control).errors) {
        if (this.formLocation.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.trim() == object2.trim();
  }
  onStateChange(countryName, resetNumberField: boolean) {
    if (resetNumberField) {
      this.formLocation.get("contactMobile").setValue(null);
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
  getTimeZone(countryId?: any) {
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
            this.onStateChange(this.formData.data?.address?.country, false);
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
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.originalCountryList.filter(option =>option.niceName.toLowerCase().startsWith(filterValue));
  }

  addLocation(){
    this.submitted = true;
    if(this.formLocation.valid){
      this.submitted = false;
    }
    if (this.formLocation.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.formLocation.controls).forEach(field => {
        this.formLocation.controls[field].markAsDirty();
        this.formLocation.controls[field].markAsTouched();
      });
    }else{
      let contactMobile = this.formLocation.value.contactMobile.number != null ? removeSpecialCharAndSpaces(this.formLocation.value.contactMobile.number.toString()) : null
      let isdCode = this.formLocation.value.contactMobile?.dialCode != null ? this.formLocation.value.contactMobile?.dialCode.substring(1) : null
      let timeZoneObject  = this.timeZones.data.find(timezone=> timezone.displayName == this.formLocation.value.timeZone);
      let addObj = {
        name: this.formLocation.value.name.trim(),
          level2Id: this.level2Id,
          status: this.formLocation.value.status,
        address: {
            line1: this.formLocation.value.addressLine1,
            line2: this.formLocation.value.addressLine2,
            officeNo: null,
            floorNo: null,
            zipCode: null,
            city: null,
            state: null,
            country: this.formLocation.value.country,
            contactEmail: null,
            contactMobile: contactMobile,
            ContactIsd :isdCode,
            mapLink: this.formLocation.value.mapLink
          },
       accountConfig: {
            timezone: this.formLocation.value.timeZone,
            timeZoneId : timeZoneObject.id,
            dateFormat: this.formLocation.value.dateFormat,
            timeFormat: this.formLocation.value.timeFormat,
          }
      }
      
      this.masterService.addBuilding(addObj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message,  this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close({ type: 'level2', status: true });
        }
      }, error => {
        if ( error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
          this.toastr.error(error.error.Message,  this.translate.instant("pop_up_messages.error"));
        }
      });
    }
  }

  getLocationDetails(level2Id) {
    //Note: this is because data will come from backend they will check there so no need to send level2Id
    //TODO need to remove level2Id after
    this.masterService.getBuildingDetail(level2Id).pipe(first()).subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.loctionObject = response;
            if(this.loctionObject && this.loctionObject.data && this.loctionObject.data.address && this.loctionObject.data.address){
              // console.log(this.loctionObject.data.address.country.replace(/\s/g, ""));
              // this.selectedCountry = CountryISO[this.loctionObject.data.address.country.replace(/\s/g, "")];
            }
            //this.getTimeZone(this.loctionObject.data.address.addressId);
            this.createForm();
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          this.toastr.error(error.message);
        }
      );
  }

  onSubmit(){
      let contactMobile = this.formLocation.value.contactMobile?.number != null ? removeSpecialCharAndSpaces(this.formLocation.value.contactMobile?.number.toString()) : null
      let isdCode = this.formLocation.value.contactMobile?.dialCode != null ? this.formLocation.value.contactMobile?.dialCode.substring(1) : null
      let timeZoneObject  = this.timeZones.data.find(timezone=> timezone.displayName == this.formLocation.value.timeZone);
      let updateObj = {
        name: this.formLocation.value.name.trim(),
        level2Id: this.level2Id,
        status: this.formLocation.value.status,
        address: {
            line1: this.formLocation.value.addressLine1,
            line2: this.formLocation.value.addressLine2,
            officeNo: null,
            floorNo: null,
            zipCode: null,
            city: null,
            state: null,
            country: this.formLocation.value.country,
            contactEmail: null,
            contactMobile: contactMobile,
            mapLink: this.formLocation.value.mapLink,
            contactIsd: isdCode
          },
       accountConfig: {
            timezone: this.formLocation.value.timeZone,
            timeZoneId : timeZoneObject.id,
            dateFormat: this.formLocation.value.dateFormat,
            timeFormat: this.formLocation.value.timeFormat,
          }
      }
      this.getLocationDetails(this.level2Id);
      this.masterService.updateBuilding(updateObj).pipe(first()).subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close({ type: 'level2', status: true });
        }
      }, error => {
        if ( error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
        this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
        }
      });
}

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.submitted = false;
    this.formLocation.reset();
  }
}
