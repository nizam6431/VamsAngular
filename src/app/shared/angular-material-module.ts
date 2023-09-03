import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OverlayModule } from "@angular/cdk/overlay";
import { CdkTreeModule } from "@angular/cdk/tree";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MAT_RIPPLE_GLOBAL_OPTIONS } from "@angular/material/core";
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
 import { MatProgressBarModule } from '@angular/material/progress-bar'; 
 import {MatExpansionModule} from '@angular/material/expansion'

const materialModules = [
  CdkTreeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSidenavModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatButtonToggleModule,
  OverlayModule,
  MatGridListModule,
  MatDialogModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatChipsModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatIconModule,
 MatProgressBarModule,
 MatExpansionModule
];

@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
  providers: [
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
  ],
})
export class AngularMaterialModule { }
