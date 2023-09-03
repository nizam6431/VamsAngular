import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SettingServices } from '../../services/setting.service';

@Component({
  selector: 'app-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.scss']
})
export class NotificationSettingComponent implements OnInit {
  @Input() notificationData;
  @Input () notifcationAction;
  subscribe: Subscription;
  selectAllValue: boolean;
  notificationForm: FormGroup;
  addNottification: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private settingServices: SettingServices,
    private toastr:ToastrService,
    private translate:TranslateService
  ) {
    this.formNotification()
  }
  ngOnInit(): void {
    this.getNoticationDetail();
  }
  ngOnChanges(changes: SimpleChanges): void {
      if (this.notificationData && this.addNottification){
        if (this.notifcationAction=='update') {
          this.addNotification();
        } else {
          this.getNoticationDetail();
        }
      }
  }
  formNotification() {
    this.notificationForm = this.formBuilder.group({
      "visitorAlert": [false, Validators.required],
      "checkInNotification": [false, Validators.required],
      "checkOutNotification": [false, Validators.required],
    })

  }
  selectAll() {
    if (this.selectAllValue) {
      this.notificationForm.controls.visitorAlert.reset(true)
      this.notificationForm.controls.checkInNotification.reset(true)
      this.notificationForm.controls.checkOutNotification.reset(true)
    } else {
      this.notificationForm.controls.visitorAlert.reset(false)
      this.notificationForm.controls.checkInNotification.reset(false)
      this.notificationForm.controls.checkOutNotification.reset(false)
    }
  }

  selectAllOrDeseelectAll(){
    if(this.notificationForm.value.visitorAlert &&this.notificationForm.value.checkInNotification &&this.notificationForm.value.checkOutNotification ){
      this.selectAllValue=true;
    }else{
      this.selectAllValue=false;
    }
  }

  getNoticationDetail() {
    this.subscribe = this.settingServices.getNotificationData({}).subscribe((data:any) => {
      this.notificationForm.controls.visitorAlert.reset(data?.data.isVisitorGreeting)
      this.notificationForm.controls.checkInNotification.reset(data?.data.isCINotification)
      this.notificationForm.controls.checkOutNotification.reset(data?.data.isCoNotification)
      this.addNottification=true;
      this.selectAllOrDeseelectAll();
    })
  }

  addNotification() {
    this.subscribe = this.settingServices.updateNotificationSetting(this.updateNotificationData()).subscribe(data => {
      if(data.statusCode == 200 && data.errors === null){
        this.getNoticationDetail();
        this.toastr.success(data.message,this.translate.instant("pop_up_messages.success"))
      }
    },(error)=>{
      if(error && error.error && error.error.Message)
      this.toastr.error(error.error.Message,this.translate.instant("pop_up_messages.error"))
    if(error && error.error && error.error.message)          
      this.toastr.error(error.error.message,this.translate.instant("pop_up_messages.error"))
  });

  }

  updateNotificationData() {
    return {
      "isVisitorGreeting": this.notificationForm.value.visitorAlert,
      "isCINotification": this.notificationForm.value.checkInNotification,
      "isCoNotification": this.notificationForm.value.checkOutNotification,
    }
  }
}
