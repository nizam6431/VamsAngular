import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractorPassRoutingModule } from './contractor-pass-routing.module';
import { ContractorPassComponent } from './contractor-pass.component';
import { MainComponent } from './main/main.component';
import { I18nModule } from '../../core/i18n/i18n.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { GridViewComponent } from './view/grid-view/grid-view.component';
import { CheckInOutComponent } from './popup/check-in-out/check-in-out.component';
import { DetailsPageComponent } from './popup/details-page/details-page.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonPagesModule } from '../../common-pages/common-pages.module';



@NgModule({
  declarations: [
    ContractorPassComponent,
    MainComponent,
    GridViewComponent,
    CheckInOutComponent,
    DetailsPageComponent
  ],
  imports: [
    CommonModule,
    ContractorPassRoutingModule,
    I18nModule,
    SharedModule,
    ZXingScannerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonPagesModule
  ]
})
export class ContractorPassModule { }
