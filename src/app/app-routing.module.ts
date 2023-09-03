import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/canactivate';
import { UpdateCompanyInfo } from './core/guards/canload';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { MainContainerComponent } from './core/main-container/main-container.component';
import { HsqQuestionsComponent } from './feature/hsq/hsq-questions/hsq-questions.component';
import { AppointmentDetailsComponent } from './feature/appointment/appointment-details/appointment-details.component';
import { ShareAppointmentScheduleComponent } from './feature/appointment/share-appointment-schedule/share-appointment-schedule.component';
import { validateToken } from './core/guards/validateToken';
import { ResetPasswordComponent } from './core/auth/reset-password/reset-password.component';
import { LinkErrorComponent } from './shared/components/link-error/link-error.component';
import { ShowPolicyComponent } from './shared/components/show-policy/show-policy.component';
import { getMasterOutside } from './core/guards/getMasterOutside';
import { WalkinHsqQuestionsComponent } from './feature/hsq/walkin-hsq-questions/walkin-hsq-questions.component';
import { ConractorPassComponent } from './feature/master/forms/conractor-pass/conractor-pass.component';
import { VisitorDetailsComponent } from './feature/visitors/visitor-details/visitor-details.component';
import { EPassComponent } from './feature/daily-pass/e-pass/e-pass.component';

const routes: Routes = [
  {
    path: 'auth',
    canLoad: [UpdateCompanyInfo],
    loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'invalid-link',
    component: LinkErrorComponent,
  },
  { 
    path: 'hsq/questions/:apnt_id',
    canActivate: [getMasterOutside],
    // canLoad: [UpdateCompanyInfo],
    component: HsqQuestionsComponent
  },
  { 
    path: 'hsq/question/:location_id',
    canActivate: [getMasterOutside],
    // canLoad: [UpdateCompanyInfo],
    component: WalkinHsqQuestionsComponent
  },
  // {
  //   path: 'auth/forgot-password/:token',
  //   canActivate: [AuthGuard, validateToken],
  //   component: ResetPasswordComponent,
  // },
  {
    path: 'appointments/details/:token',
    canActivate: [getMasterOutside],
    component: AppointmentDetailsComponent,
  },
  // for daily E-pass
   {
    path: 'daily-pass/e-pass/:token',
    canActivate: [getMasterOutside],
    component: EPassComponent,
  },
  {
    path: 'WalkIn/EPass/:token',
    canActivate: [getMasterOutside],
    component: EPassComponent,
  },
  {
    path: 'appointments/schedule/:token',
    canActivate: [getMasterOutside],
    component: ShareAppointmentScheduleComponent,
  },
  {
    path: 'contractor/e-pass/:displayId',
    canActivate: [getMasterOutside],
    component: ConractorPassComponent,
  },
  {
    path: 'Visitor/details/:displayId',
    canActivate: [getMasterOutside],
    component: VisitorDetailsComponent,
  },
  {
    path: '',
    canLoad: [UpdateCompanyInfo],
    canActivate: [AuthGuard],
    component: MainContainerComponent,
    children: [
      {
        path: 'user',
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'appointments',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/appointment/appointment.module').then(m => m.AppointmentModule)
      },
      // {
      //   path: 'hsq',
      //   canLoad: [UpdateCompanyInfo],
      //   loadChildren: () => import('./feature/hsq/hsq.module').then(m => m.HsqModule)
      // },
      {
        path: 'dashboard',
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'master',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/master/master.module').then(m => m.MasterModule)
      },
      {
        path: 'visitors',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/visitors/visitors.module').then(m => m.VisitorsModule)
      },
      {
        path: 'reports',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'accounts',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/accounts/accounts.module').then(m => m.AccountsModule)
      },
      {
        path: 'configure',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/configure/configure.module').then(m => m.ConfigureModule)
      },
      {
        path: 'setting',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'contractor-pass',
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/contractor-pass/contractor-pass.module').then(m => m.ContractorPassModule)
      },
      {
        path: 'permanentPass',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/card/card/card.module').then(m => m.CardModule)
      },
      {
        path: 'dailyPass',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/daily-pass/card.module').then(m => m.CardModule)
      },
      {
        path: 'permanentPassRequest',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/permanent-pass-request/card.module').then(m => m.CardModule)
      },
      {
        path: 'checkIn',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/check-in/check-in.module').then(m => m.CheckInModule)
      },
      {
        path: 'checkOut',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/check-in/check-in.module').then(m => m.CheckInModule)
      },
      {
        path: 'permanentPassPrint',
        canActivate: [AuthGuard],
        canLoad: [UpdateCompanyInfo],
        loadChildren: () => import('./feature/permanent-pass-print/permanent-pass-print.module').then(m => m.PermanentPassPrintModule)
      },
      {
        path: 'seepzReport',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/seepz-report/reports.module').then(m => m.ReportsModule)
      },
      {
        path: 'seepzGeneralLedger',
        canLoad: [UpdateCompanyInfo],
        canActivate: [AuthGuard],
        loadChildren: () => import('./feature/seepz-general-ledger/seepz-general-ledger.module').then(m => m.SeepzGeneralLedgerModule)
      },
      
      
    ]
    
   },
  {
    path: '', redirectTo: '/auth/login', pathMatch: "full"
  },
  {
    path: '*', redirectTo: 'error'
  },
  {path: '**', redirectTo: '/auth/login'}
];

const config: ExtraOptions = {
  useHash: false
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
