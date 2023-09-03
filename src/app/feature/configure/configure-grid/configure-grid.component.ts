import { toRelativeImport } from '@angular/compiler-cli/src/ngtsc/file_system';
import { PageEvent } from '@angular/material/paginator';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { ConfigureService } from '../services/configure.service';
import { ConfirmLoginComponent } from 'src/app/shared/components/confirm-login/confirm-login.component';
import { MasterService } from '../../master/services/master.service';
import { UserService } from 'src/app/core/services/user.service';
import { ProductTypes } from "../../../core/models/app-common-enum";
@Component({
  selector: 'app-configure-grid',
  templateUrl: './configure-grid.component.html',
  styleUrls: ['./configure-grid.component.scss']
})
export class ConfigureGridComponent implements OnInit, OnChanges {
  @Input() columns;
  @Input() dataSource;
  @Input() deviceDetailsFlag;
  @Output() detailsEmittor = new EventEmitter();
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter()
  @Input() type;
  @Input() resetLocation = false;
  @Input() displayedColumns: any;
  @Input() totalCount;
  @Input() pageSizeCount;
  @Input() isSMSApproval;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() onLocationChange: EventEmitter<any> = new EventEmitter();
  @Output() deviceSetupEmmiter = new EventEmitter();
  sortingDir: string = "";
  sortingColumn: string = "";
  showSearchBox = ['provider_setup', 'provider_details', 'HSQ_screening_questionnaire']

  // @Output() modeEmmiter = new EventEmitter()
  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  public pageIndex: 1;
  columnKeys: any;
  hasSearchValue: boolean;
  searchKey: any;
  // @Input() displayedColumns: any;
  // @Input() totalCount;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // sortingDir: string = "";
  // sortingColumn: string = "";
  reasonData: any;
  pageSize: defaultVal.pageSize;
  @Output() searchEmittor = new EventEmitter();
  productType: string;
  isEnterprise: boolean = false;
  userData: any;
  locationList: Array<{ id: number, name: string }>;
  level2Id: string;
  selectedLocation: any;
  toggleActive: string;

  constructor(private translate: TranslateService,
    private configureService: ConfigureService,
    private masterService: MasterService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.userData = this.userService.getUserData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.resetLocation) {
      this.level2Id = this.userData.level1Id;
      this.selectedLocation = this.userData.level1Id;
    }
    if (this.isSMSApproval) {
      this.columns = this.columns.map(element => {
        if (element.key != 'action')
          return element
        else
          return null
      })
      this.columns = this.columns.filter(element=>(element!=null))
      this.columnKeys = this.columns.map((data) => data.key);
      // console.log(this.isSMSApproval, this.columns)
    }
  }

  ngOnInit(): void {
    console.log(this.type)
    if (this.userData.productType == "Enterprise") {
      console.log(this.type);
    }
    console.log(this.columns, this.userData)
    // console.log(this.type)
    if (this.isSMSApproval) {
      this.columns = this.columns.map(element => {
        if (element.key != 'action')
          return element
        else
          return null
      })
      this.columns = this.columns.filter(element=>(element!=null))
      // console.log(this.isSMSApproval, this.columns)
    }
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "ASC";
    this.sortingColumn =
      this.displayedColumns &&
        this.displayedColumns[0] &&
        this.displayedColumns[0].value
        ? this.translate.instant(this.displayedColumns[0].value)
        : null;
    this.columnKeys = this.columns.map((data) => data.key);
    this.productType = this.userService.getProductType();
    this.isEnterprise = (this.productType == ProductTypes['Enterprise']) ? true : false
    if (this.productType == ProductTypes['Enterprise'] && this.type == 'HSQ_screening_questionnaire') {
      this.locationListForEnterprise()
    }
  }

  diplayRow(data) {
    this.rowData.emit(data);
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
    this.sortPagination();
  }
  sortPagination() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    // this.onDataChange.emit({searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
  }
  showAction(action: string, event: Event, rowData: any) {
    event.stopPropagation();
    let obj = {
      mode: action,
      rowData: rowData
    }
    this.modeEmmiter.emit(obj);
  }
  deviceDetails(data) {
    this.configureService.providerDetails = data;
    this.detailsEmittor.emit(data);
  }
  deviceSetup(data) {
    this.configureService.providerDetails = data;
    this.deviceSetupEmmiter.emit(data);
  }
  searchFilter() {
    this.onDataChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir, globalSearch: this.searchKey, searchByStatus: this.toggleActive })
  }
  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }
  applyFilter(filterValue) {
    if (this.hasSearchValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.searchFilter();
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.searchEmittor.emit(this.searchKey);
  }
  removeComma(accessLevel) {
    let finalString = '';
    for (let i = 0; i < accessLevel.length; i++) {
      if (i != accessLevel.length - 1) {
        finalString = finalString + accessLevel[i].name + ',' + ' '
      } else {
        finalString = finalString + accessLevel[i].name
      }
    }
    return finalString
  }

  onLevel2Select(event) {
    if (event == this.userData.level1Id) {
      this.level2Id = null;
    } else {
      this.level2Id = event;
    }
    this.configureService.setLocation(this.level2Id)
    this.onLocationChange.emit(this.level2Id)
  }

  locationListForEnterprise() {
    let reqData = {
      pageSize: defaultVal.pageSize,
      pageIndex: defaultVal.pageIndex,
      searchStatus: defaultVal.searchStatus,
      orderBy: "name",
      sortBy: "ASC",
      globalSearch: "",
    };
    this.masterService.getBuildings(reqData).pipe(first()).subscribe((resp) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.locationList = resp.data.list;
        this.locationList.splice(0, 0, { name: this.userData?.levelName, id: this.userData.level1Id });
        this.selectedLocation = this.userData.level1Id;
      } else {

      }
    }, (error) => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    });
  }

  onToggle(event) {
    if (!event) {
      this.toggleActive = "INACTIVE";
    } else {
      this.toggleActive = "ACTIVE";
    }
    this.searchFilter()
  }
  sortData(data) {
    console.log(data);
    this.sortingDir = data.direction;//this.sortingDir == 'asc' ? 'desc' : 'asc'
    // this.sort.sort(({ id: '', start: '', }) as MatSortable);
    this.sortingColumn = data.active;
    this.onDataChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: data.active, sortBy: data.direction })
    this.paginator.firstPage();
  }
}
