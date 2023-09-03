import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    private restApi;
    private ReportData: any;
    constructor(
        private _http: HttpClient,
        @Inject(API_CONFIG) private endPoints: any
    ) {
        this.restApi = endPoints;
    }

    addAccount(reqObj) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_ACCOUNT}`, reqObj)
            .pipe(map(data => {
                return data;
            }));
    }

    updateQrCodeLink(reqObj) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_QR_CODE_LINK}`, reqObj)
            .pipe(map(data => {
                return data;
            }));
    }

    getComplexPermissions(reqObj) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SUPERADMIN_COMPLEX_PERMISSIONS}`, reqObj)
        .pipe(map(data => {
            return data;
        }));
    }

    getComplexList(reqObj) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SUPERADMIN_COMPLEX_LIST}`, reqObj)
        .pipe(map(data => {
            return data;
        }));
    }

    updatePermissions(reqObj) {
        return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.SUPERADMIN_UPDATE_PERMISSIONS}`, reqObj)
        .pipe(map(data => {
            return data;
        }));
    }

}
