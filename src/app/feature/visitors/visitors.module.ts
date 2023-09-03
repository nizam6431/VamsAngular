import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms/';
import { VisitorsRoutingModule } from './visitors-routing.module';
import { VisitorsComponent } from './visitors.component';
import { AllVisitorsComponent } from './all-visitors/all-visitors.component';
import { BlacklistedComponent } from './blacklisted/blacklisted.component';
import { ContractorComponent } from './contractor/contractor.component';
import { GridComponent } from './grid/grid.component';
import { ShowRestricedVisitorDetailsComponent } from './show-restriced-visitor-details/show-restriced-visitor-details.component';
import { RestrictVisitorComponent } from './restrict-visitor/restrict-visitor.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { I18nModule } from 'src/app/core/i18n/i18n.module';
import { HttpClientModule } from '@angular/common/http';
import { TruncatePipe } from '../../core/pipes/truncate.pipe';
import { PopupComponent } from './popup/popup.component';
import { VisitorDetailsComponent } from './visitor-details/visitor-details.component';
@NgModule({
  declarations: [
    VisitorsComponent,
    AllVisitorsComponent,
    BlacklistedComponent,
    ContractorComponent,
    GridComponent,
    ShowRestricedVisitorDetailsComponent,
    RestrictVisitorComponent,
    TruncatePipe,
    PopupComponent,
    VisitorDetailsComponent,
  ],
  imports: [
    CommonModule,
    CommonPagesModule,
    SharedModule,
    VisitorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    I18nModule,
    NgxIntlTelInputModule,
  ]
})
export class VisitorsModule { }
