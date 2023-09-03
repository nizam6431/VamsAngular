import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Constants } from "../constants/columns";
import { MasterComponent } from "../master.component";
import { MasterService } from "../services/master.service";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ShowDetailsComponent } from "../show-details/show-details.component";
import { UserService } from "src/app/core/services/user.service";
import { defaultVal } from "../../../core/models/app-common-enum";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { TranslateService } from "@ngx-translate/core";
import { data } from "jquery";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  permissionKeyObj =permissionKeys;
  dataSource: any;
  totalData: any;
  displayedColumns: any[] = Constants.loction_column;
  isL2Admin: boolean;
  level2ID :any;
  @Output() companyValueChange = new EventEmitter();
  @Output() locationValueChange  = new EventEmitter();
  level2RoleName: string;
  isLocationDetails = false;
  locationData: any;
  locationLevel2Id = null;
  constructor(
    private masterService: MasterService,
    private toastr: ToastrService,
    private userService: UserService,
    private dialog: MatDialog,
    private translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.isL2Admin = this.userService.isLevel2Admin();
    this.level2RoleName = this.userService.getRolName()
    this.getLocationList()
  }



  getLocationList(data?) {
    
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      searchByStatus: data && data.searchStatus == "ALL" ? "": defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "name",
      sortBy: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
    };
    this.masterService
      .getLocation(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalData = resp.data.totalCount;
          // for(let i in resp.data.list)
          // {
          //   this.locationData = resp.data.list[i].level2Id
          // }
        }
      });
  }

  openDialog(screenType: string) {
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: { data: null, formType: "location", mode: "add" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }

  toggleTabs(event) {
    this.companyValueChange.emit(event);
  }

  showLocationDetails(event){
    // this.isLocationDetails = true;    
    this.companyValueChange.emit(event); 

  }
  
  dialogClosed(statusObj) {
    console.log(statusObj)
    if (statusObj && statusObj.status && statusObj.type == "level2")
      this.getLocationList(statusObj);
  }

  displayCounter(count: any) {
  }

  companyDataChange(event) {
    if (event.type == "location") {
      this.getLocationList(event);
    }
  }

  deleteLocation(event) {
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
          this.getLocationList(event);
        }
      });
  }
}
