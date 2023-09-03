import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError, first, map } from 'rxjs/operators';
import { API_CONFIG } from '../../../core/constants/rest-api.constants';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContractorService {
  private restApi;

  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any
  ) {
    this.restApi = endPoints;

  }

  createContractorPass(reqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CONTRACTOR_PASS_DETAILS}`, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  createContractorEPass(reqObj) {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.E_PASS_DETAILS}`, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }
}
