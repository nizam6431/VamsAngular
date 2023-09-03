import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthscreeningComponent } from './healthscreening/healthscreening.component';
import { HsqRoutingModule } from './hsq-routing.module';
import { HsqComponent } from './hsq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms/';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DpDatePickerModule } from 'ng2-date-picker';
import { I18nModule } from '../../core/i18n/i18n.module';
import { NgSelect2Module } from 'ng-select2';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { HsqSuccessComponent } from './hsq-success/hsq-success.component';
import { WalkinHealthScreeningComponent } from './walkin-health-screening/walkin-health-screening.component';
import { HsqQuestionsComponent } from './hsq-questions/hsq-questions.component';
import { SharedModule } from '../../shared/shared/shared.module';
import { WalkinHsqQuestionsComponent } from './walkin-hsq-questions/walkin-hsq-questions.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    HsqComponent,
    HealthscreeningComponent,
    HsqSuccessComponent,
    WalkinHealthScreeningComponent,
    HsqQuestionsComponent,
    WalkinHsqQuestionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule,
    NgbModalModule,
    DpDatePickerModule,
    I18nModule,
    NgSelect2Module,
    CommonPagesModule,
    HsqRoutingModule,
    SharedModule,
    NgxIntlTelInputModule
  ]
})
export class HsqModule { }

