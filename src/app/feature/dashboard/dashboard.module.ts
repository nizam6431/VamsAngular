import { NgModule, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DpDatePickerModule, DayCalendarComponent } from 'ng2-date-picker';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardFiltersComponent } from './dashboard-filters/dashboard-filters.component';
import { I18nModule } from '../../core/i18n/i18n.module';
import { LocalizedDatePipe } from '../../core/pipes/localizeDatePipe';
import { NgbActiveModal, NgbModalModule, NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { WebcamModule } from 'ngx-webcam';
import { NgxMaskModule } from 'ngx-mask';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgSelect2Module } from 'ng-select2';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { DashboardLevelWiseComponent } from './dashboard-level-wise/dashboard-level-wise.component';
import { DashboardLevel1Component } from './dashboard-details/dashboard-level1/dashboard-level1.component';
import { DashboardLevel2Component } from './dashboard-details/dashboard-level2/dashboard-level2.component';
import { DashboardLevel3Component } from './dashboard-details/dashboard-level3/dashboard-level3.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HeapmapComponent } from './dashboard-details/heapmap/heapmap.component';
import { PieChartComponent } from './dashboard-details/pie-chart/pie-chart.component';
import { BarChartComponent } from './dashboard-details/bar-chart/bar-chart.component';
import { MixedChartComponent } from './dashboard-details/mixed-chart/mixed-chart.component';
import { SemiDonutComponent } from './dashboard-details/semi-donut/semi-donut.component';
import { WalkinVisitorCheckinComponent } from './dashboard-details/walkin-visitor-checkin/walkin-visitor-checkin.component';
import { WalkinVisitorCheckoutComponent } from './dashboard-details/walkin-visitor-checkout/walkin-visitor-checkout.component';
import { DailyPassCheckinCheckoutComponent } from './dashboard-details/daily-pass-checkin-checkout/daily-pass-checkin-checkout.component';
import { BarChartPermanentPassComponent } from './dashboard-details/bar-chart-permanent-pass/bar-chart-permanent-pass.component';
import { WalkingPieChartComponent } from './dashboard-details/walking-pie-chart/walking-pie-chart.component';



@NgModule({
  declarations: [
    DashboardComponent,
    DashboardContentComponent,
    DashboardFiltersComponent,
    LocalizedDatePipe,
    DashboardMainComponent,
    DashboardLevelWiseComponent,
    DashboardLevel1Component,
    DashboardLevel2Component,
    DashboardLevel3Component,
    HeapmapComponent,
    PieChartComponent,
    BarChartComponent,
    MixedChartComponent,
    SemiDonutComponent,
    WalkinVisitorCheckinComponent,
    WalkinVisitorCheckoutComponent,
    DailyPassCheckinCheckoutComponent,
    BarChartPermanentPassComponent,
    WalkingPieChartComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    WebcamModule,
    NgxMaskModule,
    NgbModalModule,
    DpDatePickerModule,
    I18nModule,
    DashboardRoutingModule,
    AutocompleteLibModule,
    NgbTypeaheadModule,
    NgSelect2Module,
    CommonPagesModule,
    NgApexchartsModule
  ],
  providers:[NgbActiveModal]
})
export class DashboardModule { }