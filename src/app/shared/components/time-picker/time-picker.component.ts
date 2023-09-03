import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgxTimepickerFieldComponent } from 'ngx-material-timepicker';
import { convertTime12to24 } from 'src/app/core/functions/functions';
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit, OnChanges {
  @Output() timePickerAppointment = new EventEmitter();
  timePickerForm: FormGroup
  @Input() format;
  @Input() screen;
  @Input() type;
  @Input() defaultTime;
  @Input() value;
  @Input() goFornext;
  @Input() visitorSettingsDisplay;
  @Input() readOnlyVisitorSetting;
  isDisabled: boolean = false;
  constructor(public fb: FormBuilder,
    public appointmentService: AppointmentService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
    // console.log(this.type,changes,this.value); 
    if (this.screen == 'scheduled' && this.value && this.timePickerForm) {
      this.timePickerForm.get('time').reset();
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'rescheduled') {
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'shareAppointment' && this.timePickerForm) {
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'visitorSetting' && this.timePickerForm) {
      console.log(this.value, this.readOnlyVisitorSetting);
      this.isDisabled = !this.readOnlyVisitorSetting;
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (this.screen == 'scheduled') {
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'rescheduled') {
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'shareAppointment') {
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
    if (this.screen == 'visitorSetting') {
      console.log(this.value, this.readOnlyVisitorSetting);
      this.isDisabled = !this.readOnlyVisitorSetting;
      this.timePickerForm.get('time').setValue(this.type == 'from' ? this.value.time : this.value.time);
    }
  }

  createForm() {
    let defaultTime  = (this.format == 12)?'10:00 AM':"10:00";
    this.timePickerForm = this.fb.group({
      time: [defaultTime, Validators.required]
    })
  }

  timechange() {
    this.timePickerAppointment.emit({ type: this.type, value: this.timePickerForm.get('time').value });
  }
}
