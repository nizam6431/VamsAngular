import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AccountService } from '../services/account.service';
import { Constants } from '../constants/columns'
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { first, debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() type = new EventEmitter<string>();
  @Output() selectedComplex = new EventEmitter<string>();
  @Input() buttonClickEvent: string = "";
  @Input() searchfilter: any = {};

  columns: { key: string; value: string; }[];
  columnKeys: any = [];
  dataSource: any;
  displayGrid: string = "complex_list";
  requestObj: any = [];
  pageSize = 5;
  pageSizeOptions: any[] = [];
  pageEvent: PageEvent;
  pageSizeCount;
  totalCount: number = 0;
  pageIndex: number = 1;
  selectedComplexData: any;
  searchKey: string = "";
  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.pageSize = defaultVal.pageSize;
    this.pageSizeOptions = Object.keys(pagination)
    .filter((k) => typeof pagination[k] === "number")
    .map((label) => pagination[label]);
    this.getComplexData()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.handleEvents(changes)
    }
  }

  handleEvents(changes?) {
    if (changes['buttonClickEvent'] && changes['buttonClickEvent']['currentValue']) {
      this.handleClickEvents(changes['buttonClickEvent']['currentValue']);
    }
    if (changes['searchfilter'] && changes['searchfilter']['currentValue']) {
      this.searchKey = changes['searchfilter']['currentValue']['searchKey']
      this.getComplexData();
    }
  }

  handleClickEvents(clickedEvent) {
    switch (clickedEvent) {
      case "back":
        this.searchKey = "";
        this.displayGrid = "complex_list";
        this.getComplexData()
        // this.getColumns(this.displayGrid);
        this.type.emit(this.displayGrid);
        break;
      case "reset":
        this.updatePermissions(this.selectedComplexData);
        break;
      case "save":
        this.editPermissions();
        break;
    }
  }

  getComplexData() {
    this.dataSource = [];
    let reqObj = {
      "searchByName": "",
      "searchByDomain": "",
      "searchByShortName": "",
      "pageSize": this.pageSize,
      "globalSearch": this.searchKey,
      "pageIndex": this.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC"
    }

    this.accountService.getComplexList(reqObj).pipe(debounceTime(1000), first()).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.getColumns();
        this.dataSource = res.data.list;
        this.totalCount = res.data.totalCount
      } else {
        this.toastr.error(res.Message ? res.Message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  getPaginationData(event) {
    this.pageIndex = this.pageSize == event.pageSize ? event.pageIndex + 1 : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.pageSizeCount = event.pageSize;
    // this.onDataChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.sortPagination();
    this.getComplexData();
  }

  sortPagination() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.onDataChange.emit({searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
  }

  getColumns(type?: string) {
    this.columns = [];
    switch (type) {
      case "dynamic_permission":
        this.columns = Constants.permission_flags;
        break;
      default:
        this.columns = Constants.complex_list;
    }
    this.setColumnKeys();
  }

  setColumnKeys() {
    this.columnKeys = [];
    this.columns.map((data) => {
      this.columnKeys.push(data.key);
    });
  }

  updatePermissions(complex) {
    this.selectedComplexData = complex;
    this.selectedComplex.emit(complex.name);
    let reqObj = {
      complexId: complex.complexId
    }
    this.accountService.getComplexPermissions(reqObj).subscribe((res) => {
      if (res.statusCode == 200 && res.data) {
        this.dataSource = [];
        this.columnKeys = [];
        this.columns = [];
        this.displayGrid = "dynamic_permission";
        this.dataSource = res.data;
        this.getColumns(this.displayGrid);
        this.type.emit(this.displayGrid);

      } else {
        this.toastr.error(res.Message ? res.Message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  onChange(permissionKey, permission, data, value) {
    console.log("permissionKey => ", permissionKey, "permission => ", permission, "data =>", data, "value =>", value);
    let alreadyChanged = this.requestObj.find(d => d['permissionId'] == data['permissionId'])
    if (alreadyChanged) {
      alreadyChanged[permission] = value;
    } else {
      data[permission] = value;
      let reqObj = {
        permissionId: data['permissionId'],
        isHidden: data['isHidden'],
        isDisabled: data['isDisabled'],
        isPermissible: data['isPermissible']
      }
      this.requestObj.push(reqObj)
    }
  }
  editPermissions() {
    this.accountService.updatePermissions({ "complexId": this.selectedComplexData.complexId, "permissions": this.requestObj }).subscribe(res => {
      if (res.statusCode == 200) {
        this.toastr.success(res.message, this.translate.instant("toster_message.success"));
        this.updatePermissions(this.selectedComplexData);
      } else {
        this.toastr.error(res.message ? res.message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  showError(error) {
    if (error && error.error && 'errors' in error.error) {
      error.error.errors.forEach(element => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
      })
    }
    else {
      this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
    }
  }

  searchFilter(key) {
    this.searchKey = key;
  }
}
