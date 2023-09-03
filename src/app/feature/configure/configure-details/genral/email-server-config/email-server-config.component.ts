import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EmailServerComponent } from '../../../popup/email-server/email-server.component';
import { MatDialog } from '@angular/material/dialog';
// import { Constants } from 'src/app/feature/appointment/constants/columns';
import { Constants } from 'src/app/feature/configure/constants/column'
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { ConfigureService } from '../../../services/configure.service';
import { GetAllEmailConfig } from '../../../models/config-models';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { productType } from 'src/app/feature/master/constants/dropdown-enums';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-email-server-config',
  templateUrl: './email-server-config.component.html',
  styleUrls: ['./email-server-config.component.scss']
})
export class EmailServerConfigComponent implements OnInit ,OnChanges{
  // dataSource=ELEMENT_DATA;
  columns: any[];
  dataSource = [];
  data: any;
  mode: string = "show";
  type:"email_server"
  public hasSearchValue: boolean = false;
  searchKey: string = "";
  clearSerach :any ;

  @Input() addFormResult;
 @Input() pageSize: number;
  // pageSize: any;
  totalCount: any;
  userData: any;

  constructor(public dialog: MatDialog,
    private configureService: ConfigureService,
    private toastrService: ToastrService,
    private translate: TranslateService,
     private userService: UserService,
  ) { 
     this.userData = this.userService.getUserData();
    }
  ngOnChanges(changes: SimpleChanges): void {
    this.getMailServerList();
  }

  ngOnInit(): void {
     if (this.userData.productType == "Enterprise") {
      console.log(this.type);
       this.columns = Constants.email_server_enterprise;
     } else {
       this.columns = Constants.email_server;
    }
   this.getMailServerList();
  }

  applyFilter(filterValue, clearSearch = false) {
    // if(this.hasSearchValue && this.type == 'email_server_config')
    if(this.hasSearchValue )
    {
      this.searchKey = filterValue.trim().toLowerCase();
    }
    else{
      this.searchKey = filterValue.trim().toLowerCase();
    }
    if (clearSearch) {
      this.getMailServerList();
    }
    let data = {
      globalSearch: filterValue,
      orderBy: "server",
      orderDirection: "ASC",
      pageIndex: 1,
      pageSize: 25
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
      this.getMailServerList()
    } else {
      this.hasSearchValue = true;
        setTimeout(()=>{ 
          if(this.searchKey === filterValue){
          data.globalSearch = filterValue;
          //console.log(data.globalSearch, filterValue, this.searchKey)
          this.getMailServerList(data)
        }
        }, 500);
    }
  }

  applyFilter_(filterValue, clearSearch = false) {
    if(this.hasSearchValue ){
      this.searchKey = filterValue.trim().toLowerCase();
    }
    else{
      this.searchKey = filterValue.trim().toLowerCase();
    }
    let data = {
      globalSearch: filterValue,
      orderBy: "server",
      orderDirection: "ASC",
      pageIndex: 1,
      pageSize: 25
    }
    if (filterValue.length > 0) {
      this.hasSearchValue = true;
      this.getMailServerList(data)
    } else {
      this.hasSearchValue = false;
      this.getMailServerList()
    }
  }

  cleanSearchBox(event?) {
    this.clearSerach= event;
    const filterValue = (event.value = "");
    this.applyFilter(filterValue, true);
  }

  getMailServerList(data?: any) { //console.log(data)
    let requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : null,
      orderDirection: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
    };

    this.configureService.getMailServerList(requestObject).subscribe(res => {
      this.dataSource = res.data.list;
      this.pageSize = res.data.pageCount
      this.totalCount = res.data.totalCount
    })
  }

  rowData(event: any) {
    this.data = event;
    this.mode = "show";
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(EmailServerComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "email_server_config", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogClosed(result);
    });
  }

  dialogClosed(statusObj) {
  if (statusObj && statusObj?.statusCode) {
    if (statusObj.statusCode === 200 && statusObj.errors == null) {
      this.getMailServerList();
    }
  }
}

  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Email Server",
        name: rowData.displayName?rowData.displayName:"",
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.deleteEmailServerConfig(rowData);
      }
    });
  }

  deleteEmailServerConfig(rowData){
    this.configureService.deleteMailServer(rowData.id).pipe(first())
    .subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {        
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.getMailServerList();
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

  refreshData(){
    this.getMailServerList();
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

  emailDataChange(event){
      this.data = event;
      this.getMailServerList(this.data);
  }
}
