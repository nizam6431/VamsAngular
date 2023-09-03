import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeepzGeneralLedgerRoutingModule } from './seepz-general-ledger-routing.module';
import { SeepzGeneralLedgerComponent } from './seepz-general-ledger.component';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { SeepzGeneralLedgerGridComponent } from './seepz-general-ledger-grid/seepz-general-ledger-grid.component';
import { SeepzGeneralLedgerMainComponent } from './seepz-general-ledger-main/seepz-general-ledger-main.component';



@NgModule({
    declarations: [
      SeepzGeneralLedgerComponent,
      SeepzGeneralLedgerGridComponent,
      SeepzGeneralLedgerMainComponent
    ],
    imports: [
      CommonModule,
      SeepzGeneralLedgerRoutingModule,
      CommonPagesModule,
      FormsModule,
      ReactiveFormsModule,
      // HttpClientModule,
      SharedModule
    ]
  })
  export class SeepzGeneralLedgerModule { }
  