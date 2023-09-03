import { Component, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { ContractorCompanyFormComponent } from '../forms/contractor-company-form/contractor-company-form.component';
import { Constants } from '../constants/columns'
import { MatDialog } from '@angular/material/dialog';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import { ToastrService } from 'ngx-toastr';
import { MasterService } from '../services/master.service';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { defaultVal } from '../../../core/models/app-common-enum';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { TranslateService } from '@ngx-translate/core';
import { ContractorFormComponent } from '../forms/contractor-form/contractor-form.component';

@Component({
  selector: 'app-contractor-company',
  templateUrl: './contractor-company.component.html',
  styleUrls: ['./contractor-company.component.scss']
})

export class ContractorCompanyComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  displayedColumns: any[] = Constants.contractor_company_column;
  dataSource: any;
  totalData: any;
  loading: boolean = true;
  isL3Admin: boolean;
  @Output() companyValueChange = new EventEmitter();
  @Output() valueChange = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private masterService: MasterService,
    private userService: UserService,
    private translate: TranslateService,
    private toastr: ToastrService,) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.isL3Admin = this.userService.isLevel3Admin();
    this.getCompanyList();
    // this.getCompaniesById();
  }

  toggleTabs(event) {
    this.companyValueChange.emit(event);
  }

  showListOfContractors(event) {
    this.valueChange.emit(event);
  }

 showList(event) {
  this.openDialogForEmp();
 }

  companyDataChange(event) {
    // if (event.type == "company") {
      this.getCompanyList(event);
    // }
  }

  openDialogForEmp() {
    let data = {
      "contractorCompanyId": 3,
      "firstName": "Priya",
      "lastName": "B",
      "isdCode": "91",
      "email": "Priya@gmail.com",
      "phone": "1212456789",
      "level2Id": null,
      "level3Id": null,
      "departmentId": 614
    }
    const dialogRef = this.dialog.open(ContractorFormComponent, {
      //width: '55%',
      height: '100%',
      position: { right: '0' },
      data: { "data": data, "formType": "company", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog-xl', 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.dialogClose(result);
    });
  }

  dialogClose(statusObj) {
    if (statusObj && statusObj.status && statusObj.type == 'company') {
      this.getCompanyList();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ContractorCompanyFormComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "formData": null, "formType": "company", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog-xl', 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if(result){
        this.dialogClosed(result);
      }
    });
  }

  dialogClosed(statusObj) {
    console.log(statusObj);
    if (statusObj?.type?.statusCode === 200 && statusObj?.type?.errors === null) {
      this.getCompanyList(statusObj);
    }
  }

  getCompanyList(data?) {
    let levelId = (this.userService.getLevel2DidForLevel2Admin()) ?
      this.userService.getLevel2DidForLevel2Admin() : null;

      let contractorObject = {
      "globalSearch": data && data.globalSearch ? data.globalSearch : "",
      "pageSize":data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      "pageIndex": data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      "orderBy":  data && data.orderBy? data.orderBy == "Unique Id"?null:data.orderBy : null,
      "orderDirection": data && (data.orderBy == null || data.orderBy == "Unique Id")?null: data && data.sortBy ? data.sortBy : "ASC",
      "level3Id": null,
      "level2Id": null,
      "status": data && data.searchStatus == "ALL" ?"INACTIVE": defaultVal.searchStatus,
    }


    this.masterService.getContractorCompanies(contractorObject).pipe(first())
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
      contractorCompanyId: event.id
    }
    this.masterService.deleteContractorCompany(obj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.getCompanyList();
        }
      });
  }

  /* Bulk Upload For the User  */
  // openDialogBulkUpload() {
  //   const dialogRef = this.dialog.open(ContractorCompanyFormComponent, {
  //     height: "100%",
  //     data: {
  //       screen: "comapny",
  //       // filepath: "level1/" + this.userDetails?.level1DisplayId + "/bulk-appointment/" + new Date().getTime() + "/",
  //       title: "comapny_bluk_upload",
  //       fileAccept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  //     },
  //     position: { right: "0" },
  //     panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
  //   });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(first())
  //     .subscribe((statusObj) => {
  //           this.getCompanyList()
  //     });
  // }
}