import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from 'src/app/core/i18n/i18n.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { AppointmentSettingComponent } from './detail-setting/appointment-setting/appointment-setting.component';
import { NotificationSettingComponent } from './detail-setting/notification-setting/notification-setting.component';
import { SettingContentComponent } from './setting-content/setting-content.component';
import { SettingMainComponent } from './setting-main/setting-main.component';
import { SettingRoutingModule } from './setting-routing-module';
import { SettingSideBarComponent } from './setting-side-bar/setting-side-bar.component';
import { SettingComponent } from './setting.component';
import { HardwareSettingComponent } from './detail-setting/hardware-setting/hardware-setting.component';
import { EmployeeSettingComponent } from './detail-setting/employee-setting/employee-setting.component';
import { VisitorSettingComponent } from './detail-setting/visitor-setting/visitor-setting.component';
import { GeneralSettingComponent } from './detail-setting/general-setting/general-setting.component';
import { ProviderMasterComponent } from './detail-setting/provider-master/provider-master.component';
import { SettingGridComponent } from './setting-grid/setting-grid.component';
import { ProviderMasterSettingModalComponent } from './popup/provider-master-setting-modal/provider-master-setting-modal.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    SettingComponent,
    SettingMainComponent,
    SettingSideBarComponent,
    AppointmentSettingComponent,
    SettingContentComponent,
    NotificationSettingComponent,
    HardwareSettingComponent,
    EmployeeSettingComponent,
    VisitorSettingComponent,
    GeneralSettingComponent,
    ProviderMasterComponent,
    SettingGridComponent,
    ProviderMasterSettingModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SettingRoutingModule,
    I18nModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule
  ]
})
export class SettingModule { }
