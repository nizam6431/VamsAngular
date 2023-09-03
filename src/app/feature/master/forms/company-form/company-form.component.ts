import { Component, Inject, Input, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { first } from 'rxjs/operators';
import { CommonTabService } from '../../services/common-tab.service';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../../services/master.service';
import { Status,accessCantrol} from '../../constants/dropdown-enums';
import { ShowDetailsComponent } from '../../show-details/show-details.component';
import { formatPhoneNumber, getCountryCode, removeSpecialCharAndSpaces,onlyNumber } from 'src/app/core/functions/functions';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CommonService } from 'src/app/core/services/common.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { UserService } from 'src/app/core/services/user.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import s3ParseUrl from 's3-url-parser';

import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ProductTypes } from 'src/app/core/models/app-common-enum';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;
  @Output() dialogClose = new EventEmitter();
  @Input() formData: any;
  file;
  imgpreview = false;
  darkLogoPreview =false;
  imageURL;
  base64textString = [];
  base64textStringForDarkImg = [];
  profileImageOld = null;
  fileName: string;
  isShow = false;
  isFileTypeError = false;
  adminCount: number = 1;
  adminActivityLabel: string = "AddAdmin";
  adminData: any[] = [];
  statusList = Object.keys(Status);
  viewData: any;
  officeData: any[] = [
    {
      "office": "IT park",
      "floor": "floor",
      "building": "first",
      "cell": "9789767654"
    }
  ]
  selectedCountry: CountryISO = CountryISO.UnitedStates;
  selectedCountriesFoUnit = [];
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formCompany: FormGroup;
  public formCompanyEdit: FormGroup;
  addAdmin: boolean = false;
  multiAdmin: boolean;
  multiOffice: boolean;
  items: FormArray;
  adminItem: FormArray;
  isExcel: boolean = true;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  level3Admin: FormGroup;
  level3Address: FormGroup;
  buildingList = [];
  originalBuildingList= [];
  adminsList = new Map<string, Array<Object>>();
  defaultStatus: string;
  lightLogo: string = "";
  darkLogo: string = "";
  acessCantrolList = (accessCantrol);
  selectedAccessCantrol:any[]=[];
  disabledAccessCantrol:any[]=[]
  accessCantrolNumber: number=0;
  userData: any;
  mobileNoObj: any;
  enviroment = environment
  userDetails: any;
  LightLogoUrl: any;
  darkLogoUrl: any;
  lightLogoImageUrl:string = environment.DefaultLightTheamLogoUrl;
  darkLogoImageUrl:string = environment.DefaultDarkTheamLogoUrl;

  cellFormat: any;
  dynamicBuilding:any[]=[];
  errorInBuilding: boolean;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow: any;
  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    private _sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<CompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonTabService: CommonTabService,
    private masterService: MasterService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonService,
    private userService: UserService,
    private uploadService:FileUploadService,
    private translate :TranslateService
    ) {

      this.productType = this.userService.getProductType();
      this.SeepzWorkFlow = this.userService.getWorkFlow();

    this.validationMessages = {
      name: {
        required: translate.instant('Company.CompanyNameRequired'),
        pattern: translate.instant('Company.CompanyValidation'),
        maxlength:translate.instant('Company.CompanyNameMaxlength'),
      },
      shortName: {
        required: translate.instant('Company.CompanyShortNameRequired'),
        pattern: translate.instant('Company.ShortNameValidation'),
        maxlength: translate.instant('Company.ShortNameMaxlength'),
      },
      building: {
        required: translate.instant('Company.buildingRequired'),
        pattern: translate.instant('Company.buildingValidation'),
        maxlength: translate.instant('Company.buildingMaxlength'),
        validbuilding:translate.instant('Company.validbuilding'),
      },
      cell: {
        required: translate.instant('Company.CellValidation'),
        pattern: translate.instant('Company.CellPattern'),
        minlength: translate.instant('Company.Cellminlength'),
        maxlength: translate.instant('Company.Cellmaxlength'),
      },
      email: {
        required:  translate.instant('Company.emailRequired'),
        email:  translate.instant('Company.emailVaild'),
        maxlength:  translate.instant('Company.emailMaxlength'),
        pattern:  translate.instant('Company.emailPattern'),
      },
      status: {
        required: translate.instant('Company.statusRequired'),
      },
      contactMobile: {
        required: translate.instant('Company.contactMobileRequired'),
      },
      floor: {
        required: translate.instant('Company.floorRequired'),
      },
      uploadLogo: {
        required: translate.instant('Company.uploadLogoRequired'),
      },
      companyUrl: {
        required: translate.instant('Company.companyUrlRequired'),
      },
      officeNo: {
        required: translate.instant('Company.officeNoRequired'),
      },
      floorNo: {
        required: translate.instant('Company.floorNoRequired'),
      },
      mobileNo: {
        required: translate.instant('Company.mobileNoRequired'),
      },
      emailId: {
        required: translate.instant('Company.emailId'),
        email: translate.instant('Company.emailVaildation'),
        maxlength: translate.instant('Company.emailIdMaxlength'),
        pattern: translate.instant('Company.emailIDPattern'),
      },
      firstName: {
        required: translate.instant('Company.PleaseEnterFirstName'),
        pattern:  translate.instant('Company.FirstNameValidation'),
        maxlength: translate.instant('Company.FirstNameMaxlength'),
      },
      lastName: {
        required: translate.instant('Company.PleaseEnterLastName'),
        pattern: translate.instant('Company.LastNameValidation'),
        maxlength: translate.instant('Company.LastNameMaxlength'),
      },
      lightLogo: {
        required:  translate.instant('Company.ligthDemo'),
      },
      darkLogo: {
        required:  translate.instant('Company.darkDemo'),
      },
    };
  }

  ngOnInit() {
    let LightLogoUrl = environment.DefaultLightTheamLogoUrl,
      darkLogoUrl = environment.DefaultDarkTheamLogoUrl
    this.handleIamge(LightLogoUrl,'darklogo');
    this.handleIamge(darkLogoUrl,'lightLogo');
    this.userData = this.userService.getUserData();
    this.selectedAccessCantrol = [];
    this.isExcel = environment.IsExcel;
    this.createForm();
    this.level3Address.controls['building'].valueChanges.subscribe((value)=>{
      this.buildingList = this._filter(value);
    });
    // this.getBuildingList();
    // //only for show and edit
    // if (this.formData && (this.formData.mode == "show" || this.formData.mode == "edit")) {
    //   this.getCompanyById()
    // }
    this.getDetails(false);
    if (this.formData && (this.formData.mode == "show" || this.formData.mode == "edit")) {
      // this.getCompanyById()
    }
    else{
      this.imgpreview = false;
      this.darkLogoPreview = false;
      // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(environment.DefaultLightTheamLogoUrl).key);
      // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(environment.DefaultDarkTheamLogoUrl).key);
    }
    this.selectedCountry = (this.commonService.getComplexContact()) ? 
    this.commonService.getComplexContact() :  CountryISO.UnitedStates;
    // isd code for mobile number
    // this.selectedCountry = (this.commonService.getComplexContact()) ? this.commonService.getComplexContact() :  CountryISO.UnitedStates;
  }

  private _filter(value: string): string[] {
    let filterValue;
    if(value && JSON.stringify(value).includes('name'))
      filterValue = value['name'].toLowerCase();
    else
      filterValue = value.toLowerCase();
    return this.originalBuildingList.filter(option =>option.name.toLowerCase().startsWith(filterValue) );
  }

  createForm() {
    this.selectedCountry = (this.commonService.getComplexContact()) ? this.commonService.getComplexContact() :  CountryISO.UnitedStates;

    this.formCompany = this.formBuilder.group({
      name: [ null, [Validators.required, Validators.maxLength(100)]],
      shortName: [null, [Validators.required, Validators.maxLength(20)]],
      email: [null, [Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/), Validators.maxLength(150)]],
      status: [this.statusList["ACTIVE"]],
      lightThemeLogoUrl: [''],
      darkThemeLogoUrl: [''],
      accessControl:[0,[]]
    });

    this.level3Address = this.formBuilder.group({
      building: [null, [Validators.required]],
      floorNo: [null, [Validators.required,Validators.maxLength(20)]],
      officeNo: [null, [Validators.required, Validators.maxLength(20)]],
      contactIsd: [null],
      contactMobile: [null],
      // contactEmail: [null],
    });
    
    
    if (!this.isExcel) {
      this.formCompany.get('email').setValidators([Validators.required]);
      // this.formCompany.controls.email.setValidators([Validators.required]);
      this.level3Address.get('contactMobile').setValidators([Validators.required]);
      this.level3Admin = this.formBuilder.group({
        userName: [null],
        emailId: [null,[Validators.required, Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/), Validators.maxLength(150)]],
        isd: [null],
        mobileNo: [null,],
        firstName: [null, [Validators.required, Validators.maxLength(50)]],
        lastName: [null, [Validators.required, Validators.maxLength(50)]],
      });
    } else {
      this.level3Admin = this.formBuilder.group({
        userName: [null],
        emailId: [null],
        isd: [null],
        mobileNo: [null],
        firstName: [null],
        lastName: [null],
      });
    }
    this.formCompany.addControl('level3Address', this.level3Address);
    this.formCompany.addControl('level3Admin', this.level3Admin);
  }
/**
 * @description creating company object to show and edit
 */
  updateForm() {
    let unitArr = [];
    let l3value ;
    if (this.viewData.data && this.viewData.data.companyUnits) {
      this.viewData.data.companyUnits.forEach(unit => {
        let index = this.originalBuildingList.findIndex((element)=>element.level2Id ===unit.level3Address.building);
        if(index>=0){
          l3value = this.originalBuildingList[index];
        }
        // let newCell = unit.level3Address.contactMobile.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3")
        let newCell = unit.level3Address && unit.level3Address.contactMobile ? unit.level3Address.contactMobile.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3") : null;
        if (unit.level3Address.contactIsd && unit.level3Address.contactIsd.indexOf('+') > -1) {
          unit.level3Address.contactIsd = onlyNumber(unit.level3Address.contactIsd);
        }
        this.selectedCountriesFoUnit.push(unit.level3Address.contactIsd? getCountryCode(unit.level3Address.contactIsd):(this.commonService.getComplexContact())? this.commonService.getComplexContact(): CountryISO.UnitedStates);
        unitArr.push(
          this.formBuilder.group({
            companyUnitId: [unit.companyUnitId],
            level3Address: this.formBuilder.group({
              addressId: [unit.level3Address.addressId],
              building: [l3value, [Validators.required]],
              name: [unit.level3Address.name, [Validators.required, Validators.maxLength(100)]],
              floorNo: [unit.level3Address.floorNo, [Validators.required,Validators.maxLength(20)]],
              officeNo: [unit.level3Address.officeNo, [Validators.required, Validators.maxLength(20)]],
              contactIsd: [unit.level3Address.contactIsd],
              contactMobile: [newCell],
              contactEmail: [unit.level3Address.contactEmail, [Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/), Validators.maxLength(150)]],
            }),
          })
        )
      })
     
        // let cell =  this.viewData.data.companyUnits
        // let phone = cell.map(a => a.level3Address.contactMobile)
        // let cellphone =[] ;
        // for(var i =0 ; i < phone.length ;i++){
        //   let newCell = phone[i].replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3")
        //   cellphone.push(newCell)
        // }
      
        // this.level3Address.controls.contactMobile.patchValue(cellphone)

        // this.level3Address.get('contactMobile').setValue({cellphone})
    }
       // this.viewData.data.lightThemeLogoUrl = "assets/images/login-vams-logo.png"
          // this.viewData.data.darkThemeLogoUrl = "assets/images/VAMS_Logo_Dark.png"
    let level3CompanyUnits = this.formBuilder.array(unitArr);
    this.formCompanyEdit = this.formBuilder.group({
      level3Id: [this.viewData.data.level3Id],
      name: [this.viewData.data.name, [Validators.required, Validators.maxLength(100)]],
      shortName: [this.viewData.data.shortName, [Validators.required, Validators.maxLength(20)]],
      email: [this.viewData.data.email, [Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/), Validators.maxLength(150)]],
      status: [this.viewData.data.status],
      // lightThemeLogoUrl: [(this.viewData.data?.lightThemeLogoUrl)?(this.viewData.data.lightThemeLogoUrl):"assets/images/login-vams-logo.png"],
      lightThemeLogoUrl:environment.DefaultLightTheamLogoUrl,
      // darkThemeLogoUrl: [(this.viewData.data?.darkThemeLogoUrl)?(this.viewData.data.darkThemeLogoUrl):"assets/images/VAMS_Logo_Dark.png"],
      darkThemeLogoUrl: environment.DefaultDarkTheamLogoUrl,
      accessControl:[0,[]]
    });
    this.formCompanyEdit.addControl('level3CompanyUnits', level3CompanyUnits);
    this.formCompanyEdit.markAllAsTouched();
    this.setupForAutoComplete()
    // this.initAdmin();
  }

  setupForAutoComplete(){
    this.dynamicBuilding = [];
    this.formCompanyEdit.controls['level3CompanyUnits']['controls'].forEach((element,index)=>{
      this.dynamicBuilding.push(this.originalBuildingList);
      element['controls']['level3Address']['controls']['building'].valueChanges.subscribe((value)=>{
        this.dynamicBuilding[index] = this._filterForEdit(value);
      })
    })
  }

  private _filterForEdit(value: string): string[] {
    let filterValue;
    if(value && JSON.stringify(value).includes('name'))
      filterValue = value['name'].toLowerCase();
    else
      filterValue = value.toLowerCase();
    return this.originalBuildingList.filter(option =>option.name.toLowerCase().startsWith(filterValue) );
  }

  //adding list of admin for update company
  initAdmin() {
    this.viewData.data.companyUnits.forEach(unit => {
      let key = unit.companyUnitId;
      this.adminsList.set(key, unit.admins)
    });
  }

  getCountryCode(isdCode) {
    return (isdCode) ? getCountryCode(isdCode) : null;
  }

  resetForm() {
    this.formCompany?.reset();
    this.formCompanyEdit?.reset();
    this.imgpreview = false;
    this.darkLogoPreview =false;
  }

  createItem() {
    return this.formBuilder.group({
      companyUnitId: [null],
      level3Address: this.formBuilder.group({
        addressId: [null],
        building: [null, [Validators.required]],
        name: [null],
        floorNo: [null, [Validators.required]],
        officeNo: [null, [Validators.required]],
        contactIsd: [null],
        contactMobile: [null],
        contactEmail: [null],
      }),
    })
  }

  addMoreOffice() {
    this.items = this.formCompanyEdit.get('level3CompanyUnits') as FormArray;
    this.items.push(this.createItem());
    this.setupForAutoComplete();
  }
  removeOffice(index) {
    this.items = this.formCompanyEdit.get('level3CompanyUnits') as FormArray;
    this.items.removeAt(index)
  }

  //TODO Not using need to remove in future
  onSubmit() {
    if (this.formCompany.invalid) {
      // this.toastrService.warning('There are errors in the formCompany', 'Could Not Save');
      Object.keys(this.formCompany.controls).forEach(field => {
        if (this.formCompany.controls[field]['controls']) {
          this.formCompany.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.formCompany.controls[field].markAsDirty();
          this.formCompany.controls[field].markAsTouched();
        }
      });
    } else {
      let updateObj = {
        "level3Id": this.formCompany.value.level3Id,
        "name": this.formCompany.value.name.trim(),
        "email": this.formCompany.value.email,
        "status": this.formCompany.value.status,
        "shortName": this.formCompany.value.shortName,
        // "lightThemeLogoUrl": this.formCompany.value.lightThemeLogoUrl,
        // "darkThemeLogoUrl": this.formCompany.value.darkThemeLogoUrl,
        "lightThemeLogoUrl": this.lightLogoImageUrl,
        "darkThemeLogoUrl": this.darkLogoImageUrl,
        // "shortName": this.formCompany.value.shortName.trim(),
        // "lightThemeLogoUrl": this.formCompany.value.lightThemeLogoUrl,
        // "darkThemeLogoUrl": this.formCompany.value.darkThemeLogoUrl,
        "level3CompanyUnits": [
          {
            "companyUnitId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "level3Address": {
              "addressId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "building": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "floorNo": "string",
              "officeNo": "string",
              "contactIsd": "string",
              "contactMobile": "string",
              "contactEmail": "string"
            }
          }
        ]
      }
      // let updateObj = {
      //   displayId: this.formData.data.displayId,
      //   name: this.formCompany.value.name,
      //   status: this.formCompany.value.status
      // }
      this.commonTabService.addCompany(updateObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message,  this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: 'department', status: true });
          }
        }, error => {
          if ('errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            })
          }
          else {
            this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
          // this.dialogRef.close({ type: 'department', status: false });
        });
    }
  }

  /**
   * @description update level 3 company details
   */
  updateCompany() {
    if(this.selectedAccessCantrol.length>0){
      this.formCompanyEdit.get('accessControl').setValue(this.accessCantrolNumber);    
    }
    else{
      this.formCompanyEdit.get('accessControl').setValue(0);
    }
    this.formCompanyEdit.updateValueAndValidity();
    if(this.formCompanyEdit && this.formCompanyEdit['controls'] && this.formCompanyEdit['controls']['level3CompanyUnits'] && this.formCompanyEdit['controls']['level3CompanyUnits']['controls']){
      this.formCompanyEdit['controls']['level3CompanyUnits']['controls'].forEach((element,index) => {
        let formValue = element.value;
        if(formValue && formValue['level3Address'] && formValue['level3Address']['building']){
          let value =this.dynamicBuilding[index].find((element)=>(element.id === formValue['level3Address']['building']['id']))
          if(value == undefined){
            element['controls']['level3Address']['controls']['building'].setErrors({'validbuilding': 'Please select valid building'});
          }
        }
      })
    }
    if (this.formCompanyEdit.invalid) {
      this.formCompanyEdit.updateValueAndValidity();
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.warning"));
      Object.keys(this.formCompanyEdit.controls).forEach(field => {
        if(this.formCompanyEdit.controls[field]['controls']) {
          Object.keys(this.formCompanyEdit.controls[field]['controls']).forEach(fieldControl => {
            this.formCompanyEdit.controls[field]['controls'][fieldControl].markAsDirty();
            this.formCompanyEdit.controls[field]['controls'][fieldControl].markAsTouched();
          });
        } else {
          this.formCompanyEdit.controls[field].markAsDirty();
          this.formCompanyEdit.controls[field].markAsTouched();
        }
      });
    } else {
    this.formCompanyEdit?.value.level3CompanyUnits?.forEach(element => {
      if(element.level3Address && element.level3Address.contactMobile &&  element.level3Address.contactMobile.dialCode) {
        let phoneNumber =  element.level3Address.contactMobile;
        element.level3Address.contactMobile =removeSpecialCharAndSpaces(phoneNumber["number"].toString());
        element.level3Address.contactIsd =   phoneNumber.dialCode.slice(1);
      }
    });
    let updateObj = this.formCompanyEdit.value;
    // updateObj['lightThemeLogoUrl']  = this.lightLogoImageUrl;
    // updateObj['darkThemeLogoUrl']  = this.darkLogoImageUrl;
    updateObj['lightThemeLogoUrl']  = null;
    updateObj['darkThemeLogoUrl']  = null;
    updateObj.name=updateObj.name.trim();
    updateObj.shortName=updateObj.shortName.trim();
    if(updateObj && updateObj.level3CompanyUnits){
      updateObj.level3CompanyUnits.forEach((element)=>{
        if(element && element.level3Address && element.level3Address.building &&  element.level3Address.building.level2Id){
          element.level3Address.building = element.level3Address.building.level2Id
        }
      })
    }
    this.commonTabService.updateCompany(updateObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message,this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: 'company', status: true });
          }
        }, error => {
          if ('errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            })
          }
          else {
            this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
          }
          // this.dialogRef.close({ type: 'department', status: false });
        });
    }
  }

  /**
   * @description remove admin for unit and changing status 
   */
  removeFromAdminList(employeeId, unitId) {
    let age = this.adminsList[unitId];
    if (age.length > 1) {
      age.forEach(element => {
        if (element["employeeId"] == employeeId) {
          let reqObj = {
            "employeeId": element["employeeId"],
            "companyUnitId": unitId
          }
          this.commonTabService.changeAdminRole(reqObj).pipe(first())
            .subscribe(resp => {
              if (resp.statusCode === 200 && resp.errors === null) {
                age = age.splice(age.indexOf(element), 1);
                this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
              }
            }, error => {
              this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
            });
        }
      });
    } else {
      this.toastr.warning(this.translate.instant("pop_up_messages.cant_remove_single_admin"), this.translate.instant("pop_up_messages.warning"));
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.validationMessages[control]) {
      Object.keys(this.validationMessages[control]).forEach(validator => {
        if ((this.formCompany.get(control)?.touched || this.formCompany.get(control)?.dirty) && this.formCompany.get(control)?.errors) {
          if (this.formCompany.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  showValidationMessageForDynamicContent(control: string, formCantrol: any): string[] {
    const messages: any[] = [];
    if (this.validationMessages[control]) {
      Object.keys(this.validationMessages[control]).forEach(validator => {
        if ((formCantrol.get(control)?.touched || formCantrol.get(control)?.dirty) && formCantrol.get(control)?.errors) {
          if (formCantrol.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  cancel() {
    this.dialogRef.close({ type: 'company', status: true });
  }
  // addMoreAdmin() {
  //   this.addAdmin = true;
  //   if ((this.formCompany.get('adminItem')['controls'].length) > 1) {
  //     this.multiAdmin = true;
  //     window.alert("Can not add admin more than 2")
  //   }
  //   else {
  //     this.adminItem = this.formCompany.get('adminItem') as FormArray;
  //     this.adminItem.push(this.createItem('admin'));
  //     this.adminActivityLabel = "Add More Admin";
  //   }
  // }

  addCompany() {
    let formValue = this.formCompany.value;
    this.errorInBuilding = false;
    if(formValue && formValue['level3Address'] && formValue['level3Address']['building']){
      let element =this.buildingList.find((element)=>(element.id === formValue['level3Address']['building']['id'] || element.level2Id === formValue['level3Address']['building'] ))
      if(element == undefined){
        this.errorInBuilding = true;
        this.formCompany.controls['building'].setErrors({'message': 'Please select valid building'});
      }
    }
    if (this.formCompany.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.could_not_save"));
      Object.keys(this.formCompany.controls).forEach(field => {
        if(this.formCompany.controls[field]['controls']) {
          Object.keys(this.formCompany.controls[field]['controls']).forEach(fieldControl => {
            this.formCompany.controls[field]['controls'][fieldControl].markAsDirty();
            this.formCompany.controls[field]['controls'][fieldControl].markAsTouched();
          });
        } else {
          this.formCompany.controls[field].markAsDirty();
          this.formCompany.controls[field].markAsTouched();
        }
      });
    } else {
      let addObj = this.formCompany.value;
      addObj.name =addObj.name.trim()
      addObj.shortName = addObj.shortName.trim()
      addObj.level3Address.floorNo=addObj.level3Address.floorNo.trim()
      addObj.level3Address.officeNo=addObj.level3Address.officeNo.trim()

      if (this.formCompany.value.level3Address && this.formCompany.value.level3Address.contactMobile && this.formCompany.value.level3Address.contactMobile.dialCode) {
        this.mobileNoObj = this.formCompany.value.level3Address.contactMobile;
      }
      if(this.mobileNoObj) {
        addObj.level3Address.contactIsd = this.mobileNoObj.dialCode.slice(1);
        addObj.level3Address.contactMobile = removeSpecialCharAndSpaces(this.mobileNoObj.number.toString());
      }
      // if(this.mobileNoObj && !this.isExcel && this.formCompany.value.level3Admin && this.formCompany.value.level3Admin.mobileNo) {
      //   addObj.level3Admin.isd = this.formCompany.value.level3Admin.mobileNo.dialCode.slice(1);
      //   addObj.level3Admin.mobileNo = removeSpecialCharAndSpaces(this.formCompany.value.level3Admin.mobileNo.number.toString());
      // }

      // addObj["lightThemeLogoUrl"] = this.lightLogoImageUrl;
      // addObj["darkThemeLogoUrl"] = this.darkLogoImageUrl;
      addObj["lightThemeLogoUrl"] = null;
      addObj["darkThemeLogoUrl"] = null;

      if(this.formCompany.value.level3Address && this.formCompany.value.level3Address.building && this.formCompany.value.level3Address.building.level2Id){
        this.formCompany.value.level3Address.building = this.formCompany.value.level3Address.building.level2Id;
      }

      this.commonTabService.addCompany(addObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: 'company', status: true });
          }
        }, error => {
          // this.toastr.error(error.message, 'Error');
          // this.dialogRef.close({ type: 'company', status: false });
          if ('errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            })
          }
          else {
            this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
        });
    }
  }

  getDetails(companyData:boolean){
    let apiCall = [];
    apiCall.push(this.masterService.getBuildings({ pageSize: 0, pageIndex: 0 }).pipe(first()));
    // this.getBuildingList();
    //only for show and edit
    if (this.formData && (this.formData.mode == "show" || this.formData.mode == "edit")) {
      // this.getCompanyById()
      this.selectedAccessCantrol = [];
      this.accessCantrolNumber = 0;
      if (companyData == true) {
        this.formData.mode = 'edit'
      }
      apiCall.push(this.masterService.getCompaniesById(this.formData.data.level3Id).pipe(first()))
    }
    forkJoin(apiCall).subscribe((resp)=>{
      if(resp && resp[0]){
        if (resp[0]['statusCode'] === 200 && resp[0]['errors'] === null) {
          this.buildingList = resp[0]['data']['list'];
          this.originalBuildingList = resp[0]['data']['list'];
        }
      }
      if(resp && resp[1]){
        if(resp[1]['statusCode'] === 200 && resp[1]['errors'] === null){
          this.viewData = resp[1];
          this.convertToBinary(this.viewData?.data?.accessControl);
          // this.lightLogo = "assets/images/login-vams-logo.png"
          // this.darkLogo = "assets/images/VAMS_Logo_Dark.png"
          // this.viewData.data.lightThemeLogoUrl = "assets/images/login-vams-logo.png"
          // this.viewData.data.darkThemeLogoUrl = "assets/images/VAMS_Logo_Dark.png"
          if (this.formData.mode == "edit") {
            this.updateForm();
          }
        }
      }
    })
  }

  getBuildingList() {
    this.masterService.getBuildings({ pageSize: 0, pageIndex: 0 }).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.buildingList = resp.data.list;
          console.log(this.buildingList,'buildingList')
          this.originalBuildingList = resp.data.list;
        }
      });
  }
  getCompanyById(companyData?: boolean) {
    this.selectedAccessCantrol = [];
    this.accessCantrolNumber = 0;
    if (companyData == true) {
      this.formData.mode = 'edit'
    }
    this.masterService.getCompaniesById(this.formData.data.level3Id).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.viewData = resp;
          let LightLogoUrl = environment.DefaultLightTheamLogoUrl,
            darkLogoUrl = environment.DefaultDarkTheamLogoUrl
          // let LightLogoUrl = (this.viewData && this.viewData?.data && this.viewData?.data?.lightThemeLogoUrl)?(this.viewData?.data?.lightThemeLogoUrl):environment.DefaultLightTheamLogoUrl;
          // let darkLogoUrl = (this.viewData && this.viewData?.data && this.viewData?.data?.darkThemeLogoUrl)?(this.viewData?.data?.darkThemeLogoUrl):environment.DefaultDarkTheamLogoUrl;
          //TODO: On logo upload changes ti will be changes
          this.lightLogoImageUrl = LightLogoUrl;
          this.darkLogoImageUrl = darkLogoUrl;
          // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(LightLogoUrl).key);
          // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(darkLogoUrl).key);
          this.handleIamge(darkLogoUrl,'darklogo');
          this.handleIamge(LightLogoUrl,'lightLogo');
          // this.darkLogoPreview = (this.viewData && this.viewData?.data && this.viewData?.data?.darkThemeLogoUrl)?true:false;
          // this.imgpreview = (this.viewData && this.viewData?.data && this.viewData?.data?.lightThemeLogoUrl)?true:false;
          this.convertToBinary(this.viewData?.data?.accessControl);
          // this.lightLogo = "assets/images/login-vams-logo.png"
          // this.darkLogo = "assets/images/VAMS_Logo_Dark.png"
          // this.viewData.data.lightThemeLogoUrl = "assets/images/login-vams-logo.png"
          // this.viewData.data.darkThemeLogoUrl = "assets/images/VAMS_Logo_Dark.png"
          if (this.formData.mode == "edit") {
            this.updateForm();
          }
        }
      });
  }
  //to open the employee details page
  employeeDetails(employeeId) {
      let employeeData = {
        displayId: employeeId
      }
      // this.commonTabService.getEmployeeById("8eeac0e6-d550-4af3-8343-ea9608136684").pipe(first())
      //   .subscribe(resp => {
      //     if (resp.statusCode === 200 && resp.errors === null) {
      //       employeeData = {
      //         company: null,
      //         // department: resp.data.departmentName,
      //         displayId: resp.data.displayId,
      //         // email: resp.data.emailId,
      //         // isd: resp.data.isd,
      //         // mobile: resp.data.mobileNo,
      //         // name: resp.data.firstName,
      //         // role: resp.data.roleDisplayId,
      //         // status: resp.data.status,
      //       }
            this.openDialog(employeeData)
          // }
        // });
        this.dialogRef.close({ type: 'employee', status: true });
  }

  openDialog(employeeData) {
    let applyClass = 'complex-employees-dialog';
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": employeeData, "formType": "employee", "mode": "show" },
      panelClass: ['animate__animated', applyClass, 'animate__slideInRight']
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogClose.emit(result);
    });
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.imgpreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  handleReaderForDarkImg(e) {
    this.base64textStringForDarkImg.push('data:image/png;base64,' + btoa(e.target.result));
    this.darkLogoPreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }


  onFileChange(event) {
    const file = event.target.files[0];
    // this.base64textString = [];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = this.handleReaderLoaded.bind(this);
    //   reader.readAsBinaryString(file);
    // }
  //   let level3Id = (this.viewData?.data?.level3Id)?this.viewData.data.level3Id:new Date().getTime();
  //   let mainfilePath = "level1/" + this.userData?.level1DisplayId + "/logo/" +level3Id+"/" ;    
  //   this.uploadService.fileUpload(file,mainfilePath+file.name).promise().then(resp=>{
  //     this.LightLogoUrl = resp.Location;
  //     this.imgpreview = true;
  // })
  }

  onFileChangeForDarkLogo(event){
    const file = event.target.files[0];
    // this.base64textStringForDarkImg = [];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = this.handleReaderForDarkImg.bind(this);
    //   reader.readAsBinaryString(file);
    // }
  //   let level3Id = (this.viewData?.data?.level3Id)?this.viewData.data.level3Id:new Date().getTime();
  //   let mainfilePath = "level1/" + this.userData?.level1DisplayId + "/logo/" +level3Id+"/" ;
  //   this.uploadService.fileUpload(file,mainfilePath+file.name).promise().then(resp=>{
  //     this.darkLogoUrl = resp.Location;
  //     this.darkLogoPreview = true;
  // })
  }

  formatCellNumber(cellNumber:any){
    return formatPhoneNumber(cellNumber);
  }

  getAccessCantrol(event:MatCheckboxChange,data:any,index:number){
    if(event.checked){
      this.selectedAccessCantrol.push(parseInt(data.value));
      this.setAccessCantrolNumber(parseInt(data.value));
    }
    else{
      var index = this.selectedAccessCantrol.indexOf(parseInt(data.value));
      this.accessCantrolNumber = this.accessCantrolNumber-(2**this.selectedAccessCantrol[index])
      this.selectedAccessCantrol.splice(index, 1);
    }
  }

  convertToInt(value){
    return parseInt(value)
  }

  convertToBinary(x) {
    this.accessCantrolNumber = 0
    if(x){
      let bin = 0;
      let rem, i = 1, step = 1;
      let iter = 0
      while (x != 0) {
          rem = x % 2;
          if(rem == 1){
            this.selectedAccessCantrol.push(iter);
            this.setAccessCantrolNumber(iter);
          }
          iter++;
          let num = x / 2;
          x = this.convertToInt(num);
          bin = bin + rem * i;
          i = i * 10;
      }
    }
    else{
      this.selectedAccessCantrol = []
    }
  }

  setAccessCantrolNumber(value){
    this.accessCantrolNumber = this.accessCantrolNumber + 2**parseInt(value);
  }

  handleImage(error){
    console.log(error)
    // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(environment.DefaultLightTheamLogoUrl).key);
    // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(environment.DefaultDarkTheamLogoUrl).key);
  }

  async handleIamge(url,type){
    console.log(url,type);
    let newUrl;
    try{
      let parserContent = s3ParseUrl(url);
      let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch(e){
      console.log(e);
      let parserContent = s3ParseUrl(type == 'darklogo'?environment.DefaultDarkTheamLogoUrl:environment.DefaultLightTheamLogoUrl);
      let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    if(type == 'darklogo') {
      this.darkLogoUrl =  newUrl;
      this.darkLogoPreview = true;
    }
    else {
      this.LightLogoUrl = newUrl;
      this.imgpreview = true;
    }
  }

  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
  

  displayWith(user){    
    return user && user.name ? user.name : '';  
  }

  getValue(event) {
    
  }

}
