import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { environment } from 'src/environments/environment';
import { AppointmentScheduleDetails } from '../../appointment/models/appointment-schedule';
import { VisitorsModule } from '../visitors.module';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {
  restApi: any;
  
  constructor(private http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  addRestrictedVisitor(addReqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_RESTRICTED_VISITOR}`, addReqObj)
      .pipe(map(data => {
          return data;
    }));
  }

  RemoveRestrictedVisitor(addReqObj){
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.REMOVE_RESTRICTED_VISITOR}`, addReqObj)
      .pipe(map(data => {
          return data;
    }));
  }

  // getRestrictedVisitorsList(reqData) {
  //   let bldgReqObj = {
  //     "searchByName": "",
  //     "searchByStatus": reqData.searchStatus && reqData.searchStatus == "ALL" ? "" : "ACTIVE",
  //     "pageSize": reqData.pageSize ? reqData.pageSize : reqData.pageSize == 0 ? reqData.pageSize : 1,
  //     "pageIndex": reqData.pageIndex ? reqData.pageIndex : reqData.pageIndex == 0 ? reqData.pageIndex : 1,
  //     "orderBy": reqData.orderBy ? reqData.orderBy : "firstName",
  //     "orderDirection": reqData.orderDirection ? reqData.orderDirection : "ASC",
  //     "globalSearch": reqData.globalSearch ? reqData.globalSearch : "",
  //   }

  //   return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RESTRICT_VISITOR_GET_ALL}`, bldgReqObj)
  //     .pipe(map(data => {
  //       return data;
  //     }));
  // }

  getRestrictedVisitorsList(getSchedule): Observable<AppointmentScheduleDetails> {
    return this.http.post<any>(environment.CompanyAPIURL + this.restApi.RESTRICT_VISITOR_GET_ALL, getSchedule)
      .pipe(map(data => {
        return data;
      }));
  }

  getAllVisitorsList(getSchedule):Observable<AppointmentScheduleDetails> {
    return this.http.post<any>(environment.CompanyAPIURL + this.restApi.RESTRICT_All_VISITOR_GET_ALL, getSchedule)
      .pipe(map(data => {
        return data;
      }));
  }

  getCurrentTimeByZone(timezone:string){
    let getTimeZoneObj = {
      timezone :  timezone
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CURRENT_TYPE_BY_ZONE}`, getTimeZoneObj)
    .pipe(map(data => {
      return data;
  }));
  }
}
