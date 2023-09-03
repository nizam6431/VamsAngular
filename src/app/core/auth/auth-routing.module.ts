import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UpdateCompanyInfo } from '../guards/canload';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from '../guards/canactivate';
import { validateToken } from '../guards/validateToken';
import { LinkErrorComponent } from 'src/app/shared/components/link-error/link-error.component';
import { PrivacyPolicyAndTermsConditionComponent } from './privacy-policy-and-terms-condition/privacy-policy-and-terms-condition.component';
import { ShowPolicyComponent } from 'src/app/shared/components/show-policy/show-policy.component';


export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        canLoad: [UpdateCompanyInfo],
        component: LoginComponent,
      },
      {
        path: 'forgot-password',
        canLoad: [UpdateCompanyInfo],
        component: ForgetPasswordComponent,
      },
      {
        path: 'forgot-password/:token',
        canActivate: [validateToken],

        component: ResetPasswordComponent,
      },
      {
        path: 'forgot-password',
        canLoad: [UpdateCompanyInfo],
        component: ForgetPasswordComponent,
      },
      {
        path: 'reset-password/:token',
        canActivate: [validateToken],
        component: ResetPasswordComponent,
      },
    ],
    
  },
  {
    path: 'show-policy/:type',
    canLoad: [UpdateCompanyInfo],
    component: ShowPolicyComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
