import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsPageService {
  restApi: any;

  constructor(    
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  getReportDetails(appointmentId:string){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VISITOR_REPORT_DETAILS}`, {"appointmentId": appointmentId})
      .pipe(map(data => {
        return data;
      }));
  }

  getAppointmentDetails(appointmentId:string){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPOINTMENT_REPORT_DETAILS}`, {"appointmentId":appointmentId})
    .pipe(map(data => {
      return data;
    }));
  }

  getEmailLogDetails(appointmentId:string){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.EMAIL_LOG_REPORT_DETAILS}`, {"emailLogId":appointmentId})
    .pipe(map(data => {
      return data;
    }));
  }

  getAppointmentHsqDetails(appointmentId:string){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPOINTMENT_HSQ_REPORT_DETAILS}`, {"appointmentId":appointmentId})
      .pipe(map(data => {
        return data;
    }));
  }

}
