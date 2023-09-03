import { HttpClient } from '@angular/common/http';
import {Inject, Injectable } from '@angular/core';
import { FormArray } from '@angular/forms/';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';
import { API_CONFIG } from '../../core/constants/rest-api.constants';

@Injectable({
  providedIn: 'root'
})
export class AppointmentDetailService {

  private restApi;
  private apiEndPoint = environment.apiEndPoint;

  constructor(private _http: HttpClient,
    private scriptService: ScriptService,
    private translate: TranslateService,
    private authenticationService: AccountService, 
    @Inject(API_CONFIG) private endPoints: any) { 
      this.restApi = endPoints; 
    }


  getAppointmentDetails(visitorId: number) {
    var appointmentDetails = {

      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      VisitorId: visitorId
    }

    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetAppointmentDetail', appointmentDetails);
  }

  getAppointmentDetailsForHSQ(visitorId: string) {
    var appointmentDetails = {

      ExternalId: visitorId,
      Language: this.translate.currentLang
    }

    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetAppointmentForHSQ', appointmentDetails);
  }

  saveHSQConfirmation(HSQData: any) {
    var hsqDetails = {
      HSQData: HSQData,
      Language: this.translate.currentLang
    }

    return this._http.post<any>(environment.CompanyAPIURL + 'HSQConfirmation/SaveHSQConfirmation', hsqDetails);
  }

  getAppointmentDetailsByQRCode(QRCode: string, locationId: any) {
    var appointmentDetails = {
      LocationId: locationId,
      Language: this.translate.currentLang,
      QRCode: QRCode
    }

    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetAppointmentByQRCode', appointmentDetails);
  }

  validateHSQ(visitorId: any) {
    var appointmentDetails = {
      "VisitorId": visitorId,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/ValidateHSQ', appointmentDetails);
  }

  getWalkinForHSQ(qrCode: any) {
    var qrCodeDetails = {
      QRCode: qrCode,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetWalkinHSQ', qrCodeDetails);
  }

  checkHSQWalkinExistByDate(isdCode: string, mobile: string, email: string, locationId: number) {
    var qrCodeDetails = {
      IsdCode: isdCode,
      Mobile: mobile,
      Email: email,
      LocationId: locationId,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/CheckHSQWalkinExistByDate', qrCodeDetails);
  }

  validateHSQWalkin(isdCode: string, mobile: string, email: string, locationId: number) {
    var qrCodeDetails = {
      IsdCode: isdCode,
      Mobile: mobile,
      Email: email,
      LocationId: locationId,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/ValidateHSQWalkin', qrCodeDetails);
  }

  saveWalkinHSQ(walkinHSQDetails: any) {
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/SaveHSQWalkin', walkinHSQDetails);
  }

  getCompniesList(buildingId: any) {
    let reqBody = {
      "level2Id": buildingId
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.COMPANY_BY_BUILDING, reqBody);
  }

  createWalkin(walkInObj: any) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.CREATE_WALK_IN, walkInObj);
  }
  createWalkinSeepz(walkInObj: any) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.CREATE_WALK_IN_SEEPZ, walkInObj);
  }

  appointmentDetailsForQRPage(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_DETAILS_QR, reqBody);
  }
  visitorDetailsForQRPage(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.VISITOR_DETAILS_QR, reqBody);
  }

  validateByPassPin(userPin:string){
    let reqObj  = {
      "userPin":userPin
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.VALIDATE_BY_PASS_PIN, reqObj);
  }
}
