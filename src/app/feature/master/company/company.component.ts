import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Constants } from '../constants/columns'
import { MatDialog } from '@angular/material/dialog';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../services/master.service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { defaultVal, ProductTypes } from '../../../core/models/app-common-enum';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnChanges {
  permissionKeyObj = permissionKeys;
  displayedColumns: any[] = Constants.company_column;
  displayedColumns1: any[] = Constants.company_column_Hospital;
  dataSource: any;
  totalData: any;
  loading: boolean = true;
  isL3Admin: boolean;
  @Output() valueChange = new EventEmitter();
  ProductType = ProductTypes;
  productType: string;
  dynamicReq: any;
  constructor(
    public dialog: MatDialog,
    private masterService: MasterService,
    private userService: UserService,
    private translate: TranslateService,
    private toastr: ToastrService,) {
      this.productType = this.userService.getProductType();
     }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.isL3Admin = this.userService.isLevel3Admin();
    this.getCompanyList();
    // this.getCompaniesById();

    if (this.productType == ProductTypes.Hospital) {
      this.displayedColumns = this.displayedColumns1 
    }else{
      this.displayedColumns
    }
  }

  toggleTabs(event) {
    this.valueChange.emit(event);
  }

  companyDataChange(event) {
    console.log(event);
    this.dynamicReq=event
    if (event.type == "company") {
      this.getCompanyList(event);
    }
  }

  openDialog(screenType: string) {
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      //width: '55%',
      height: '100%',
      position: { right: '0' },
      data: { "data": null, "formType": "company", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog-xl', 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.dialogClosed(result);
    });
  }
  dialogClosed(statusObj) {
    if (statusObj && statusObj.status && statusObj.type == 'company') {
      this.getCompanyList(this.dynamicReq);
      console.log(statusObj);
    }
  }

  getCompanyList(data?) {
  console.log(data)
    let levelId = (this.userService.getLevel2DidForLevel2Admin()) ?
      this.userService.getLevel2DidForLevel2Admin() : null;
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      levelId: levelId,
      searchStatus: data && data.searchStatus ? data.searchStatus : defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "name",
      sortBy: data && data.sortBy ? data.sortBy : "ASC",
      "globalSearch": data && data.globalSearch ? data.globalSearch : "",

    }
    this.masterService.getCompanies(reqData).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalData = resp.data.totalCount;
        }
      });
  }
  getCompaniesById() {
    this.masterService.getCompaniesById('a0b869e0-e1ae-4167-9df1-6acc17573168').pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
        }
      });
  }
  deleteCompany(event) {
    let obj = {
      level3Id: event.level3Id
    }
    this.masterService.deleteCompany(obj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.getCompanyList(event);
        }
      });
  }

  /* Bulk Upload For the User  */
  openDialogBulkUpload() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      height: "100%",
      data: {
        screen: "comapny",
        // filepath: "level1/" + this.userDetails?.level1DisplayId + "/bulk-appointment/" + new Date().getTime() + "/",
        title: "comapny_bluk_upload",
        fileAccept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((statusObj) => {
            this.getCompanyList(this.dynamicReq)
      });
  }
}
