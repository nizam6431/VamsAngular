import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractorPassComponent } from './contractor-pass.component';

const routes: Routes = [
  {
    path: '',
    component: ContractorPassComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractorPassRoutingModule { }
