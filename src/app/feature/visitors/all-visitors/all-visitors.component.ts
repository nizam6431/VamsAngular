import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Constants } from '../constants/columns';
import { VisitorsService } from '../services/visitors.service'
import { defaultVal } from '../../../core/models/app-common-enum';

@Component({
  selector: 'app-all-visitors',
  templateUrl: './all-visitors.component.html',
  styleUrls: ['./all-visitors.component.css']
})
export class AllVisitorsComponent implements OnInit {

  dataSource: any;
  displayedColumns: any;
  filterData: any;
  constructor(
    private visitorServiceObj: VisitorsService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getAllVisitor();
  }

  getAllVisitor() {
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
          this.displayedColumns = Constants.all_visitor_column
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], 'Error');
          })
        }
        else {
          this.toastr.error(error.message, 'Error');
        }
        // this.dialogRef.close({ type: 'employee', status: false });
      });
  }

  commonDataChange(event) {
    this.filterData = event;
    this.getAllVisitor();
  }

}
