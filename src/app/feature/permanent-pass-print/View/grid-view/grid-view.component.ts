import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { DetailPageViewComponent } from 'src/app/feature/daily-pass/popup/detail-page-view/detail-page-view.component';
import { MasterService } from 'src/app/feature/master/services/master.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import s3ParseUrl from 's3-url-parser';
import { MatListOption } from '@angular/material/list';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
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
  @Input() isPrint;
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
  isSelecetAll: boolean = false;
  time: Date;
  constructor(private _sanitizer: DomSanitizer,
  private translate: TranslateService,
  private configureService: ConfigureService,
  private masterService: MasterService,
  private userService: UserService,
  private fileUploadService:FileUploadService,
  public dialog: MatDialog,
  private toastr: ToastrService) { }


  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dataSource,'print')
    if (changes && changes.dataSource && changes.dataSource.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
      this.isSelecetAll = false;
    }
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
       this.isSelecetAll = false;
    }
  }
  ngOnInit(): void { console.log(this.dataSource)
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "ASC";
    this.columnKeys = this.columns.map((data) => data.key); 
    this.productType = this.userService.getProductType();
    // this.isEnterprise = (this.productType == ProductTypes['Enterprise']) ? true : false;
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
    //this.rowData1(data)
  }
  rowData1(rowData) {
    const dialogRef = this.dialog.open(DetailPageViewComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog-lg", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if(result.success){
        this.rowData.emit()
      }
    });
  }
  getPaginationData(event) {
    // this.pageIndex = event.pageIndex;
    //   this.pageSize == event.pageSize
    //     ? event.pageIndex + 1
    //     : defaultVal.pageIndex;
    // if (this.pageSize != event.pageSize) {
    //   this.paginator.firstPage();
    // }

    this.pageIndex =
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
   onToggle(event: boolean) {
    if (!event) {
      this.toggleActive = false;
    } else {
      this.toggleActive = true;
    }
    // this.searchFilter();
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
  }
  searchFilter() {
    // this.pageSize = defaultVal.pageSize;
    this.pageIndex = defaultVal.pageIndex;
   
    this.onDataChange.emit({
      type: this.type,
      globalSearch: this.searchKey,
      searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
      orderBy: this.sortingColumn,
      sortBy: this.sortingDir,
      pageIndex: this.pageIndex,
      pageSize:this.pageSize
    });
    this.paginator.firstPage();
    this.sortPagination();
  }
  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }
  changeCategory(event) {
  }
  sortData(name) {
    this.sortingDir = name.direction;//this.sortingDir == 'asc' ? 'desc' : 'asc'
    if(name.active == 'unitName' || name.active == 'category' || name.active == 'approvedDisplayDate'){
      let orderByName = "";
      if(name.active == 'unitName'){
        orderByName = "unitname"
      }else if(name.active == 'category'){ 
        orderByName = "category" 
      }else{
        orderByName = "approvedDate"
      }
      this.onDataChange.emit({
        type: this.type,
        globalSearch: this.searchKey,
        searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
        orderBy: orderByName,
        sortBy: this.sortingDir,
        pageIndex: this.pageIndex,
        pageSize:this.pageSize
      });
      this.paginator.firstPage();
    }
    // this.sortingColumn = name.active;
    // this.onDataChange.emit(this.getAppointmentRequest);
    // this.paginator.firstPage();
  }

  permanentPassPrintAction(event){
    // let dataId = [];
    // this.dataSource.map(ele => {
    //   ele.checked = event.checked;
    //   dataId.push(ele.id);
    // });
    // this.pageIndex =
    //   this.pageSize == events.pageSize
    //     ? events.pageIndex + 1
    //     : defaultVal.pageIndex;
    // if (this.pageSize != events.pageSize) {
    //   this.paginator.firstPage();
    // }
    // this.pageSize = events.pageSize;
    // this.pageSizeCount = events.pageSize;
    let obj2 = {globalSearch: this.searchKey, pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir }
    //this.onDataChange.emit({ pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })

    this.dataSource.map(ele => {
      ele.checked = false;
    });
    let obj = {
      mode: 'single',
      rowData: [event],
      pageData: obj2
    }
    this.modeEmmiter.emit(obj);
  }

  permanentPassReprintAction(event){
    // let dataId = [];
    // this.dataSource.map(ele => {
    //   ele.checked = event.checked;
    //   dataId.push(ele.id);
    // });
    // this.pageIndex =
    //   this.pageSize == events.pageSize
    //     ? events.pageIndex + 1
    //     : defaultVal.pageIndex;
    // if (this.pageSize != events.pageSize) {
    //   this.paginator.firstPage();
    // }
    // this.pageSize = events.pageSize;
    // this.pageSizeCount = events.pageSize;
    let obj2 = {globalSearch: this.searchKey, pageSize: this.pageSize, pageIndex: this.pageIndex, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir }

    this.dataSource.map(ele => {
      ele.checked = false;
    });
    let obj = {
      mode: 'single',
      rowData: [event],
      pageData: obj2
    }
    this.modeEmmiter.emit(obj);
  }
  selectAll(event){
    this.isSelecetAll = !this.isSelecetAll;
    let dataId = [];
    this.dataSource.map(ele => {
      ele.checked = event.checked;
      dataId.push(ele.id);
    });
    let obj = {
      mode: 'all',
      rowData: dataId,
      selected:this.isSelecetAll
    }
    this.modeEmmiter.emit(obj);
  }

  selectionChange(event,index){
    this.dataSource[index].checked = event.checked;
    this.isSelecetAll = event.checked;
    // let obj1 = {
    //   mode: 'all',
    //   rowData: null,
    //   selected:this.isSelecetAll
    // }
    // this.modeEmmiter.emit(obj1);
    let count = 0;
    let checkedId = [];
    let obj = {
      mode: '',
      rowData: [],
      selected:this.isSelecetAll
    }
    this.dataSource.map(ele =>{
      if(ele.checked){
        count = count +1;
        checkedId.push(ele.id)
      }
    })
    console.log(checkedId)
    if(count == this.dataSource.length){
      this.isSelecetAll = true;
      obj.mode = 'all';
      obj.rowData = checkedId
       obj.selected=true
    }else{
      this.isSelecetAll = false;
      obj.mode = 'multiple';
      obj.rowData = checkedId;
       obj.selected=false
    }
    if (count >0) {
     obj.selected=true
    } else {
      obj.selected=false
   }
    console.log(this.dataSource,this.dataSource[index].checked)
    this.modeEmmiter.emit(obj);
    // if(!event.checked){
    //   this.isSelecetAll = false
    // }
 
  }
  
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  onChange(){
    this.time = new Date();
    this.onDataChange.emit({
      type: this.type,
      globalSearch: this.searchKey,
      searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
      //orderBy: this.orderByName ,
      sortBy: this.sortingDir,
      pageIndex: this.pageIndex,
      pageSize:this.pageSize
    });
    this.paginator.firstPage();
  }
}
