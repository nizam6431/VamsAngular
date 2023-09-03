import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { catchError, first, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { API_CONFIG } from '../constants/rest-api.constants';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private currentUserSubject: BehaviorSubject<any>;
    private restApi;

    constructor(private _http: HttpClient,
        private router: Router,
        private translate: TranslateService,
        @Inject(API_CONFIG) private endPoints: any) {
        this.restApi = endPoints;
    }

    login(username: string, password: string,isForceUpdate:boolean) {
        let headers = new HttpHeaders().set('Subdomain', environment.Subdomain);
        headers.append('LanguageCode', environment.LanguaeCode)
        let loginModel = {
            "password": password,
            "emailId": username,
            "isForcedLogin":isForceUpdate
        }

        return this._http.post<any>(`${environment.CompanyAPIURL}account/authenticate`, loginModel, { headers: headers })
            .pipe(map(data => {
                return data;
            }));
    }

    public get currentUserValue(): any {
        return //this.currentUserSubject.value;
    }

    public getCurrentUserToken() {
        return localStorage.getItem('currentUserToken');
    }

    forgetPassword(username: string) {
        var forgetPassword = {
            "email": username,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(`${environment.CompanyAPIURL}account/forgotpassword`, forgetPassword)
            .pipe(map(data => {
                return data;
            }));
    }

    validateToken(token, url) {
        let reqObj = { token };
        let apiUrl = "";
        switch (url) {
            case 'reset-password':
                apiUrl = `${environment.CompanyAPIURL}${this.restApi.VALIDATE_INVITATION_TOKEN}`;
                break;
            case 'forgot-password':
                apiUrl = `${environment.CompanyAPIURL}${this.restApi.VALIDATE_RESET_TOKEN}`;
                break;
        }
        return this._http.post<any>(apiUrl, reqObj)
    }

    resetPassword(newpassword: any, confirmPassword: any, token: any, forgotpwd: boolean) {
        var resetPassword = {
            "password": newpassword,
            "confirmPassword": confirmPassword,
            "token": token
        }
        let apiUrl = `${environment.CompanyAPIURL}${this.restApi.SET_FIRST_PASSWORD}`;
        if (forgotpwd) {
            apiUrl = `${environment.CompanyAPIURL}${this.restApi.RESET_PASSWORD}`;
        }
        // return this._http.post<any>(apiUrl, resetPassword)
        //     .pipe(map(data => {
        //         return data;
        //     }));
            return this._http.post<any>(apiUrl, resetPassword)
            .pipe(map(data => {
                if (data.data && data.statusCode === 200) {
                    return data;
                } else {
                    return data;
                }
            }, error => {
                return error
            }));
    }

    changePassword(oldPassword: string, newpassword: string, confirmPassword: string, userId: any) {
        let changePassword, apiURL;
        if(!oldPassword) {
            changePassword = {
                "newPassword": newpassword,
                "confirmPassword": confirmPassword,
                "employeeId": userId
            }
            apiURL = this.restApi.CHANGE_PASSWORD_EXCEL;
        } else {
            changePassword = {
                "newPassword": newpassword,
                "confirmPassword": confirmPassword,
                "oldPassword": oldPassword,
                "employeeId": userId
            }
            apiURL = this.restApi.CHANGE_PASSWORD;
        }
        return this._http.post<any>(`${environment.CompanyAPIURL}${apiURL}`, changePassword)
            .pipe(map(data => {
                return data;
            }));
    }

    logout(empId: number, currentConnectionId: number) {
        let logoutRequestObj = {
            "EmployeeId": empId,
            "CurrentConnectionId": currentConnectionId
        }

        return this._http.post<any>(environment.CompanyAPIURL + this.restApi.LOGOUT, logoutRequestObj)
        .pipe(map(data => {
            localStorage.removeItem('currentUserToken');
            return data;
        }));
    }

    changeBuilding(reqBody) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SET_DEFAULT_BUILDING}`, reqBody)
          .pipe(map(data => {
            return data;
          }));
        }

    changeLocation(reqBody) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_LOCATION_REPORT_ASYNC}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    }    
    getVisitorList(reqBody) {
        //  EmergencyNotification/GetVisitorAsync
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_LIST}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    } 
    getEmployeeList(reqBody) {
        //  EmergencyNotification/GetEmployeeAsync
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_EMPLOYEE_LIST}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    } 
     getSOSMessageList(reqBody) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_EMERGENCY_MESSAGES}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    } 
    sendEmergencyMessage(reqBody) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SEND_EMERGENCY_MESSAGE}`, reqBody)
            .pipe(map(data => {
            return data;
            }));
    } 
    getLocation(bldgReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GETALL_LEVEL2}`, bldgReqObj)
        .pipe(map(data => {
            return data;
        }));
  }
}
