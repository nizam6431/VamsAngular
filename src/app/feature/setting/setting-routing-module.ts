import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/canactivate';
import { SettingComponent } from './setting.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: SettingComponent,
  },    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SettingRoutingModule { }
