import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(private http: HttpClient) { }

  getSampleData() {
    return this.http.get('./assets/dummy-json/bio-security-device-list.json')
  }
}
