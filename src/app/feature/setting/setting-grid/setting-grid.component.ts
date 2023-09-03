import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';

@Component({
  selector: 'app-setting-grid',
  templateUrl: './setting-grid.component.html',
  styleUrls: ['./setting-grid.component.scss']
})
export class SettingGridComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @Input() columns;
  @Input() dataSource;
  @Input() totalCount;
  @Input() type;
  @Input() isProvidedMaster;
  @Output() rowData = new EventEmitter()
  @Output() editData = new EventEmitter()
  @Output() modeEmmiter = new EventEmitter()
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() dialogClose = new EventEmitter();
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  pageSize = 5;
  pageSizeOptions: number[];
  hasSearchValue: boolean = false;
  pageEvent: PageEvent;
  pageIndex: number = defaultVal.pageIndex;
  columnKeys: any;
  reasonData: any;
  searchKey: string = "";
  sortingDir: string = "ASC";
  sortingColumn: string = "providername";
  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.columnKeys = this.columns.map((data) => data.key);
    //  this.dataSource=this.dataSource;
  }
  ngOnInit(): void {
    this.pageSize = defaultVal.pageSize;
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
  }

  diplayRow(data, event) {
    this.rowData.emit({ data: data, event: event });
  }

  editdata(data, event) {
    this.editData.emit({ data: data, event: event });
  }

  getPaginationData(event) {
    this.pageIndex = this.pageSize == event.pageSize ? event.pageIndex + 1 : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.onDataChange.emit({
      type: this.type,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
    });
  }

  showAction(action: string, event: Event, rowData: any) {
    event.stopPropagation();
    // this.rowData = rowData;
    console.log(action, event, rowData);
    let obj = {
      mode: action,
      rowData: rowData
    }
    this.modeEmmiter.emit(obj);
  }
  cleanSearchBox(event) {
    this.searchKey = "";
    const filterValue = (event.value = "");
    this.filterData(filterValue, "globalSearch")
  }

  applyFilter() {
    this.onDataChange.emit({
      type: this.type,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      globalSearch: this.searchKey,
      orderBy: this.sortingColumn,
      orderDirection: this.sortingDir,
    });
    this.paginator.firstPage();
  }

  filterData(event, type) {
    let search = false;
    switch (type) {
      case 'pagination':
        this.pageIndex = this.pageSize == event.pageSize ? event.pageIndex + 1 : defaultVal.pageIndex;
        this.pageSize = event.pageSize;
        search = true
        break;
      case 'globalSearch':
        if (this.hasSearchValue) {
          this.searchKey = event.trim().toLowerCase();
          search = true;
        }
        if (event.length == 0) {
          this.hasSearchValue = false;
        } else {
          this.hasSearchValue = true;
        }
        break;
      case "sort":
        this.sortingDir = event.direction;
        this.sortingColumn = event.active;
        search = true;
        break;
    }
    if (search) {
      this.applyFilter();
    }
  }
}
