import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';

@Injectable({
  providedIn: 'root'
})
export class ShareappointmentService {

  private apiEndPoint = environment.apiEndPoint;
  constructor(private _http: HttpClient,
    private scriptService: ScriptService,
    private translate: TranslateService,
    private authenticationService: AccountService) { }
    
  visitor:any[]=[];
    contactData:any[]=[];
    locationId:number;

  getISDCodes() {
    var codesRequestObject = {
      "Language": this.translate.currentLang,
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Master/GetAllIsdCodes', codesRequestObject);
  }

  sendInvite(contact: any[]) {

    var currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);

    this.locationId = Number(currentLocation.LocationId);

    for (let i = 0; i < contact.length; i++) 
    {
      var data = contact[i].split(")"); 

      if (data.length > 1) {
        this.visitor.push({ "IsdCode": data[0].replace("(", ""), "Mobile": data[1].trim() });
      }
      else {
        this.visitor.push({ "Email": data[0] });
      }

    }

    var sendInvitationRequest = {
        UserId: this.authenticationService.currentUserValue.UserId,
        CompanyId: environment.CompanyId,
        Language: this.translate.currentLang,
        Visitors:this.visitor,
        LocationId:this.locationId
    }
    return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/SendAppointmentInvitation', sendInvitationRequest);
  }

  getAppointmentInvitiationDetails(invitationId: any) {
    return this._http.get<any>(environment.CompanyAPIURL + 'AppointmentInvitation/GetAppointmentInvitation', {
      params: {
        invitationId: invitationId
      }
    });
  }
}
