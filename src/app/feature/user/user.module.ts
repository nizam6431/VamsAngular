import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from '../../core/i18n/i18n.module';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxMaskModule } from 'ngx-mask';
import { ChangePasswordComponent } from './change-password/change-password.component';



@NgModule({
  declarations: [
    UserComponent,
    UpdateprofileComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelect2Module,
    I18nModule,
    NgxMaskModule,
    UserRoutingModule
  ]
})
export class UserModule {


 }
