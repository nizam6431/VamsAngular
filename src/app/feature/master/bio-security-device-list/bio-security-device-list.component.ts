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
import { pagination, defaultVal } from "../../../core/models/app-common-enum";
import { debounceTime, first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MasterService } from '../services/master.service';
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-bio-security-device-list",
  templateUrl: "./bio-security-device-list.component.html",
  styleUrls: ["./bio-security-device-list.component.scss"],
})
export class BioSecurityDeviceListComponent implements OnInit, OnChanges {
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
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() dialogClose = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
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
  columns: any;
  tempType: string;
  mode: any;
  toggleOptions: Array<String> = ["Active", "All"];
  activeData: any;
  origData: any = [];
  toggleActive: boolean = true;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private masterService:MasterService,
    private translate:TranslateService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    // this.sortPagination();
    if (this.displayedColumns)
      this.columns = this.displayedColumns.map((data) => data.key);
    this.showListFlag = false;
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
        ? this.displayedColumns[0].value
        : "Name";
  }

  ngAfterViewInit() {
    this.sortPagination();
  }

  ngAfterViewChecked(): void {}

  isSticky(column: string) {
    return column === "action" ? true : false;
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
    this.onDataChange.emit({type: "bio", pageSize: this.pageSize, pageIndex: this.pageIndex,searchStatus: this.toggleActive? "ACTIVE" : "ALL", orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.sortPagination();
  }

  searchFilter() {
    // this.pageSize = defaultVal.pageSize;
    this.pageIndex = defaultVal.pageIndex;
    this.onDataChange.emit({type: "bio", globalSearch: this.searchKey, searchStatus: this.toggleActive? "ACTIVE" : "ALL",orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.paginator.firstPage();
    this.sortPagination();
  }

  sortData(name) {
    this.sortingDir = this.sortingDir == "asc" ? "desc" : "asc";
    this.sort.sort({
      id: this.sortingColumn,
      start: this.sortingDir,
    } as MatSortable);
    this.sortingColumn = name;
    this.onDataChange.emit({type: "bio", globalSearch: this.searchKey, searchStatus: this.toggleActive? "ACTIVE" : "ALL", orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.paginator.firstPage();
    // this.sortPagination();
  }

  sortPagination() {}

  getRowData(data: any, type: string) {
    this.rowData = data;
    this.mode = "show";
    this.openDialog(type);
  }

  sortActiveRows(rows = []) {
    return rows.filter((item) => item.status === "ACTIVE");
  }

  openDialog(type?) {
    let applyClass;
    switch (type) {
      case "department": {
        applyClass = "complex-department-dialog";
        break;
      }
      case "employee": {
        applyClass = "complex-employees-dialog";
        break;
      }
      case "contractor-company": {
        applyClass = "complex-contractorsCcompany-dialog";
        break;
      }
      case "company": {
        applyClass = "company-details-dialog";
        break;
      }
      case "building": {
        applyClass = "building-level-dialog";
        break;
      }
      case "bio": {
        applyClass = "vams-dialog-lg";
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
    };
    if (type == "employee" && this.companyRowData) {
      dialogDataObj["companyData"] = this.companyRowData;
    }
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: dialogDataObj,
      panelClass: ["animate__animated", applyClass, "animate__slideInRight"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogClose.emit(result);
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
    }
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

  showAction(action: string, event: Event, rowData: any, type: string) {
    event.stopPropagation();
    this.rowData = rowData;
    if (action == "edit") {
      this.mode = "edit";
      this.openDialog(type);
    }
    if (action == "delete") {
      if (type == "employee") {
        this.openDialogForDelete(rowData);
      } else {
        this.openDialogForDelete(rowData);
      }
    }
  }
  openDialogForDelete(rowData) {
    // const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
    //   width: "40%",
    //   data: {
    //     type: this.type,
    //     name: this.rowData.name ? this.rowData.name : "",
    //   },
    //   panelClass: ["animate__animated", "popup-styling"],
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) this.deleteAction.emit(rowData);
    // });

    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      width: "40%",
      data: {
        type: this.type,
        name: this.rowData.name ? this.rowData.name : "",
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["animate__animated", "popup-styling"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteAction.emit(rowData);
    });
  }
  onToggle(event: boolean) {
    if (!event) {
      this.toggleActive = false;
    } else {
      this.toggleActive = true;
    }
    this.searchFilter();
  }
  getAccessLevel(event:Event,levelData:any){
    event.stopPropagation();
    this.masterService.getAccessLevels(levelData.id)
    .pipe(first())
    .subscribe((resp)=>{
      if(resp && resp?.Data){
        this.toastr.success('Access Level', this.translate.instant("pop_up_messages.success"));
      }
      else{
      }
    },
    (error)=>{
      if(error && error.Message){
        this.toastr.error(error.Message, this.translate.instant("pop_up_messages.error"));
      }
    })

  }
}