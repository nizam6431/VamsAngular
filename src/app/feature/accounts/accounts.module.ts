import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { GridComponent } from './grid/grid.component';
import { AccountFormComponent } from './account-form/account-form.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AccountsComponent,
    GridComponent,
    AccountFormComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    SharedModule,
    NgxIntlTelInputModule,
    CommonPagesModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AccountsModule { }
