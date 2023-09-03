import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import ar from '@angular/common/locales/ar';
// import hi from '@angular/common/locales/hi';
import { APP_INITIALIZER, NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QrCodeModule } from 'ng-qrcode';
import { DpDatePickerModule } from 'ng2-date-picker';
import { IConfig, MaskPipe, NgxMaskModule } from 'ngx-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { AuthModule } from './core/auth/auth.module';
// import { DashboardModule } from './feature/dashboard/dashboard.module';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import ar from '@angular/common/locales/ar';
import hi from '@angular/common/locales/hi';
import { CommonPagesModule } from './common-pages/common-pages.module';
import { SpinnerOverlayComponent } from './common-pages/spinner-overlay/spinner-overlay.component';
import { AuthModule } from './core/auth/auth.module';
import { ConfigService } from './core/auth/services/config.service';
import { API_CONFIG, restApiSuffix } from './core/constants/rest-api.constants';
import { ErrorInterceptor } from './core/Intercepter/errorIntercepter';
import { OWINIntercepter } from './core/Intercepter/OWINIntercepter';
import { SpinnerInterceptor } from './core/Intercepter/SpinnerInterceptor';
import { MainContainerComponent } from './core/main-container/main-container.component';
import { AppointmentModule } from './feature/appointment/appointment.module';
import { DashboardModule } from './feature/dashboard/dashboard.module';
// import { ScheduleModule } from './feature/schedule/schedule.module';
import { HsqModule } from './feature/hsq/hsq.module';
import { MasterModule } from './feature/master/master.module';
import { ReportsModule } from './feature/reports/reports.module';
import { UserModule } from './feature/user/user.module';
import { CommonPopUpComponent } from './shared/components/common-pop-up/common-pop-up.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ShowPolicyComponent } from './shared/components/show-policy/show-policy.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProfilePageModalComponent } from './core/profile-page-modal/profile-page-modal.component';
import { PayNowComponent } from './core/pay-now/pay-now.component';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { SOSComponent } from './core/sos/sos.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MobileFormatDirective } from './core/directives/mobile-format.directive';


registerLocaleData(ar);
registerLocaleData(hi);

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    SpinnerOverlayComponent,
    CommonPopUpComponent,
    ShowPolicyComponent,
    ProfilePageModalComponent,
    SOSComponent,
    PayNowComponent,
    MobileFormatDirective
    
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    OverlayModule,
    DpDatePickerModule,
    AppRoutingModule,
    NgxMaskModule.forRoot(maskConfig),
    AuthModule,
    DashboardModule,
    MasterModule,
    CommonPagesModule,
    NgbModule,
    BrowserAnimationsModule,
    UserModule,
    AppointmentModule,
    HsqModule,
    QrCodeModule,
    ToastrModule.forRoot(),
    NgxMaterialTimepickerModule,
    ReportsModule,
    BrowserModule,
    NgMultiSelectDropDownModule,
    PdfViewerModule,
    AngularEditorModule,
    NgxIntlTelInputModule
  ],
  providers: [
    DatePipe,
    MaskPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: OWINIntercepter,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
    {
      provide: API_CONFIG,
      useValue: restApiSuffix,
    },
    ConfigService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [ConfigService],
      'multi': true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


export function init(settingsProvider: ConfigService) {
  return () => settingsProvider.loadConfig();
}

