import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/canactivate';
import { VisitorsComponent } from './visitors.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: VisitorsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitorsRoutingModule { }
