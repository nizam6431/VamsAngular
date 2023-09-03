import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError, first, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { API_CONFIG } from '../../../core/constants/rest-api.constants';
import { environment } from '../../../../environments/environment';
import { ComplexDetailsUpdate, RootObject } from '../models/complex-details';
import {UserService} from '../../../core/services/user.service';
import { parseInt } from 'lodash';
import { removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';

@Injectable({
  providedIn: 'root'
})
export class CommonTabService {
  private restApi;

  constructor(
    private userService:UserService,
    private _http: HttpClient,
    private router: Router,
    private translate: TranslateService,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  getComplexDetails(): Observable<RootObject> {    
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_COMPLEX_DETAILS,null)
      .pipe(map(data => {
        return data;
      }));
  }

  updateCompplexDetail(complexDetailsUpdate: ComplexDetailsUpdate) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_COMPLEX_DETAILS, complexDetailsUpdate)
    .pipe(map(data => {
      return data;
    }));
  }

  getCounrty(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_COUNTRY,'')
    .pipe(map(data => {
      return data;
    }));    
  }

  getTimeZone(countryId:string){
    let getCountryTimeZone = {
      "countryId":countryId   
    }

    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_TIME_ZONE_BY_ID,getCountryTimeZone)
    .pipe(map(data => {
      return data;
    }));
  }

  async getSampleData(type: string) {
    if(type.toLocaleLowerCase()=='showcompanylist'){
      return await this._http.get('./assets/dummy-json/employee.json');
    }
    else if (type.toLocaleLowerCase() == 'departments')
      return await this._http.get('./assets/dummy-json/department.json');
    else if (type.toLocaleLowerCase() == 'employees')
      return await this._http.get('./assets/dummy-json/employee.json');
    else if (type.toLocaleLowerCase() == 'contractors')
      return await this._http.get('./assets/dummy-json/contractor.json');
    else
      return await this._http.get('./assets/dummy-json/contractor-company.json');
  }

  getDepartments(reqData) {
    let deptReqObj = {
      "searchByName": "",
      "searchByStatus": reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
      "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
      "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
      "orderBy": reqData.orderBy ? reqData.orderBy : "name",
      "orderDirection": reqData.sortBy ? reqData.sortBy : "ASC",
      "level3Id": reqData.levelId ? reqData.levelId : null,
      "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_DEPARTMENTS}`, deptReqObj)
      .pipe(map(data => {
        return data;
      }));
  }
  getCompanyUnit(displayId:string) {
    let companyUnitByCompany = {
      "displayId":displayId
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.COMPANY_UNIT_BY_COMPANY}`, companyUnitByCompany)
      .pipe(map(data => {
        return data;
      }));
  }

  addDepartment(addReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_DEPARTMENT}`, addReqObj)
        .pipe(map(data => {
          return data;
        }));
  }

  updateDepartment(editReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_DEPARTMENT}`, editReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteDepartment(deleteObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_DEPARTMENT}`, deleteObj)
      .pipe(map(data => {
        return data;
      }));
  }

  getEmployee(reqData) {
    let empReqObj = {
      "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
      "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
      "orderBy": reqData.orderBy ? reqData.orderBy : "name",
      "orderDirection": reqData.sortBy ? reqData.sortBy : "ASC",
      "name": "",
      "mobileno": "",
      "email": "",
      "company": "",
      "department": "",
      "status": reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
      "role": "",
      "level3DisplayId": reqData.level3Id ? reqData.level3Id : null,
      "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
      "level2Id": reqData.level2Id?reqData.level2Id:null
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_EMPLOYEE}`, empReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  getLevel2Employee(reqData) {
    let empReqObj = {
      "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
      "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
      "orderBy": reqData.orderBy ? reqData.orderBy : "name",
      "orderDirection": reqData.sortBy ? reqData.sortBy : "ASC",
      "name": "",
      "mobileno": "",
      "email": "",
      "company": "",
      "department": "",
      "status": reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
      "role": "",
      "level2Id": reqData.level2Id ? reqData.level2Id : null,
      "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_LEVEL2_EMPLOYEE}`, empReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  getEmployeeById(displayId:string) {
    let empReqObj = {
      "displayId": displayId
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_EMPLOYEE_BY_ID}`, empReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

 
  getProfileById() {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PROFILE_BY_ID}`,{})
      .pipe(map(data => {
        return data;
      }));
  }
  updateUserProfile(updateProfile){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_PROFILE}`, updateProfile)
    .pipe(map(data => {
      return data;
    }));
  }
  addEmployee(dataSendToBackEnd) {
    let data = dataSendToBackEnd?.data;
    let level3Id = dataSendToBackEnd?.level3Id;
    let notificationValue = dataSendToBackEnd?.notificationValue;
    let userData = this.userService.getUserData();
    let employeeOfDisplayId = level3Id?level3Id:userData?.level1DisplayId;
    let employeeOf = level3Id?"Level3":"Level1";
    let addEmployee = {
      "firstName": data?.firstName,
      "lastName": data?.lastName,
      "employeeOf": employeeOf,
      "employeeOfDisplayId": employeeOfDisplayId,
      "companyUnitDisplayId":data?.companyUnit?.displayId,
      "emailId": data?.emailId,
      "isd": (data?.cell)?((data?.cell?.dialCode).match(/\d+/)[0]):null,
      "mobileNo": (data?.cell?.number)?(removeSpecialCharAndSpaces(data?.cell?.number.toString())):null,
      "notificationType":parseInt(notificationValue),
      "departmentDisplayId": (data?.department)?(data?.department?.displayId):null,
      "username":data?.userName,
      "status":(data?.status),
      "role": {
        "roleDisplayId": (data?.role?.displayId),
        "isDefault": true,
        "Level2Ids": userData.productType == ProductTypes.Enterprise?(data?.buildings)?(level3Id?[]:[data?.buildings.id]):[]:((data?.buildings)?(level3Id?[]:(data?.buildings.map(element=>element.id))):[])
      }
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_EMPLOYEE}`, addEmployee)
      .pipe(map(data => {
        return data;
      }));
  }

  updateEmployee(data,displayId,empOfDisplayId,notificationValue,level3Id) 
  {
    let userData = this.userService.getUserData();
    let employeeOfDisplayId = empOfDisplayId?(empOfDisplayId):(userData?.level1DisplayId);
    let employeeOf = (empOfDisplayId == (userData?.level1DisplayId))?"Level1":"Level3";
    let editReqObj = {
      "displayId": displayId,
      "firstName": data?.firstName,
      "lastName": data?.lastName,
      "employeeOf": employeeOf,
      "employeeOfDisplayId": employeeOfDisplayId,
      "companyUnitDisplayId":data?.companyUnit?.displayId,
      "emailId": data?.emailId,
      "isd": (data?.cell)?((data?.cell?.dialCode).match(/\d+/)[0]):null,
      "mobileNo": (data?.cell?.number)?(removeSpecialCharAndSpaces(data?.cell?.number.toString())):null,
      "notificationType":parseInt(notificationValue),
      "departmentDisplayId": (data?.department)?(data?.department?.displayId):null,
      "username":data?.userName,
      "status":(data?.status),
      "role": {
        "roleDisplayId": (data?.role?.displayId),
        "isDefault": true,
        "Level2Ids": userData.productType == ProductTypes.Enterprise?(data?.buildings)?(level3Id?[]:[data?.buildings.id]):[]:((data?.buildings)?(level3Id?[]:(data?.buildings.map(element=>element.id))):[])
      }
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_EMPLOYEE}`, editReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteEmployee(deleteObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_EMPLOYEE}`, deleteObj)
      .pipe(map(data => {
        return data;
      }));
  }

  addCompany(editReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_LEVEL3}`, editReqObj)
        .pipe(map(data => {
            return data;
        }));
  }

  updateCompany(editReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_LEVEL3}`, editReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  changeAdminRole(editReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CHANGE_ADMIN_ROLE}`, editReqObj)
      .pipe(map(data => {
        return data;
      }));
    }
  
  getBioSecurityDeviceList(reqData){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DEVICE_SETTINGS_GET_ALL}`, reqData)
          .pipe(map(data => {
              return data;
          })); 
  }
  getBioSecurityDeviceById(deviceSettingId){
      let deviceSettingObj = {
          "deviceSettingId": deviceSettingId
      }
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RESTRICT_THIS_VISITOR}`, deviceSettingObj)
          .pipe(map(data => {
              return data;
          })); 
  }

  getAllContractors(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ALL_CONTACTORS}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  getContractor(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CONRACTOR}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  addContractor(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_CONRACTOR}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  updateContractor(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_CONRACTOR}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  deleteContractor(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_CONRACTOR}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  createContractorPass(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CREATE_PASS}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  updateContractorPass(reqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_PASS}`, reqObj)
    .pipe(map(data => {
        return data;
    }));
  }
}