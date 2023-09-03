import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { contractorConfigGetAllReq } from '../constants/enum';
import { AddQuestionComponent } from '../popup/add-question/add-question.component';
import { AppointmentCancelReasonComponent } from '../popup/appointment-cancel-reason/appointment-cancel-reason.component';
import { ContractorConfigPopupComponent } from '../popup/contractor-config-popup/contractor-config-popup.component';
import { DeviceSetupPopupComponent } from '../popup/device-setup-popup/device-setup-popup.component';
import { EmailServerComponent } from '../popup/email-server/email-server.component';
import { ProviderDevicePopupComponent } from '../popup/provider-device-popup/provider-device-popup.component';
import { ProviderSetupPopupComponent } from '../popup/provider-setup-popup/provider-setup-popup.component';
import { RateCardPopupComponent } from '../popup/rate-card-popup/rate-card-popup.component';
import { ConfigureService } from '../services/configure.service';

@Component({
  selector: 'app-configure-content',
  templateUrl: './configure-content.component.html',
  styleUrls: ['./configure-content.component.scss']
})
export class ConfigureContentComponent implements OnInit, OnChanges {
  @Input() type: string;
  @Output() dialogClose = new EventEmitter()
  refreshData: any = null;
  refreshDeviceSetupList: any = null;
  refreshAccessSetup: any = null;
  // @Output() dialogClose = new EventEmitter();
  permissionsEvent = null
  // type:string="bio-security-device";
  title: string;
  ndaUploadFile = null;
  privacyUploadFile = null;
  termsConditionUploadFile = null;
  privacyUploadVisitorFile = null;
  termsConditionUploadVisitorFile = null;
  uploadEnable: boolean;
  // addFormResult:any=null
  providerDevice: boolean = false;

  isDropDown: boolean = false;
  cancelReaon: any;
  aaptCancelReasonAdd: any = null;
  hsqQuestionAdd: any = null;
  addFormResult: any = null
  editBannerImage: boolean = false;
  saveBtnFlag: boolean = false;
  saveBannerImage: any = null;
  dynamicPermission: number = new Date().getTime();
  addDevice: boolean = false;
  contractorConfigAdd: number;
  refreshRateCard: number;
  get_all_template_obj = new contractorConfigGetAllReq()


  constructor(
    public dialog: MatDialog,
    private configureService: ConfigureService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['type'] && changes['type']['currentValue']) {
      this.type = changes['type']['currentValue'];
      this.checkSetting(this.type)
      this.saveBtnFlag = false;
      this.editBannerImage = false;
      this.saveBannerImage = 'error'
    }
  }


  ngOnInit(): void {
    this.saveBtnFlag = false;
  }


  checkSetting(type) {
    switch (type) {
      case 'email_server_config':
        this.title = this.translate.instant("Configure.email_server_config");
        break;
      case 'sms_server_config':
        this.title = this.translate.instant("Configure.sms_server_config");
        break;
      case 'HSQ_master_for_visitor_and_employee':
        this.title = this.translate.instant("Configure.hsq_master_for_visitor_and_employee");
        break;
      case 'email_templates':
        this.title = this.translate.instant("Configure.emial_template");
        break;
      case 'appointment_reject_reason_master':
        this.title = this.translate.instant("Configure.appointment_cancel_reason");
        break;
      case 'NDA':
        this.title = this.translate.instant("Configure.nda");
        break;
      case 'employee_form':
        this.title = this.translate.instant("Configure.employee_form");
        break;
      case 'role_master':
        this.title = this.translate.instant("Configure.role_master");
        break;
      case 'terms_condition':
        this.title = this.translate.instant("Configure.term_&_condition");
        break;
      case 'privacy_policy':
        this.title = this.translate.instant("Configure.privacy_policy");
        break;
      case 'banner_image':
        this.title = this.translate.instant("Configure.banner_image");
        break;
      case 'HSQ_screening_questionnaire':
        this.title = this.translate.instant("Configure.HSQ_screening_questionnaire");
        break;
      case 'terms_condition_visitor':
        this.title = this.translate.instant("Configure.terms_condition_visitor");
        break;
      case 'privacy_policy_visitor':
        this.title = this.translate.instant("Configure.privacy_policy_visitor");
        break;
      case 'dynamic_permissions':
        this.title = this.translate.instant("Configure.dynamic_permissions");
        break;
      case 'provider_setup':
        this.title =this.translate.instant("Configure.provider_setup")
        break;
      case 'provider_device':
        this.title = "Provider Device Details"
        break;
      case 'sms_template':
        this.title = this.translate.instant("Configure.sms_template");
        break;
      case 'email_template':
        this.title = this.translate.instant("Configure.email_templates");
        break;
      case 'contractor_config_field':
        this.title = this.translate.instant("Configure.contractor_config_field");
        break;
      case 'rateCard':
        this.title = this.translate.instant("configure_side_manu.rateCard");
        break;
      default:
        this.title = this.translate.instant("Configure.email_server_config");
        break;
    }
  }


  openDialog(type?) {
    let applyClass;
    switch (this.type) {
      case "bio-security-device": {
        applyClass = "vams-dialog-lg";
        break;
      }
      case "appointment_reject_reason_master": {
        applyClass = "vams-dialog-lg";
        break;
      }
      case "HSQ_screening_questionnaire": {
        applyClass = "vams-dialog-lg";
        break;
      }
      case "contractor_config": {
        applyClass = "vams-dialog-lg";
        break;
      }
      case "rateCrad": {
         applyClass = "vams-dialog";
        break;
      }
      default: {
        applyClass = "vams-dialog";
        break;
      }
    }
    let dialogDataObj = {
      // data: this.rowData,
      // formType: this.type,
      // mode: this.mode,
    };
    if (this.type == "appointment_reject_reason_master") {
      const dialogRef = this.dialog.open(AppointmentCancelReasonComponent, {
        height: "100%",
        position: { right: "0" },
        data: { "data": null, "formType": "email_server_config", "mode": "add" },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });

      dialogRef.afterClosed().subscribe((result) => {
        // this.dialogClose.emit(result);
        this.aaptCancelReasonAdd = new Date().getTime();
      });
    }

    if (this.type == "email_server_config") {
      const dialogRef = this.dialog.open(EmailServerComponent, {
        height: '100%',
        position: { right: '0' },
        data: { "data": null, "formType": "email_server_config", "mode": "add" },
        panelClass: ['animate__animated', 'vams-dialog-lg', 'animate__slideInRight']
      });
      dialogRef.afterClosed().subscribe((result) => {
        // this.dialogClose.emit(result);
        this.addFormResult = result;
      });
    }


    if (this.type == "HSQ_screening_questionnaire") {
      const dialogRef = this.dialog.open(AddQuestionComponent, {
        height: '100%',
        position: { right: '0' },
        data: { "data": null, "formType": "HSQ_screening_questionnaire", "mode": "add" },
        panelClass: ['animate__animated', 'vams-dialog-lg', 'animate__slideInRight']
      });
      dialogRef.afterClosed().subscribe((result) => {
        // this.dialogClose.emit(result);
        // this.addFormResult = result;
        this.hsqQuestionAdd = new Date().getTime();
      });
    }

    if (this.type == "contractor_config_field") {
      const dialogRef = this.dialog.open(ContractorConfigPopupComponent, {
        height: '100%',
        width: '100%',
        position: { right: '0' },
        data: { "data": null, "mode": "add", level2Id: this.get_all_template_obj.level2Id },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.statusCode == 200) {
          this.contractorConfigAdd = new Date().getTime();
        }
      });
    }
     if (this.type == "rateCard") {
      const dialogRef = this.dialog.open(RateCardPopupComponent, {
        height: '100%',
        width: '60%',
        position: { right: '0' },
        data: { "data": null, "mode": "add", level2Id: this.get_all_template_obj.level2Id },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.statusCode == 200) {
          this.refreshRateCard = new Date().getTime();
        }
      });
    }
  }

  addNewAccessSetup() {
    const dialogRef = this.dialog.open(ProviderDevicePopupComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": null, "formType": "email_server_config", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.addFormResult = result;
      console.log(result);
      this.refreshAccessSetup = new Date().getTime()
    });

  }
  uploadPdfFile() {
    if (this.type == "NDA") {
      this.ndaUploadFile = new Date().getTime();
    } else if (this.type == 'privacy_policy') {
      this.privacyUploadFile = new Date().getTime();
    } else if (this.type == 'terms_condition') {
      this.termsConditionUploadFile = new Date().getTime();
    } else if (this.type == 'privacy_policy_visitor') {
      this.privacyUploadVisitorFile = new Date().getTime();
    } else {
      this.termsConditionUploadVisitorFile = new Date().getTime();
    }

  }
  cancelPdfFile() {

  }

  fileUpload(event) {
    if (event && event.status === 'success') {
      this.uploadEnable = true;
    }
    else {
      this.uploadEnable = false;
    }
    if (event && event.fileUpload === 'success') {
      this.uploadEnable = false;
    }
  }
  // Provider Setup Related function here 
  addNewProvide() {
    const dialogRef = this.dialog.open(ProviderSetupPopupComponent, {
      width: '50%',
      height: '100%',
      position: { right: '0' },
      data: { "data": null, "formType": "provider_setup", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData = new Date().getTime()
    });
  }
  changeFooterbtn(event) {
    this.providerDevice = event;
  }
  editBannerLogo() {
    this.editBannerImage = true;
    this.saveBtnFlag = false;
    this.saveBannerImage = 'error'
  }
  uploadBannerLogo() {
    this.saveBannerImage = 'success';
    this.editBannerImage = false;
  }
  changeFooterBtn() {
    this.editBannerImage = false;
    this.saveBtnFlag = false;
  }
  saveButtonDisbale(event) {
    this.saveBtnFlag = event;
  }

  permissionEvents(event) {
    this.dynamicPermission = new Date().getTime();
    this.permissionsEvent = event;
  }
  addNewBuilding() {
    const dialogRef = this.dialog.open(DeviceSetupPopupComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": null, "formType": "provider_setup", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.refreshData = null;
      this.refreshDeviceSetupList = new Date().getTime()
    });
  }
  addNewDeviceBtn(event) {
    if (event) {
      this.providerDevice = !event;
      this.addDevice = event;
    } else {
      this.providerDevice = false;
      this.addDevice = event;
    }

  }

  getContractorConfig(event: contractorConfigGetAllReq) {
    this.get_all_template_obj = event
  }
}
