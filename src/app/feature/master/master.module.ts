import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MasterRoutingModule } from './master-routing.module';
import { CommonPagesModule } from 'src/app/common-pages/common-pages.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { MasterComponent } from './master.component';
import { GridComponent } from './grid/grid.component';
import { ComplexComponent } from './complex/complex.component';
import { BuildingComponent } from './building/building.component';
import { CompanyComponent } from './company/company.component';
import { CommonTabComponent } from './common-tab/common-tab.component';
import { EmployeeFormComponent } from './forms/employee-form/employee-form.component';
import { ContractorFormComponent } from './forms/contractor-form/contractor-form.component';
import { ShowDetailsComponent } from './show-details/show-details.component';
import { DepartmentFormComponent } from './forms/department-form/department-form.component';
import { ComplexDetailsFormComponent } from './forms/complex-details-form/complex-details-form.component';
import { CompanyFormComponent } from './forms/company-form/company-form.component';
import { BuildingFormComponent } from './forms/building-form/building-form.component';
import { QrCodeModule } from 'ng-qrcode';
import { ShareAppointmentFormComponent } from './forms/share-appointment-form/share-appointment-form.component';
import { ContractorCompanyFormComponent } from './forms/contractor-company-form/contractor-company-form.component';
import { NgSelect2Module } from 'ng-select2';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { L3CompanyDetailsComponent } from './l3-company-details/l3-company-details.component';
import { BioSecurityDeviceListComponent } from './bio-security-device-list/bio-security-device-list.component';
import { BioSecurityDeviceFormComponent } from './forms/bio-security-device-form/bio-security-device-form.component';
import {AccessQrCodeComponent} from '../master/access-qr-code/access-qr-code.component';
import { SmsScreenForAccessQrCodeComponent } from './sms-screen-for-access-qr-code/sms-screen-for-access-qr-code.component';
import { TruncatePipe } from 'src/app/shared/pipe/truncate.pipe';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MyProfileModalComponent } from 'src/app/core/my-profile-modal/my-profile-modal.component';
import { CompanyUnitComponent } from './company-unit/company-unit.component';
import { LocationComponent } from './location/location.component';
import { LocationFormComponent } from './forms/location-form/location-form.component';
import { LocationDetailComponent } from './location-detail/location-detail.component';
import { ContractorCompanyComponent } from './contractor-company/contractor-company.component';
import { SubLocationComponent } from './forms/sub-location/sub-location.component';
import { WebcamModule } from 'ngx-webcam';
import { ConractorPassComponent } from './forms/conractor-pass/conractor-pass.component';
import {NgxPrintModule} from 'ngx-print';
import { ContractorPassDetailsComponent } from './contractor-pass-details/contractor-pass-details.component';
import { HospitalComponent } from './hospital/hospital.component';

@NgModule({
  declarations: [
    MasterComponent,
    GridComponent,
    ComplexComponent,
    BuildingComponent,
    CompanyComponent,
    CommonTabComponent,
    EmployeeFormComponent,
    ContractorFormComponent,
    ShowDetailsComponent,
    DepartmentFormComponent,
    ComplexDetailsFormComponent,
    CompanyFormComponent,
    BuildingFormComponent,
    ShareAppointmentFormComponent,
    ContractorCompanyFormComponent,
    BuildingDetailComponent,
    L3CompanyDetailsComponent,
    BioSecurityDeviceListComponent,
    BioSecurityDeviceFormComponent,
    AccessQrCodeComponent,
    SmsScreenForAccessQrCodeComponent,
    TruncatePipe,
    MyProfileModalComponent,
    CompanyUnitComponent,
    LocationComponent,
    LocationFormComponent,
    LocationDetailComponent,
    SubLocationComponent,
    ContractorCompanyComponent,
    SubLocationComponent,
    ConractorPassComponent,
    ContractorPassDetailsComponent,
    HospitalComponent
  ],
  imports: [
    CommonModule,
    CommonPagesModule,
    SharedModule,
    MasterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QrCodeModule,
    NgSelect2Module,
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
    NgMultiSelectDropDownModule,
    WebcamModule,
    NgxPrintModule
  ]
})
export class MasterModule { }
