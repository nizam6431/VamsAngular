import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';

@Injectable({
    providedIn: 'root'
})
export class HolidayService {

    private apiEndPoint = environment.apiEndPoint;
    constructor(private _http: HttpClient,
        private translate: TranslateService,
        private authenticationService: AccountService) {
    }

    getHolidays(locationId: any) {
        var request = {
            LocationId: locationId,
            CompanyId: environment.CompanyId,
            Language: this.translate.currentLang,
        }
        return this._http.post<any>(environment.CompanyAPIURL + '/Holiday/GetHolidays', request);
    }
}
