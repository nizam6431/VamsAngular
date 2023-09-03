import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { AppointmentSchedule, AppointmentScheduleDetails, shareAppointmentSchedule } from '../models/appointment-schedule';
import { catchError, first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MY_FORMATS } from '../../../core/models/users';
@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  private restApi;
  VisitorSettingData: any;

  constructor(
    private userService: UserService,
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  drivingLicenseUpdate(drivingLicenseUpdate){
    return this._http.post<any>(environment.CompanyAPIURL+this.restApi.DRIVING_LICENSE_UPDATE, drivingLicenseUpdate)
        .pipe(map(data => {
          return data;
      }),
        catchError(error => {
          return error;
        }));
  }


  shareAppointmentInvitation(shareAppointmentInvitation) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_SHARE_APPOINTMENT_INVITATION, shareAppointmentInvitation)
      .pipe(map(data => {
        return data;
      }));
  }

  shareAppointmentSchedule(appointmentSchedule: shareAppointmentSchedule) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SHARE_APPOINTMENT_SCHEDULE, appointmentSchedule)
      .pipe(map(data => {
        return data;
      }));
  }


  appointmentSchedule(appointmentSchedule: AppointmentSchedule) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_SCHEDULE, appointmentSchedule)
      .pipe(map(data => {
        return data;
      }));
  }

  appointmentReSchedule(appointmentSchedule) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_RE_SCHEDULE, appointmentSchedule)
      .pipe(map(data => {
        return data;
      }));
  }

  getAllScheduleAppointment(getSchedule): Observable<AppointmentScheduleDetails> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_GET_ALL_SCHEDULE, getSchedule)
      .pipe(map(data => {
        return data;
      }));
  }

  getVisitorDetails(displayId: string) {
    let getByIdObject = {
      displayId: displayId
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_BY_ID}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }

  getVisitorType(){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_TYPE}`, {})
    .pipe(map(data => {
      return data;
    }))
  }

  getAllEmployee(data){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_EMPLOYEES}`, data)
    .pipe(map(data => {
      return data;
    }))
  }

  resendOtp(data: any){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.RESEND_OTP}`, data)
    .pipe(map(data => {
      return data;
    }))
  }

  validateOTP(data: any){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VALIDATE_OTP}`, data)
    .pipe(map(data => {
      return data;
    }))
  }
  getPrintPassDocument(data: any){
    var url = environment.productType == 'Commercial' ? this.restApi.PRINT_WALKING_PASS_DOCUMENT : this.restApi.PRINT_PASS_DOCUMENT;
    return this._http.post<any>(`${environment.CompanyAPIURL}${url}`, data)
    .pipe(map(data => {
      return data;
    }))
  }

  getVisitorPurpose(){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PURPOSE_OF_VISITOR}`, {})
    .pipe(map(data => {
      return data;
    }))
  }
  getAllLocation(){
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ALL_LOCATION}`, {})
    .pipe(map(data => {
      return data;
    }))
  }
  CheckInAsyncAppointment(data: any) {
    let checkInObject = {
      "appointmentId": data?.appointmentId,
      "temprature": data?.temprature,
      "isMask": (data?.isMask) ? (data?.isMask) : true,
      "visitorId": (data?.visitorId) ? (data?.visitorId) : 0,
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CHECK_IN_ASYNC}`, checkInObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetByQrCodeAsync(qrCode: string,appointmentId) {
    let qrCodeObject = {
      qrCode: qrCode,
      appointmentId:appointmentId
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_BY_QR_CODE_ASYNC}`, qrCodeObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetByQrCodeAsync_(data) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VALIDATE_OTP}`, data)
      .pipe(map(data => {
        return data;
      }));
  }

  
  GetAppointmentDetailsByQRCodeAsync(qrCode: string) {
    let qrCodeObject = {
      "qrCode": qrCode
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_BY_QR_CODE_ASYNC_BY_TIME_IN_OUT}`, qrCodeObject)
      .pipe(map(data => {
        return data;
      }));
  }


  ByPassAsync(byPassObject: any) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.BY_PASS_ASYNC}`, byPassObject)
      .pipe(map(data => {
        return data;
      }));
  }

  checkOutAsync(appointmentId: number) {
    let checkOutObject = {
      "appointmentId": appointmentId,
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CHECK_OUT_ASYNC}`, checkOutObject)
      .pipe(map(data => {
        return data;
      }));
  }

  checkOutAllAppointment(checkOutAllAppointment) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.CHECK_OUT_ALL_APPOINTMENT, checkOutAllAppointment)
      .pipe(map(data => {
        return data;
      }));
  }

  getAppointmentById(appointmentId) {
    let getByIdObject = {
      "appointmentId": appointmentId,
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_BY_ID}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }

  cancelAppointment(cancelAppointmenmtObject: any) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.CANCEL_APPOINTMENT}`, cancelAppointmenmtObject)
      .pipe(map(data => {
        return data;
      }));
  }
  getCancelAppointmentReason() {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.REJECT_REASON}`, {})
      .pipe(map(data => {
        return data;
      }));
  }
  restrictThisVisitor(appointmentData) {
    let restrictThisVisitorObject = {
      "firstName": appointmentData?.firstName,
      "lastName": appointmentData?.lastName,
      "emailId": (appointmentData.emailId) ? appointmentData.emailId : "",
      "isd": (appointmentData.isd) ? appointmentData.isd : "",
      "mobileNo": (appointmentData.mobileNo) ? appointmentData.mobileNo : "",
      "level2Id": (appointmentData.level2Id) ? appointmentData.level2Id : null,
      "level3Id": (appointmentData.level3Id) ? appointmentData.level3Id : null,
      "companyUnitId": (appointmentData.companyUnitId) ? appointmentData.companyUnitId : null
    }
    // return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.IS_VISITOR_RESTRICTED}`, restrictThisVisitorObject)
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.IS_VISITOR_RESTRICTED_DETAILS}`, restrictThisVisitorObject)
      .pipe(map(data => {
        return data;
      }));
  }
  TimeInOutAsync(appointmentId: number, type: string) {
    let checkOutObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
      "inOut": type
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.TIME_IN_TIME_OUT_HIT}`, checkOutObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetTimeInOutById(appointmentId, type) {
    let getByIdObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
      "inOut": type
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.TIME_IN_TIME_OUT_GET_BY_ID}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }

  GetTimeInAndOutById(appointmentId, type) {
    let getByIdObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
      "inOut": type
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.TIME_IN_AND_TIME_OUT_GET_BY_ID}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }

  timeInOutbyQrCode(appointmentId, type) {
    let getByIdObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
      "inOut": type
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.TIME_IN_OUT_BY_QR_CODE}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
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

  getNdaDocument(level2Id: number, docType: any) {
    let getVisitorDetails = {
      "docType": "NDA",
      level2Id: level2Id,
      "subDomain": docType
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_PDF_URL}`, getVisitorDetails)
      .pipe(map(data => {
        this.VisitorSettingData = data
        return data;
      }));
  }

  getVisitorByEmailPhone(mobile, email, bool) {
    let getVisitorDetails = {};
    if(mobile != null){
      let mobcode = mobile?.dialCode.substring(1);
      let noSpecialCharacters = mobile?.number.replace(/[^0-9]/g, '');
      getVisitorDetails = { "emailId": '', "isd": mobcode, "phone": noSpecialCharacters, "onlyFetch":bool }
    }else{
      getVisitorDetails = { "emailId": email, "isd": "", "phone": "", "onlyFetch":bool }
    }
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_BY_EMAIL_PHONE}`, getVisitorDetails)
      .pipe(map(data => {
        this.VisitorSettingData = data
        return data;
      }));
  }
  getVisitorByPhone(mobile, bool) {
    let mobcode = mobile?.dialCode.substring(1);
    let noSpecialCharacters = mobile?.number.replace(/[^0-9]/g, '');
    let getVisitorDetails = { "isd": mobcode, "phone": noSpecialCharacters, "onlyFetch":bool }
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_BY_PHONE_ASYNC}`, getVisitorDetails)
      .pipe(map(data => {
        this.VisitorSettingData = data
        return data;
      }));
  }

  getScheduleByEmailPhone(obj:any) {
   
    // if(mobile != null){
    //   let mobcode = mobile?.dialCode.substring(1);
    //   let noSpecialCharacters = mobile?.number.replace(/[^0-9]/g, '');
    //   getVisitorDetails = { "emailId": '', "isd": mobcode, "phone": noSpecialCharacters }
    // }else{
    //   getVisitorDetails = { "emailId": email, "isd": "", "phone": "" }
    // }
      return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_BY_EMAIL_PHONE}`, obj)
      .pipe(map(data => {
        this.VisitorSettingData = data
        console.log(this.VisitorSettingData,'visitorsetting')
        return data;
      }));
  }
  

  getCurrentTimeByZone(timezone: string) {
    let getTimeZoneObj = {
      timezone: timezone
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CURRENT_TYPE_BY_ZONE}`, getTimeZoneObj)
      .pipe(map(data => {
        return data;
      }));
  }

  setDateFormat(format) {
    MY_FORMATS.display.dateInput = format.toUpperCase()
  }

  scanDrivingLicense(formData: FormData) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_DRIVING_LICENCE_DATA}`, formData)
      .pipe(map(data => {
        return data;
      }));
  }
  DRIVING_LICENSE_UPDATE
  validateToken(token: string) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.VALIDATE_TOKEN, { token: token })
      .pipe(map(data => {
        return data;
      }));
  }

  // SignalR connection start and delete connection code.

  addSignalRConnection(connectionId: string,employeeId:number) {
    let addSignalRConnectionObject = {
      "connectionId": connectionId,
      "employeeId": employeeId
    }

    
  return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SIGNAL_R_CONNECTION_ADD, addSignalRConnectionObject)
    .pipe(map(data => {
      return data;
    }), catchError(error => {
      return error;
    }));
  }

  deleteSignalRConnection(connectionId: string) {
    let deleteSignalRConnectionObject = {
      "connectionId": connectionId
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SIGNAL_R_CONNECTION_DELETE, deleteSignalRConnectionObject)
      .pipe(map(data => {
        return data;
      }));
  }

  checkInWithoutBioDevice(obj: any) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.CHECK_IN_ASYNC_WITHOUT_ACCESS_CONTROL, obj)
      .pipe(map(data => {
        return data;
      }));
  }

  getAppointmentSync(){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DATA_SYNCCHRONIZATION, {})
      .pipe(map(data => {
        return data;
      }));
  }
  // CHECK_IN_ASYNC_WITHOUT_ACCESS_CONTROL

  getReautneticateSync(Obj :any){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.RE_AUTHENTICATE, Obj)
      .pipe(map(data => {
        return data;
      }));
  }
  getReautneticateValidateAsync(Obj :any){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.RE_AUTHENTICATE_VALIDATE, Obj)
      .pipe(map(data => {
        return data;
      }));
  }

  approveWalkin(appointmentId, type) {
    let getByIdObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
      "Walkin": type
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPROVE_WALKING_ASYNC}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }
  approveCheckin(appointmentId, type) {
    let getByIdObject = {
      "appointmentId": appointmentId,
      "visitorId": null,
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPROVE_CHECKIN_ASYNC}`, getByIdObject)
      .pipe(map(data => {
        return data;
      }));
  }

}
