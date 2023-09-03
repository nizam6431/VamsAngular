import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/canactivate';
import { SeepzGeneralLedgerComponent } from './seepz-general-ledger.component';

export const routes: Routes = [ 
    {
        path: '',
        component: SeepzGeneralLedgerComponent,
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class SeepzGeneralLedgerRoutingModule { }  