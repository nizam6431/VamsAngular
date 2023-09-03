import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UpdateprofileComponent } from './updateprofile/updateprofile.component';
import { AuthGuard } from '../../core/guards/canactivate';
import { ChangePasswordComponent } from './change-password/change-password.component';




export const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: 'updateprofile',
        canLoad: [AuthGuard],
        component: UpdateprofileComponent,
      },
      {
        path: 'change-password',
        canLoad: [AuthGuard],
        component: ChangePasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule { }
