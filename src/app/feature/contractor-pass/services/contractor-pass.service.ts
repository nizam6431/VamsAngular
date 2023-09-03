import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractorPassService {
  private restApi;
  constructor(
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  getAllContractors(getAllContractorPassApptReq) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_CONTRACTORS, getAllContractorPassApptReq).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  checkInCheckOutContractor(checkInCheckOutContractorObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.CHEKCK_IN_CHECK_OUT_CONTRACTORS, checkInCheckOutContractorObj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getContractorDetailsBYQrCOde(getContractorDetailsBYQrCOdeObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_CONTRACTORS_DETAILS_BY_QR_CODE, getContractorDetailsBYQrCOdeObj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
