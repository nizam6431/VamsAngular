import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material-module';
import { BulkUploadComponent } from '../components/bulk-upload/bulk-upload.component';
import { ConfirmDeleteComponent } from '../components/confirm-delete/confirm-delete.component';
import { ConfirmReasonComponent } from '../components/confirm-reason/confirm-reason.component';
import { ToggleButtonComponent } from '../components/toggle-button/toggle-button.component';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { SelectBuildingComponent } from '../components/select-building/select-building.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DateRangeComponent } from '../components/date-range/date-range.component';
import { LinkErrorComponent } from 'src/app/shared/components/link-error/link-error.component';
import { FileUploadComponent} from '../components/file-upload/file-upload.component'
import { MobileNumberFormatDirective } from '../directives/mobile-number-format.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { CommonPdfViewerComponent } from 'src/app/shared/components/common-pdf-viewer/common-pdf-viewer.component'
import { TimePickerComponent } from '../components/time-picker/time-picker.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
@NgModule({
  declarations: [
    BulkUploadComponent,
    ConfirmDeleteComponent,
    ConfirmReasonComponent,
    ToggleButtonComponent,
    SelectBuildingComponent,
    DateRangeComponent,
    LinkErrorComponent,
    FileUploadComponent,
    MobileNumberFormatDirective,
    TimePickerComponent,
    
    // CommonPdfViewerComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPagesModule,
    DpDatePickerModule,
    PdfViewerModule,
    NgxMaterialTimepickerModule
  ],
  exports: [AngularMaterialModule,
    BulkUploadComponent,
    ToggleButtonComponent,
    LinkErrorComponent,
    MobileNumberFormatDirective,
    TimePickerComponent
    // CommonPdfViewerComponent
  ]
})
export class SharedModule { }
