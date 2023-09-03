import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { CardRoutingModule } from './card-routing.module';
import {GridViewComponent} from './View/grid-view/grid-view.component'
import { MainComponent } from './main/main/main.component';
import { I18nModule } from '../../../core/i18n/i18n.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CommonPagesModule} from '../../../common-pages/common-pages.module';
import { CardDetailsComponent } from './card-details/card-details.component'
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DocumentGridViewComponent } from './View/document-grid-view/document-grid-view.component';
import { ViewDocumentComponent } from './View/view-document/view-document.component';
import { WebcamModule } from 'ngx-webcam';
import { PassValidityComponent } from './View/pass-validity/pass-validity.component';
import { DetailPageViewComponent } from './popup/detail-page-view/detail-page-view.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  declarations: [
    CardComponent,
    GridViewComponent,
    MainComponent,
    CardDetailsComponent,
    DocumentGridViewComponent,
    ViewDocumentComponent,
    PassValidityComponent,
    DetailPageViewComponent,
  ],
  imports: [
    CommonModule,
    CardRoutingModule,
    I18nModule,
    SharedModule,
    ZXingScannerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPagesModule,
    MatExpansionModule,
    NgxIntlTelInputModule,
    WebcamModule,
    PdfViewerModule
  ],
  exports: [MatExpansionModule]

})
export class CardModule { }
