import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeepzGeneraLedgerReportService {
  private restApi;
  constructor(private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints}

    getAllGeneralLedger(getAllReq) {
      return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GENERAL_LEDGER, getAllReq).pipe(
        map((response: any) => {
          return response;
        })
      );
    }
    exportSeepsReportData(reqObj) {
      let headers = new HttpHeaders();
      headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return this._http.post<any>(environment.CompanyAPIURL + this.restApi.EXPORT_GENERAL_LEDGER_REPORT, reqObj, { headers: headers, responseType: 'blob' as 'json' })
        .pipe(map(data => {
          return data
        }));
    }
}
