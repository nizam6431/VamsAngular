import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HealthscreeningComponent } from './healthscreening/healthscreening.component';
import { HsqComponent } from './hsq.component';
import { HsqSuccessComponent } from './hsq-success/hsq-success.component';
import { WalkinHealthScreeningComponent } from './walkin-health-screening/walkin-health-screening.component';
import { HsqQuestionsComponent } from './hsq-questions/hsq-questions.component';


export const routes: Routes = [
  {
    path: '',
    component: HsqComponent,
    children: [
      // {
      //   path: 'healthscreening/:token',
      //   component: HealthscreeningComponent
      // },
      // {
      //   path: 'walkin-hsq/:token',
      //   component: WalkinHealthScreeningComponent
      // },
      // {
      //   path: 'hsqsuccess',
      //   component: HsqSuccessComponent
      // },
    ]
  },
  // { 
  //   path: 'hsq/questions/:apnt_id',
  //   component: HsqQuestionsComponent
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HsqRoutingModule { }