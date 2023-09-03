import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { getCountryCode, noWhitespaceValidator, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { CommonService } from 'src/app/core/services/common.service';
import { first } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { CountryData, TimeZoneObject } from '../models/country-and-time-zone';
import { Status } from '../constants/dropdown-enums';
import { LocationFormComponent } from '../forms/location-form/location-form.component';
import { CommonTabService } from '../services/common-tab.service';
import { MasterService } from '../services/master.service';


@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
  styleUrls: ['./location-detail.component.scss']
})
export class LocationDetailComponent implements OnInit {
  public isEdit: boolean = false;
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
  flagClass: string = "";
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
  public loctionObject: any = [];
  level2: any;
  @Input() locationLevel2Id;
  @Output() locationLevel2ID = new EventEmitter();
  @Output() displayCompanyName = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private translate:TranslateService,
    private commonService: CommonService,
    private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private masterService: MasterService,
    private userService:UserService
  ) {
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());
    // console.log(this.selectedCountry);
    this.validationMessages = {
      name: {
        whitespace: translate.instant('level2_details.name_placeholder'),
        pattern: translate.instant('level2_validation.LoctionVaildation'),
        maxlength: translate.instant('level2_max_length.LoctionMaxlength'),
      },
      addressLine1:{
        required: translate.instant('level2_details.address_placeholder'),
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
        required: translate.instant('Department.statusRequired'),
      }
    };
   }

  ngOnInit(): void {
    // console.log(this.selectedCountry)
    this.level2 = this.userService.getLevel2DidForLevel2Admin()
    // if (this.level2) {
    //this.getLocationDetails(this.level2);
    // }
    this.createForm();
    this.getCountry();
  }
  ngOnChanges(changes: SimpleChanges): void { 
    this.level2 = this.locationLevel2Id
    this.getLocationDetails(this.level2);
  }
  
  createForm() {
     this.formLocation = this.formBuilder.group({
      name: [this.loctionObject.data?.name ? this.loctionObject.data.name : null, [Validators.required, Validators.maxLength(50),noWhitespaceValidator]],
      addressLine1: [this.loctionObject.data?.address?.line1 ? this.loctionObject.data.address?.line1 : null,[Validators.required]],
      addressLine2: [this.loctionObject.data?.address?.line2 ? this.loctionObject.data.address?.line2 : null,[]],
      contactMobile:[this.loctionObject.data?.address?.contactMobile ? this.loctionObject.data?.address?.contactMobile : null,[Validators.required]],
      dateFormat:[this.loctionObject.data?.accountConfig?.dateFormat ? this.loctionObject.data.accountConfig?.dateFormat : null,[Validators.required]],
      timeFormat:[this.loctionObject.data?.accountConfig?.timeFormat ? this.loctionObject.data.accountConfig?.timeFormat : null,[Validators.required]],
      timeZone: [this.loctionObject.data?.accountConfig?.timezone ? this.loctionObject.data.accountConfig?.timezone : null,[Validators.required, Validators.maxLength(100)]],
      country: [this.loctionObject.data?.address?.country ? this.loctionObject.data.address?.country : null,[Validators.required]],
      mapLink:[this.loctionObject.data?.address ? this.loctionObject.data.address.mapLink: null,[Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")]],
      status:[this.loctionObject.data?.status ? this.loctionObject.data?.status:null,[Validators.required]]  
    });
    if (this.loctionObject.data)
      this.formLocation.controls.status.setValidators([Validators.required]);
    else
      this.formLocation.controls.status.setValidators(null);
      
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
             this.onStateChange(this.loctionObject?.data?.address?.country, false);
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
          // this.dialogRef.close({ type: 'level2', status: true });
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
    this.masterService.getBuildingDetail(level2Id).pipe(first()).subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.loctionObject = response;
            this.userService.setLocationData(this.loctionObject);
            this.locationLevel2Id = response.data?.level2Id
            this.locationLevel2ID.emit(this.locationLevel2Id);
            this.displayCompanyName.emit(response.data.name)
            if(this.loctionObject && this.loctionObject.data && this.loctionObject.data.address && this.loctionObject.data.address){
              this.selectedCountry = CountryISO[this.loctionObject.data.address.country.replace(/\s/g, "")];
            }
            this.createForm();
            this.loctionObject.data.address.country = this.loctionObject.data.address.country || "India";
            this.selectedCountry = getCountryCode(this.loctionObject.data.address.contactIsd || "91", this.loctionObject.data.address.country || "India");
            this.commonService.setComplexContact(this.selectedCountry);
            this.flagClass = `flag-icon-${this.selectedCountry}`;
            this.getCountry();
            let cellFormat = this.loctionObject.data.address.contactMobile ? this.loctionObject.data.address.contactMobile.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3") : this.loctionObject.data.address.contactMobile;
            this.formLocation.controls.contactNumber.patchValue(cellFormat, { emitEvent: false, onlySelf: true })           
          
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
      
      this.masterService.updateBuilding(updateObj).pipe(first()).subscribe(resp => {
        this.getLocationDetails(this.level2Id);
        if (resp.statusCode === 200 && resp.errors === null) {
          this.isEdit = false;
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
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
  // console.log(this.level2Id)
  this.getLocationDetails(this.level2Id)
  this.isEdit = false; 
}
  isEditClick() {
    // console.log(this.selectedCountry)
    this.isEdit = true;
    this.level2Id = this.loctionObject.data?.id;
  }
}
