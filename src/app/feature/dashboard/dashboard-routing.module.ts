import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { AuthGuard } from '../../core/guards/canactivate';
import { ShareAppointmentComponent } from '../appointment/share-appointment/share-appointment.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        // canActivate:[AuthGuard],
        component: DashboardComponent,
      },
      {
        path: 'appointment/shareappointment',
        // canActivate:[AuthGuard],
        component: ShareAppointmentComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
