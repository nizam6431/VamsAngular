import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProviderMasterSettingModalComponent } from '../popup/provider-master-setting-modal/provider-master-setting-modal.component';
import { NullLogger } from '@microsoft/signalr';
import { bool } from 'aws-sdk/clients/signer';
import { data } from 'jquery';

@Component({
  selector: 'app-setting-content',
  templateUrl: './setting-content.component.html',
  styleUrls: ['./setting-content.component.scss']
})
export class SettingContentComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Output() dialogClose = new EventEmitter();
  updateEmployeeData = null;
  title: string;
  updateData: any = [];
  updateGeneralSetting = null;
  updateVisitorSetting = null;
  action: string;
  invalidEmail: boolean;
  notifcationAction: string;
  notificationData: number;
  actionAppointment: string;
  appointmentData: number;


  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes && changes['type'] && changes['type']['currentValue']) {
      this.type = changes['type']['currentValue'];
      this.checkSetting(this.type);
    }
  }
  ngOnInit(): void {
  }


  updateButton(event) {

    // if (event == 'reset') {
    //   this.updateData.push({ type: this.type, reset: true })
    // }
    // else {
    //   console.log("in else part working ");

    //   this.updateData.push({ type: this.type, reset: true })
    // }
    if (this.type == 'notification_setting') {
      this.notifcationAction = (event == 'reset') ? 'reset' : 'update';
      this.notificationData = new Date().getTime();
    }

    if (this.type == 'appoinement_setting') {
      this.actionAppointment = (event == 'reset') ? 'reset' : 'update';
      this.appointmentData = new Date().getTime();
    }

    if (this.type == 'employee_setting') {
      this.action = (event == 'reset') ? 'reset' : 'update';
      this.updateEmployeeData = new Date().getTime();
    }

    if (this.type == 'general_setting') {
      this.updateGeneralSetting = new Date().getTime();
    }
    if (this.type == 'visitor_setting') {
      this.action = (event == 'reset') ? 'reset' : 'update';
      this.updateVisitorSetting = new Date().getTime();
    }

    // if (event == 'reset') {
    //   console.log(event);

    //   this.fromSideBar.emit({ type: this.type, reset: true })
    // }
    // else {
    //   this.fromSideBar.emit({ type: this.type, reset: false })
    // }

  }


  checkSetting(type) {
    this.invalidEmail = false;
    switch (this.type) {
      case 'appoinement_setting':
        this.title = "Appoinement Setting"
        break;
      case 'visitor_setting':
        this.title = "Visitor Setting"
        break;
      case 'employee_setting':
        this.title = 'Employee Setting'
        break;
      case 'general_setting':
        this.title = 'General Setting'
        break;
      case 'notification_setting':
        this.title = "Notification Setting"
        break;
      case 'hardware_setting':
        this.title = "Hardware Setting"
        break;
      case 'provider_master':
        this.title = "Provider Master"
        break;
      default:
        this.title = "Appoinement Setting"
        break;
    }
  }

  openDialog(type?) {
    let applyClass;
    console.log(this.type, 'type')
    switch (this.type) {
      case "provider_master ": {
        applyClass = "vams-dialog-lg";
        break;
      }
      default: {
        applyClass = "vams-dialog";
        break;
      }
    }
    if (this.type == "provider_master") {
      const dialogRef = this.dialog.open(ProviderMasterSettingModalComponent, {
        height: "100%",
        position: { right: "0" },
        data: { "data": null, "formType": "provider_master ", "mode": "add" },
        panelClass: ['animate__animated', "vams-dialog", "animate__slideInRight"]
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.dialogClose.emit(result);
      });
    }
  }
  showInvalid(event) {
    // console.log(event);
    this.invalidEmail = JSON.parse(event)
  }
}
