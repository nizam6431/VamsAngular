import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerOverlayComponent } from './spinner-overlay/spinner-overlay.component';
import { HeaderComponent } from '../core/header/header.component';
import { FooterComponent } from '../core/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardModule } from '../feature/dashboard/dashboard.module';
import { DashboardRoutingModule } from '../feature/dashboard/dashboard-routing.module';
import { DecisionComponent } from './decision/decision.component';
import { I18nModule } from '../core/i18n/i18n.module';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { NgSelect2Module } from 'ng-select2';
import { WebcamModule } from 'ngx-webcam';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgxMaskModule } from 'ngx-mask';
import { SheduleModalComponent } from './shedule-modal/shedule-modal.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { SidebarComponent } from '../core/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { IsPermissibleDirective } from '../core/directives/is-permissible.directive';
import { AngularMaterialModule } from '../shared/angular-material-module';
import { ViewImagesComponent } from './view-images/view-images.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
const routes: Routes = [
  {
    path: 'error', component: ErrorComponent
  }
];

const config: ExtraOptions = {
  useHash: false
}

@NgModule({
  declarations: 
  [
    ErrorComponent, ErrorPopupComponent, HeaderComponent, 
    FooterComponent, DecisionComponent,
    SheduleModalComponent, CancelModalComponent, MobileMenuComponent, SidebarComponent,
    IsPermissibleDirective,
    ViewImagesComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    RouterModule.forChild(routes),
    FormsModule,
    I18nModule,
    WebcamModule,
    DpDatePickerModule,
    NgxMaskModule,
    ReactiveFormsModule,
    AutocompleteLibModule,
    NgSelect2Module,
    NgbTypeaheadModule,
    AngularMaterialModule,
    PdfViewerModule
  ],
  exports:[
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SheduleModalComponent,
    CancelModalComponent,
    MobileMenuComponent,
    SidebarComponent,
    TranslateModule,
    IsPermissibleDirective,
    AngularMaterialModule
  ]
})
export class CommonPagesModule { }

