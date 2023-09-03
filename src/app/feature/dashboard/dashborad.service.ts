import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashBoradSerivce {
  restApi: any;
  public refreshTime: Subject<boolean> = new Subject<boolean>();
  constructor(private userService: UserService, private http: HttpClient, @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  refreshApi(){
    this.refreshTime.next(true)
  }

  heapMapService(type) {
    var body = {
      "type": type
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.HEAP_MAP_DATA}`, body)
      .pipe(map(data => {
        return data;
      }));
  }

  barChartService(type) {
    var body = {
      "type": type
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.BAR_GRAPH_DATA}`, body)
      .pipe(map(data => {
        return data;
      }));
  }

  pieChartService(type) {
    var body = {
      "type": type
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.PIE_CHART_DATA}`, body)
      .pipe(map(data => {
        return data;
      }));
  }
  
  getVisitorCount(type) {
    var body = {
      "type": type
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VISITOR_COUNT_DATA}`, body)
      .pipe(map(data => {
        return data;
      }));
  }

  pieChartServiceEnterprise(type,locationId) {
    var body = {
      "reportFor": type,
      "startDate": null,
      "endDate": null,
      "level2Ids": locationId ? locationId : [null],
      "isTopTen": true
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.PIE_CHART_DATA_ENTERPRISE}`, body)
      .pipe(map(data => {
        return data;
      }));
  }
  barChartServiceEnterprise(type,locationId) {
    var body = {
      "reportFor": type,
      "startDate": null,
      "endDate": null,
      "level2Ids": locationId ? locationId : [null],
      "isTopTen": true
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.BAR_GRAPH_DATA_ENTERPRISE}`, body)
      .pipe(map(data => {
        return data;
      }));
  }
  heapMapServiceEnterprise(type,locationId) {
    var body = {
      "reportFor": type,
      "startDate": null,
      "endDate": null,
      "level2Ids": locationId ? locationId : [null],
      "isTopTen": true
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.HEAP_MAP_DATA_Enterprise}`, body)
      .pipe(map(data => {
        return data;
      }));
  }
  getVisitorCountEnterprise(type,locationId) {
    var body = {
      "reportFor": type,
      "startDate": null,
      "endDate": null,
      "level2Ids": locationId ? locationId : [null],
      "isTopTen": true
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VISITOR_COUNT_DATA_ENTERPRISE}`, body)
      .pipe(map(data => {
        return data;
      }));
  }
  getVisitorHoursWiseCount(type,locationId) {
    var body = {
      "reportFor": type,
      "startDate": null,
      "endDate": null,
      "level2Ids": locationId,
      "isTopTen": true
    }
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.VISITOR_HOURS_COUNT_DATA_ENTERPRISE}`, body)
      .pipe(map(data => {
        return data;
      }));
  }

  // walkinVisitorCheckInCount(body) {
  //   return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.WALKIN_VISITOR_CHECKIN_COUNT}`, body)
  //     .pipe(map(data => {
  //       return data;
  //     }));
  // }
  barChartWalkinCheckinCheckout() {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.BAR_CHART_WALKING_DAILYPASS_CHECKIN_CHECKOUT}`, {})
      .pipe(map(data => {
        return data;
      }));
  }
  barChartWalkinPermanentPassCheckinCheckout() {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.BAR_CHART_WALKING_PERMANENT_PASS_CHECKIN_CHECKOUT}`, {})
      .pipe(map(data => {
        return data;
      }));
  }
  walkingVisitorCheckinCount() {
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.WALKIN_VISITOR_CHECKIN_COUNTS}`, {})
      .pipe(map(data => {
        return data;
      }));
  }
}
