import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermanentPassPrintComponent } from './permanent-pass-print.component';

const routes: Routes = [
  {
    path: '',
    component: PermanentPassPrintComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermanentPassPrintRoutingModule { }
