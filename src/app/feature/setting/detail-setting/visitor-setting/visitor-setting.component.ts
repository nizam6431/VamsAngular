import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { levels } from '../../constant/visitor'
import { GetVisitorSettingObj } from 'src/app/feature/setting/constant/visitor-setting';
import { SettingServices } from '../../services/setting.service'
import { earlyCheckinMins, hsqLimit, lateCheckinMins } from 'src/app/feature/setting/constant/limit'
import { defaultVal } from 'src/app/feature/setting/constant/default-visitor-setting'
import { LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { TranslateService } from '@ngx-translate/core';
import { authenticationMethods } from '../../constant/column';
import { stringify } from 'querystring';
import { AccountService } from 'src/app/core/services/account.service';
@Component({
  selector: 'app-visitor-setting',
  templateUrl: './visitor-setting.component.html',
  styleUrls: ['./visitor-setting.component.scss']
})
export class VisitorSettingComponent implements OnInit {
  @Input() updateVisitorSetting: any;
  @Input() action: any;
  @Output() invalid = new EventEmitter();
  public visitorForm: FormGroup;
  levelList = levels;
  checkInAtComplex: boolean;
  buildingList: any[] = []
  GetVisitorSettingObj = new GetVisitorSettingObj()
  isLivePhoto: boolean;
  isRegisterPhoto: boolean;
  userData: any;
  currentTimeZone: any;
  dateFormat: string = "DD-MM-YYYY";
  timeFormat: number = 12;
  isExcel = environment.IsExcel;
  complexSetting: boolean = true;
  level2Id: any;
  invalidEmail: boolean;
  originalBuildingList: any;
  isError: boolean;
  ProductType = ProductTypes;
  productType: any;
  hiddenAuth: boolean;
  methodList: any;
  constructor(
    private toastr: ToastrService,
    private commonService: CommonService,
    private userService: UserService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private visitorSettingObj: SettingServices,
    private authenticationService :AccountService) { 
      this.productType = this.userService.getProductType();
    }

  ngOnChanges(changes: SimpleChanges): void {
    // this.productType = ProductTypes.Enterprise;
    if (this.action && this.action == 'update') {
      this.updateSetting();
    }
    if (this.action && this.action == 'reset') {
      let level2Id = (this.level2Id == this.userData.level1Id) ? null : this.level2Id;
      this.getVisitorSetting(level2Id);
    }
    this.updateVisitorSetting = null;
  }

  ngOnInit(): void {
    this.isExcel = environment.IsExcel;
    // this.isExcel = false;
    this.userData = this.userService.getUserData();
    this.getDetails();
    this.createForm();
    this.visitorForm.controls['level2Id'].setErrors({ 'buildingValidation': null });
  }

  getDetails() {
    if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
      let locationId = this.userData?.level2List?.find(location => location.isDefault == true);
      this.callMultipleApi(locationId.id);
    }
    else if (this.userData && this.userData?.level1Id) {
      this.callMultipleApi(null);
    } else {
    }
  }

  callMultipleApi(locationId) {
    let listOfApi = [];
    listOfApi.push(this.commonService.getVisitorSettings(locationId).pipe(first()));
    //listOfApi.push(this.visitorSettingObj.getLevel2List().pipe(first()))
    let reqObj = {
      isDeleted: false,
    };
    listOfApi.push(this.authenticationService.changeLocation(reqObj).pipe(first()))
    forkJoin(listOfApi).subscribe((resp) => {
      if (resp && resp[0]) {
        this.getDefaultVisitorSettings(resp[0]);
        // let level2 = resp[0]['data'].level2Id;
        // localStorage.setItem("levelTwoId", level2);
      }
      if (resp && resp[1]) {
        resp[1]['data'].map(element =>{
          element.name = element.locationName
        })
        this.getLevel2List(resp[1]);
      }
      // this.getVisitorSetting(null);
    })
  }

  getDefaultVisitorSettings(response) {
    if (response.statusCode === 200 && response.errors == null) {
      this.currentTimeZone = response?.data?.timeZone;
      this.dateFormat = response?.data?.dateFormat;
      this.timeFormat = response?.data?.timeformat;
    } else {
      this.toastr.error(response.message);
    }
  }

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : "India Standard Time";
    this.commonService.getCurrentTimeByZone(timezone).subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {

        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      }
    );
  }

  getLevel2List(resp) {
    if (resp.statusCode == 200 && resp.errors == null) {
      this.buildingList = resp.data;
      this.originalBuildingList = JSON.parse(JSON.stringify(resp.data));
    }
    if (this.userData.role.shortName == LevelAdmins.Level1Admin) {
      let name = (this.productType == this.ProductType.Commercial)?this.translate.instant("Masters.Complex"):this.translate.instant("ProductType.EnterPrise");
      this.buildingList.splice(0, 0, { name: name+" " + this.userData?.levelName, id: this.userData.level1Id });
      this.originalBuildingList.splice(0, 0, { name: name+" " + this.userData?.levelName, id: this.userData.level1Id });
      this.visitorForm.get('level2Id').setValue(this.userData.level1Id);
      this.level2Id = this.userData.level1Id;
    }
    if (this.userData.role.shortName == LevelAdmins.Level2Admin) {
      this.visitorForm.get('level2Id').setValue(this.buildingList[0].id);
      this.level2Id = this.buildingList[0].id
      if(this.productType === this.ProductType.Enterprise){
        this.hiddenAuth = true
      }
    }
    this.onLevelChange(this.level2Id);
  }

  getVisitorSetting(level2Id) {
    this.visitorSettingObj.getVisitorSetting(level2Id)
      .pipe()
      .subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors == null) {
          this.GetVisitorSettingObj = resp.data;
          this.methodList = this.GetVisitorSettingObj['visitorAuthenticationTypeList'];
          // this.visitorForm.patchValue(this.GetVisitorSettingObj);
          this.createForm();
          this.isChecked();
          // if(this.level2Id && this.level2Id != this.userData.level1Id){
          this.visitorForm.get('level2Id').setValue(this.level2Id);
          // }
        }
      })
  }

  createForm() {
    this.visitorForm = this.formBuilder.group({
      level2Id: [this.GetVisitorSettingObj?.level2Id ? (this.GetVisitorSettingObj?.level2Id) : null, []],
      visitorCheckinAtComplex: [((this.GetVisitorSettingObj?.visitorCheckinAtComplex) != null) ? (this.GetVisitorSettingObj?.visitorCheckinAtComplex) : JSON.parse(defaultVal.visitorCheckinAtComplex), []],
      visitorCheckinAtBuilding: [(this.GetVisitorSettingObj?.visitorCheckinAtBuilding != null) ? (this.GetVisitorSettingObj?.visitorCheckinAtBuilding) : JSON.parse(defaultVal.visitorCheckinAtBuilding), []],
      isAuth: [(this.GetVisitorSettingObj?.isAuth != null) ? (this.GetVisitorSettingObj?.isAuth) : JSON.parse(defaultVal.isAuth), []],
      isByPass: [(this.GetVisitorSettingObj?.isByPass != null) ? (this.GetVisitorSettingObj?.isByPass) : JSON.parse(defaultVal.isByPass), []],
      isHostRequired: [(this.GetVisitorSettingObj?.isHostRequired != null) ? (this.GetVisitorSettingObj?.isHostRequired) : JSON.parse(defaultVal.isHostRequired), []],
      allowWalkinApproval: [(this.GetVisitorSettingObj?.allowWalkinApproval != null) ? (this.GetVisitorSettingObj?.allowWalkinApproval) : JSON.parse(defaultVal.allowWalkinApproval), []],
      isCamera: [(this.GetVisitorSettingObj?.isCamera != null) ? (this.GetVisitorSettingObj?.isCamera) : JSON.parse(defaultVal.isCamera), []],
      isLivePhoto: [(this.GetVisitorSettingObj?.isLivePhoto != null) ? (this.GetVisitorSettingObj?.isLivePhoto) : JSON.parse(defaultVal.isLivePhoto), []],
      isPrintPass: [(this.GetVisitorSettingObj?.isPrintPass != null) ? (this.GetVisitorSettingObj?.isPrintPass) : JSON.parse(defaultVal.isPrintPass), []],
      isSoftPass: [(this.GetVisitorSettingObj?.isSoftPass != null) ? (this.GetVisitorSettingObj?.isSoftPass) : JSON.parse(defaultVal.isSoftPass), []],
      showLivePhotoOnVisitorPass: [(this.GetVisitorSettingObj?.showLivePhotoOnVisitorPass != null) ? (this.GetVisitorSettingObj?.showLivePhotoOnVisitorPass) : JSON.parse(defaultVal.showLivePhotoOnVisitorPass), []],
      showRegisterVisitorPhotoOnVisitorPass: [(this.GetVisitorSettingObj?.showRegisterVisitorPhotoOnVisitorPass != null) ? (this.GetVisitorSettingObj?.showRegisterVisitorPhotoOnVisitorPass) : JSON.parse(defaultVal.showRegisterVisitorPhotoOnVisitorPass), , []],
      isVisitorHSQ: [(this.GetVisitorSettingObj?.isVisitorHSQ != null) ? (this.GetVisitorSettingObj.isVisitorHSQ) : JSON.parse(defaultVal.isVisitorHSQ), []],
      hsqAlertSendBeforeHours: [(this.GetVisitorSettingObj?.hsqAlertSendBeforeHours != null) ? (this.GetVisitorSettingObj?.hsqAlertSendBeforeHours) : defaultVal.hsqAlertSendBeforeHours, [Validators.required, Validators.min(hsqLimit.low), Validators.max(hsqLimit.upper)]],
      earlyCheckinMins: [(this.GetVisitorSettingObj?.earlyCheckinMins != null) ? (this.GetVisitorSettingObj?.earlyCheckinMins) : defaultVal.earlyCheckinMins, [Validators.required, Validators.min(0)]],
      lateCheckinMins: [(this.GetVisitorSettingObj?.lateCheckinMins != null) ? (this.GetVisitorSettingObj?.lateCheckinMins) : defaultVal.lateCheckinMins, [Validators.required, Validators.min(0)]],
      autoCheckOut: [(this.GetVisitorSettingObj?.autoCheckout != null) ? (this.GetVisitorSettingObj?.autoCheckout) : JSON.parse(defaultVal.autoCheckout), []],
      autoCheckoutTime: [(this.GetVisitorSettingObj?.autoCheckoutTime != null) ? (this.GetVisitorSettingObj?.autoCheckoutTime) : (defaultVal.autoCheckoutTime), []],
      noCheckOutVisitorAlert: [(this.GetVisitorSettingObj?.noCheckOutVisitorAlert != null) ? (this.GetVisitorSettingObj?.noCheckOutVisitorAlert) : JSON.parse(defaultVal.noCheckOutVisitorAlert), []],
      noCheckOutVisitorAlertTime: [(this.GetVisitorSettingObj?.noCheckOutVisitorAlertTime != null) ? (this.GetVisitorSettingObj?.noCheckOutVisitorAlertTime) : (defaultVal.noCheckOutVisitorAlertTime), []],
      noCheckoutVisitorAlertEmail: [(this.GetVisitorSettingObj?.noCheckoutVisitorAlertEmail != null) ? (this.GetVisitorSettingObj?.noCheckoutVisitorAlertEmail) : (defaultVal.noCheckoutVisitorAlertEmail), []],
      sendNDA: [(this.GetVisitorSettingObj?.sendNDA != null) ? (this.GetVisitorSettingObj?.sendNDA) : JSON.parse(defaultVal.sendNDA), []],
      printRegisterPhotoIfNotLivePhoto: [(this.GetVisitorSettingObj?.printRegisterPhotoIfNotLivePhoto != null) ? (this.GetVisitorSettingObj?.printRegisterPhotoIfNotLivePhoto) : JSON.parse(defaultVal.printRegisterPhotoIfNotLivePhoto), []],
      visitorAuthenticationType: [(this.GetVisitorSettingObj?.visitorAuthenticationType != null) ? JSON.stringify(this.GetVisitorSettingObj?.visitorAuthenticationType) : "", []],
    });
  }

  onLevelChange(id) {
    this.invalidEmail = false;
    this.invalid.emit(JSON.stringify(this.invalidEmail))
    if (id == this.userData.level1Id) {
      this.level2Id = id;
      this.complexSetting = true;
      this.getVisitorSetting(null);
    }
    else {
      this.level2Id = id;
      this.complexSetting = false;
      this.getVisitorSetting(id);
    }
    let index = this.originalBuildingList.findIndex(element => element.id == id);
    if (index >= 0) {
      this.checkBuildingError(this.originalBuildingList[index]);
    }
  }
  selectAuthenticationMethod(value) {
  }

  getComplexSetting() {
    this.getVisitorSetting(null);
  }

  updateSetting() {
    if (this.visitorForm.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("pop_up_messages.could_not_save"));
      Object.keys(this.visitorForm.controls).forEach((field) => {
        this.visitorForm.controls[field].markAsDirty();
        this.visitorForm.controls[field].markAsTouched();
      });
    } else {
      if (this.isExcel) {
        this.visitorForm.get('isCamera').setValue(true);
        this.visitorForm.get('isLivePhoto').setValue(true);
        this.onButtonToggleChange('building_level')
      }
      this.visitorSettingObj.updateVisitorSetting(this.dataSendToBackend())
        .pipe(first())
        .subscribe((resp) => {
          if (resp.statusCode == 200 && resp.errors == null) {
            let level2Id = (this.visitorForm.get('level2Id').value == this.userData.level1Id) ? null : this.visitorForm.get('level2Id').value;
            this.getVisitorSetting(level2Id);
            this.toastr.success(this.translate.instant("pop_up_messages.visitor_setting_update"), this.translate.instant("pop_up_messages.success"));
          }
        },
          (error) => {
            if ("errors" in error.error) {
              error.error.errors.forEach((element) => {
                this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
              });
            } else {
              this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
            }
          })
    }
  }
  dataSendToBackend() {
    this.GetVisitorSettingObj = this.visitorForm.value;
    this.GetVisitorSettingObj.visitorAuthenticationType = parseInt(this.GetVisitorSettingObj.visitorAuthenticationType)
    this.GetVisitorSettingObj.autoCheckoutTime =
      this.GetVisitorSettingObj.autoCheckoutTime.split(":")[0].length <= 1
        ? "0" + this.GetVisitorSettingObj.autoCheckoutTime
        : this.GetVisitorSettingObj.autoCheckoutTime;
    if (this.GetVisitorSettingObj.level2Id == this.userData.level1Id) {
      //this.GetVisitorSettingObj.level2Id = parseInt(level2)
      this.GetVisitorSettingObj.level2Id = null
    }
    return this.GetVisitorSettingObj
  }

  onButtonToggleChange(type) {
    if (type === 'building_level') {
      this.checkInAtComplex = false;
      this.visitorForm.get('visitorCheckinAtBuilding').setValue(true);
      this.visitorForm.get('visitorCheckinAtComplex').setValue(false);
    }
    if (type === 'complex_level') {
      this.checkInAtComplex = true;
      this.visitorForm.get('visitorCheckinAtBuilding').setValue(false);
      this.visitorForm.get('visitorCheckinAtComplex').setValue(true);
    }
    this.visitorForm.updateValueAndValidity();
  }

  onToggleChange(event) {

  }

  getWalkInStatus(event) {
    if (!event.checked) {
      this.visitorForm.get('allowWalkinApproval').setValue(false);
    }
  }

  getCameraStatus(event) {
    if (!event.checked) {
      this.visitorForm.get('isLivePhoto').setValue(false);
    }
  }

  photoStatus(event) {
    if (event.value == "livePhoto") {
      this.visitorForm.get('showLivePhotoOnVisitorPass').setValue(true);
      this.visitorForm.get('showRegisterVisitorPhotoOnVisitorPass').setValue(false);
      this.isRegisterPhoto = false;
      this.isLivePhoto = true;
    }
    else {
      this.visitorForm.get('showLivePhotoOnVisitorPass').setValue(false);
      this.visitorForm.get('showRegisterVisitorPhotoOnVisitorPass').setValue(true);
      this.isRegisterPhoto = true;
      this.isLivePhoto = false;
    }
    this.visitorForm.updateValueAndValidity();
  }

  isChecked() {
    if (this.visitorForm) {
      if (this.visitorForm.get('showLivePhotoOnVisitorPass').value) {
        this.isLivePhoto = true;
        this.isRegisterPhoto = false;
      }
      if (this.visitorForm.get('showRegisterVisitorPhotoOnVisitorPass')) {
        this.isLivePhoto = false;
        this.isRegisterPhoto = true;
      }
    }
  }

  HsqCount(hsq, manual?) {
    if (hsq) {
      if (this.visitorForm.get('hsqAlertSendBeforeHours').value >= hsqLimit.low && this.visitorForm.get('hsqAlertSendBeforeHours').value < hsqLimit.upper)
        this.visitorForm.get('hsqAlertSendBeforeHours').setValue(this.visitorForm.get('hsqAlertSendBeforeHours').value + 1)
    }
    else {
      if (this.visitorForm.get('hsqAlertSendBeforeHours').value > hsqLimit.low && this.visitorForm.get('hsqAlertSendBeforeHours').value <= hsqLimit.upper)
        this.visitorForm.get('hsqAlertSendBeforeHours').setValue(this.visitorForm.get('hsqAlertSendBeforeHours').value - 1)
    }
  }
  hsqToggle(event) {
    if (!event.checked) {
      this.visitorForm.get('hsqAlertSendBeforeHours').setValue(hsqLimit.low);
    }
  }

  earlyCheckInWindow(checkIn) {
    if (checkIn) {
      if (this.visitorForm.get('earlyCheckinMins').value >= earlyCheckinMins.low && this.visitorForm.get('earlyCheckinMins').value < earlyCheckinMins.upper)
        this.visitorForm.get('earlyCheckinMins').setValue((this.visitorForm.get('earlyCheckinMins').value) + 1)
    }
    else {
      if (this.visitorForm.get('earlyCheckinMins').value > earlyCheckinMins.low && this.visitorForm.get('earlyCheckinMins').value <= earlyCheckinMins.upper)
        this.visitorForm.get('earlyCheckinMins').setValue((this.visitorForm.get('earlyCheckinMins').value) - 1)
    }
    this.visitorForm.updateValueAndValidity()
  }

  lateCheckInWindow(checkIn) {
    if (checkIn) {
      if (this.visitorForm.get('lateCheckinMins').value >= lateCheckinMins.low && this.visitorForm.get('lateCheckinMins').value < lateCheckinMins.upper)
        this.visitorForm.get('lateCheckinMins').setValue(this.visitorForm.get('lateCheckinMins').value + 1)
    }
    else {
      if (this.visitorForm.get('lateCheckinMins').value > lateCheckinMins.low && this.visitorForm.get('lateCheckinMins').value <= lateCheckinMins.upper)
        this.visitorForm.get('lateCheckinMins').setValue(this.visitorForm.get('lateCheckinMins').value - 1)
    }
    this.visitorForm.updateValueAndValidity()

  }

  noCheckOutAlert(event) {
    if (!event.checked) {
      // this.visitorForm.get('noCheckoutVisitorAlertEmail').setValue(null);
      // this.visitorForm.get('noCheckOutVisitorAlertTime').setValue(null);
    }
  }

  noCheckOut(event) {
    if (!event.checked) {
      // this.visitorForm.get('autoCheckoutTime').setValue(null);
    }
  }

  showLivePhotoOnVisitorPassFnc(event) {
    if (!event.checked) {
      this.visitorForm.get('printRegisterPhotoIfNotLivePhoto').setValue(false);
    }
  }

  readEmail() {
    this.invalidEmail = false;
    if (this.visitorForm.get('noCheckoutVisitorAlertEmail').value.length > 0) {
      let email = this.visitorForm.get('noCheckoutVisitorAlertEmail').value;
      if (email && email.includes(',')) {
        let emailArray = email.split(',');
        emailArray.forEach((element) => {
          if (!this.isEmail(element)) {
            this.invalidEmail = true;
            // this.invalid.emit(JSON.stringify(this.invalidEmail))
          }
        })
      }
      else {
        this.invalidEmail = (!this.isEmail(email)) ? true : false;
        // this.invalid.emit(JSON.stringify(this.invalidEmail))
      }
    }
    else {
      this.invalidEmail = true;
    }
    this.invalid.emit(JSON.stringify(this.invalidEmail))

  }

  isEmail(search: string): boolean {
    var serchfind: boolean;
    let regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    serchfind = regexp.test(search);
    return serchfind
  }

  getValue(event: string) {
    event = event.trim();
    this.buildingList = this._filter(event);
    this.checkBuildingError(event);
  }

  checkBuildingError(event) {
    if (event && typeof (event) == 'object' && event.name) {
      event = event.name
    }
    if ((this.originalBuildingList.findIndex((element) => (JSON.stringify(element.name).toLowerCase().trim() === JSON.stringify(event).toLowerCase().trim()))) >= 0) {
      this.visitorForm.controls['level2Id'].setErrors({ 'buildingValidation': null });
      this.isError = false;
    }
    else {
      this.visitorForm.controls['level2Id'].setErrors({ 'buildingValidation': 'Please select valid building' });
      this.isError = true;
    }
    this.invalid.emit(JSON.stringify(this.isError))
  }

  displayFn = building => {
    let value = this.setValue(building);
    return value
  }

  setValue(building) {
    if (building) {
      if (typeof (building) == 'object') {
        let index = this.originalBuildingList.findIndex(element => (element.id == building.id))
        if (index >= 0) {
          return this.originalBuildingList[index]['name'];
        }
      }
      if (typeof (building) == 'number') {
        let index = this.originalBuildingList.findIndex(element => (element.id == building))
        if (index >= 0) {
          return this.originalBuildingList[index]['name'];
        }
      }
    }
  }

  private _filter(value: string): string[] {
    let filterValue = value.toLowerCase();
    return this.originalBuildingList.filter(option => option.name.toLowerCase().startsWith(filterValue));
  }

  formError(controlName: string, errorName: string) {
    return this.visitorForm.controls[controlName].hasError(errorName);
  }

  getTimeValue(data) {
    if (data.type == 'from') {
      this.visitorForm.controls["autoCheckoutTime"].setValue(data.value);
    }
    else {
      this.visitorForm.controls["noCheckOutVisitorAlertTime"].setValue(data.value);
    }
  }

  open(trigger) {
    trigger.openPanel()
  }

  getLocation(){
    let reqObj = {
      isDeleted: false,
    };
    this.authenticationService.changeLocation(reqObj).pipe(first())
  }

}