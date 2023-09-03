import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../../core/models/users";
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DateRangeComponent implements OnInit {

  @ViewChild('picker') datePicker: MatDatepicker<any>;
  todayDateTime: any;
  minDateForRange: any;
  dateRange: FormGroup;
  maxDateForRange: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DateRangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.minDateForRange = this.data.minDate?this.data.minDate:null;
    this.maxDateForRange = this.data.maxDate?this.data.maxDate:null;
    this.dateRange = this.fb.group({
      'start': [null],
      'end': [null],
    })
  }

  ngAfterViewInit(): void {
    this.datePicker.open();
  }

  ngOnInit(): void {
  }

  close() {
    if (this.dateRange.value.start == null || this.dateRange.value.end == null) {
      this.dialogRef.close({ success: false });
    } else {
      this.dialogRef.close({ success: true, data: this.dateRange });
    }
  }

}
