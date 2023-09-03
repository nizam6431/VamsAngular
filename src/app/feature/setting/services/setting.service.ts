import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from '../../../../environments/environment';
import { API_CONFIG } from '../../../core/constants/rest-api.constants';
import { RootObject } from '../../master/models/complex-details';

@Injectable({
  providedIn: 'root'
})
export class SettingServices {
  private restApi;
  userDetails: any;

  constructor(
    private _http: HttpClient,
    private userService: UserService,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
    this.userDetails = this.userService.getUserData()
  }

  getNotificationData(parmas): Observable<RootObject> {
    (this.userDetails?.level2Id) ? parmas.level2Id = this.userDetails?.level2Id : parmas.level1Id = this.userDetails?.level1Id;
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.NOTIFICATIONSETTING_GETNOTIFICATIONSEGBYID,parmas)
      .pipe(map(data => {
        return data;
      }));
  }
  getGeneralSetting(level2Id: number): Observable<RootObject> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_GENERAL_SETTINGS, { "level2Id": level2Id })
      .pipe(map(data => {
        return data;
      }));
  }
  getLangueDetail(level2Id: number): Observable<RootObject> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_LANGUGE_DETAIL, { "level2Id": level2Id })
      .pipe(map(data => {
        return data;
      }));
  }
  updateGeneralSetting(languageCode: string, level2Id: number): Observable<RootObject> {
    let obj = {
      languageCode: languageCode,
      level2Id: level2Id
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_GENERAL_SETTINGS, obj)
      .pipe(map(data => {
        return data;
      }));
  }
  getproviderMasterList(reqObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.PROVIDER_MASTERS_LIST, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  //   {
  //   "languageCode": "string",
  //     "level1Id": 0
  // }



  getDefaultVisitorSetting() {
    return this._http.get("assets/dummy-json/visitor-setting.json")
  }
  updateNotificationSetting(parmas): Observable<RootObject> {
    (this.userDetails?.level2Id) ? parmas.level2Id = this.userDetails?.level2Id : parmas.level1Id = this.userDetails?.level1Id;
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.NOTIFICATIONSETTING_UPDATENOTIFICATIONSETTINASYNC, parmas)
      .pipe(map(data => {
        return data;
      }));
  }

  resetToDefaultVisitorSettings(level2Id: number) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.RESET_VISITOR_SETTING, { "level2Id": level2Id })
  }
  getAppointmentSettingDetail(parmas) {
    (this.userDetails?.level2Id) ? parmas.level2Id = this.userDetails?.level2Id : parmas.level1Id = this.userDetails?.level1Id;
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_SETTING_GET_APPOINTMENT_SETTING, parmas)
      .pipe(map(data => {
        return data;
      }));
  }

  getVisitorSetting(level2Id: number) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_VISITOR_SETTING_FOR_SETTING, { "level2Id": level2Id })
  }
  updateAppointmentDetail(parms) {
    (this.userDetails?.level2Id) ? parms.level2Id = this.userDetails?.level2Id : parms.level1Id = this.userDetails?.level1Id;
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_APPOINTMENT_SETTING, parms)
      .pipe(map(data => {
        return data;
      }));
  }

  getEmployeeData(): Observable<RootObject> {    
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EMPLOYEE_SETTING_GET_EMPLOYEE_SETTING_GET_ALL,{ "level2Id" : this.userDetails?.level2Id})
  }
  updateVisitorSetting(updateObj: any) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_VISITOR_SETTING, updateObj)
      .pipe(map(data => {
        return data;
      }));
  }

  updateEmployeeDetail(parms){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EMPLOYEE_SETTING_UPDATE_EMPLOYEE_SETTING,parms)
  }
  getLevel2List() {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_BUILDING_LIST, {})
      .pipe(map(data => {
        return data;
      }));
  }

  saveProviderMaster(reqObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_PROVIDER_MASTERS, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  updateProviderMaster(reqObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_PROVIDER_MASTERS, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }
}