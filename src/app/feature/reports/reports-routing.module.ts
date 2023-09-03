import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/canactivate';
import { ReportFilterPopupComponent } from './report-filter-popup/report-filter-popup.component';
import { ReportsComponent } from './reports.component';

export const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'filterPage',
        canActivate:[AuthGuard],
        component: ReportFilterPopupComponent,
      },
    ],
  },
  // {
  //   path: 'reports/reportData',
  //   component: ReportGridComponent,
  // },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
