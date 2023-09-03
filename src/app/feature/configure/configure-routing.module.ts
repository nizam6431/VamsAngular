import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/canactivate';
import { ProviderDeviceDetailsComponent } from './configure-details/genral/provider-device-details/provider-device-details.component';
import { ProviderSetupComponent } from './configure-details/genral/provider-setup/provider-setup.component';
import { ConfigureComponent } from './configure.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ConfigureComponent,
  },
  // {
  //   path: 'providerDeviceDetails',
  //   component:ProviderDeviceDetailsComponent
  // },
  // {
  //   path: 'providerSetup',
  //   component:ProviderSetupComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ConfigureRoutingModule { }
