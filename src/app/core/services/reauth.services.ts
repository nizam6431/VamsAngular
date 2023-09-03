import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';

@Injectable({
    providedIn: 'root'
})
export class ReauthService {

    private apiEndPoint = environment.apiEndPoint;
    constructor(private _http: HttpClient,
        private translate: TranslateService,
        private authenticationService: AccountService) {
    }

    validateReauthOTP(locationId: any, isdCode: string, mobile: string,
        email: string, reauth: string) {
        var request = {
            LocationId: locationId,
            CompanyId: environment.CompanyId,
            Language: this.translate.currentLang,
            IsdCode: isdCode,
            Mobile: mobile,
            Email: email,
            ReAuthKey: reauth
        }
        return this._http.post<any>(environment.CompanyAPIURL + '/ReAuth/ValidateReAuthOTP', request);
    }

    resendReauthOTP(locationId: any, isdCode: string, mobile: string,
        email: string) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "IsdCode": isdCode,
            "Mobile": mobile,
            "Email": email,
            "Language": this.translate.currentLang,
            "HostCompany": this.authenticationService.currentUserValue.CompanyShortName,
            "Product": this.authenticationService.currentUserValue.CompanyType
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'ReAuth/ReSendReAuthenticateOTP', request);
    }

    sendReauthOTP(locationId: any, isdCode: string, mobile: string, email: string) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "IsdCode": isdCode,
            "Mobile": mobile == null ? '' : mobile,
            "Email": email,
            "Language": this.translate.currentLang,
            "HostCompany": this.authenticationService.currentUserValue.CompanyShortName,
            "Product": this.authenticationService.currentUserValue.CompanyType
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'ReAuth/SendReAuthenticateOTP', request);
    }
}
