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
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ReportDetailViewComponent } from './report-detail-view/report-detail-view/report-detail-view.component';
import { DocumentGridViewComponent } from './report-detail-view/document-grid-view/document-grid-view.component';
import { WalkinVisitorReportComponent } from './walkin-visitor-report/walkin-visitor-report.component';
import { VisitorReportDetailViewComponent } from './visitor-report-detail-view/visitor-report-detail-view.component'

@NgModule({
  declarations: [
    ReportsComponent,
    ReportFilterPopupComponent,
    ReportMainComponent,
    ReportGridComponent,
    ReportDetailViewComponent,
    DocumentGridViewComponent,
    WalkinVisitorReportComponent,
    VisitorReportDetailViewComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
    // HttpClientModule,
    SharedModule,
    NgxIntlTelInputModule
  ]
})
export class ReportsModule { }
