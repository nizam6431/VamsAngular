import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants } from '../../../constants/column';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { ProviderDevicePopupComponent } from '../../../popup/provider-device-popup/provider-device-popup.component';
import { ConfigureService } from '../../../services/configure.service';
import { ProviderService } from '../../../services/provider.service';
import { ToastrService } from 'ngx-toastr';
import { defaultVal, ProductTypes } from 'src/app/core/models/app-common-enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-provider-device-details',
  templateUrl: './provider-device-details.component.html',
  styleUrls: ['./provider-device-details.component.scss']
})
export class ProviderDeviceDetailsComponent implements OnInit,OnChanges{
  columns: any[] = Constants.provider_device_detail;
  dataSource: any;
  data: any;
  mode: string;
  @Input() detailsDeta;
  @Input() accessSetupRefresh;
  @Output() back = new EventEmitter()
  type: string = 'provider_details'
  // originalDataSource = JSON.parse(JSON.stringify(this.dataSource));
  providerData: any;
  requestObject: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; globalSearch: any; providerSetupId:any };
  totalCount: number;
  productType: any;
  ProductType = ProductTypes;
  constructor(
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private configureService: ConfigureService,
    public dialog: MatDialog, 
    private translate: TranslateService,
     private userService:UserService,
  ) { }                     
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.detailsDeta) {
      this.providerData = this.detailsDeta;
    }
    if (this.accessSetupRefresh) {
      this.providerData = this.configureService.providerDetails;
      this.getAccessSetupList();
    }
  }
  
  ngOnInit(): void {
     this.productType = this.userService.getProductType();
    this.providerData = this.configureService.providerDetails;
    this.dataSendToBackend();
    this.getAccessSetupList();
  }

  rowData(event: any) {
    this.data = event;
    this.mode = "show";
    this.openDialog()
  }

  changeMode(event) {
    this.data = event.rowData;
    this.mode = event.mode;
    if (this.mode == "delete") {
      this.openDialogForDelete(this.data);
    } else {
      this.openDialog()
    }
  }
  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Access Setup",
        name: rowData.buildingName,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result)
      {
        this.deleteAccessSetup(rowData)
      }
    });
  }
  deleteAccessSetup(rowData) {
    let obj = {
      id: rowData.id
    }
    this.providerService.deleteAccessSetup(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.getAccessSetupList();
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(ProviderDevicePopupComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "email_server_config", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAccessSetupList();
      }
    });
  }
  gotoProviderSetup() {
    this.back.emit();
  }
  getSearchtext(searchKey) {
    this.requestObject.globalSearch = searchKey;
        // get all api call
    this.getAccessSetupList();
  }
  dataSendToBackend(data?: any) {
    this.requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : null,
      orderDirection: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      providerSetupId: this.providerData['id']
    }
  }
  getAccessSetupList(data?: any) {
    this.providerData = this.configureService.providerDetails;
    this.providerService.getAllAccessSetup(this.requestObject)
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalCount = this.dataSource.length;
        } else {
          this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.error"));
        }
      })
  }
}

