import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Constants } from '../constants/columns';
import { VisitorsService } from '../services/visitors.service'
import { defaultVal } from '../../../core/models/app-common-enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmReasonComponent } from 'src/app/shared/components/confirm-reason/confirm-reason.component';
import { ShowRestricedVisitorDetailsComponent } from '../show-restriced-visitor-details/show-restriced-visitor-details.component';
@Component({
  selector: 'app-blacklisted',
  templateUrl: './blacklisted.component.html',
  styleUrls: ['./blacklisted.component.scss']
})
export class BlacklistedComponent implements OnInit {
  filterData: any;

  constructor(
    public dialog: MatDialog,
    private visitorsService: VisitorsService,
    private visitorServiceObj: VisitorsService,
    private toastr: ToastrService,
  ) { }
  displayedColumns: any[] = Constants.blacklisted_columns;
  dataSource: any;
  totalData: any;
  ngOnInit(): void {
    this.getRestrictedVisitorsList();
  }

  unblockUser(row) {
    const dialogRef = this.dialog.open(ConfirmReasonComponent, {
      data: {
        visitorType: row.visitorDataShowType,
      },
      panelClass: ["animate__animated", "vams-dialog-sm", "vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
      }
    });
  }

  gridRowClick(rowData) {
    this.openRestrictedVisitor(rowData);
  }

  openRestrictedVisitor(rowData) {
    const dialogRef = this.dialog.open(ShowRestricedVisitorDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   this.dialogClose.emit(result);
    // });
  }

  visitorDataChange(event) {
    this.filterData = event;
    this.getRestrictedVisitorsList();
  }
  getRestrictedVisitorsList(data?) {
    let visitorObj = {
      pageSize: this.filterData && this.filterData.pageSize ? this.filterData.pageSize : defaultVal.pageSize,
      pageIndex: this.filterData && this.filterData.pageIndex ? this.filterData.pageIndex : defaultVal.pageIndex,
      orderBy: this.filterData && this.filterData.orderBy ? this.filterData.orderBy : "firstName",
      orderDirection: this.filterData && this.filterData.sortBy ? this.filterData.sortBy : "ASC",
      globalSearch: this.filterData && this.filterData.globalSearch ? this.filterData.globalSearch : "",
    }
    this.visitorServiceObj.getRestrictedVisitorsList(visitorObj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.displayedColumns = Constants.blacklisted_columns
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], 'Error');
          })
        }
        else {
          this.toastr.error(error.error.Message, 'Error');
        }
        // this.dialogRef.close({ type: 'employee', status: false });
      });
  }
}
