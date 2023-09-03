import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { defaultVal, pagination_ } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-seepz-general-ledger-grid',
  templateUrl: './seepz-general-ledger-grid.component.html',
  styleUrls: ['./seepz-general-ledger-grid.component.scss']
})
export class SeepzGeneralLedgerGridComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  @Input() columns;
  displayColumns :any;
  @Input() dataSource;
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  @Input() type;
  @Input() resetLocation = false;
  @Input() displayedColumns;
  @Input() totalCount;
  @Input() pageSizeCount;
  @Input() postDocumentData;
  @Input() originalpostDocumentData;
  pageSize: defaultVal.pageSize;
  @Output() searchEmittor = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() companyValueChange = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  @Output() changeDocumentList = new EventEmitter();
  @Input() testDate ;
  isViewOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWONLY];
  isEditOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWEDIT];
  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  public pageIndex: 1;
  columnKeys: any;
  hasSearchValue: boolean;
  searchKey: any;
  sortingDir: string = "";
  sortingColumn: string = "";
  showSearchBox = []
  productType: any;
  isEnterprise: boolean;
  mode: any;
  constructor(
    private userService: UserService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
   
    if (changes && changes.dataSource && changes.dataSource.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
    }
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
    }
  }

  ngOnInit(): void { 
    this.pageSizeOptions = Object.keys(pagination_)
      .filter((k) => typeof pagination_[k] === "number")
      .map((label) => pagination_[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "ASC";
    this.columnKeys = this.columns.map((data) => data.key);
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
    this.pageSizeCount = event.pageSize;
    this.onDataChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
   // this.sortPagination();
  }

  diplayRow(data) {
    this.rowData.emit(data);
  }
}
