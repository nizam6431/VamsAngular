import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { SettingServices } from '../../services/setting.service';

@Component({
  selector: 'app-appointment-setting',
  templateUrl: './appointment-setting.component.html',
  styleUrls: ['./appointment-setting.component.scss']
})
export class AppointmentSettingComponent implements OnInit {
  appointmentType="appoinement_setting"
  appointmentSettingForm: FormGroup;
  subscribe: Subscription;
  @Input() appointmentData;
  @Input() actionAppointment;
  readonlyAppointment: boolean;
  ProductType = ProductTypes;
  productType: string;
  defalutArray= [{value:15,duration:"15"},{value:30,duration:"30"},{value:60,duration:"60"}]
  constructor(private formBuilder: FormBuilder,
    private settingServices: SettingServices,
    private toastr: ToastrService,
    private translate:TranslateService,
    private userService :UserService

  ) {
    this.formAppointment()
    this.productType = this.userService.getProductType();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.appointmentData   && this.appointmentSettingForm.valid &&  this.appointmentType=="appoinement_setting"){
      if (this.actionAppointment=='update') {
        this.updateAppointmentSetail()
      } else {
        this.getAppointmentDatil()
      }
    }
  }

  ngOnInit(): void {
    this.getAppointmentDatil()
  }
  formAppointment() {
    this.appointmentSettingForm = this.formBuilder.group({
      "maximumDuration": [1,[Validators.required, Validators.min(1), Validators.max(364)]],
      // "maximumVistor": [1, Validators.required],
      "minimumDuaration": [, Validators.required],
      // "timeSelectioninterval": ['15', Validators.required],
      "isMultipleDays": [false,],
      "activateDLScanScheduledAppointment":[true,],
      "walkinWithBioAuth":[true,],
      "isAccessControlEnabled":[true,]
    })
  }


  addMaxDuration() {
    if (this.appointmentSettingForm.value.maximumDuration < 365) {
      this.appointmentSettingForm.controls.maximumDuration.setValue(this.appointmentSettingForm.value.maximumDuration + 1)
    }
  }

  minusMaxDuration() {
    if (this.appointmentSettingForm.value.maximumDuration > 1) {
      this.appointmentSettingForm.controls.maximumDuration.setValue(this.appointmentSettingForm.value.maximumDuration - 1)
    }
  }

  getAppointmentDatil() {
    this.subscribe = this.settingServices.getAppointmentSettingDetail({}).subscribe(data => {
      console.log((data?.data.walkinWithBioAuth))
      this.appointmentSettingForm = this.formBuilder.group({
        isMultipleDays: [data?.data.isMultidays],
        maximumDuration: [data?.data.maxMultiDays, [Validators.required, Validators.min(1), Validators.max(364)]],
        // "maximumVistor": [data?.data.maxGroupSize, Validators.required],
        minimumDuaration: [JSON.stringify(data?.data.minDuration) ,Validators.required],
        // "timeSelectioninterval": [data?.data.slotDuration, Validators.required],
        activateDLScanScheduledAppointment: [(data?.data.activateDLScanScheduledAppointment)],
        walkinWithBioAuth: [(data?.data.walkinWithBioAuth)],
        isAccessControlEnabled: [(data?.data.isAccessControlEnabled)],

      })
      console.log(this.appointmentSettingForm.value)
      this.isMultiday(data?.data.isMultidays,2)
    })
  }

  isMultiday(multiDay,valueforUpdataion) {
    if (!multiDay) {
      this.readonlyAppointment = true;
      this.appointmentSettingForm.controls.maximumDuration.setValue(1)
      this.appointmentSettingForm.controls.maximumDuration.clearValidators()
      this.appointmentSettingForm.controls.maximumDuration.setValidators([Validators.required,Validators.max(364),Validators.min(1)])
      this.appointmentSettingForm.controls.maximumDuration.updateValueAndValidity()
    } else {

      (valueforUpdataion==1)?this.appointmentSettingForm.controls.maximumDuration.setValue(2):
      this.appointmentSettingForm.controls.maximumDuration.clearValidators()
      this.appointmentSettingForm.controls.maximumDuration.setValidators([Validators.required,Validators.max(364),Validators.min(2)])
      this.appointmentSettingForm.controls.maximumDuration.updateValueAndValidity()
      this.readonlyAppointment = false;

    }
  }
  updateAppointmentSetail() {
    if (this.appointmentSettingForm.valid) {
      this.subscribe = this.settingServices.updateAppointmentDetail(this.updateSettingObj()).subscribe(data => {
        if (data.statusCode == 200 && data.errors === null) {
          this.getAppointmentDatil();
          this.toastr.success(data.message,this.translate.instant("pop_up_messages.success"))
        }
      }, (error) => {
        if (error && error.error && error.error.Message)
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"))
        if (error && error.error && error.error.message)
          this.toastr.error(error.error.message, this.translate.instant("pop_up_messages.error"))
      });


    }

  }

  updateSettingObj() {
    return {
      "isAccessControlEnabled":this.appointmentSettingForm.value.isAccessControlEnabled,
      "walkinWithBioAuth":this.appointmentSettingForm.value.walkinWithBioAuth,
      "isMultidays": this.appointmentSettingForm.value.isMultipleDays,
      "maxMultiDays": this.appointmentSettingForm.value.maximumDuration,
      "minDuration": JSON.parse(this.appointmentSettingForm.value.minimumDuaration),
      "maxGroupSize": 0,
      "slotDuration": 0,
      "isInBehalfOf": false,
      "activateDLScanScheduledAppointment":this.appointmentSettingForm.value.activateDLScanScheduledAppointment
    }
  }

  formError(controlName: string, errorName: string) {
    return this.appointmentSettingForm.controls[controlName].hasError(errorName);
  }

  setDlScanValue(event:any,controlName: string){
    this.appointmentSettingForm.controls[controlName].setValue(event.checked);
  }

  walkinWithBio(event:any,controlName: string){
    this.appointmentSettingForm.controls[controlName].setValue(event.checked);
  }

  scheduleWithBio(event:any,controlName: string){
    if(!event.checked)
      this.appointmentSettingForm.controls['walkinWithBioAuth'].setValue(event.checked);
    this.appointmentSettingForm.controls[controlName].setValue(event.checked);
  }
}
