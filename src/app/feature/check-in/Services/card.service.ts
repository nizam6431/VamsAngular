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
      return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SEEPZ_PERMANENT_PASS_REQUEST, getAllCardReq).pipe(
        map((response: any) => {
          return response;
        })
      );
    }

    getPassCategoryType(){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PASS_CATEGORY_TYPE}`, {})
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

    checkIn(reqBody){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.PERMANENTPASSCHECKIN}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
    }
    // checkIn(reqBody){
    //   return this._http.get<any>(`${environment.CompanyAPIURL}${this.restApi.PERMANENTPASSCHECKIN}/${reqBody}`)
    //   .pipe(map(data => {
    //     return data;
    //   }))
    // }
    checkOut(reqBody){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.PASSCHECKOUT}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
      // return this._http.get<any>(`${environment.CompanyAPIURL}${this.restApi.PASSCHECKOUT}/${reqBody}`)
      // .pipe(map(data => {
      //   return data;
      // }))
     }
    // getPaymentOrder(reqBody){
    //   return this._http.post<any>(`${this.restApi.GET_PAYMENT_ORDER}`, reqBody)
    //   .pipe(map(data => {
    //     return data;
    //   }))
    // }
    // paymentDetail(reqBody){
    //   return this._http.post<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}`, reqBody)
    //   .pipe(map(data => {
    //     return data;
    //   }))
    // }
    // rechargeUnitWallet(reqBody){
    //   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RECHARGE_UNIT_WALLET}`, reqBody)
    //   .pipe(map(data => {
    //     return data;
    //   }))
    // }
  
   raiseFlag(reqBody){
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RAISE_FLAG}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
    }
  }