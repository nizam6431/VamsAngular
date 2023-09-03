import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureComponent } from './configure.component';
import { ConfigureRoutingModule } from './configure-routing.module';
import { ConfigureGridComponent } from './configure-grid/configure-grid.component';
import { ConfigureMainComponent } from './configure-main/configure-main.component';
import { ConfigureSidebarComponent } from './configure-sidebar/configure-sidebar.component';
import { ConfigureContentComponent } from './configure-content/configure-content.component';
import { MainTabsComponent } from './main-tabs/main-tabs.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { I18nModule } from '../../core/i18n/i18n.module';
import { VisitorSettingsComponent } from './configure-details/visitor-settings/visitor-settings.component';
import { BioSecurityServerDetailComponent } from './configure-details/genral/bio-security-server-detail/bio-security-server-detail.component';
import { AddUpdateBioSecurityServerComponent } from './configure-details/genral/add-update-bio-security-server/add-update-bio-security-server.component';
import { EmailServerConfigComponent } from './configure-details/genral/email-server-config/email-server-config.component';
import { SmsServerConfigComponent } from './configure-details/genral/sms-server-config/sms-server-config.component';
import { HsqConfigComponent } from './configure-details/genral/hsq-config/hsq-config.component';
import { AppointmentRejectReasonMasterComponent } from './configure-details/genral/appointment-reject-reason-master/appointment-reject-reason-master.component';
import { NdaComponent } from './configure-details/genral/nda/nda.component';
import { RoleMasterComponent } from './configure-details/genral/role-master/role-master.component';
import { MainGridComponent } from './main-grid/main-grid.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EmailServerComponent } from './popup/email-server/email-server.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AppointmentCancelReasonComponent } from './popup/appointment-cancel-reason/appointment-cancel-reason.component';
import { PrivacyPolicyComponent } from './configure-details/genral/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './configure-details/genral/terms-conditions/terms-conditions.component';
import { ToastrModule } from 'ngx-toastr';
import { ProviderSetupComponent } from './configure-details/genral/provider-setup/provider-setup.component';
import { ProviderSetupPopupComponent } from './popup/provider-setup-popup/provider-setup-popup.component';
import { ProviderDeviceDetailsComponent } from './configure-details/genral/provider-device-details/provider-device-details.component';
import { ProviderDevicePopupComponent } from './popup/provider-device-popup/provider-device-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DynamicEmailTemplateComponent } from './configure-details/genral/dynamic-email-template/dynamic-email-template.component';
import { PrivacyPolicyVisitorComponent } from './configure-details/genral/privacy-policy-visitor/privacy-policy-visitor.component';
import { TermsConditionVisitorComponent } from './configure-details/genral/terms-condition-visitor/terms-condition-visitor.component';
import { DynamicPermissionsComponent } from './configure-details/general/dynamic-permissions/dynamic-permissions.component';
import { AddQuestionComponent } from './popup/add-question/add-question.component';
import { ConfigureSubContentComponent } from './configure-sub-content/configure-sub-content.component';
import { DeviceSetupComponent } from './configure-details/genral/device-setup/device-setup.component';
import { DeviceSetupPopupComponent } from './popup/device-setup-popup/device-setup-popup.component';
import { SmsTemplateComponent } from './configure-details/genral/sms-template/sms-template.component';
import { SmsTemplateDialogComponent } from './popup/sms-template-dialog/sms-template-dialog.component';
import { EmailTemplateComponent } from './configure-details/genral/email-template/email-template.component';
import { EmailTemplatePopupComponent } from './popup/email-template-popup/email-template-popup.component';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { ContractorConfigComponent } from './configure-details/genral/contractor-config/contractor-config.component';
import { ContractorConfigPopupComponent } from './popup/contractor-config-popup/contractor-config-popup.component';
import { RateCardComponent } from './configure-details/genral/rate-card/rate-card.component';
import { RateCardPopupComponent } from './popup/rate-card-popup/rate-card-popup.component';
@NgModule({
  declarations: [
    ConfigureComponent,
    ConfigureGridComponent,
    ConfigureMainComponent,
    ConfigureSidebarComponent,
    ConfigureContentComponent,
    MainTabsComponent,
    VisitorSettingsComponent,
    BioSecurityServerDetailComponent,
    AddUpdateBioSecurityServerComponent,
    EmailServerConfigComponent,
    SmsServerConfigComponent,
    HsqConfigComponent,
    AppointmentRejectReasonMasterComponent,
    NdaComponent,
    RoleMasterComponent,
    MainGridComponent,
    EmailServerComponent,
    AppointmentCancelReasonComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    ProviderSetupComponent,
    ProviderSetupPopupComponent,
    ProviderDeviceDetailsComponent,
    ProviderDevicePopupComponent,
    DynamicEmailTemplateComponent,
    AddQuestionComponent,
    ConfigureSubContentComponent,
    PrivacyPolicyVisitorComponent,
    TermsConditionVisitorComponent,
    DynamicPermissionsComponent,
    DeviceSetupComponent,
    DeviceSetupPopupComponent,
    SmsTemplateComponent,
    SmsTemplateDialogComponent,
    EmailTemplateComponent,
    EmailTemplatePopupComponent,
    ContractorConfigComponent,
    ContractorConfigPopupComponent,
    RateCardComponent,
    RateCardPopupComponent
  ],
  imports: [
    CommonModule,
    ConfigureRoutingModule,
    SharedModule,
    I18nModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    PdfViewerModule,
    ToastrModule,
    MatCheckboxModule,
    AngularEditorModule
  ]
})
export class ConfigureModule { }
