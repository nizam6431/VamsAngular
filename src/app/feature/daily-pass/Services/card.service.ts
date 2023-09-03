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
  VisitorSettingData: any;
  constructor(private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints}


    getAllDailyPass(getAllCardReq) {
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
  getHostName(reqBody) {
     return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_EMPLOYEE}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
  } 
  dailyEpassDetails(reqBody) {
     return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DAILY_EPASS_AFTER_CHECKIN}`, reqBody)
      .pipe(map(data => {
        return data;
      }))
  }
  getVisitorSettings(level2Id: number) {
    let getVisitorDetails = {
      level2Id: level2Id
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_SETTING}`, getVisitorDetails)
      .pipe(map(data => {
        this.VisitorSettingData = data
        return data;
      }));
  }
//  getBalance(){
//     return this._http.get<any>(environment.CompanyAPIURL + this.restApi.GET_BALANCE)
//       .pipe(map(data => {
//         return data;
//       }));
//   }
  getBalance(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_BALANCE, {})
    .pipe(map(data => {
      return data;
    }));
  }
  dailyPassAmount(obj){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_DAILYPASS_CATEGORYWISE_AMOUNT,obj)
      .pipe(map(data => {
        return data;
      }));
  }
   walkInDetails(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_WALKIN_DETAILS, reqBody);
  }
  // Razor pay api function start
  getPaymentOrder(reqBody){
    return this._http.post<any>(`${this.restApi.GET_PAYMENT_ORDER}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
  paymentDetail(reqBody){
    // return this._http.get<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}${reqBody}`)
    // .pipe(map(data => {
    //   return data;
    // }))
    return this._http.post<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
  rechargeUnitWallet(reqBody){
    // return this._http.get<any>(`${this.restApi.GET_PAYMENT_DETAIL_BY_PAYMENT_ID}${reqBody}`)
    // .pipe(map(data => {
    //   return data;
    // }))
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RECHARGE_UNIT_WALLET}`, reqBody)
    .pipe(map(data => {
      return data;
    }))
  }
  // Razor pay api function end

checkRateCardConfigure(reqBody){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.VALID_CATEGORY,reqBody)
      .pipe(map(data => {
        return data;
      }));
  }
  getByIdPermenantAsync(Obj :any){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_ASYNC_PERMANENTPASS_GETBYID, Obj)
      .pipe(map(data => {
        return data;
      }));
  }
  resendSMS(Obj :any){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.RESEND_SMS, Obj)
      .pipe(map(data => {
        return data;
      }));
  }
  
}