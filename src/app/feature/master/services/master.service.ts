import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { LevelAdmins } from '../../../core/models/app-common-enum'
import { Level } from '../../../core/models/app-common-enum'
import { saveAs } from 'file-saver';
import { MY_FORMATS } from '../../../core/models/users';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  restApi: any;
  constructor(private userService:UserService,private http: HttpClient, @Inject(API_CONFIG) private endPoints: any) { 
    this.restApi = endPoints;
  }


  getBuildings(reqData) {
    // let bldgReqObj = {
    //   "searchByName": "",
    //   "searchByStatus":reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
    //   "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
    //   "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
    //   "orderBy": reqData.orderBy ? reqData.orderBy : "name",
    //   "orderDirection": reqData.sortBy ? reqData.sortBy : "ASC",
    //   "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
    // }

    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_LEVEL2}`, reqData)
        .pipe(map(data => {
            return data;
        }));
  }
  getLocation(bldgReqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_LEVEL2}`, bldgReqObj)
        .pipe(map(data => {
            return data;
        }));
  }

  getBuildingDetail(level2Id){
    let buildingReqObj ={
      level2Id:level2Id
    }

    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_LEVEL2_DETAILS}`, buildingReqObj)
    .pipe(map(data => {
        return data;
    }));    
  }

  addBuilding(addReqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_LEVEL2}`, addReqObj)
      .pipe(map(data => {
          return data;
      }));
  }

  updateBuilding(editReqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_LEVEL2}`, editReqObj)
      .pipe(map(data => {
          return data;
      }));
  }

  deleteBuilding(deleteObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_LEVEL2}`, deleteObj)
        .pipe(map(data => {
            return data;
        }));
  }

  getCompanies(reqData) {
    let bldgReqObj = {
      "searchByName": "",
      "searchByStatus": reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
      "searchByEmail": "",
      "searchByShortName": "",
      "pageSize": reqData.pageSize ? reqData.pageSize: reqData.pageIndex == 0 ? reqData.pageIndex :1,
      "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0? reqData.pageIndex: 1,
      "orderBy": reqData.orderBy? reqData.orderBy : "name",
      "orderDirection": reqData.sortBy? reqData.sortBy : "ASC",
      "level2Id": reqData.levelId ? reqData.levelId : null,
      "globalSearch": reqData.globalSearch  ? reqData.globalSearch : "",

    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_LEVEL3}`, bldgReqObj)
    .pipe(map(data => {
        return data;
    }));
  }

  getContractorCompanies(contractorObject) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CONTRACTORCOMPANY}`, contractorObject)
    .pipe(map(data => {
        return data;
    }));
  }

  deleteContractorCompany(deleteObject){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_CONTRACTOR_COMPANY}`, deleteObject)
    .pipe(map(data => {
        return data;
    }));
  }

  updateContractorCompany(updateObject){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_CONTRACTOR_COMPANY}`, updateObject)
    .pipe(map(data => {
        return data;
    }));
  }

  getContractorCompanyById(deleteObject){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET__CONTRACTOR_COMPANY_BY_ID}`, deleteObject)
    .pipe(map(data => {
        return data;
    }));
  }

  addContractorCompanies(addReqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_CONTRACTOR_COMPANY}`, addReqObj)
      .pipe(map(data => {
          return data;
      }));
  }


  getCompaniesById(level3Id) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_LEVEL3}`, {level3Id})
    .pipe(map(data => {
        return data;
    }));
  }

  deleteCompany(deleteObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_LEVEL3}`, deleteObj)
      .pipe(map(data => {
          return data;
      }));
  }

  getRole(level3Id){
    let userData = this.userService.getUserData();
    let employeeOf = (userData?.role?.shortName == LevelAdmins.Level1Admin)?Level.Level1:(userData?.role?.shortName == LevelAdmins.Level2Admin)?Level.Level2:Level.Level3;
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ROLE_BY_LEVEL}`,level3Id?{"level": Level.Level3,"level1Id":userData?.level1DisplayId}:{"level": employeeOf,"level1Id":userData?.level1DisplayId})
        .pipe(map(data => {
            return data;
        }));
  }

  getAccessLevels(deviceId){
    let endpoint = 'https://omnitrack.info/VAMSDeviceIntegration/api/';
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ACCESS_LEVELS}`,{deviceId:deviceId})
        .pipe(map(data => {
            return data;
        }));
  }

  getOverallARole(){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ROLE}`,{})
        .pipe(map(data => {
            return data;
        }));
  }

  downloadImage(url:string,fileName:string){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/png');
    this.http.get(url, { headers: headers, responseType: 'blob' }).subscribe(resp => {
      var blob = new Blob([resp], { type: 'application/png' });
      saveAs(blob, fileName);
    });
  }
  
  accessEmployeeQrCode(employeeId:string){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_EMPLOYEE_QR_CODE}`,{displayId:employeeId})
    .pipe(map(data => {
      return data;
  }));
  }

  getCompanyAndBuilding() {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_BUILDING_AND_COMPANY}`, {})
        .pipe(map(data => {
            return data;
        }));
  }

  getBuildingsForFilter(reqData) {
    let bldgReqObj = {
      "searchByName": "",
      "searchByStatus":reqData.searchStatus && reqData.searchStatus == "ALL" ? "": "ACTIVE",
      "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
      "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
      "orderBy": reqData.orderBy ? reqData.orderBy : "name",
      "orderDirection": reqData.sortBy ? reqData.sortBy : "ASC",
      "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
    }

    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ALL_BUILDINGS}`, bldgReqObj)
        .pipe(map(data => {
            return data;
        }));
  }

  //for Date and time changes
  getVisitorSettings(level2Id: number) {
    let getVisitorDetails = {
      level2Id: level2Id
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_SETTING}`, getVisitorDetails)
      .pipe(map(data => {
        return data;
      }));
  }

  getCurrentTimeByZone(timezone: string) {
    let getTimeZoneObj = {
      timezone: timezone
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CURRENT_TYPE_BY_ZONE}`, getTimeZoneObj)
      .pipe(map(data => {
        return data;
      }));
  }

  setDateFormat(format) {
    MY_FORMATS.display.dateInput = format.toUpperCase()
  }
}
