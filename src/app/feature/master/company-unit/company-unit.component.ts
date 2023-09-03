import { Component, Input, OnInit, Output, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { first } from 'lodash';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { Constants } from '../constants/columns';
import { MasterService } from '../services/master.service';
@Component({
  selector: 'app-company-unit',
  templateUrl: './company-unit.component.html',
  styleUrls: ['./company-unit.component.scss']
})
export class CompanyUnitComponent implements OnInit {

  @Input() displayedColumns: any;
  @Input() companyRowData: any;
  companyUnitData: any[] = [];
  hasSearchValue: any;
  totalData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  public pageSizeOptions = [];
  public pageSize: number;
  public pageIndex: 1;
  rowData: any;
  sortingDir: string;
  sortingColumn: any;
  @Input() type: any;
  @Output() valueChange = new EventEmitter();
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  columns: any;
  showListFlag: boolean;
  globalSerach:string='';
  constructor(private masterService: MasterService) {

  }
  ngOnInit(): void {
    this.getCompanyList(this.companyRowData?.rowData)
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "asc";
    this.sortingColumn =
      this.displayedColumns &&
        this.displayedColumns[0] &&
        this.displayedColumns[0].value
        ? this.displayedColumns[0].value
        : "name";

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.displayedColumns) {
      this.columns = this.displayedColumns.map((data) => data.key);
      this.showListFlag = false;
    }

  }
  isSticky(column: string) {
    return column === "action" ? true : false;
  }

  getCompanyList(data?) {
    let reqData = {
      pageSize:  this.pageSize ?this.pageSize: defaultVal.pageSize,
      pageIndex: this.pageIndex? this.pageIndex : defaultVal.pageIndex,
      levelId: data.id,
      searchStatus: data && data.searchStatus ? data.searchStatus : defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "name",
      sortBy: this.sortingDir?this.sortingDir : "ASC",
      "globalSearch": this.globalSerach,

    }
    this.masterService.getCompanies(reqData).pipe()
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.companyUnitData = resp.data.list;
          this.totalData = resp.data.totalCount;
        }
      });
  }


  applyFilter(filterValue) {
    if (this.hasSearchValue) {
      this.globalSerach = filterValue.trim().toLowerCase();
      this.getCompanyList(this.companyRowData?.rowData)
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
    if (this.companyRowData.paginator) {
      this.companyRowData.paginator.firstPage();
    }
  }
  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }
  sortData(colName) {
    this.sortingDir = this.sortingDir == "asc" ? "desc" : "asc";
    this.sort.sort({
      id: this.sortingColumn,
      start: this.sortingDir,
    } as MatSortable);
    this.sortingColumn = colName;
    console.log(colName);
    console.log(this.sortingDir);
    
    this.getCompanyList(this.companyRowData?.rowData)
    
    // this.onDataChange.emit({type: "bio", globalSearch: this.searchKey, searchStatus: this.toggleActive? "ACTIVE" : "ALL", orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.paginator.firstPage();

  }
  getRowData(row, data) {
    this.rowData = data;
  }

  getPaginationData(event) {
    this.pageIndex =
      this.pageSize == event.pageSize
        ? event.pageIndex + 1
        : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.getCompanyList(this.companyRowData?.rowData)
  }
}
