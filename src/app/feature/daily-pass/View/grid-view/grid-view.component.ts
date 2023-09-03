import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { defaultVal, pagination_, ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { MasterService } from 'src/app/feature/master/services/master.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { DetailPageViewComponent } from '../../popup/detail-page-view/detail-page-view.component';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'lodash';

@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {

  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  public pageIndex: 1;
  columnKeys: any;
  hasSearchValue: boolean;
  searchKey: any;

  @Input() columns;
  @Input() dataSource;
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  @Input() type;
  @Input() resetLocation = false;
  @Input() displayedColumns;
  @Input() totalCount;
  @Input() pageSizeCount;
  @Input() categoryType;
  pageSize: defaultVal.pageSize;
  @Output() searchEmittor = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();

  sortingDir: string = "";
  sortingColumn: string = "";
  showSearchBox = []
  productType: any;
  isEnterprise: boolean;
  selfPhotoUrl: any;
  toggleActive: boolean = true;
  // categoryType: any;
  constructor(
     public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private configureService: ConfigureService,
    private masterService: MasterService,
    private userService: UserService,
    private fileUploadService:FileUploadService,
    private toastr: ToastrService) { }

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
    this.productType = this.userService.getProductType();
    this.isEnterprise = (this.productType == ProductTypes['Enterprise']) ? true : false;
  }

  showAction(action: string, event: Event, rowData: any) {
    event.stopPropagation();
    let obj = {
      mode: action,
      rowData: rowData
    }
    this.modeEmmiter.emit(obj);
  }

  diplayRow(data) {
    // this.rowData.emit(data);
    this.showDetails(data);
  }
showDetails(rowData) {
    const dialogRef = this.dialog.open(DetailPageViewComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog-lg", "animate__slideInRight"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      // if (result.success) {
      //   let obj = {
      //     globalSearch: this.searchKey,
      //     orderBy: this.sortingColumn,
      //     sortBy: this.sortingDir,
      //     pageSize: this.pageSize,
          
      //   }
      //   this.rowData.emit(obj)
      // }
    });
  }
  getPaginationData(event) {
    this.pageIndex =event.pageIndex
      this.pageSize == event.pageSize
        ? event.pageIndex + 1
        : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.pageSizeCount = event.pageSize;
    this.onDataChange.emit({globalSearch: this.searchKey, pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.sortPagination();
  }
  sortPagination() {
  }
  async handleIamge(PhotoUrl, type, index) {
    let parserContent = s3ParseUrl(PhotoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
     this.selfPhotoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
     for (let i = 0; i < this.dataSource.length; i++){
       if (i == index) {
         this.dataSource[i]['photoUrl'] = this.selfPhotoUrl;
         break;
       }
     }
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
   onToggle(event: boolean) {
    if (!event) {
      this.toggleActive = false;
    } else {
      this.toggleActive = true;
    }
    this.searchFilter();
  }
  
  applyFilter(filterValue) {
    if (this.hasSearchValue) {
      this.searchKey = filterValue.trim().toLowerCase();
       if (filterValue.length >2) {
       this.searchFilter();
    }
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
      this.searchFilter();
    } else {
      this.hasSearchValue = true;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
   cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }
  changeCategory(event) {
  }
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
  searchFilter() {
    // this.pageSize = defaultVal.pageSize;
    // this.pageIndex = defaultVal.pageIndex;
   
    this.onDataChange.emit({
      type: this.type,
      globalSearch: this.searchKey,
      searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
      orderBy: this.sortingColumn,
      sortBy: this.sortingDir,
      pageSize: this.pageSize,
      pageIndex:this.pageIndex
      // passStatus:this.passStatus?.name
    });
    this.paginator.firstPage();
    this.sortPagination();
  }
}
