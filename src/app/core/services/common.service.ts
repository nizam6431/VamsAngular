import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { EventEmitter, Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { first, map } from "rxjs/operators";
import { CommonTabService } from "src/app/feature/master/services/common-tab.service";
import { environment } from "../../../environments/environment";
import { ErrorsService } from "../handlers/errorHandler";
import { AccountService } from "./account.service";
import { DashboardService } from "./dashboard.service";
import { ScriptService } from "./script.service";
import { ThemeService } from "./theme.service";
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { AppEvent } from "src/app/feature/master/models/complex-details";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  private restApi;
  LocationUpdatedEmitter: EventEmitter<number> = new EventEmitter<number>();
  countries = [];
  countryMap: any = new Map();
  private apiEndPoint = environment.apiEndPoint;
  complexContactIsd = null;
  title = new BehaviorSubject('Dashboard');
  private eventBrocker = new Subject<AppEvent<any>>();

  constructor(
    private _http: HttpClient,
    private dashboardService: DashboardService,
    private scriptService: ScriptService,
    private errorService: ErrorsService,
    private authenticationService: AccountService,
    private themeService: ThemeService,
    private commonTabService: CommonTabService,
    @Inject(API_CONFIG) private endPoints: any) {
      this.restApi = endPoints;
    }

  emitUpdatedLocation(locationId: number) {
    this.LocationUpdatedEmitter.emit(locationId);
  }

  getLanguages(api_Url: string, companyId: number) {
    return this._http.post<any>(
      api_Url + "CompanySetting/RetrieveLanguageList/" + companyId,
      null
    );
  }

  // getPermissions() {
  //   return new Promise((resolve) => {
  //     var permissions: any[] = [];
  //     var locationId: number = JSON.parse(localStorage.getItem("currentLocation")!).LocationId;
  //     var locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]");
  //     this.dbService.getByKey('LocationPermissions',
  //       locationId)
  //       .subscribe((indexDbData: any) => {
  // if (indexDbData == undefined) {
  //   var locationDetails = locations.find((element: any) => {
  //     return element.LocationId == locationId;
  //   });
  //   this.dashboardService.getPermissionByUserLocation(locationId,
  //     this.authenticationService.currentUserValue.UserId,
  //     locationDetails.GroupName,
  //     locationDetails.Persona, locationDetails.LocationGroupMasterId)
  //     .pipe(first())
  //     .subscribe(
  //       (dbData: any) => {
  //         permissions = [];
  //         dbData.Data.forEach((element: any) => {
  //           permissions.push(element);
  //         });
  //         resolve(permissions);
  //       });
  // }
  // else {
  //   permissions = [];
  //   var permissionDetails = JSON.parse(indexDbData.Permissions);
  //   permissionDetails.Data.forEach((element: any) => {
  //     permissions.push(element);
  //   });
  //   resolve(permissions);
  // }

  //       }, (error: any) => {
  //         this.errorService.handleError(error);
  //         resolve(null);
  //       });
  //   });
  // }

  getTimezone(date: Date, timeZoneName: string) {
    var requestDetails = {
      TimeZoneName: timeZoneName,
      DateTime: formatDate(date, "YYYY-MM-dd HH:mm:ss", "en"),
    };
    return this._http.post<any>(
      environment.CompanyAPIURL + "Master/ReturnDateTimeOffsetTime",
      requestDetails
    );
  }

  getAllCountries() {
    this.commonTabService
      .getCounrty()
      .pipe(first())
      .subscribe(
        (response) => {
          if (response["statusCode"] === 200 && response["errors"] == null) {
            let countries = response["data"];
            this.setCountryData(countries);
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
            });
          }
        }
      );
  }

  setCountryData(countryData) {
    this.countries = countryData;
    this.countries.forEach((element) => {
      this.countryMap.set(element.isdCode, element);
    });
  }

  setTitle(title: string) {
    this.title.next(title);
  }

  setComplexContact(isd) {
    this.complexContactIsd = isd;
  }

  getComplexContact() {
    return this.complexContactIsd;
  }

  getCountryData(isdCode) {
    return this.countryMap.has(Number(isdCode))
      ? this.countryMap.get(Number(isdCode))
      : null;
  }

  getLogo() {
    // if (this.themeService.currentThemeValue.indexOf("dark") > -1) {
    //   return environment.CompanyAPIURL + 'CompanyData/' + environment.CompanyId + '/LogoInverse.png';
    // }
    // return environment.CompanyAPIURL + 'CompanyData/' + environment.CompanyId + '/Logo.png';
    // return "assets/images/vams-logo.jpg";
    return environment && environment.defaultLogoUrl?(environment.defaultLogoUrl):"assets/images/vams-logo.jpg";
  }

  //   loadCompanyData(companyCode: string) {
  //     var thisObj = this;
  //     var companyData = this.dbService.getByKey('CompanyData', companyCode).subscribe((key: any) => {
  //       if (key != undefined) {
  //         environment.CompanyAPIURL = key.API_URL;
  //         environment.CompanyId = key.CompanyId;
  //         environment.CompanyCode = key.CompanyCode;
  //       }
  //       if (key == undefined) {
  //         var scriptUrl = environment.apiEndPoint + "CompanyData/" + companyCode + "/configuration.js";
  //         this.scriptService.loadScript(scriptUrl, 'company-data-config',
  //           function () {
  //             environment.CompanyAPIURL = (<any>window).API_URL;
  //             environment.CompanyId = (<any>window).Company_Id;
  //             environment.CompanyCode = (<any>window).CompanyCode;
  //             thisObj.dbService.add('CompanyData',
  //               {
  //                 CompanyCode: (<any>window).CompanyCode,
  //                 CompanyId: (<any>window).Company_Id,
  //                 API_URL: (<any>window).API_URL
  //               })
  //               .subscribe((key) => {
  //                 let scriptLink = document.getElementById(
  //                   'company-data-config'
  //                 ) as HTMLScriptElement;
  //                 scriptLink.remove();
  //               });
  //           });
  //       }
  //     });
  //   }

  getVisitorSettings(level2Id: number){
    let getVisitorDetails = {
      level2Id: level2Id
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_VISITOR_SETTING}`, getVisitorDetails)
      .pipe(map(data => {
        return data;
    }));
  }

  getCurrentTimeByZone(timezone:string){
    let getTimeZoneObj = {
      timezone :  timezone
    }
    return this._http.post<any>(`${environment.CompanyAPIURL}${this.restApi.GET_CURRENT_TYPE_BY_ZONE}`, getTimeZoneObj)
    .pipe(map(data => {
      return data;
  }));
  }


  //For sending event on logo changed
  on(eventType): Observable<AppEvent<any>> {
    return this.eventBrocker.pipe();
  }

  dispatch<T>(event: AppEvent<T>): void {
    this.eventBrocker.next(event);
  }
}
