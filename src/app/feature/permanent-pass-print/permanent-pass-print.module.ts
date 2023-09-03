import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule } from '../../core/i18n/i18n.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonPagesModule} from '../../common-pages/common-pages.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PermanentPassPrintComponent } from './permanent-pass-print.component';
import { PermanentPassPrintRoutingModule } from './permanent-pass-print.routing.module';
import { MainComponent } from './main/main.component';
import { GridViewComponent } from './View/grid-view/grid-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations: [
      PermanentPassPrintComponent,
      MainComponent,
      GridViewComponent
    ],
    imports: [
        PermanentPassPrintRoutingModule,
        CommonModule,
        I18nModule,
        SharedModule,
        ZXingScannerModule,
        FormsModule,
        ReactiveFormsModule,
        CommonPagesModule,
        MatExpansionModule,
        NgxIntlTelInputModule,
        PdfViewerModule
      ],
    exports: [MatExpansionModule]
})

export class PermanentPassPrintModule { }