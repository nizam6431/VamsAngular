import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { notificationType, Status } from 'src/app/feature/master/constants/dropdown-enums';
import { CommonTabService } from 'src/app/feature/master/services/common-tab.service';
import { MasterService } from 'src/app/feature/master/services/master.service';
import { SettingServices } from 'src/app/feature/setting/services/setting.service';
import { ChangePasswordComponent } from 'src/app/feature/user/change-password/change-password.component';
import { environment } from 'src/environments/environment';
import { removeSpecialCharAndSpaces } from '../functions/functions';
import { CommonService } from '../services/common.service';
import { UserService } from '../services/user.service';
import { formatPhoneNumber, getCountryCode } from "src/app/core/functions/functions";
import { ProductTypes } from '../models/app-common-enum';
import { AccountService } from "src/app/core/services/account.service";
import { TranslateCacheService } from 'ngx-translate-cache';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-profile-modal',
  templateUrl: './my-profile-modal.component.html',
  styleUrls: ['./my-profile-modal.component.scss']
})
export class MyProfileModalComponent implements OnInit {
  @Output() Signal_R_Emittir =  new EventEmitter();

  isAdd: boolean
  userDetail: any;
  languageCodeList: any[];
  level2Id: number = null;
  profileForm: FormGroup;
  departmentList: any;
  buildingData: any[] = [];
  statusList = Object.keys(Status);
  notificationTypeList = Object.keys(notificationType);
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  maxLength: string = "15";
  private validationMessages: { [key: string]: { [key: string]: string } };
  selectedIso: any = CountryISO.India;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  settings: { singleSelection: boolean; idField: string; textField: string; enableCheckAll: boolean; selectAllText: string; unSelectAllText: string; allowSearchFilter: boolean; limitSelection: number; clearSearchFilter: boolean; maxHeight: number; itemsShowLimit: number; searchPlaceholderText: string; noDataAvailablePlaceholderText: string; closeDropDownOnSelection: boolean; showSelectedItemsAtTop: boolean; defaultOpen: boolean; };
  selectedNotificationType: any;
  defaultNotType: number;
  notificationValue: any;
  isExcel: boolean;
  showBuildingDropDown: boolean;
  roleType: any;
  langugename: any[];
  langugeName: any;
  isEmailValid: boolean;
  isCellValid: boolean;
  userData: any;
  productType:string;
  ProductTypeEnum = ProductTypes;
  isEnterpriseadmin : boolean = false;

  constructor(private userService: UserService,
    private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private commonService: CommonService,
    private masterService: MasterService,
    public translateCacheService:TranslateCacheService,
    public router: Router,
    private authenticationService: AccountService,
    private settingService: SettingServices) {
    this.getAllLanguge();
    this.productType = this.userService.getProductType();

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
      cell: {
        required: translate.instant('EmployeeForm.RequiredCellNumber'),
      },
      emailId: {
        required: translate.instant('EmployeeForm.PleaseEnterEmailAddress'),
        email: translate.instant('EmployeeForm.EmailVaild'),
        maxlength: translate.instant('EmployeeForm.EmailMaxlength'),
        pattern: translate.instant('EmployeeForm.EmailPattern'),
      },
      status: {
        required: translate.instant('EmployeeForm.PleaseSelectStatus'),
      },
      department: {
        required: translate.instant('EmployeeForm.PleaseSelectDepartment'),
      },
      notificationType: {
        required: translate.instant('EmployeeForm.PleaseSelectNotificationType'),
      },
      admin: {
        required: translate.instant('EmployeeForm.adminRequried'),
      },
      buildingAdmin: {
        required: translate.instant('EmployeeForm.adminRequried'),
      },
      reception: {
        required: translate.instant('EmployeeForm.receptionRequried'),
      },
      security: {
        required: translate.instant('EmployeeForm.securityRequried'),
      },
      employee: {
        required: translate.instant('EmployeeForm.employeeRequried'),
      },
      role: {
        required: translate.instant('EmployeeForm.roleRequried'),
      },
      userName: {
        required: translate.instant('EmployeeForm.PleaseEnterUserName'),
        maxlength: translate.instant('EmployeeForm.usernameMaxlength'),
        minlength: translate.instant('EmployeeForm.usernameMinlength'),
        pattern: translate.instant('EmployeeForm.usernameValid'),
      },
      buildings: {
        required: translate.instant('EmployeeForm.PleaseSelectBuilding'),
      },
      companyUnit: {
        required: translate.instant('EmployeeForm.PleaseSelectOfficeDetails'),
      },
      bypassPin: {
        required: translate.instant('EmployeeForm.byPassPin'),
        pattern: translate.instant('EmployeeForm.byPassPinPattern'),
      },
    };

  }

  ngOnInit(): void {
    this.isExcel = environment.IsExcel;

    this.selectedIso = (this.commonService.getComplexContact()) ?
      this.commonService.getComplexContact() : CountryISO.UnitedStates;
    this.selectedNotificationType =
      this.notificationTypeList[this.defaultNotType];
    this.notificationValue = notificationType["None"];
    this.assignSettings();
    // this.getDetails()
    this.buildingData = this.userService.getUserData()?.level2List
    this.getProfileById()
    this.selectedNotificationType =
      this.notificationTypeList[this.defaultNotType];
    this.notificationValue = notificationType["None"];
  }
  assignSettings() {
    this.settings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll: true,
      selectAllText: this.translate.instant("notification_setting.Select_All"),
      unSelectAllText: this.translate.instant("notification_setting.Un_Select_All"),
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText:this.translate.instant('Company.search_building'),
      noDataAvailablePlaceholderText: this.translate.instant('Company.building_not_found'),
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  formProfile() {
    this.profileForm = this._formBuilder.group({
      firstName: [
        this.userDetail?.firstName,
        [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [
        this.userDetail?.lastName,
        [Validators.required, Validators.maxLength(50)]
      ],
      emailId: [this.userDetail?.emailId, [Validators.required, Validators.maxLength(150), Validators.email],
      ],
      cell: [''],
      status: [this.userDetail?.status,
      [Validators.required]
      ],
      notificationType: [this.userDetail?.notificationType,

      [Validators.required, Validators.maxLength(100)],
      ],
      role: [this.userDetail?.role?.roleDisplayName,
      [Validators.required]
      ],
      userName: [this.userDetail?.userName,
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.pattern("^[a-zA-Z0-9.#_-]+$")
      ],
      ],
      buildings: [this.buildingData
      ],
      bypassPin: [this.userDetail?.userPin,
      [Validators.required, Validators.pattern('[0-9]{6}')]
      ],
      languge: [this.userDetail.languageCode,
      Validators.required
      ]
    })

  }
  checkNumber(event) {
    this.profileForm.get("cell").setValue(null);
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  getAllLanguge() {
    this.languageCodeList = []
    this.settingService.getLangueDetail(this.level2Id).subscribe((resp: any) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.languageCodeList = resp?.data;
      }
    }, (error: any) => {
      this.toastr.error(this.translate.instant("toster_message.something_went_wrong"), this.translate.instant("toster_message.error"));
    })
  }

  changePwd(screen) {
    if (screen == 'password') {
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        height: "100%",
        position: { right: "0" },
        data: {},
        panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
      });
    }
  }

  /*  closing the Diloagbox  */
  cancelDiloag() {
    this.dialog.closeAll()
  }





  /*  Update Profile for employee Document */
  updateProfile() {
    if (this.productType == this.ProductTypeEnum.Enterprise){
      this.removeValidators("userName");
    }
    if (this.profileForm.invalid || this.profileForm.value.userName != this.userDetail.userName || this.profileForm.value.role != this.roleType?.roleDisplayName || this.profileForm.value.status != this.userDetail?.status) {
      (this.profileForm.invalid) ? this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning")) : this.toastr.warning(this.translate.instant("toster_message.user_naame_error"), this.translate.instant("toster_message.warning"))
      Object.keys(this.profileForm.controls).forEach((field) => {
        this.profileForm.controls[field].markAsDirty();
        this.profileForm.controls[field].markAsTouched();
      });
    } else {
      this.commonTabService.updateUserProfile(this.updateProfileObj()).subscribe(data => {
        if (data.statusCode == 200) {
          if (data.data.isEmailChanged == true) {
            this.logout();
            this.cancelDiloag();
          } else {
            localStorage.setItem('mylang', this.profileForm.value.languge)
            this.toastr.success(data.message, this.translate.instant("toster_message.success"));
            location.reload();
          }
        }
      }, (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.success"));
        }
      }
      );
    }

  }
  updateProfileObj() {
    return {
      "displayId": this.userDetail?.displayId,
      "firstName": this.profileForm.value.firstName.trim(),
      "lastName": this.profileForm.value.lastName.trim(),
      "employeeOf": this.userDetail?.employeeOf,
      "employeeOfDisplayId": this.userDetail?.employeeOfDisplayId,
      "emailId": this.profileForm.value.emailId,
      "isd": (this.profileForm.value.cell) ? ((this.profileForm.value.cell?.dialCode).match(/\d+/)[0]) : null,
      "mobileNo": (this.profileForm.value.cell?.number) ? (removeSpecialCharAndSpaces(this.profileForm.value.cell?.number.toString())) : null,
      "notificationType": this.notificationTypeList.findIndex(x => x === this.profileForm.value.notificationType) + 1,
      "departmentDisplayId": this.userDetail?.departmentDisplayId,
      "userPin": this.profileForm.value.bypassPin,
      "userName": this.profileForm.value.userName,
      "status": this.profileForm.value.status,
      "role": this.userDetail.role,
      "LanguageCode": this.profileForm.value.languge
    }

  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.profileForm && this.profileForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.profileForm.get(control).touched ||
            this.profileForm.get(control).dirty) &&
          this.profileForm.get(control).errors
        ) {
          if (this.profileForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  getProfileById() {
    this.commonTabService
      .getProfileById(
      )
      .pipe(first())
      .subscribe((resp) => {

        if (resp.statusCode === 200 && resp.errors === null) {
          this.userDetail = resp.data;
          this.notificationValue = parseInt(this.userDetail?.notificationType);
          this.selectedNotificationType = this.notificationTypeList[this.notificationValue - 1];
          this.userDetail["notificationType"] = this.selectedNotificationType;
          if (this.userDetail?.isd){
            this.selectedIso = getCountryCode(this.userDetail?.isd);
          }
         
          this.formProfile();
          this.langugeName = this.languageCodeList.find(x => x.code == this.userDetail.languageCode);
          if (this.selectedNotificationType) {
            this.onNotificationChange(this.selectedNotificationType);
          }
        }
        this.roleType = this.userDetail?.role;

        if (this.userDetail.mobileNo) {
          this.profileForm.controls.cell.patchValue(this.userDetail.mobileNo)
        } else {
          this.profileForm.controls.cell.patchValue("")
        }
      });


  }
  onNotificationChange(event: string) { 
    if (this.isExcel) {
      if (event.toLowerCase() == "both") {
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isEmailValid = true;
        this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
      } else if (event.toLowerCase() == "sms") {
        this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
        this.removeValidators("emailId");
        this.isEmailValid = false;
      } else if (event.toLowerCase() == "email") {
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isEmailValid = true;
        this.removeValidators("cell");
        this.isCellValid = false;
      } else {
        this.removeValidators("cell");
        this.removeValidators("emailId");
        this.isCellValid = false;
        this.isEmailValid = false;
      }
    } else {
      if (event.toLowerCase() == "both") { //console.log('Both')
        this.setValidators("cell", [Validators.required]);
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isCellValid = true;
        this.isEmailValid = true;
      }else if (event.toLowerCase() == "sms") { //console.log('sms', this.isCellValid)
        //this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
        this.removeValidators("emailId");
        this.isEmailValid = false;  //console.log(this.isCellValid)
      }else if (event.toLowerCase() == "email") { //console.log('email')
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isEmailValid = true;
        this.removeValidators("cell");
        this.isCellValid = false;
      } else {
        this.removeValidators("cell");
        this.removeValidators("emailId");
        this.isCellValid = false;
        this.isEmailValid = false;
      }
    }
    this.notificationValue = notificationType[event];
  }
  removeValidators(name: string) {
    this.profileForm.get(name).clearValidators();
    this.profileForm.get(name).updateValueAndValidity();
  }
  setValidators(name: string, validatorArray: any) {
    this.profileForm.get(name).setValidators(validatorArray);
    this.profileForm.get(name).updateValueAndValidity();
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  logout() {
    // this.deleteSignalR();
    this.Signal_R_Emittir.emit({"type":"logout"})
    this.authenticationService
      .logout(
        this.userService.getUserData().employeeId,
        this.userService.getUserData().currentConnectionId
      )
      .subscribe((res) => {
        if (res.errors == null && res.statusCode === 200) {
          // this.toastr.success(res.message, 'Success');
          this.translateCacheService.init();
          this.userService.setUserData(null);
          localStorage.clear();
          this.router.navigate(["/auth/login"]);
        }
      });
  }

}
