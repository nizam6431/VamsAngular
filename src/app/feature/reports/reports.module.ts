import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms/';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ReportFilterPopupComponent } from './report-filter-popup/report-filter-popup.component';
import { ReportMainComponent } from './report-main/report-main.component';
import { ReportGridComponent } from './report-grid/report-grid.component';
import { AppointmentReportDetailsComponent } from './report-details-page/appointment-report-details/appointment-report-details.component';
import { VisitorReportDetailsComponent } from './report-details-page/visitor-report-details/visitor-report-details.component';
import { HsqReportDetailsComponent } from './report-details-page/hsq-report-details/hsq-report-details.component';
import { EmailReportDetailsComponent } from './report-details-page/email-report-details/email-report-details.component';

@NgModule({
  declarations: [
    ReportsComponent,
    ReportFilterPopupComponent,
    ReportMainComponent,
    ReportGridComponent,
    AppointmentReportDetailsComponent,
    VisitorReportDetailsComponent,
    HsqReportDetailsComponent,
    EmailReportDetailsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    SharedModule,
  ]
})
export class ReportsModule { }
