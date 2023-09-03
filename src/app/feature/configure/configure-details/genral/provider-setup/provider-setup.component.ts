import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants } from '../../../constants/column';
import { MatDialog } from '@angular/material/dialog';
import { ProviderSetupPopupComponent } from '../../../popup/provider-setup-popup/provider-setup-popup.component';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { ConfigureService } from '../../../services/configure.service';
import { ProviderService } from '../../../services/provider.service';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { bool } from 'aws-sdk/clients/signer';
import { ConfirmLoginComponent } from 'src/app/shared/components/confirm-login/confirm-login.component';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
@Component({
  selector: 'app-provider-setup',
  templateUrl: './provider-setup.component.html',
  styleUrls: ['./provider-setup.component.scss']
})
export class ProviderSetupComponent implements OnInit,OnChanges{
  showDetails: boolean = false;
  showDeviceSetup: boolean = false;
  showProviderSetup: boolean = true;
  // columns: any[] = Constants.provider_setup_commercial;
  columns: any;
  dataSource = [];
  originalDataSource = JSON.parse(JSON.stringify(this.dataSource));
  data: any;
  mode: string;
  deviceDetailsFlag: boolean = true;
  searchTexts: string;
  detailsDeta: any;
  type: string = 'provider_setup';
  totalCount: number = 0;
  @Output() changeFooter = new EventEmitter()
  @Output() addDeviceEmmiter = new EventEmitter() 
  @Input() refreshData;
  @Input() refreshDeviceSetupList;
  @Input() refreshAccessSetup;
  deviceRefresh: any = null;
  accessSetupRefresh: any = null;
  requestObject: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; globalSearch: any;level2Id:any };
  providerMasterList: any[]=[];
  userDetails: any;
  productType: any;
  constructor(public dialog: MatDialog,
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private translate: TranslateService,
     private userService: UserService,
    private configureService: ConfigureService) { 
     this.userDetails = this.userService.getUserData();
    }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshData) {
      this.getProviderList();
    } if (this.refreshDeviceSetupList) {
      this.deviceRefresh = this.refreshDeviceSetupList;
    } if (this.refreshAccessSetup) {
      this.accessSetupRefresh = this.refreshAccessSetup;
    }
  }

  ngOnInit(): void {
    this.productType = this.userService.getProductType();
  
    if (this.productType == ProductTypes.Commercial) { 
      this.columns = Constants.provider_setup_commercial;
    } else if (this.productType == ProductTypes.Enterprise) {
      this.columns = Constants.provider_setup_enterprise;
    }
    // console.log(this.productType);
    // console.log( this.columns);
    this.dataSendToBackend();
    this.getProviderList();
  }
  rowData(event: any) {
    this.data = event;
    this.mode = "show";
    this.openDialog()
  }
  getDetails(){
    this.dataSendToBackend();
    let apicall = [];
    apicall.push(this.providerService.getProviderList(this.requestObject));
    apicall.push(this.providerService.getProviderMasterList());
    forkJoin(apicall).subscribe((resp)=>{
      if(resp && resp[0]){
        this.dataSource = resp[0]['data']['list'];
      }
      if(resp && resp[1]){
        this.providerMasterList = resp[1]['data']['list'];
      }
    })
  }

  dataSendToBackend(data?: any) {
    let level2id = null;
    if (this.userDetails.level2List.length > 0) {
      this.userDetails.level2List.map(element => {
        if (element.isDefault) {
          level2id = this.userDetails.level2List[0]['id'];
        }
      })
    }

    this.requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : null,
      orderDirection: data && data.sortBy ? data.sortBy : "DESC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      level2Id :level2id
    };
  }
  getProviderList(data?: any) {
    this.providerService.getProviderList(this.requestObject)
    .subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.dataSource = resp.data.list;
        this.totalCount = this.dataSource.length;
      } else {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.error"));
      }
    })
    
  }

  getProviderMasterList(){
    this.configureService.getProviderMasterList()
    .subscribe(resp => {
      // this.dataSource = resp.data.list;
    })
  }

  getProviderServer(){
    let obj = {
      "pageSize": 20,
      "pageIndex": 1,
      "orderBy": "",
      "orderDirection": ""
    }
    this.providerService.getProviderServer(obj)
    .subscribe(resp => {
      // this.dataSource = resp.data.list;
    })
  }
 
  openDialog() {
    const dialogRef = this.dialog.open(ProviderSetupPopupComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "email_server_config", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProviderList()
    });
  }
  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Provider Setup",
        name: rowData.name,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProvider();
      }
    });
  }
  deleteProvider() {
    let id = this.data.id;
    this.providerService.deleteProvider(id).subscribe(resp => {
    if (resp.statusCode === 200 && resp.errors === null) {
      this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
      this.getProviderList();
    }
  }, error => {
  if ('errors' in error.error) {
    error.error.errors.forEach(element => {
      this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
    })
  }
  else {
    this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error") );
  }
});
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
  searchTextEnterKey() {
      // this.sendSearchTexts.emit(this.searchTexts);
  }

  getproviderDetails(data) {
    
    this.detailsDeta = data;
    this.showDetails = true
    this.showProviderSetup = false;
    this.changeFooter.emit(true);
  }
  deviceSetup(event) {
    this.showDetails = false;
    this.showDeviceSetup = true;
    this.showProviderSetup = false;
    this.addDeviceEmmiter.emit(true);
  }

  back(event) {
    this.showProviderSetup = true;
    this.showDetails = false;
    this.showDeviceSetup = false;
    this.addDeviceEmmiter.emit(false);
  }

  getSearchtext(searchKey) {
    this.requestObject.globalSearch = searchKey;
    this.getProviderList();
  }
  providerSetupRequestData(data) {
    // console.log(data);
    this.requestObject.orderBy = data.orderBy;
    this.requestObject.orderDirection = data.sortBy;
    this.getProviderList(this.requestObject); 
  }

}
