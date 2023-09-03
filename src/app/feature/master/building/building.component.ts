import { Component, EventEmitter, OnInit, Output, SimpleChanges } from "@angular/core";
import { Constants } from "../constants/columns";
import { MasterComponent } from "../master.component";
import { MasterService } from "../services/master.service";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ShowDetailsComponent } from "../show-details/show-details.component";
import { UserService } from "src/app/core/services/user.service";
import { defaultVal, ProductTypes } from "../../../core/models/app-common-enum";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-building",
  templateUrl: "./building.component.html",
  styleUrls: ["./building.component.scss"],
})
export class BuildingComponent implements OnInit {
  permissionKeyObj =permissionKeys;
  dataSource: any;
  totalData: any;
  displayedColumns: any[] = Constants.building_column;
  displayedColumns1: any[] = Constants.building_columns_Hospital;
  isL2Admin: boolean;
  @Output() companyValueChange = new EventEmitter();
  ProductType = ProductTypes;
  productType: string;
  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog,
    private translate:TranslateService
  ) {
    this.productType = this.userService.getProductType();
  }

  ngOnInit(): void {
    this.isL2Admin = this.userService.isLevel2Admin();
    this.getBuildingList();

    if (this.productType == ProductTypes.Hospital) {
      this.displayedColumns = this.displayedColumns1 
    }else{
      this.displayedColumns
    }
  }

  getBuildingList(data?) {
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      searchByStatus: data && data.searchStatus == "ALL" ? "": defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "name",
      sortBy: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
    };
    console.log(reqData)
    this.masterService
      .getBuildings(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalData = resp.data.totalCount;
        }
      });
  }

  companyDataChange(event) {
    if (event.type == "building") {
      this.getBuildingList(event);
    }
  }

  displayCounter(count: any) {
  }

  dialogClosed(statusObj) {
    console.log(statusObj);
    if (statusObj && statusObj.status && statusObj.type == "level2")
      this.getBuildingList(statusObj);
  }

  openDialog(screenType: string) {
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: { data: null, formType: "building", mode: "add" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }

  deleteBuilding(event) {
    console.log(event)
    let obj = {
      level2Id: event.level2Id,
    };
    this.masterService
      .deleteBuilding(obj)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message,  this.translate.instant("pop_up_messages.success"));
          this.getBuildingList(event);
        }
      });
  }

  toggleTabs(event) {
    this.companyValueChange.emit(event);
  }
}
