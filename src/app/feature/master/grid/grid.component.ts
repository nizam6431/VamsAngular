import {
  AfterViewInit,
  Component,
  Inject,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ShowDetailsComponent } from "../show-details/show-details.component";
import { ConfirmDeleteComponent } from "src/app/shared/components/confirm-delete/confirm-delete.component";
import { pagination, defaultVal, ProductTypes } from "../../../core/models/app-common-enum";
import { debounceTime } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { formatPhoneNumber } from "src/app/core/functions/functions";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { TranslateService } from "@ngx-translate/core";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { environment } from "../../../../../src/environments/environment";
import { UserService } from "src/app/core/services/user.service";
import { LevelAdmins, Level2Roles } from "../../../../app/core/models/app-common-enum";
import { Constants } from "../constants/columns";
@Component({
  selector: "app-grid",
  templateUrl: "./grid.component.html",
  styleUrls: ["./grid.component.scss"],
})
export class GridComponent implements OnInit, AfterViewInit, OnChanges {
  permissionKeyObj = permissionKeys;
  enviroment = environment;
  @Input() companyRowData: any;
  public pageSizeOptions = [];
  public pageSize: number;
  public pageIndex: 1;
  @Input() displayedColumns: any;
  @Input() cssClass: string;
  @Input() dataSource: any;
  @Input() totalData: any;
  @Input() showToggle: any;
  @Output() valueChange = new EventEmitter();
  @Output() companyValueChange = new EventEmitter();
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() dialogClose = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  @Output() locationDetails = new EventEmitter();
  @Input() subLocationlevel2Id;
  @Input() type: any;
  typeToDelete: string;
  searchKey: string = "";
  sortingColumn: string = "";

  public hasSearchValue: boolean = false;
  sortingDir: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  showListFlag: boolean = false;
  rowData: any;
  columns: any[] = [];
  gridColumn: any[] = [];
  tempType: string;
  mode: any;
  toggleOptions: Array<String> = ["Active", "All"];
  activeData: any;
  origData: any = [];
  toggleActive: boolean = true;
  showListColumn: any[] = ['departments', 'employees', 'contractors', 'contractor_company'];
  // showOfficeListColumn:any[]=['Company']
  isViewOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWONLY];
  isEditOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWEDIT];
  isExcel: boolean;
  userData: any;
  @Input() locationLevel2Id: any
  ProductType = ProductTypes;
  productType: string;
  pageData: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UserService,
  ) {
    this.isExcel = environment.IsExcel;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.productType = this.userService.getProductType();
    if (this.productType == ProductTypes.Hospital) {
      this.gridColumn = Constants.building_columns_Hospital
    }else{
      this.gridColumn = Constants.building_column
    }
    if (this.productType == ProductTypes.Hospital) {
      this.gridColumn = Constants.company_column_Hospital
    }else{
      this.gridColumn = Constants.company_column
    }
    if (this.productType == ProductTypes.Hospital) {
      this.gridColumn = Constants.employee_column_Hospital
    }else{
      this.gridColumn = Constants.employee_column
    }
   
    this.gridColumn = [];
    this.columns = [];
    if (this.displayedColumns)
      this.displayedColumns.map((data) => {
        // if((this.isViewOnly || !this.isEditOnly) && this.showListColumn.includes(data.key))
        //   return 
        // else{
        this.columns.push(data.key);
        this.gridColumn.push(data)
        // }
      });

    //  this.userData = this.userService.getUserData();
    //  if(this.userData && this.userData["role"].shortName === LevelAdmins.Level3Admin ){
    //    this.hideUsername();
    //  }
    if (!this.isExcel) {
      this.hideUsername();
    }



    this.showListFlag = false;
    // if ('dataSource' in changes) {
    //   // this.origData = changes.dataSource.currentValue;
    //   // if (this.showToggle) {
    //   //   this.activeData = this.sortActiveRows(this.origData);
    //   // } else {
    //   //   this.activeData = this.origData;
    //   // }
    //   // if(this.toggleActive) {
    //   //   this.dataSource = new MatTableDataSource(this.activeData);
    //   // } else {
    //   //   this.dataSource = new MatTableDataSource(this.origData);
    //   // }
    //   this.sortPagination();
    // }

  }

  hideUsername() {
    this.columns.splice(3, 1);
  }

  ngOnInit(): void {
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "asc";
    this.sortingColumn =
      this.displayedColumns &&
        this.displayedColumns[0] &&
        this.displayedColumns[0].value
        ? this.translate.instant(this.displayedColumns[0].value)
        : "Name";
  }

  ngAfterViewInit() {
    this.sortPagination();
  }

  ngAfterViewChecked(): void {
    // if (this.table) {
    //   this.table.updateStickyColumnStyles();
    // }
  }

  isSticky(column: string) {
    return column === "action" ? true : false;
  }

  getPaginationData(event) {
     this.pageData = event;
    console.log(event)
    this.pageIndex =
      this.pageSize == event.pageSize
        ? event.pageIndex + 1
        : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.onDataChange.emit({
      type: this.type,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
      orderBy: this.sortingColumn,
      sortBy: this.sortingDir,
      globalSearch: this.searchKey ? this.searchKey : "",
    });
    this.sortPagination();
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
    });
    this.paginator.firstPage();
    this.sortPagination();
  }

  sortData(name) {
    this.sortingDir = name.direction;//this.sortingDir == "asc" ? "desc" : "asc";
    this.sortingColumn = name.active;
    // this.sort.sort({
    //   id: this.sortingColumn,
    //   start: this.sortingDir,
    // } as MatSortable);
    this.onDataChange.emit({
      type: this.type,
      globalSearch: this.searchKey,
      searchStatus: this.toggleActive ? "ACTIVE" : "ALL",
      orderBy: this.sortingColumn,
      sortBy: this.sortingDir,
    });
    this.paginator.firstPage();
    // this.sortPagination();
  }

  sortPagination() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  getRowData(data: any, type: string) {
    this.rowData = data;
    this.mode = "show";
    // this.openDialog(type);
    if (type == 'location') {
      this.locationDetails.emit(this.rowData);
    }
    else {
      this.openDialog(type);
    }
  }

  sortActiveRows(rows = []) {
    return rows.filter((item) => item.status === "ACTIVE");
  }

  openDialog(type?) {
    let applyClass;
    let popupWidth="50%"
    switch (type) {
      case "department": {
        applyClass = "vams-dialog";
        break;
      }
      case "employee": {
        popupWidth="65%"
        applyClass = "vams-dialog-xl";
        break;
      }
      case "contractor-company": {
        applyClass = "complex-contractorsCcompany-dialog";
        break;
      }
      case "company": {
        applyClass = "vams-dialog";
        popupWidth = "100%";
        break;
      }
      case "building": {
        popupWidth="30%"
        applyClass = "vams-dialog";
        break;
      }
      case "contractor_company": {
        applyClass = "vams-dialog-xl";
        break;
      }
      case "contractors": {
        if (this.mode == 'print_pass') {
          applyClass = "vams-dialog";
        } else {
          applyClass = "vams-dialog-lg";
        }
        break;
      }
      case "contractor_pass": {
        applyClass = "vams-dialog";
        break;
      }
      default: {
        applyClass = "vams-dialog";
        break;
      }
    }
    let dialogDataObj = {
      data: this.rowData,
      formType: this.type,
      mode: this.mode,
      level2Id: null
    };
    if (type == 'subLocation') {
      dialogDataObj.level2Id = this.locationLevel2Id;
    }
    if (type == "employee" && this.companyRowData) {
      dialogDataObj["companyData"] = this.companyRowData;
    }
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      width:popupWidth,
      position: { right: "0" },
      data: dialogDataObj,
      panelClass: ["animate__animated", applyClass, "animate__slideInRight"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      let data = result;
      console.log(this.type)
       if (!this.toggleActive) {
         data.searchStatus = 'ALL';
      }
       data.pageSize=this.pageSize
      this.dialogClose.emit(data);
    });
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
      // this.searchFilter()
    }
    //   debounceTime(1000)
    // ).subscribe(

    // )

    // this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }

  showList(rowData) {
    rowData.event.stopPropagation();
    this.valueChange.emit(rowData);
  }

  showOfficeList(rowData) {
    rowData.event.stopPropagation();
    this.companyValueChange.emit(rowData);
  }

  showAction(action: string, event: Event, rowData: any, type: string) {
    event.stopPropagation();
    this.rowData = rowData;
    if (action == "edit") {
      this.mode = "edit";
      this.openDialog(type);
    }
    if (action == "delete") {
      if (type == "employee") {
        // let adminData = this.dataSource.filter(element=>(element.role=="Admin"))
        // if(adminData.length>1){
        this.openDialogForDelete(rowData);
        // }
        // else{
        //   this.toastr.warning('At least one admin not to be deleted','Warning');
        // }
      } else {
        this.openDialogForDelete(rowData);
      }
    }
  }
  openDialogForDelete(rowData) {

    let name = this.rowData.name ? this.rowData.name : "";
    if (this.type == 'contractors') {
      name = this.rowData.contractorName;
    }
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: this.type,
        name: name,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         if (!this.toggleActive) {
         rowData.searchStatus ='ALL';
      }
        this.deleteAction.emit(rowData);
      } 
    });
    // const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
    //   data: {
    //     type: this.type,
    //     name: this.rowData.name ? this.rowData.name : ""
    //   },
    //   panelClass: ["vams-dialog-sm", "vams-dialog-confirm"]
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) this.deleteAction.emit(rowData);
    // });
  }
  onToggle(event: boolean) {
    if (!event) {
      this.toggleActive = false;
    } else {
      this.toggleActive = true;
    }
    this.searchFilter();
  }
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  contractorPassAction(event, data, mode) {
    event.stopPropagation();
    this.mode = mode;
    this.rowData = data;
    this.openDialog(this.type);
  }
}