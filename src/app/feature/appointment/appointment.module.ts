import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareAppointmentComponent } from './share-appointment/share-appointment.component';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { CommonPagesModule } from '../../common-pages/common-pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { I18nModule } from '../../core/i18n/i18n.module';
import { AppointmentComponent } from './appointment.component';
import { ReauthenticateComponent } from './reauthenticate/reauthenticate.component';
import { NgxMaskModule } from 'ngx-mask';
import { PrescheduleComponent } from './preschedule/preschedule.component';
import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { DpDatePickerModule } from 'ng2-date-picker';
import { WebcamModule } from 'ngx-webcam';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgSelect2Module } from 'ng-select2';
import { CheckinModalComponent } from './checkin-modal/checkin-modal.component';
import { CheckoutModalComponent } from './checkout-modal/checkout-modal.component';
import { PrintingModalComponent } from './printing-modal/printing-modal.component';
import { RescheduleModalComponent } from './reschedule-modal/reschedule-modal.component';
import { ZoomPhotoComponent } from './zoom-photo/zoom-photo.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { QrCodeModule } from 'ng-qrcode';
import { ScheduleComponent } from './schedule/schedule.component';
import { GridComponent } from './grid/grid.component';
import { CardComponent } from './card/card.component';
import { ShowVisitorsDetailsComponent } from './show-visitors-details/show-visitors-details.component';
import { WalkinComponent } from './walkin/walkin.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CancelAppointmentComponent } from './cancel-appointment/cancel-appointment.component';
import { RejectComponent } from './reject/reject.component';
import { TimeInOutComponent } from './time-in-out/time-in-out.component';
import { ConfirmVisitorRestrictionComponent } from './confirm-visitor-restriction/confirm-visitor-restriction.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ConfirmCancelAppointmentComponent } from './confirm-cancel-appointment/confirm-cancel-appointment.component';
import { ScanDrivingLicenceComponent } from './scan-driving-licence/scan-driving-licence.component';
import { ShareAppointmentScheduleComponent } from './share-appointment-schedule/share-appointment-schedule.component';
import { FormatCellPipe } from '../../core/pipes/format-cell.pipe';
import { DrivingLicenceComponent } from './driving-licence/driving-licence.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { WalkinNewComponent } from './walkin-new/walkin-new.component';
import { CheckInWithoutBioComponent } from './check-in-without-bio/check-in-without-bio.component';
import { CommonPopupComponent } from './common-popup/common-popup.component';
import { ConfrmSynronizationModalComponent } from 'src/app/shared/components/confrm-synronization-modal/confrm-synronization-modal.component';
import { TimeInOutWithQrComponent } from './time-in-out-with-qr/time-in-out-with-qr.component';
import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    AppointmentComponent,
    ShareAppointmentComponent,
    ReauthenticateComponent,
    PrescheduleComponent,
    CheckoutModalComponent,
    RescheduleModalComponent,
    CheckinModalComponent,
    PrintingModalComponent,
    ZoomPhotoComponent,
    ScheduleComponent,
    GridComponent,
    CardComponent,
    ShowVisitorsDetailsComponent,
    WalkinComponent,
    CancelAppointmentComponent,
    RejectComponent,
    TimeInOutComponent,
    ConfirmVisitorRestrictionComponent,
    AppointmentDetailsComponent,
    ConfirmCancelAppointmentComponent,
    ScanDrivingLicenceComponent,
    ShareAppointmentScheduleComponent,
    FormatCellPipe,
    DrivingLicenceComponent,
    WalkinNewComponent,
    CheckInWithoutBioComponent,
    CommonPopupComponent,
    ConfrmSynronizationModalComponent,
    TimeInOutWithQrComponent,
    AutoFocusDirective
   ],
  imports: [
    CommonModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    WebcamModule,
    I18nModule,
    NgxMaskModule,
    NgbModalModule,
    DpDatePickerModule,
    AppointmentRoutingModule,
    DashboardModule,
    NgbTypeaheadModule,
    ZXingScannerModule,
    NgSelect2Module,
    SharedModule,
    QrCodeModule,
    NgxIntlTelInputModule,
    MatDatepickerModule,
    PdfViewerModule
  ],
  providers:[FormatCellPipe]
})
export class AppointmentModule { }
