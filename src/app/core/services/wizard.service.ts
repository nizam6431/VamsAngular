import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WizardService {


  constructor(private _http: HttpClient,
    private translate: TranslateService,
    private authenticationService: AccountService,
  ) { }

  getCompanyDetails() {
    var payLoad = {
      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      PremiseId: environment.PremiseId
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'CompanyMaster/GetCompanyDataForWizard', payLoad);
  }

  getPurposeDetails() {
    var payLoad = {
      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      LocationId: localStorage.getItem('locationId') ,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Purpose/GetPurposesForWizard', payLoad);
  }

  getPurposeMaster() {
    var payLoad = {
      Language: this.translate.currentLang,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'PurposeMaster/GetPurposeMaster', payLoad);
  }

  getHSQDetails() {
    var payLoad = {
      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      LocationId:  localStorage.getItem('locationId') ,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/GetHSQForWizard', payLoad);
  }

  getHoliday() {
    var payLoad = {
      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      LocationId:  localStorage.getItem('locationId') ,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Holiday/GetHolidays', payLoad);  }


  getHSQMaster() {
    var payLoad = {
      PersonaId: 1,
      Language: this.translate.currentLang,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Master/GetHSQMasters', payLoad);
  }

  getLocation() {
    var payLoad = {
      CompanyId: environment.CompanyId,
      Language: this.translate.currentLang,
      LocationId:  localStorage.getItem('locationId') ,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Location/GetLocation', payLoad);
  }

  getLanguages(companyId: number) {
    return this._http.post<any>(environment.CompanyAPIURL + 'CompanySetting/RetrieveLanguageList/' + companyId, null);
  }

  getAllCountry() {
    var payLoad = {
      IsDefaultRequire: true,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'CountryMaster/GetCountryList', payLoad);
  }

  SavePurpose(PurposeOfVisit: any) {
    var payLoad = {
      CompanyId: environment.CompanyId,
      LocationId:  localStorage.getItem('locationId') ,
      Language: this.translate.currentLang,
      listPurpose: _.map(PurposeOfVisit, l => _.omit(l, 'CompanyId', 'LocationId', 'PurposeId')
      )
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Purpose/SavePurpose', payLoad);
  }

  SaveHSQData(hsqDto: any) {
    // let flag = Array.isArray(hsqDto);
    // var payLoad = {};
    // if (flag) {
    var  payLoad = {
        CompanyId: environment.CompanyId,
        LocationId:  localStorage.getItem('locationId') ,
        Language: this.translate.currentLang,
        listHSQ: _.map(hsqDto, h => _.omit(h, 'HSQMasterId'))
      }
    // } else {
    //   payLoad = {
    //     CompanyId: environment.CompanyId,
    //     LocationId: 18,
    //     Language: this.translate.currentLang,
    //     listHSQ: [{
    //       Language: hsqDto.language,
    //       PersonaId: hsqDto.persona,
    //       Question: hsqDto.question,
    //       Answer: hsqDto.answer,
    //       Deleted: false
    //     }]

    //   }
    //}
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/SaveHSQ', payLoad);
  }

  UpdateLocationFromBusiness(payload: any) {
    return this._http.post<any>(environment.CompanyAPIURL + 'Location/UpdateLocation', payload);
  }

  SaveHolidayForm(value: any) {
    var payLoad = {
      CompanyId: environment.CompanyId,
      LocationId:  localStorage.getItem('locationId') ,
      Name: value.holiday,
      HolidayDate: value.date,
      Deleted: true,
      ModifiedBy: 1,
      // ModifiedDate": "2021-03-24T06:26:05.484Z",
      // ModifiedDateUtc": "2021-03-24T06:26:05.484Z",
      Language:  this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Holiday/SaveHoliday', payLoad);

  }

  DeletePurpose(purpose: any) {
    var payload = {
      Lanuguage: purpose.Language,
      PurposeId: purpose.PurposeId
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Purpose/DeletePurpose', payload);
  }

  DeleteHSQ(hsq: any) {
    var payload = {
      HSQId: hsq.HSQId,
      Language: hsq.Language
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'HSQ/DeleteHSQ', payload);
  }

  DeleteHoliday(holiday: any) {
    var payload = {
      HolidayId: holiday.HolidayId,
      Language: holiday.Language
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Holiday/DeleteHoliday', payload);  }


  updateCompany(companyName: any, companyShortName: any, appColor: any, appDarkThemecolor: any, uploadLogo: any, uploadReversLogo: any) {
    var payload = {
      CompanyData: {
        UserId: this.authenticationService.currentUserValue.UserId,
        CompanyId: environment.CompanyId,
        Name: companyName,
        PremiseId: environment.PremiseId,
        ShortName: companyShortName,
        DarkColor: appDarkThemecolor,
        LightColor: appColor,
        ModifiedBy: this.authenticationService.currentUserValue.UserId,
        IsCompanySetup: true
      },
      Logo: uploadLogo,
      LogoInverse: uploadReversLogo,
      Language: this.translate.currentLang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'CompanyMaster/UpdateCompanyData', payload);
  }

  updateDefaultSetting(obj: any, language: any, isdCode: any, timeZone: any, dateFormat: any, timeFormat: any) {
    obj.Language = language,
      obj.IsdCode = isdCode,
      obj.Timezone = timeZone,
      obj.DateFormat = dateFormat,
      obj.TimeFormat = timeFormat
    delete obj.MapLink;
    return this._http.post<any>(environment.CompanyAPIURL + 'Location/UpdateLocation', obj);
  }


  SaveLocation(locationName: any, shortName: any, address1: any, address2: any,
    city: any, pincode: any, country: any, state: any) {
    var payload = {
      LocationName: locationName,
      LocationShortName: shortName,
      Address1: address1,
      Address2: address2,
      City: city,
      State: state,
      Country: country,
      Pincode: pincode,
      CompanyId: environment.CompanyId
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Location/SaveLocation', payload);
  }

  getTimeZone(lang: string, CountryId: any) {
    var payload = {
      CountryId: CountryId,
      Language: lang
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Master/GetTimeZone', payload);
  }

}

