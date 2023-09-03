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
export class ProviderService {
  private restApi;
  constructor(private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) { 
    this.restApi = endPoints;
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
  getProviderList(obj): Observable<any> {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_PROVIDERS, obj)
      .pipe(map(data => {
        return data;
      }));
  }
  getProviderById(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_BYID_PROVIDERS, obj)
      .pipe(map(data => {
        return data;
      }));
  }

  updateProvider(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_PROVIDERS, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addProvider(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_PROVIDERS,obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteProvider(id) {
    let obj = {
      id:id
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_PROVIDERS, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getProviderServer(obj){
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.PROVIDER_SERVER_NAME,obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // DEVICE SETUP API'S
  addNewDeviceSetup(obj) {
     return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_DEVICE_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateDeviceSetup(obj) {
     return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_DEVICE_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteDeviceSetup(obj) {
     return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_DEVICE_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllDeviceSetup(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_DEVICE_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  // Access Setup Api's
  addNewAccessSetup(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ADD_ACCESS_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  updateAccessSetup(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.UPDATE_ACCESS_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  deleteAccessSetup(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.DELETE_ACCESS_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAllAccessSetup(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ALL_ACCESS_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAccessLevelList(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_ACCESS_LEVEL_LIST, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getDeviceUniqueId(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.GET_DEVICE_UNIQUE_ID, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
  getAccessLevelById(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.ACCESS_SETUP_BY_ID, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  } 
  getCardTypeAccess(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.PROVIDER_SETUP_CRADTYPES, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
checkAlreadyDeviceActive(obj) {
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.IS_ACTIVE_PROVIDER_SETUP, obj).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
