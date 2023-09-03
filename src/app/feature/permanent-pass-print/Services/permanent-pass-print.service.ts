import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class PermanentPassPrintService {
  private restApi;
  constructor(private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints  }

  getAllPermanentPassPrint(getAllCardReq) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SEEPZ_PERMANENT_PASS_REQUEST, getAllCardReq).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  printPermanentPass(getAllCardReq) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.PRINT_PERMANENT_PASS, getAllCardReq).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
