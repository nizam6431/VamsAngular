import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from '../i18n/i18n.module';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { ConfirmLoginComponent } from 'src/app/shared/components/confirm-login/confirm-login.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonPdfViewerComponent } from 'src/app/shared/components/common-pdf-viewer/common-pdf-viewer.component';
import { PrivacyPolicyAndTermsConditionComponent } from './privacy-policy-and-terms-condition/privacy-policy-and-terms-condition.component'

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    ConfirmLoginComponent,
    CommonPdfViewerComponent,
    PrivacyPolicyAndTermsConditionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthRoutingModule,
    CommonPagesModule,
    I18nModule,
    PdfViewerModule

  ],
  exports:[
    AuthComponent,
    LoginComponent,
    CommonPdfViewerComponent
  ]
})
export class AuthModule { }


