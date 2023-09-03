import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { Constants } from '../../constant/column';
import { ProviderMasterSettingModalComponent } from '../../popup/provider-master-setting-modal/provider-master-setting-modal.component';
import { SettingServices } from '../../services/setting.service';
import { defaultVal } from 'src/app/core/models/app-common-enum';

@Component({
  selector: 'app-provider-master',
  templateUrl: './provider-master.component.html',
  styleUrls: ['./provider-master.component.scss']
})
export class ProviderMasterComponent implements OnInit {
  @Input() formData: any;
  @Output() modeEmmiter = new EventEmitter();
  columns: any[] = Constants.provider_master;
  displayedColumns: any[];
  mode: string = "show";
  data: any;
  dataSource: any;
  private validationMessages: { [key: string]: { [key: string]: string } };
  reasonData: any;
  pageSize: any;
  pageIndex: number = 1;
  orderBy: string = "providername"; 
  orderDirection: string = "ASC"
  totalCount: any;
  globalSearch: string = "";
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private settingService: SettingServices,
    private translate: TranslateService,
  ) {
    this.pageSize = defaultVal.pageSize;
  }

  ngOnInit(): void {
    this.providerMasterData();
  }

  providerMasterData() {
    let reqObj = {
      "pageSize": this.pageSize,
      "pageIndex": this.pageIndex,
      "globalSearch": this.globalSearch,
      "orderBy": this.orderBy,
      "orderDirection": this.orderDirection
    }
    this.settingService.getproviderMasterList(reqObj).subscribe(res => {
      if (res.statusCode && res.statusCode == 200) {
        this.totalCount = res.data.totalCount
        this.dataSource = res.data.list;
      } else {
        this.toastr.error(res.message ? res.message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    });
  }

  rowData(eventObj: any) {
    this.data = eventObj.data;
    this.mode = "show";
    this.openDialog(eventObj.event)
  }

  editData(eventObj: any) {
    this.data = eventObj.data;
    this.mode = "edit";
    this.openDialog(eventObj.event)
  }

  openDialog(event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ProviderMasterSettingModalComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "appointment_reject_reason_master", "mode": this.mode },
      panelClass: ['animate__animated', "vams-dialog", "animate__slideInRight"]
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.providerMasterData();
      }

      // this.getReasonData();

    });
  }

  //TODO: Need to remove delete functionality once confirm that it is not required here
  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Appointment Cancel Reason",
        name: rowData.reason,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.modeEmmiter.emit(rowData);
      //  this.deleteReasonData(rowData);
    });
  }
  changeMode(event) {
    this.data = event.rowData;
    this.mode = event.mode;
    if (this.mode == "delete") {
      this.openDialogForDelete(this.data);
    } else {
      this.openDialog(event)
    }
  }

  deleteReasonData() { }

  onDataChange(event) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.globalSearch = event.globalSearch;
    this.orderDirection = event.orderDirection;
    this.orderBy = event.orderBy;
    this.providerMasterData();
  }

  showError(error) {
    if (error && error.error && 'errors' in error.error) {
      error.error.errors.forEach(element => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
      })
    }
    else {
      this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
    }
  }
}

