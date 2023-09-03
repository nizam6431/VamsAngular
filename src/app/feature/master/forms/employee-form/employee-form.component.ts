import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { CommonTabService } from "../../services/common-tab.service";
import { ToastrService } from "ngx-toastr";
import { MasterService } from "../../services/master.service";
import { Status, notificationType } from "../../constants/dropdown-enums";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { forkJoin } from "rxjs";
import { parseInt } from "lodash";
import { environment } from "src/environments/environment";
import { UserService } from "src/app/core/services/user.service";
import { ChangePasswordComponent } from "src/app/feature/user/change-password/change-password.component";
import { LevelAdmins ,Level2Roles, ProductTypes} from "../../../../core/models/app-common-enum";
import { formatPhoneNumber, getCountryCode } from "src/app/core/functions/functions";
import { CommonService } from "src/app/core/services/common.service";
import { CountryData } from "../../models/country-and-time-zone";
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { TranslateService } from "@ngx-translate/core";
// import { SelectAutocompleteComponent } from "mat-select-autocomplete";
@Component({
  selector: "app-employee-form",
  templateUrl: "./employee-form.component.html",
  styleUrls: ["./employee-form.component.scss"],
})
export class EmployeeFormComponent implements OnInit, AfterViewInit {
  // @ViewChild(SelectAutocompleteComponent) multiSelect: SelectAutocompleteComponent;
  permissionKeyObj = permissionKeys;
  statusList = Object.keys(Status);
  notificationTypeList = Object.keys(notificationType);
  selectedNotificationType: any;
  departmentList: any[] = [];
  notificationType: notificationType;
  empDisplayId: string = "";
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formEmployee: FormGroup;
  @Input() formData: any;
  departmentData: any;
  selectedBuilding: any;
  roles: any[] = [];
  buildingData: any[] = [];
  buildingsForms = new FormControl();
  showBuildingDropDown: boolean = false;
  isExcel: boolean = false;
  isPasswordRequired: boolean = false;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  selectedDepartment: any;
  notificationValue: any;
  allEmpData: any = {};
  level3Id: any;
  empOfDisplayId: any;
  selectedIso: any = CountryISO.India;
  officeData: any[] = [];
  buildingDisabled: any[] = ["Level1Admin", "Level1Host", "Level2Host"];
  isCellValid: boolean;
  isEmailValid: boolean = true;
  isBuildingMandatory: boolean;
  defaultNotType = 3;
  userData = {};
  @ViewChild("phone") phone: ElementRef;
  level2Id: any;
  flagClass: string = "";
  maxLength: string = "15";
  country: string;
  public countries: CountryData;
  public selectedCountry: CountryISO;
  cellFormat: any;
  selectedOptions: any[] = [];
  selected: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  settings: { singleSelection: boolean; idField: string; textField: string; enableCheckAll: boolean; selectAllText: string; unSelectAllText: string; allowSearchFilter: boolean; limitSelection: number; clearSearchFilter: boolean; maxHeight: number; itemsShowLimit: number; searchPlaceholderText: string; noDataAvailablePlaceholderText: string; closeDropDownOnSelection: boolean; showSelectedItemsAtTop: boolean; defaultOpen: boolean; };
  productType:string;
  ProductTypeEnum = ProductTypes;
  isEnterpriseadmin : boolean = false;
  isHospitaladmin :boolean = false;

  // private toastrService: ToastrService  service
  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private commonTabService: CommonTabService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private translate:TranslateService 
  ) {
    this.productType = this.userService.getProductType();

    this.dropdownSettings = {
      singleSelection: false,
      text: this.translate.instant("notification_setting.select_countries"),
      selectAllText: this.translate.instant("notification_setting.Select_All"),
      unSelectAllText: this.translate.instant("notification_setting.Un_Select_All"),
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
    this.validationMessages = {
      firstName: {
        required:  translate.instant('EmployeeForm.PleaseEnterFirstName'),
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
        required:  translate.instant('EmployeeForm.PleaseEnterUserName'),
        maxlength: translate.instant('EmployeeForm.usernameMaxlength'),
        minlength: translate.instant('EmployeeForm.usernameMinlength'),
        pattern: translate.instant('EmployeeForm.usernameValid'),
      },
      buildings: {
        required: this.productType == this.ProductTypeEnum.Enterprise?translate.instant('EmployeeForm.PleaseSelectLocation') :translate.instant('EmployeeForm.PleaseSelectBuilding'),
      },
      companyUnit: {
        required: translate.instant('EmployeeForm.PleaseSelectOfficeDetails'),
      },
    };
  }

  ngAfterViewInit(): void {}
 

  ngOnInit() {
    this.assignSettings();
    this.departmentList = [];
    this.buildingData = [];
    this.roles = [];
    this.isExcel = environment.IsExcel;
    // this.isExcel = false;
    this.isPasswordRequired =
      this.userService.isLevel1Admin() || this.userService.isLevel2Admin();
    this.userData = this.userService.getUserData();
    if (this.data?.companyData) {
      this.level3Id = this.data?.companyData?.rowData?.level3Id;
    }
    if (
      this.userData &&
      this.userData["role"].shortName === LevelAdmins.Level3Admin
    ) {
      this.level3Id = this.userData["employeeOfDisplayId"]
        ? this.userData["employeeOfDisplayId"]
        : null;
    }
    if (
      this.userData &&
      this.userData["role"].shortName === LevelAdmins.Level2Admin
    ) {
      this.level2Id = this.userData["employeeOfDisplayId"]
        ? this.userData["employeeOfDisplayId"]
        : null;
      this.buildingData = this.userData["level2List"];
    }

    if (this.productType == this.ProductTypeEnum.Enterprise){
      this.selectedIso = (this.userService.getLocationData().data.address.contactIsd) ?  getCountryCode(this.userService.getLocationData().data.address.contactIsd): this.commonService.getComplexContact();
    } else {
      this.selectedIso = (this.commonService.getComplexContact()) ? this.commonService.getComplexContact() :  CountryISO.UnitedStates;
    }

    this.allEmpData["status"] = this.statusList[0];
    this.selectedNotificationType =
      this.notificationTypeList[this.defaultNotType];
    this.notificationValue = notificationType["None"];
    this.createForm();
    if (this.level3Id){
      this.formEmployee.addControl(
        "companyUnit",
        new FormControl(
          this.allEmpData?.companyUnit ? this.allEmpData?.companyUnit : null,
          [Validators.required, Validators.maxLength(100)]
        )
      );
      this.formEmployee.updateValueAndValidity();
    }

    if (this.productType == this.ProductTypeEnum.Enterprise && this.userService.isLevel1Admin()){
      this.isEnterpriseadmin = true;
    }

    if (this.productType == this.ProductTypeEnum.Enterprise){
      this.setValidators("department", [Validators.required]);
    }
    
    if (this.isExcel) {
      this.removeValidators("emailId");
      this.isEmailValid = false;
    } else {
      this.removeValidators("userName");
    }
    this.getDetails();
  }

  

  getDetails() {
    let apiCall = [];
    let departmentApiCall = this.commonTabService
      .getDepartments({ pageSize: 0, pageIndex: 0, levelId: this.level3Id })
      .pipe(first());
    let roleApiCall = this.masterService.getRole(this.level3Id).pipe(first());
    let buildingApiCall = this.masterService
      .getBuildings({ pageSize: 0, pageIndex: 0, level3Id: this.level3Id })
      .pipe(first());
    apiCall = [departmentApiCall, roleApiCall, buildingApiCall];
    if (this.level3Id) {
      let unitApiCall = this.commonTabService
        .getCompanyUnit(this.level3Id)
        .pipe(first());
      apiCall = [departmentApiCall, roleApiCall, buildingApiCall, unitApiCall];
      this.removeValidators("buildings");
    }
    forkJoin(apiCall).subscribe((resp) => {
      this.departmentList = resp[0]["data"]["list"];
      this.roles = resp[1]["data"];
      if (this.level2Id == null) {
        this.buildingData = resp[2]["data"]["list"];
      }
      this.roles.map((role) => {
        role["value"] = false;
      });
      this.roles[0]["value"] = true;
      if (this.formEmployee)
        this.formEmployee.controls["role"].setValue(this.roles[0]);
      if (this.level3Id) this.officeData = resp[3]["data"];
      this.performAction();
    });
  }
  assignSettings(){
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
  performAction() {
    if (this.formData?.mode == "show" || this.formData?.mode == "edit") {
      if (this.formData?.data) {
        this.empDisplayId = this.formData.data.displayId;
        this.getEmployeeById(this.formData.data.displayId);
      }
    } else {
      this.selectedNotificationType = this.notificationTypeList[0];
      this.activateRole(this.roles[0]);
      if (this.formData?.data) {
        this.formData.data["firstName"] = this.formData.data.name;
        this.formData.data["lastName"] = this.formData.data.name;
      }
    }
  }
  getEmployeeById(displayId) {
    this.commonTabService
      .getEmployeeById(displayId)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.allEmpData = resp.data;
          if(this.allEmpData && this.allEmpData?.isd)
            this.selectedIso = getCountryCode(this.allEmpData?.isd);
          this.empDisplayId = this.allEmpData?.displayId;
          this.empOfDisplayId = this.allEmpData?.employeeOfDisplayId;
          this.notificationValue = parseInt(this.allEmpData?.notificationType);
          this.selectedNotificationType =
            this.notificationTypeList[this.notificationValue - 1];
          if (this.allEmpData.departmentDisplayId) {
            if (this.departmentList?.length > 0) {
              this.selectedDepartment = this.departmentList.find(function (
                element
              ) {
                return element.displayId === resp.data?.departmentDisplayId;
              });
            }
            this.allEmpData["department"] = this.selectedDepartment;
          }
          this.allEmpData["notificationType"] = this.selectedNotificationType;
          this.allEmpData["buildings"] = this.buildingData.filter((element) => {
            if (
              this.allEmpData.role &&
              this.allEmpData.role.level2Ids &&
              this.allEmpData.role.level2Ids.includes(element.id)
            ) {
              return element;
            }
          });
          if (
            this.allEmpData?.companyUnitDisplayId &&
            this.officeData?.length > 0
          ) {
            this.allEmpData["companyUnit"] = this.officeData.find((element) => {
              if (element.displayId == this.allEmpData?.companyUnitDisplayId) {
                return element;
              }
            });
          }
          this.createForm();
          if (this.level3Id) {
            this.formEmployee.addControl(
              "companyUnit",
              new FormControl(
                this.allEmpData?.companyUnit
                  ? this.allEmpData?.companyUnit
                  : null,
                [Validators.required, Validators.maxLength(100)]
              )
            );
            this.removeValidators("buildings");
          }
          if (this.isExcel) {
            this.removeValidators("emailId");
          } else {
            this.removeValidators("userName");
          }
          let index = this.roles.findIndex(
            (element) =>
              element?.displayId === this.allEmpData?.role?.roleDisplayId
          );
          this.activateRole(
            this.roles[index] ? this.roles[index] : this.roles[0]
          );
          if (this.selectedNotificationType) {
            this.onNotificationChange(this.selectedNotificationType);
          }
          if(this.allEmpData.mobileNo){
             this.formEmployee.controls.cell.patchValue(this.allEmpData.mobileNo)
          }else {
             this.formEmployee.controls.cell.patchValue("")
          }
        }  
      });
  }

  createForm() {
    this.formEmployee = this.formBuilder.group({
      firstName: [
        this.allEmpData?.firstName ? this.allEmpData?.firstName : null,
        [Validators.required, Validators.maxLength(50)],
      ],
      lastName: [
        this.allEmpData?.lastName ? this.allEmpData?.lastName : null,
        [Validators.required, Validators.maxLength(50)],
      ],
      emailId: [
        this.allEmpData?.emailId ? this.allEmpData?.emailId : null,
        this.isExcel
          ? []
          : [Validators.required, Validators.maxLength(150), Validators.email],
      ],
      // cell: [this.allEmpData?.mobileNo ? this.allEmpData?.mobileNo : null, []],
      cell: [''],
      status: [
        this.allEmpData?.status ? this.allEmpData?.status : null,
        [Validators.required],
      ],
      department: [
        this.allEmpData?.department ? this.allEmpData?.department : null,
        [],
      ],
      notificationType: [
        this.allEmpData?.notificationType
          ? this.allEmpData?.notificationType
          : this.selectedNotificationType,
        [Validators.required, Validators.maxLength(100)],
      ],
      role: [
        this.allEmpData?.role ? this.allEmpData?.role : null,
        [Validators.required],
      ],
      userName: [
        this.allEmpData?.userName ? this.allEmpData?.userName : null,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern("^[a-zA-Z0-9.#_-]+$")
        ],
      ],
      buildings: [
        this.productType == this.ProductTypeEnum.Enterprise? this.allEmpData?.buildings?this.allEmpData?.buildings[0]:null :this.allEmpData?.buildings ? this.allEmpData?.buildings : null, [],
      ],
    });
  }

  onSubmit() {
    if (!this.isExcel)
      this.formEmployee
        .get("userName")
        .setValue(this.formEmployee.get("emailId").value);
    // if (this.isExcel && (this.formEmployee.get('emailId').value == null || this.formEmployee.get('emailId').value == ""))
    //   this.formEmployee.get('emailId').setValue(this.formEmployee.get('userName').value);
    if (this.formEmployee.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning")); 
      Object.keys(this.formEmployee.controls).forEach((field) => {
        this.formEmployee.controls[field].markAsDirty();
        this.formEmployee.controls[field].markAsTouched();
      });
    } 
    else {
      console.log(this.formEmployee.value)
      if((this.formEmployee.get("notificationType").value == 'Both' || this.formEmployee.get("notificationType").value == 'SMS')
       && this.formEmployee.get("cell").value == null)
      {
          this.checkMobileNumberRequried = true 
      }
      else{
        this.createEmployee();
      }
    }
  }

  updateEmployee() {
    if (this.formEmployee.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.formEmployee.controls).forEach((field) => {
        this.formEmployee.controls[field].markAsDirty();
        this.formEmployee.controls[field].markAsTouched();
      });
    } else {
//console.log(this.formEmployee);
if( this.productType == this.ProductTypeEnum.Commercial ){
  if( this.formEmployee.value.notificationType == "SMS" && this.formEmployee.value.cell == null ){
    //console.log(this.formEmployee.value.notificationType)
    this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.enter_mobile"));
    return;
  }
  if( this.formEmployee.value.notificationType == "Both" && ( this.formEmployee.value.cell == null || this.formEmployee.value.emailId == "" ) ){
    //console.log(this.formEmployee.value.notificationType)
    this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.add_account_warning"));
    return;
  }
}
      //return;
      //console.log(this.showBuildingDropDown)
      if (!this.showBuildingDropDown && this.productType != this.ProductTypeEnum.Enterprise) {
        this.formEmployee.get("buildings").setValue(null);
        this.formEmployee.get("buildings").updateValueAndValidity();
      }
  
      if (!this.showBuildingDropDown && this.productType == this.ProductTypeEnum.Enterprise && !this.userService.isLevel1Admin()) {
        this.formEmployee.get("buildings").setValue(this.buildingData[0]);
        this.formEmployee.get("buildings").updateValueAndValidity();
      }

      let emplyeeObj=this.formEmployee.value;
      emplyeeObj.firstName=emplyeeObj.firstName.trim();
      emplyeeObj.lastName=emplyeeObj.lastName.trim();
      emplyeeObj.userName=emplyeeObj.userName.trim();
      this.commonTabService
        .updateEmployee(
          emplyeeObj,
          this.empDisplayId,
          this.empOfDisplayId,
          this.notificationValue,
          this.level3Id
        )
        .pipe(first())
        .subscribe(
          (resp) => {
            if (resp.statusCode === 200 && resp.errors === null) {
              this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
              this.dialogRef.close({ type: "employee", status: true });
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
            // this.dialogRef.close({ type: 'employee', status: false });
          }
        );
    }
  }

  createEmployee() {
    // if (this.notificationValue)
    //   this.formEmployee.controls['notificationType'].setValue(this.notificationValue);
    if (!this.showBuildingDropDown && this.productType != this.ProductTypeEnum.Enterprise) {
      this.formEmployee.get("buildings").setValue(null);
      this.formEmployee.get("buildings").updateValueAndValidity();
    }

    if (!this.showBuildingDropDown && this.productType == this.ProductTypeEnum.Enterprise && !this.userService.isLevel1Admin()) {
      this.formEmployee.get("buildings").setValue(this.buildingData[0]);
      this.formEmployee.get("buildings").updateValueAndValidity();
    }
    
    // if((Level2Roles.l2Host == this.formEmployee.controls["role"].value?.shortName) && (this.userData['role']['shortName'] == LevelAdmins.Level2Admin)){
    //   let buildingData = this.userData['level2List'].filter(element=>(element?.id === this.userService.getLevel2Id()));
    //   this.formEmployee.controls["buildings"].setValue(buildingData);
    // }
    let emplyeeObj=this.formEmployee.value;
    emplyeeObj.firstName=emplyeeObj.firstName.trim();
    emplyeeObj.lastName=emplyeeObj.lastName.trim();
    emplyeeObj.userName=emplyeeObj.userName.trim();

    let dataSendToBackEnd = {
      data: emplyeeObj,
      level3Id: this.level3Id,
      notificationValue: this.notificationValue,
    };
    this.commonTabService
      .addEmployee(dataSendToBackEnd)
      .pipe(first())
      .subscribe(
        (resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: "employee", status: true });
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
          // this.dialogRef.close({ type: 'employee', status: false });
        }
      );
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if(this.formEmployee && this.formEmployee.get(control)){
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.formEmployee.get(control).touched ||
            this.formEmployee.get(control).dirty) &&
          this.formEmployee.get(control).errors
        ) {
          if (this.formEmployee.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formEmployee.reset();
    this.roles.forEach((content) => {
      content.value = false;
    })
    this.removeValidators("buildings");
  }

  changePwd() {
    this.dialog.open(ChangePasswordComponent, {
      height: "100%",
      position: { right: "0" },
      data: { employeeData: this.formData.data, invokeFrom: "employeeForm" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
  }

  onToggle(event: any, type: any) {
    if (event?.checked) {
      this.activateRole(type);
    } else {
      this.formEmployee.controls["role"].setValue(null);
      this.showBuildingDropDown = false;
    }
  }
  activateRole(type: any) {
    let allFlagFalse = true;
    this.roles.forEach((content) => {
      if (content?.displayId == type?.displayId) {
        if((this.userService.isLevel1Admin() || this.userService.isLevel2Admin()) && this.productType == this.ProductTypeEnum.Commercial) {
            this.showBuildingDropDown = (content?.shortName == LevelAdmins.Level2Admin || content?.shortName == Level2Roles.l2Reception
              || content?.shortName == Level2Roles.l2Security) ? true : false;

            this.isBuildingMandatory = this.showBuildingDropDown;
        }

        if(this.userService.isLevel1Admin() && this.productType == this.ProductTypeEnum.Enterprise) {
           this.showBuildingDropDown = (content?.shortName == LevelAdmins.Level2Admin || content?.shortName == Level2Roles.l2Reception
              || content?.shortName == Level2Roles.l2Security || content?.shortName == Level2Roles.l2Host) ? true : false;
            
          // this.isBuildingMandatory = this.showBuildingDropDown;
          // To all the users of enterprise users location drop down is required.
          this.isBuildingMandatory = true;
        }
      //   if(this.userService.isLevel1Admin() && this.productType == this.ProductTypeEnum.Hospital) {
      //     this.showBuildingDropDown = (content?.shortName == LevelAdmins.Level2Admin || content?.shortName == Level2Roles.l2Reception
      //        || content?.shortName == Level2Roles.l2Security || content?.shortName == Level2Roles.l2Host) ? true : false;
      //    this.isBuildingMandatory = this.showBuildingDropDown;
      //  }

        content.value = true;

        if (this.isBuildingMandatory) {
          this.setValidators("buildings", [Validators.required]);
        } else {
          this.removeValidators("buildings");
        }
        this.formEmployee.controls["role"].setValue(content);
        allFlagFalse = false;
      } else {
        if (this.isBuildingMandatory) {
          this.setValidators("buildings", [Validators.required]);
        } else {
          this.removeValidators("buildings");
        }
        content.value = false;
      }
    });
  }

  checkMobileNumberRequried = false
  checkEmpty(event:any){
    console.log(event.target.value)
    if(event.target.value == ''){
      this.checkMobileNumberRequried = true
    }
    else{
      this.checkMobileNumberRequried = false
    }
  }
  onNotificationChange(event: string) {
    if (this.isExcel) {
      if (event.toLowerCase() == "both") {
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isEmailValid = true;
        //this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
        // this.checkMobileNumberRequried = true
      } else if (event.toLowerCase() == "sms") {
        //this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
        this.removeValidators("emailId");
        this.isEmailValid = false;
      } else if (event.toLowerCase() == "email") {
        this.setValidators("emailId", [Validators.required, Validators.maxLength(150), Validators.email]);
        this.isEmailValid = true;
        this.removeValidators("cell");
        this.isCellValid = false;
        this.checkMobileNumberRequried = false
      } else {
        this.removeValidators("cell");
        this.removeValidators("emailId");
        this.isCellValid = false;
        this.isEmailValid = false;
        this.checkMobileNumberRequried = false
      }
    } else {
      if (event.toLowerCase() == "both" || event.toLowerCase() == "sms") {
        this.setValidators("cell", [Validators.required]);
        this.isCellValid = true;
      } else {
        this.removeValidators("cell");
        this.isCellValid = false;
      }
    }
    this.notificationValue = notificationType[event];
  }
  removeValidators(name: string) {
    this.formEmployee.get(name).clearValidators();
    this.formEmployee.get(name).updateValueAndValidity();
  }
  setValidators(name: string, validatorArray: any) {
    this.formEmployee.get(name).setValidators(validatorArray);
    this.formEmployee.get(name).updateValueAndValidity();
  }
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
  checkNumber(event) {
    this.formEmployee.get("cell").setValue(null);
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  // onKeyUpEvent(event: any){
  //   this.cellFormat = event.target.value.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3")
  //   this.formEmployee.controls.cell.patchValue(this.cellFormat)


  // }

  onKeyUpEvent(event: any ,backspace?){
    // this.cellFormat = event.target.value.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3")
    //this.formEmployee.controls.cell.patchValue(this.cellFormat)

    let cellFormat = event.target.value.replace(/\D/g, '');
    if (backspace && cellFormat.length <= 6) {
      cellFormat = cellFormat.substring(0, cellFormat.length - 1);
    }
    if (cellFormat.length === 0) {
      cellFormat = '';
    } else if (cellFormat.length <= 3) {
      cellFormat = cellFormat.replace(/^(\d{0,3})/, '($1)');
    } else if (cellFormat.length <= 6) {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (cellFormat.length <= 10) {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    this.formEmployee.controls.cell.patchValue(cellFormat)
  }

  public onFilterChange(item: any) {
  }
  public onDropDownClose(item: any) {
  }

  public onItemSelect(item: any) {
  }
  public onDeSelect(item: any) {
  }

  public onSelectAll(items: any) {
  }
  public onDeSelectAll(items: any) {
  }
  
}
