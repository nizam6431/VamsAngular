import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/core/services/user.service";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  userDetails: any;
  visitorSettings:any;
  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UserService,
    private commonService: CommonService,
  ) { 
    this.translateService.get(['grid_side_menu.daily_pass'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['grid_side_menu.daily_pass'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserData();
    this.getDetails();
  }

  getDetails() { console.log('yes')
    if (this.userDetails && this.userDetails?.level2List && this.userDetails?.level2List.length > 0) {
      let locationId = this.userDetails?.level2List?.find(location => location.isDefault == true);
      if (locationId) {
        this.getVisitorSettings(locationId.id);
      } else {
        this.toastr.error(this.translate.instant('pop_up_messages.defalut_location_not_found'));
      }
    }
    else if (this.userDetails && this.userDetails?.level1Id) {
      this.getVisitorSettings(null);
    }
  }
  getVisitorSettings(locationId) {
    this.commonService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.visitorSettings = response.data; console.log(this.visitorSettings) 
        //this.sendNDA = response?.data?.sendNDA;
        // if( response.data.sendNDA == true ){
        //   this.sendNDA = 1; console.log(this.sendNDA)
        // }else{
        //   this.sendNDA = 0; console.log(this.sendNDA)
        // }
        // this.dateFormat = response.data.dateFormat || "dd-MM-yyyy";
        // this.dateFormatWithTimeFormat = (response.data.timeformat == 12) ? (this.dateFormat.toUpperCase() + " HH:MM A") : (this.dateFormat.toUpperCase() + " HH:MM");
        // let currentTimeZone = response?.data?.timeZone;
        // this.activateDLScanScheduledAppointment = response?.data?.activateDLScanScheduledAppointment;
        // this.isAccessControlEnabled = response?.data?.isAccessControlEnabled;
        // this.getCurrentTimeZone(currentTimeZone);
        // this.appointmentService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
      } else {
        this.toastr.error(response.message);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
  }

}
