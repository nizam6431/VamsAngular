import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { event } from "jquery";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { getCountryCode } from "src/app/core/functions/functions";
import { CommonService } from "src/app/core/services/common.service";
import { UserService } from "src/app/core/services/user.service";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { ProductTypes, CommonTabs, Level1Roles, Level2Roles, Level3Roles } from "../../core/models/app-common-enum";
import { CommonTabService } from "./services/common-tab.service";
import { MasterService } from "./services/master.service";
@Component({
  selector: "app-master",
  templateUrl: "./master.component.html",
  styleUrls: ["./master.component.scss"],
})
export class MasterComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  showTabs: boolean = false;
  selectedIndexFromSubTab: number = 0;
  selectedTab: string = "";
  @ViewChild("MatTabGroup", { static: true }) tabGroup: MatTabGroup;
  selectedIndex: number = 0;
  isHidden: boolean = false;
  companyName: string = "";
  companyRowData: any;
  isL1Admin: boolean;
  isL2Admin: boolean;
  isL3Admin: boolean;
  ProductType = ProductTypes;
  productType: string;
  isSecurityHead: boolean;
  isL1Reception: boolean;
  showL1Tabs: boolean;
  userData: any;
  showL2Tabs: boolean;
  showL3Tabs: boolean;
  isShowComapnyList: any;
  locationId :any;
  subLocationlevel2Id: any;
  locationName: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private commonService: CommonService,
    private titleService: Title,
    private translateService: TranslateService,
    private commonTabService: CommonTabService,
    private toastr: ToastrService,
  ) { 
    this.productType = this.userService.getProductType();
    this.translateService
      .get(["Masters.Masters_Title"])
      .pipe(first())
      .subscribe((translations) => {
        let title = translations["Masters.Masters_Title"];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }

  ngOnInit(): void {
    this.commonService.getAllCountries();
    this.checkForAdmin();
    if (!this.commonService.getComplexContact())
      this.getComplexDetails();
  }

  tabClick(tab: any) { }

  checkForAdmin() {
    this.isL1Admin = this.userService.isLevel1Admin();
    this.isL2Admin = this.userService.isLevel2Admin();
    this.isL3Admin = this.userService.isLevel3Admin();
    this.isSecurityHead = (this.userService.getUserData().role.shortName === Level1Roles.l1SecurityHead) ? true : false;
    this.isL1Reception = (this.userService.getUserData().role.shortName === Level1Roles.l1SecurityHead) ? true : false;
    this.userData = this.userService.getUserData();
    if (this.userData.role.shortName === Level1Roles.l1SecurityHead ||
      this.userData.role.shortName == Level1Roles.l1Admin ||
      this.userData.role.shortName == Level1Roles.l1Reception
    ) {
      this.showL1Tabs = true;
    }
    if (this.userData.role.shortName === Level2Roles.l2Admin ||
      this.userData.role.shortName == Level2Roles.l2Reception ||
      this.userData.role.shortName == Level2Roles.l2Security
    ) {
      this.showL2Tabs = true;
    }
    if (this.userData.role.shortName === Level3Roles.l3Admin ||
      this.userData.role.shortName == Level3Roles.l3Reception
    ) {
      this.showL3Tabs = true;
    }
    this.companyName = this.isL3Admin
      ? this.userService.getUserData().levelName
      : "";
  }

  Back() {
    // this.tabGroup.selectedIndex = this.selectedIndex;
    if (this.productType == ProductTypes.Commercial) {
       (this.selectedTab=='showCompanyList' || this.selectedTab=='showHospitalList')?this.selectedIndex = 1:this.selectedIndex = 2;
      this.showTabs = false;
      this.companyName = "";
    } else if (this.productType == ProductTypes.Enterprise) {
       (this.selectedTab=='showCompanyList' || this.selectedTab=='showHospitalList')?this.selectedIndex = 0:this.selectedIndex = 1;
       this.showTabs = false;
       this.companyName = "";
    }
   
  }

  toggleTabs(event) {
    this.locationId = event.id
    this.subLocationlevel2Id = event.level2Id
    this.showTabs = true  ;
    this.isShowComapnyList=event.columnName
    this.selectedIndex = 2;
    this.selectedIndexFromSubTab = parseInt(CommonTabs[event.columnName]);
    this.selectedTab = event["columnName"];
    // this.companyName = event.rowData?.["name"];
    this.companyName = (event && event.rowData && event.rowData.name)?(event.rowData.name):(event && event.name)?event.name : null;
    if(this.isShowComapnyList == "contractors") {
      this.companyName = event.rowData["companyName"];
    }
    this.companyRowData = event;
  }

  toggleTabsBuilding(event){
    this.showTabs = true;
    this.selectedIndex = 2;
    this.selectedIndexFromSubTab = parseInt(CommonTabs[event.columnName]);
    this.selectedTab = event["columnName"];
    this.companyName = event.rowData["name"];
    this.companyRowData = event;
  }

  getComplexDetails() {
    this.commonTabService
      .getComplexDetails()
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.commonService.setComplexContact(getCountryCode(response.data.address.contactIsd || "91"));
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], "Error");
            });
          } else {
            this.toastr.error(error.message, "Error");
          }
        }
      );
  }

  getCompanyName(event)
  {
    this.companyName = event
  }
}
