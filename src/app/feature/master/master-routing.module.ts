import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/canactivate';
import { MasterComponent } from './master.component';
import { SmsScreenForAccessQrCodeComponent  } from '../master/sms-screen-for-access-qr-code/sms-screen-for-access-qr-code.component';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    component: MasterComponent,
  },
  // {
  //   path: 'master/employee/myaccessqrcode/:id',
  //   // canActivate: [AuthGuard],
  //   component: SmsScreenForAccessQrCodeComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
