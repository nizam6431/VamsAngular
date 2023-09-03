import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../../../constants/column';
import { ConfigureService } from '../../../services/configure.service';
import { ProviderService } from '../../../services/provider.service';
import { MatDialog } from '@angular/material/dialog';
import { DeviceSetupPopupComponent } from '../../../popup/device-setup-popup/device-setup-popup.component';
import { first } from 'rxjs/operators';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { defaultVal, ProductTypes } from 'src/app/core/models/app-common-enum';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-device-setup',
  templateUrl: './device-setup.component.html',
  styleUrls: ['./device-setup.component.scss']
})
export class DeviceSetupComponent implements OnInit, OnChanges {
  providerData: any;
  requestObject: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; globalSearch: any; };
  totalCount: number=0
  @Input() detailsDeta;
  @Input() deviceRefresh;
  @Output() back = new EventEmitter()
  columns: any[] = Constants.device_setup;
  dataSource: any;
  data: any;
  mode: string;
  type: string = 'provider_details'
  productType: any;
  ProductType = ProductTypes;
  constructor(
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private configureService: ConfigureService,
    private translate: TranslateService,
      private userService:UserService,
    public dialog: MatDialog,) { }
  
  ngOnInit(): void {
     this.productType = this.userService.getProductType();
    this.providerData = this.configureService.providerDetails;
    this.dataSendToBackend();
    this.getDeviceList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (this.detailsDeta) {
    //   this.providerData = this.detailsDeta;
    // }
    if (this.deviceRefresh) {
      this.providerData = this.configureService.providerDetails;
      this.getDeviceList();
    }
  }
  gotoProviderSetup() {
    this.back.emit();
  }
  getSearchtext(searchKey) {
    this.requestObject.globalSearch = searchKey;
    this.getDeviceList();
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
  rowData(event: any) {
    this.data = event;
    this.mode = "show";
     this.openDialog()
  }
  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Device Setup",
        name: rowData.buildingName,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteDeviceSetup(rowData);
      }
    });
  }
  deleteDeviceSetup(rowData) {
    let obj = {
      "id": rowData.id
    }
    this.providerService.deleteDeviceSetup(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.getDeviceList();
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(DeviceSetupPopupComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "device setup", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.getDeviceList();
    });
  }
  dataSendToBackend(data?: any) {
    this.requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : null,
      orderDirection: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
    };
  }
  getDeviceList(data?: any) {
    this.providerData = this.configureService.providerDetails;
    this.requestObject['providerSetupId'] = this.providerData['id'],
    this.providerService.getAllDeviceSetup(this.requestObject)
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
