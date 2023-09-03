import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private restApi;
  constructor(private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints}


    getAllCards(getAllCardReq) {
      return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_ASYNC_PASS, getAllCardReq).pipe(
        map((response: any) => {
          return response;
        })
      );
    }

    getPassCategoryType(obj){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PASS_CATEGORY_TYPE}`, obj)
      .pipe(map(data => {
        return data;
      }))
    }
    getDocumentType(){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_DOCUMENT_TYPE}`, {})
      .pipe(map(data => {
        return data;
      }))
    }
    getVehicleType(){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SEEPZ_VEHICLE_TYPE}`, {})
      .pipe(map(data => {
        return data;
      }))
    }

    createPass(reqBody){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SEEPZ_CREATE_PASS}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
  }
  getPassValidity(reqBody) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PASS_VALIDITY}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
    
  }
  getRateCardCategory(reqBody) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_RATE_CARD_CATEGORY_MASTER}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
    
  }

  approvePermanentPass(displayId){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPROVE_PERMANNENT_PASS}`, displayId)
    .pipe(map(data => {
      return data;
    }))
  }
  getResaonData(displayId){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.REJECT_REASON_DATA}`, displayId)
    .pipe(map(data => {
      return data;
    }))
  }

  rejectReasonData(obj){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.REJECT_REASON_SEEPZ}`, obj)
    .pipe(map(data => {
      return data;
    }))
  }
  getByIdPermenantAsync(Obj :any){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_ASYNC_PERMANENTPASS_GETBYID, Obj)
      .pipe(map(data => {
        return data;
      }));
  }
  //  getBalance(){
  //   return this._http.get<any>(environment.CompanyAPIURL + this.restApi.GET_BALANCE)
  //     .pipe(map(data => {
  //       return data;
  //     }));
  // }

  getBalance(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_BALANCE, {})
    .pipe(map(data => {
      return data;
    }));
  }
   deactivatePass(obj){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DEACTIVATE_PASS,obj)
    .pipe(map(data => {
      return data;
    }));
  }
  getDeactivateReasons(reqBody){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DEACTIVATE_REASONS}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
    }
  }