import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HsqService {

  private apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient,
    private scriptService: ScriptService,
    private translate: TranslateService,
    private authenticationService: AccountService) { }

  generateQRCode(locationId: string) {
    var request = {
      LocationId: locationId,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Location/GenerateQRCodeHSQWalkin', request);
  }

  getQuestions(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/GetQuestionaire', reqBody)
      .pipe(map(data => {
        return data;
      }));
  }
  saveQuestions(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/SaveHSQAsync', reqBody)
      .pipe(map(data => {
        return data;
      }));
  }

  getWalkinQuestions(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/GetWalkInQuestionaire', reqBody)
      .pipe(map(data => {
        return data;
      }));
  }

  saveWalkinQuestions(reqBody) {
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/SaveWalkInHSQAsync', reqBody)
      .pipe(map(data => {
        return data;
      }));
  }


}
