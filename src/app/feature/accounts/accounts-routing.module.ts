import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      // {
      //   path: 'filterPage',
      //   canActivate:[AuthGuard],
      //   component: ReportFiltersComponent,
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
