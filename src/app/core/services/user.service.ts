import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Level, LevelAdmins,Level1Roles } from '../models/app-common-enum';
import { UserPermissions } from '../models/app-common-interface';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { BehaviorSubject, Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // TODO: User Interface for userDetail object.
  userDetail: any = null;
  private apiEndPoint = environment.apiEndPoint;
  userPermissions: any;
  isL1Admin: boolean;
  isL2Admin: boolean;
  isL3Admin: boolean;
  level2Id: string;
  private restApi;
  private eventBrocker = new Subject<any>();
  locationId:any = null;

  isSelect = new BehaviorSubject(true);
  isSelect$ = this.isSelect.asObservable();

  locationData:any = null;
  userData: any;

  constructor(private _http: HttpClient,
      private scriptService: ScriptService,
      private translate: TranslateService,
      private authenticationService: AccountService,
      private router: Router,
      @Inject(API_CONFIG) private endPoints: any
      ) {
        this.restApi = endPoints;
  }

  getLocationId(){
    return this.locationId;
  }

  setLocationId(locationId){
    this.locationId = locationId;
  }

  getLocationData(){
    return this.locationData;
  }

  setLocationData(location){
    this.locationData = location;
  }


  getUserData(){
    return this.userDetail;
  }
  getUserToken() {
    return localStorage.getItem('currentUserToken');
    //return this.getUserData().jwtToken;
  }

  setUserData(userData){
    this.userDetail = userData; 
    
    if(userData)  {
      if( userData.level2List && userData.level2List.length > 0 ){
        // assign level2list default value to default building
        let selectedBuilding = userData.level2List.filter(
          (e) => e.isDefault == true
        );
  
        this.userDetail["selectedBuilding"]  = selectedBuilding[0]
      }
      if(userData.role) {
        this.setAdminFlags();
      }
      this.setPermissions();
    }      
  }
  setAdminFlags() {
    if(this.userDetail.role instanceof Array) {

    } else {
       this.isL1Admin = (this.userDetail.role.shortName === LevelAdmins.Level1Admin) ? true : false;
       this.isL2Admin = (this.userDetail.role.shortName === LevelAdmins.Level2Admin) ? true : false;
       this.isL3Admin = (this.userDetail.role.shortName === LevelAdmins.Level3Admin) ? true : false;
    }
    if(this.isL2Admin) {
      this.setLevel2DisplayId();
    }
  }

  setPermissions() {
    let permissions = {};
    // this.userPermissions = new Map<string, UserPermissions>(); 
    if(this.userDetail.permissions) {
      this.userDetail.permissions.forEach(element => {
        if(element["permissionKey"]) {
          permissions[element["permissionKey"]] = element["isPermissible"] || false;
        }
        // this.userPermissions.set(element.permissionKey, element);
      });
      permissions["appointment"] = true;
      permissions["appointments"] = true;
    } else {
      permissions['superAdmin'] = true;
    }
    console.log(permissions)
    environment.Permissions = permissions;
  }

  checkPermission(key) {
    if (environment.Permissions && environment.Permissions[key]) {
      return true;
    } else {
      return false;
    }
  }

  isLevel1Admin() {
    return this.isL1Admin;
  }
  isLevel2Admin() {
    return this.isL2Admin;
  }
  isLevel3Admin() {
    return this.isL3Admin;
  }
  getProductType() {
    return this.userDetail.productType;
  }
  isPermissible(permission: string) {
    if(environment.Permissions[permission]) {
      return true;
    }
    return false;
  }

  getWorkFlow(){
    return this.userDetail.feature.workFlow
  }
  isLevel1Reception(){
    return this.userDetail.role.shortName === Level1Roles.l1Reception
  }
  isLevel1Security(){
    return this.userDetail.role.shortName === Level1Roles.l1Security
  }
  isLevel1SecurityHead(){
    return this.userDetail.role.shortName === Level1Roles.l1SecurityHead
  }
  isLevel1Host(){
    return this.userDetail.role.shortName === Level1Roles.l1Host
  }

  setLevel2DisplayId() {
    this.level2Id = null;
    if(this.userDetail.level2List.length) {
      let obj = this.userDetail.level2List.find(item => item.isDefault === true);
      this.level2Id = obj.id;
    }
  }
  getLevel2DidForLevel2Admin() {
    return this.level2Id;
  }
  getLevel3DidForLevel3Admin() {
    return (this.userDetail.employeeOf === Level.Level3) ? this.userDetail.employeeOfDisplayId:
    null;
  } 
  getLevel2Id() {
    if(this.userDetail.selectedBuilding) {
      return this.userDetail.selectedBuilding.id;
    } else {
      return null;
    }
  }
  getLevel2IdWalkIn(isShown?) {
    if(this.userDetail.selectedBuilding) {
      if(this.userDetail.selectedBuilding.id && !isShown){
        return null
      }
      else{
        return this.userDetail.selectedBuilding.id}
    } else {
      return null;
    }
  }
  getLevel3Id() {
    if(this.userDetail.employeeOf === Level.Level3) {
      return this.userDetail.employeeOfId;
    } else {
      return null;
    }
  }
  getCompanyUnitId() {
    if(this.userDetail.employeeOf === Level.Level3) {
      return this.userDetail.companyUnitId;
    } else {
      return null;
    }
  }

  reAuthenticateToken() {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.REAUTHENTIKATE_TOKEN, {})
      .pipe(map(data => {
        if (data.statusCode == 200 && data.data) {
          console.log(data.data);
          this.userData = data.data;
          this.setUserData(data.data);
          if(data.data?.languageCode){
            localStorage.setItem('mylang',data.data?.languageCode)
            environment.LanguaeCode=data.data?.languageCode;
          }else{
            localStorage.setItem('mylang',"en-US");
             environment.LanguaeCode="en-US";
          }
         
          return true;
        } else {
          return false;
        }
      }, error => {
        return false
      }));
  }

  getUserCountryCode() {
    if (this.userDetail) {
      if (this.userDetail.isd) {
        return this.userDetail.isd;
      } else if (this.userDetail.country && this.userDetail.country.isdCode) {
        return this.userDetail.country.isdCode;
      }
    }
    return environment.defaultCountryIsd;
  }

  getRolName(){
    return this.userDetail.role.roleName;
  }

  //For sending event on logo changed
  on(eventType): Observable<any> {
    return this.eventBrocker.pipe();
  }

  dispatch<T>(event): void {
    this.eventBrocker.next(event);
  }

  getPaymentOrder(reqBody){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PAYMENT_ORDER}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
  paymentDetail(reqBody){
    // return this._http.get<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}${reqBody}`)
    // .pipe(map(data => {
    //   return data;
    // }))
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
  rechargeUnitWallet(reqBody){
    // return this._http.get<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}${reqBody}`)
    // .pipe(map(data => {
    //   return data;
    // }))
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RECHARGE_UNIT_WALLET}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
}
