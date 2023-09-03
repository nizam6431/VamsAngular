import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  async getSampleData() {
    return await this.http.get('./assets/dummy-json/appointment.json');
  }
  getTestData(){
    return this.http.get('./assets/dummy-json/checkIn.json');
  }
  getCheckOutSampleData(){
    return this.http.get('./assets/dummy-json/checkout.json');
  }
  getSampleDataForReAuth(){
    return this.http.get('./assets/dummy-json/reauthenticate.json');
  }

  async getSampleFormConfigData() {
    return await this.http.get('./assets/dummy-json/appointment_form_config.json')
  }
  getReasons() {
    return this.http.get('./assets/dummy-json/cancel-reason.json')
  }
}