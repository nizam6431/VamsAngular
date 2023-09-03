import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AccountService } from './account.service';
import { ScriptService } from './script.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    private apiEndPoint = environment.apiEndPoint;
    constructor(private _http: HttpClient,
        private scriptService: ScriptService,
        private translate: TranslateService,
        //private authenticationService: AccountService,
) {
    }

    getDefaultValuesForLocation(locationId: any) {
        var locationDetails = {
            LocationId: locationId,
            CompanyId: environment.CompanyId,
            Language: this.translate.currentLang,
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Location/GetDefaultValuesForLocation', locationDetails);
    }

    getPermissionByUserLocation(locationId: any, userid: any, groupName: any, persona: any, locationGroupMasterId: any) {
        var permissions = {
            LocationId: locationId,
            Persona: persona,
            UserId: userid,
            GroupName: groupName,
            Language: this.translate.currentLang,
            LocationGroupMasterId: locationGroupMasterId
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'User/GetPermissionByUserLocation', permissions);
    }

    getLocations(userId: number) {
        var userLocations = {
            "UserId": userId,
            "Language": this.translate.currentLang,
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'User/GetUserLocations', userLocations);
    }

    getAppointments(locationId: number, startTime: any, endTime: any,
        searchKeywords: string, hostDetails: any,
        status: string[], pageNumber: number = 1, pageSize: number = 10) {

        var userLocations = {
            "Language": this.translate.currentLang,
            "FCMId": "",
            "RequestFromWeb": true,
            "Filter":
            {
                "CompanyId": environment.CompanyId,
                "LocationId": locationId,
                "StartTimeUtc": startTime,
                "EndTimeUtc": endTime,
                "PageNumber": pageNumber,
                "PageSize": pageSize,
                "Visitors":
                    [{
                        "FirstName": searchKeywords,
                        "LastName": searchKeywords,
                        "Email": searchKeywords,
                        "PurposeOfVisit": searchKeywords
                    }],
                "Hosts": hostDetails,
                "Status": status
            }
        }

        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetAppointments', userLocations);
    }

    checkout(userId: number, visitorId: number, location: string, notificationType: number) {
        var checkoutDetails = {
            "VisitorId": visitorId,
            "CheckOutBy": userId,
            "CheckOutAt": location,
            "Language": this.translate.currentLang,
            "NotificationType": notificationType
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Visitor/Checkout', checkoutDetails);
    }

    cancel(visitorId: number, rejectReason: string, notificationType: number) {
        var cancelDetails = {
            "VisitorId": visitorId,
            "Language": this.translate.currentLang,
            "RejectReason": rejectReason,
            "NotificationType": notificationType
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/Cancel', cancelDetails);
    }

    getISDCodes() {
        var codesRequestObject = {
            "Language": this.translate.currentLang,
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Master/GetAllIsdCodes', codesRequestObject);
    }

    getRegisteredUser(locationId: number, email: string, isdCode: string, mobile: string) {
        var searchVisitors = {
            "Email": email,
            "IsdCode": isdCode == null ? '' : isdCode,
            "Mobile": mobile,
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Register/SearchVisitorSchedule', searchVisitors);
    }


    getPurposeOfVisits(locationId: number) {
        var purposeRequest = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Purpose/GetPurposes', purposeRequest);
    }

    scheduleAppointment(notificationType: number, firstName: string, lastName: string, isdCode: string, phonenumber: string,
        email: string, purposeOfVisit: string, appointmentDate: string, appointmentFromTime: string,
        appointmentEndTime: string, appointmentStartTimeUtc: any, appointmentEndTimeUtc: any,
        company: string, meetingNotes: string | null, locationId: number, ipAddress: string, persona: string,
        addtoFavorite: boolean, isWalkin: boolean = false, hostId: number | null = null,
        hostFirstName: string | null = null, hostLastName: string | null = null, hostEmail: string | null = null,
        hostIsdCode: string | null = null, hostMobile: string | null = null,
        hostCompany: string | null = null, isShared: boolean = false) {
        
        var details =
        {
            "NotificationType": notificationType,
            "Language": this.translate.currentLang,
            "AppointmentDate": appointmentDate,
            "StartTime": appointmentFromTime,
            "EndTime": appointmentEndTime,
            "AppointmentStartTimeUtc": appointmentStartTimeUtc,
            "AppointmentEndTimeUtc": appointmentEndTimeUtc,
            "Status": "Scheduled",
            "PurposeOfVisit": purposeOfVisit,
            "IP": ipAddress,
            "AppointmentDevice": "WEB",
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,

            // "HostId": hostId == null ? this.authenticationService.currentUserValue.UserId : hostId,
            // "HostFirstName": hostFirstName == null ? this.authenticationService.currentUserValue.FirstName : hostFirstName,
            // "HostLastName": hostLastName == null ? this.authenticationService.currentUserValue.LastName : hostLastName,
            // "HostEmail": hostEmail == null ? this.authenticationService.currentUserValue.Email : hostEmail,
            // "HostIsdCode": hostIsdCode == null ? this.authenticationService.currentUserValue.IsdCode : hostIsdCode,
            // "HostMobile": hostMobile == null ? this.authenticationService.currentUserValue.CellNumber : hostMobile,
            // "HostCompany": hostCompany == null ? this.authenticationService.currentUserValue.CompanyShortName : hostCompany,

            "FirstName": firstName,
            "LastName": lastName,
            "Email": email,
            "IsdCode": isdCode,
            "Mobile": phonenumber,
            "Company": company,
            "MeetingChat": meetingNotes,
            "IsImportant": false,
            "Persona": persona,
            //"ModifiedFirstName": this.authenticationService.currentUserValue == null ? hostFirstName : this.authenticationService.currentUserValue.FirstName,
            //"ModifiedLastName": this.authenticationService.currentUserValue == null ? hostLastName : this.authenticationService.currentUserValue.LastName,
            "IsScheduled": !isWalkin,
            //"ModifiedBy": this.authenticationService.currentUserValue == null ? hostId : this.authenticationService.currentUserValue.UserId,
            "BypassMode": false,
            "IsFavourite": addtoFavorite,
            "IsWalkin": isWalkin,
            "IsShared": isShared,
            "Type": "Visitor"
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/Schedule', details);
    }

    shareScheduleAppointment(firstName: string, lastName: string, isdCode: string, phonenumber: string,
        email: string, purposeOfVisit: string, appointmentDate: string, appointmentFromTime: string,
        appointmentEndTime: string, appointmentStartTimeUtc: any, appointmentEndTimeUtc: any,
        company: string, meetingNotes: string | null, locationId: number, ipAddress: string, persona: string,
        addtoFavorite: boolean, isWalkin: boolean = false, hostId: number | null = null,
        hostFirstName: string | null = null, hostLastName: string | null = null, hostEmail: string | null = null,
        hostIsdCode: string | null = null, hostMobile: string | null = null,
        hostCompany: string | null = null, isShared: boolean = false, invitationId: any) {
        var details =
        {
            "Language": this.translate.currentLang,
            "AppointmentDate": appointmentDate,
            "StartTime": appointmentFromTime,
            "EndTime": appointmentEndTime,
            "AppointmentStartTimeUtc": appointmentStartTimeUtc,
            "AppointmentEndTimeUtc": appointmentEndTimeUtc,
            "Status": "Scheduled",
            "PurposeOfVisit": purposeOfVisit,
            "IP": ipAddress,
            "AppointmentDevice": "WEB",
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,

            // "HostId": hostId == null ? this.authenticationService.currentUserValue.UserId : hostId,
            // "HostFirstName": hostFirstName == null ? this.authenticationService.currentUserValue.FirstName : hostFirstName,
            // "HostLastName": hostLastName == null ? this.authenticationService.currentUserValue.LastName : hostLastName,
            // "HostEmail": hostEmail == null ? this.authenticationService.currentUserValue.Email : hostEmail,
            // "HostIsdCode": hostIsdCode == null ? this.authenticationService.currentUserValue.IsdCode : hostIsdCode,
            // "HostMobile": hostMobile == null ? this.authenticationService.currentUserValue.CellNumber : hostMobile,
            // "HostCompany": hostCompany == null ? this.authenticationService.currentUserValue.CompanyShortName : hostCompany,

            "FirstName": firstName,
            "LastName": lastName,
            "Email": email,
            "IsdCode": isdCode,
            "Mobile": phonenumber,
            "Company": company,
            "MeetingChat": meetingNotes,
            "IsImportant": false,
            "Persona": persona,
            // "ModifiedFirstName": this.authenticationService.currentUserValue == null ? hostFirstName : this.authenticationService.currentUserValue.FirstName,
            // "ModifiedLastName": this.authenticationService.currentUserValue == null ? hostLastName : this.authenticationService.currentUserValue.LastName,
            "IsScheduled": !isWalkin,
            // "ModifiedBy": this.authenticationService.currentUserValue == null ? hostId : this.authenticationService.currentUserValue.UserId,
            "BypassMode": false,
            "IsFavourite": addtoFavorite,
            "IsWalkin": isWalkin,
            "IsShareAppointment": true,
            "Type": "Visitor",
            "InvitationId": invitationId
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/ShareSchedule', details);
    }

    rescheduleAppointment(visitorId: number, appointmentId: number, purposeOfVisit: string, appointmentDate: string,
        appointmentFromTime: string, appointmentEndTime: string, appointmentStartTimeUtc: string,
        appointmentEndTimeUtc: string, meetingNotes: string, notificationType: number) {
        var details = {
            "NotificationType": notificationType,
            "AppointmentDate": appointmentDate,
            "AppointmentEndTimeUtc": appointmentEndTimeUtc,
            "AppointmentId": appointmentId,
            "AppointmentStartTimeUtc": appointmentStartTimeUtc,
            "BypassMode": false,
            "EndTime": appointmentEndTime,
            "IsScheduled": true,
            "MeetingChat": meetingNotes,
            "PurposeOfVisit": purposeOfVisit,
            "StartTime": appointmentFromTime,
            "Status": "Scheduled",
            "CompanyId": environment.CompanyId,
            "VisitorId": visitorId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/ReSchedule', details);
    }

    getAppointment(visitorId: number) {
        var request = {
            "CompanyId": environment.CompanyId,
            "VisitorId": visitorId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/GetAppointment', request);
    }

    getLocation(locationId: number) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Location/GetLocation', request);
    }

    validateOtp(locationId: number, authKey: string, isdCode: string, mobile: string, email: string) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang,
            "IsdCode": isdCode,
            "Mobile": mobile,
            "Email": email,
            "AuthKey": authKey
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Register/ValidateOTP', request);
    }


    resendOTP(locationId: number, isdCode: string, mobile: string, email: string) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang,
            "IsdCode": isdCode,
            "Mobile": mobile,
            "Email": email
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Register/ResendOTP', request);
    }

    validateBypassPin(pin: string, visitorId: number) {
        var request = {
            // "UserId": this.authenticationService.currentUserValue.UserId,
            "Pin": pin,
            "VisitorId": visitorId,
            "Language": this.translate.currentLang,
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Visitor/ValidateAppointmentWithPin', request);
    }

    checkIn(locationName: string, locationId: number, timezone: string, notificationType: number, visitorId: number,
        isBypass: boolean = false) {
        var request = {
            "NotificationType": notificationType,
            "VisitorId": visitorId,
            "AccessCardNo": "",
            // "CheckInBy": this.authenticationService.currentUserValue.UserId,
            "CheckInAt": locationName,
            "Temprature": "",
            "IsMask": "",
            "Language": this.translate.currentLang,
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "BypassMode": isBypass,
            "TimeZone": timezone
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Visitor/CheckIn', request);
    }

    uploadThumbnail(thumbnail: Uint8Array, visitorId: number) {
        // const formData = new FormData();
        // for (const prop in updateResourceDetails) {
        //     if (!updateResourceDetails.hasOwnProperty(prop)) { continue; }
        //     formData.append(prop, updateResourceDetails[prop]);
        // }

        var numbers = new Array();
        thumbnail.forEach(element => {
            var length = numbers.push(element);
        });

        var request = {
            "Photo": null,
            "Thumbnail": numbers,
            "VisitorId": visitorId,
            "Language": this.translate.currentLang
        }

        return this._http.post<any>(environment.CompanyAPIURL + 'Visitor/UploadCheckinPhoto', request);
    }

    GetBadge(printerType: any, visitorId: number) {
        var request = {
            "VisitorId": visitorId,
            "PrinterType": printerType,
            "PdfPageSize": "A6",
            "PdfPageOrientation": "Landscape",
            "WebPageWidth": 50,
            "WebPageHeight": 105,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/PrintBadge', request);
    }

    GetFileBadge(printerType: any, visitorId: number) {
        let headers = new HttpHeaders().set('Accept', 'application/octet-stream');
        var request = {
            "VisitorId": visitorId,
            "PrinterType": printerType,
            "PdfPageSize": "A4",
            "PdfPageOrientation": "Landscape",
            "WebPageWidth": 50,
            "WebPageHeight": 105,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Appointment/PrintBadgeFile', request, {
            headers: headers,
            responseType: 'blob' as 'json',
            observe: 'response'
        });
    }

    getRegisteredUserForWalkin(locationId: number, email: string, isdCode: string, mobile: string) {
        var searchVisitors = {
            "Email": email,
            "IsdCode": isdCode == null ? '' : isdCode,
            "Mobile": mobile,
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'Register/SearchVisitorWalkin', searchVisitors);
    }

    searchUser(locationId: number, searchText: any) {
        var request = {
            "CompanyId": environment.CompanyId,
            "LocationId": locationId,
            "Language": this.translate.currentLang,
            "SearchText": searchText
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'User/Search', request).pipe(
            map(response => response.Data)
        );;
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

}
