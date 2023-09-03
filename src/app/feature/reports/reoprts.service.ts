import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReportsModule } from './reports.module';
import { environment } from 'src/environments/environment';
import { ReportsResponse } from './models/report-req';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';

@Injectable({
  providedIn: 'root'
})
export class ReoprtsService {
  private restApi;
  private ReportData: any;
  constructor(
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any
  ) {
    this.restApi = endPoints;
  }

  visitorsReportData(reqObj): Observable<ReportsResponse> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.VISITOR_REPORTS_DATA, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  appointmentsReportData(reqObj): Observable<ReportsResponse> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_REPORTS_DATA, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  hsqReportData(reqObj): Observable<ReportsResponse> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.HSQ_REPORTS_DATA, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  emailReportData(reqObj): Observable<ReportsResponse> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EMAIL_REPORTS_DATA, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  exportAppointmentsReportData(reqObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EXPORT_APPOINTMENTS_REPORTS_DATA, reqObj, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data;
      }));
  }

  exportAppointmentsHsqReportData(reqObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EXPORT_APPOINTMENTS_HSQ_REPORTS_DATA, reqObj, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data;
      }));
  }

  exportVisitorsReportData(reqObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EXPORT_VISITOR_REPORTS_DATA, reqObj, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data
      }));
  }

  exportEmailReportData(reqObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EXPORT_EMAIL_REPORTS_DATA, reqObj, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data
      }));
  }

  setReportData(filterReq) {
    this.ReportData = filterReq;
  }

  getReportData() {
    return this.ReportData;
  }

  firstTimePasswordChange(reqObj): Observable<ReportsResponse> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.first_time_password_change, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }
  
  exportFirstTmePassword(reqObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.first_time_password, reqObj, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data;
      }));
  }

  getVisitorPurpose(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_VISITOR_PURPOSE,{}).pipe(map(data => {
      return data;
    }));
  }

  getVisitorType(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_VISITOR_TYPE_All,{}).pipe(map(data => {
      return data;
    }));
  }
   changeLocation(reqBody) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_LOCATION_REPORT_ASYNC}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    } 
}
