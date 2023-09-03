import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { AddEmailConfig, UpdateEmailConfig } from '../models/config-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigureService {
  private restApi;
  providerDetails: any;
  selectedLocation: string;
  constructor(
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  getMailServerList(getMailServer): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_MAILSERVER, getMailServer)
      .pipe(map(data => {
        return data;
      }));
  }

  getMailServerById(getMailServerById) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_MAILSERVER_BY_ID, getMailServerById)
      .pipe(map(data => {
        return data;
      }));
  }

  updateMailServer(updateEmailConfig: UpdateEmailConfig) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_MAILSERVER, updateEmailConfig).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addMailServer(addEmailConfig: AddEmailConfig) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_MAILSERVER, addEmailConfig).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getBuildingList() {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_BUILDING_LIST, {}).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteMailServer(id) {
    let deleteMailServer = {
      "mailServerId": id
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_MAILSERVER, deleteMailServer).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getCancelAppointmentReason(getappointmentReason) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.REJECT_REASON}`, getappointmentReason)
      .pipe(map(data => {
        return data;
      }));
  }

  addAppointmentCancelReason(addReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_APPOINTMENT_CANCEL_REASON}`, addReqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  updateAppointmentCancelReason(editReqObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_APPOINTMENT_CANCEL_REASON}`, editReqObj)
      .pipe(map(data => {
        return data;
      }));
  }
  deleteAppointmentCancelReason(deleteObj) {
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_APPOINTMENT_CANCEL_REASON}`, deleteObj)
      .pipe(map(data => {
        return data;
      }));
  }
  uploadPdf(pdfUrl: string, DocType: string) {
    let obj = {
      "Level2Id": null,
      "DocURL": pdfUrl,
      "DocType": DocType
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_PDF_URL, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
    // return {errors:null,status:200};
  }
  getPdfUrl(DocType: string, level2Id) {
    let obj = {
      "DocType": DocType,
      "Level2Id": level2Id
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_PDF_URL, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getVisitorPdfUrl(docType: string, level2Id, subDomain: string) {
    let obj = {
      "DocType": docType,
      "Level2Id": level2Id,
      "SubDomain": subDomain
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_VISITOR_PDF, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updatePdfUrl(pdfUrl: string, DocType: string, id) {
    let obj = {
      "id": id,
      "level2Id": null,
      "docURL": pdfUrl,
      "docType": DocType
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_PDF_URL, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // getAccessLevels(deviceId) {
  //   let endpoint = 'https://omnitrack.info/VAMSDeviceIntegration/api/';
  //   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_ACCESS_LEVELS}`, { deviceId: deviceId })
  //     .pipe(map(data => {
  //       return data;
  //     }));
  // }
  updatePrivaycPolicy(empId: number) {
    let obj =
    {
      "employeeId": empId,
      "isPrivacyAccept": true
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_PRIVACY_POLICY, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateTermsConditions(empId: number) {
    let obj =
    {
      "employeeId": empId,
      "isTermsAccept": true
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_TERMS_CONDITIONS, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getDefaultBannerImage() {
    let obj =
    {
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_DEFAULT_BANNER_IMAGE, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateBannerImage(url: string) {
    let obj =
    {
      bannerImageURL: url
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_BANNER_IMAGE, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  hsqQuestionList(hsqObj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ALL_HSQ_QUESTION, hsqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  addHsqQuestion(hsqObj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_HSQ_QUESTION, hsqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  updateHsqQuestion(hsqObj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_HSQ_QUESTION, hsqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  deleteHsqQuestion(hsqObj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_HSQ_QUESTION, hsqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  addHsqQuestionsForLocation(hsqObj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SAVE_DEFAULT_HSQ, hsqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  getPermissions() {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.COMPLEX_ALL_PERMISSION, {})
      .pipe(map(data => {
        return data;
      }));
  } ROLES_OF_COMPLEX

  getComplexRoles() {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ROLES_OF_COMPLEX, {})
      .pipe(map(data => {
        return data;
      }));
  }

  updatePermissions(reqObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_PERMISSION, reqObj)
      .pipe(map(data => {
        return data;
      }));
  }

  getProviderMasterList(): Observable<any> {
    let obj = {
      "pageSize": 20,
      "pageIndex": 1,
      "orderBy": "",
      "orderDirection": "ASC"
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.PROVIDER_MASTER, obj)
      .pipe(map(data => {
        return data;
      }));
  }

  //set the selected location
  setLocation(event) {
    this.selectedLocation = event;
  }

  //get location
  getLocation() {
    return this.selectedLocation ? this.selectedLocation : null;
  }

  getAllEmailTemplates(getAllEmailTemplateObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_EMAIL_TEMPLATES, getAllEmailTemplateObj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getEmailTemplateBYId(getEmailTemplateBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_EMAIL_TEMPLATE_BY_ID, getEmailTemplateBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateEmailTemplateBYId(updateEmailTemplateBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_TEMPLATE_BY_ID, updateEmailTemplateBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllSmsTemplates(getAllSmsTemplateObj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_SMS_TEMPLATES, getAllSmsTemplateObj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getSmsTemplateBYId(getSmsTemplateBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_SMS_TEMPLATE_BY_ID, getSmsTemplateBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateSmsTemplateBYId(updateSmsTemplateBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_SMS_TEMPLATE_BY_ID, updateSmsTemplateBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


  getAllContractorConfig(getAllContractorConfig) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_CONTRACTOR_CONFIG_FIELD, getAllContractorConfig).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getContractorConfigBYId(getContractorConfigBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_CONTRACTOR_CONFIG_FIELD_BY_ID, getContractorConfigBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateContractorConfigBYId(updateContractorConfigBYId) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_CONTRACTOR_CONFIG_FIELD_BY_ID, updateContractorConfigBYId).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addContractorConfig(addContractorConfig) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_CONTRACTOR_CONFIG, addContractorConfig).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteContractorConfig(deleteContractorConfig) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_CONTRACTOR_CONFIG, deleteContractorConfig).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
 getAllRateCard(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.RATE_CARD, obj).pipe(
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
  addNewRateCard(obj) {
   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.ADD_RATE_CARD}`, obj)
      .pipe(map(data => {
        return data;
      }))
  }
  deleteRateCard(obj) {
   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.DELETE_RATE_CARD}`, obj)
      .pipe(map(data => {
        return data;
      }))
  }
  updateRateCard(obj) {
   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.UPDATE_RATE_CARD}`, obj)
      .pipe(map(data => {
        return data;
      }))
}
  
   getPassValidity(obj) {
   return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VALIDITY}`, obj)
      .pipe(map(data => {
        return data;
      }))
}
}