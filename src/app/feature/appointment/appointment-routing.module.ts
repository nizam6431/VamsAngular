import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './appointment.component';
import { RouterModule, Routes } from '@angular/router';
import { ShareAppointmentComponent } from './share-appointment/share-appointment.component';
import { ReauthenticateComponent } from './reauthenticate/reauthenticate.component';
import { PrescheduleComponent } from './preschedule/preschedule.component';
import { AuthGuard } from '../../core/guards/canactivate';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { ShareAppointmentScheduleComponent } from './share-appointment-schedule/share-appointment-schedule.component';

export const routes: Routes = [
  {
    path: '',
    component: AppointmentComponent,
    children: [
      {
        path: 'appointment/shareappointment',
        canActivate:[AuthGuard],
        component: ShareAppointmentComponent,
      },
      {
        path: 'shareappointment',
        canActivate:[AuthGuard],
        component: ShareAppointmentComponent,
      },
      {
        path: 're-authenticate',
        canActivate:[AuthGuard],
        component: ReauthenticateComponent,
      },
      {
        path: 'prescheduled',
        canActivate:[AuthGuard],
        component: PrescheduleComponent,
      },
    ],
  },
  // {
  //   path: 'appointments/details/:token',
  //   component: AppointmentDetailsComponent,
  // },
  // {
  //   path: 'appointments/schedule/:token',
  //   component: ShareAppointmentScheduleComponent,
  // }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentRoutingModule { }
