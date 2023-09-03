import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Constants } from "../constants/columns";
import { CommonTabService } from "../services/common-tab.service";
import { ShowDetailsComponent } from "../show-details/show-details.component";
import { ContractorCompanyFormComponent } from "../forms/contractor-company-form/contractor-company-form.component";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/core/services/user.service";
import { defaultVal, LevelAdmins, ProductTypes } from "../../../core/models/app-common-enum";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { FileUploadComponent } from "src/app/shared/components/file-upload/file-upload.component";
import { TranslateService } from "@ngx-translate/core";
import { MasterService } from "../services/master.service";
import { LocationDetailComponent } from "../location-detail/location-detail.component";


@Component({
  selector: "app-common-tab",
  templateUrl: "./common-tab.component.html",
  styleUrls: ["./common-tab.component.scss"],
})
export class CommonTabComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  selectedIndex: number = 0;
  @Input() companyRowData: any;
  @Input() type: any;
  @Input() selectedIndexFromSubTab: number = 0;
  @Input() selectedTab: string = "";
  @Input() locationId;
  @Input() subLocationlevel2Id;
  @Input() subLocationlevel3Id;
  @ViewChild(LocationDetailComponent) locationDetailComponent: LocationDetailComponent;
  @Output() getCompanyName = new EventEmitter();
  displayedColumns: any[] = Constants.company_column;
  dataSource: any;
  totalData: any;
  showToggle: any;
  departmentData: any;
  employeeData: any;
  filterData: any;
  searchReset: boolean = true;
  bioSecurityDeviceData: any;
  contractorsData: any;
  commonTabDesableTo: string[] = ["showCompanyList", "contractors"]

  level3Id: any;
  userData: any;
  commonDataTabVisable: boolean;
  subLocationData: any;
  ProductType = ProductTypes;
  productType: string;
  locationLevel2Id = null
  subLocationid: any;
  sublocationlL3id
  locationLevel2ID: any;
  constructor(
    public dialog: MatDialog,
    private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private userService: UserService,
    private translate: TranslateService,
    private masterService: MasterService
  ) {
    this.productType = this.userService.getProductType();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("locationDetailComponent",this.locationDetailComponent.locationLevel2Id)
    if ("type" in changes) {
      let tempType = (changes?.type?.currentValue).toLowerCase();
      // if(tempType!='complex'){
      //   this.selectedIndex = (tempType == 'departments') ? 0 : (tempType == 'employees') ? 1 : 2;
      //   this.getTabDetails(tempType);
      // }
    }
    if (changes.selectedIndexFromSubTab) {
      console.log(changes);

      this.getTabDetails(this.selectedTab);
    }
    this.locationLevel2Id = this.locationId;

    // set locaiton Id from table to use it in location modules.
    this.userService.setLocationId(this.locationId);

    this.subLocationid = this.subLocationlevel2Id;

    this.sublocationlL3id = this.subLocationlevel3Id;

  }


  ngAfterViewInit() {
    this.subLocationlevel2Id = this.subLocationid
    this.subLocationlevel3Id = this.sublocationlL3id
  }
  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    if (this.commonTabDesableTo.includes(this.selectedTab) || this.selectedTab=='showHospitalList') {
      this.commonDataTabVisable = false;
    } else {
      this.commonDataTabVisable = true;
    }
    this.level3Id = (this.companyRowData?.rowData?.level3Id) ? (this.companyRowData?.rowData?.level3Id) : (this.userData.role.shortName == LevelAdmins.Level3Admin) ? this.userData.employeeOfDisplayId : null;
    this.selectedIndex =
      this.type === "complex" ? 0 : this.selectedIndexFromSubTab;


      // if (this.productType == ProductTypes.Hospital) {
      //   this.displayedColumns = this.displayedColumns1 
      // }else{
      //   this.displayedColumns
      // }
  }

  openDialog(type: string) {
    let applyClass;
    switch (type) {
      case "department": {
        applyClass = "vams-dialog";
        break;
      }
      case "employee": {
        applyClass = "vams-dialog-xl";
        break;
      }
      case "contractor-company": {
        applyClass = "complex-contractorsCcompany-dialog";
        break;
      }
      case "subLocation": {
        applyClass = "vams-dialog";
        break;
      }
      case "contractors": {
        applyClass = "vams-dialog-lg";
        break;
      }
      default: {
        applyClass = "";
        break;
      }
    }
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: {
        companyData: this.companyRowData ? this.companyRowData : null,
        formType: type,
        mode: "add",
        // Todo: need clear mapping of level2Id and subLocationlevel2Id
        level2Id: this.subLocationlevel2Id,
        locationLevel2Id:this.locationLevel2Id
      },
      panelClass: ["animate__animated", applyClass, "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }

  openContractorDialog() {
    this.dialog.open(ShowDetailsComponent, {
      width: "55%",
      height: "100%",
      position: { right: "0" },
      data: { data: null, formType: "contractor", mode: "edit" },
      panelClass: ["animate__animated", "animate__slideInRight"],
    });
  }

  openDialogForBulk() {
    this.dialog.open(ShowDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: {
        data: {
          employeeUpload: "employeeUpload",
          employeeTemplateDownload: "employeeTemplateDownload",
        },
        formType: "bulkUpload",
        mode: "upload",
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
  }

  commonDataChange(event) {
    this.filterData = event;
    console.log(this.filterData, 'filterData')
    if (event.type == "department") {
      this.getTabDetails("departments", true);
    } else if (event.type == "employee") {
      this.getTabDetails("employees", true);
    }
    // else if (event.type == "Company") {
    //   this.getTabDetails("Company", true);
    // }
    else if (event.type == "bio") {
      this.getTabDetails("bio security device configuration", true);
    } else if (event.type == "contractors") {
      this.getTabDetails("contractors", true);
    }
    else if (event.type == "subLocation") {
      this.getTabDetails("Sub Location", true);
    }
  }

  async getTabDetails(activeTab: string, isSearchReset: boolean = false) {
    activeTab = activeTab.toLocaleLowerCase();

    this.filterData = isSearchReset ? this.filterData : null;
    if (activeTab === 'showcompanylist' || activeTab === 'showHospitalList') {
      this.displayedColumns = Constants.building_column_company;
    } else
      if (activeTab === this.translate.instant('Common_Tabs.Departments').toLocaleLowerCase()) {
        this.displayedColumns = Constants.department_column;
        this.getDepartmentList();
      } else if (activeTab === this.translate.instant('Common_Tabs.Employees').toLocaleLowerCase()) {
        this.displayedColumns = Constants.employee_column;
        this.getEmployeeList();
      }
      else if (activeTab === this.translate.instant('Common_Tabs.Patient').toLocaleLowerCase()) {
        this.displayedColumns = Constants.employee_column_Hospital;
        this.getEmployeeList();
      }
      else if (activeTab === this.translate.instant('Common_Tabs.Company').toLocaleLowerCase()) {
        this.displayedColumns = Constants.building_column;
        this.getEmployeeList();
      }
    if (activeTab === this.translate.instant('Common_Tabs.sub-location').toLocaleLowerCase()) {
      this.displayedColumns = Constants.sub_location_column;
      this.getsubLocationList();
    }
    else if (activeTab === this.translate.instant('Common_Tabs.Bio_Security_Device_config').toLocaleLowerCase()) {
      this.displayedColumns = Constants.bio_security_device_columns;
      this.getBioSecurityDeviceList();
    }
    else if (activeTab === this.translate.instant('Common_Tabs.Contractors').toLocaleLowerCase()) {
      this.displayedColumns = Constants.contractor_column;
      this.contractorsList();
    } else {
      (await this.commonTabService.getSampleData(activeTab)).subscribe(
        (data: any) => {
          this.displayedColumns =
            activeTab == "employees"
              ? Constants.employee_column:
                activeTab == "patient"
                ? Constants.employee_column_Hospital
              : activeTab == "departments"
                ? Constants.department_column
                : activeTab == "contractors"
                  ? Constants.contractor_column
                  : activeTab == "Company"
                    ? Constants.building_column
                    : activeTab == "subLoction"
                      ? Constants.sub_location_column
                      : Constants.building_column_company;
                      
            this.dataSource = data["data"];
          }
        );
      }
  }

  dialogClosed(statusObj) {
    console.log(statusObj)
    if (statusObj?.status && statusObj.type == "department")
      this.getDepartmentList();
    if (statusObj?.status && statusObj.type == "employee") {
      this.getEmployeeList();
    }
    if (statusObj?.status && statusObj.type == "contractors") {
      this.contractorsList();
    }
    if (statusObj?.status && statusObj.type == "subLocation") {
      this.getsubLocationList();
    }
  }

  getDepartmentList() {
    let levelId = this.companyRowData
      ? this.companyRowData?.rowData?.level3Id
      : null;
    levelId =
      this.userService.isLevel3Admin() &&
        this.userService.getLevel3DidForLevel3Admin()
        ? this.userService.getLevel3DidForLevel3Admin()
        : levelId;
    let reqData = {
      pageSize:
        this.filterData && this.filterData.pageSize
          ? this.filterData.pageSize
          : defaultVal.pageSize,
      pageIndex:
        this.filterData && this.filterData.pageIndex
          ? this.filterData.pageIndex
          : defaultVal.pageIndex,
      levelId: levelId,
      searchStatus:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : defaultVal.searchStatus,
      orderBy:
        this.filterData && this.filterData.orderBy
          ? this.filterData.orderBy
          : "name",
      sortBy:
        this.filterData && this.filterData.sortBy
          ? this.filterData.sortBy
          : "ASC",
      globalSearch:
        this.filterData && this.filterData.globalSearch
          ? this.filterData.globalSearch
          : "",
    };
    this.commonTabService
      .getDepartments(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.departmentData = resp.data.list;
          this.totalData = resp.data.totalCount;
        }
      });
  }

  deleteDepartment(event) {
    let obj = {
      departmentId: event.displayId,
    };
    this.commonTabService
      .deleteDepartment(obj)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.getDepartmentList();
        }
      });
  }
  getEmployeeList() {
    let reqData = {
      pageSize:
        this.filterData && this.filterData.pageSize
          ? this.filterData.pageSize
          : defaultVal.pageSize,
      pageIndex:
        this.filterData && this.filterData.pageIndex
          ? this.filterData.pageIndex
          : defaultVal.pageIndex,
      searchStatus:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : defaultVal.searchStatus,
      orderBy:
        this.filterData && this.filterData.orderBy
          ? this.filterData.orderBy
          : "name",
      sortBy:
        this.filterData && this.filterData.sortBy
          ? this.filterData.sortBy
          : "ASC",
      globalSearch:
        this.filterData && this.filterData.globalSearch
          ? this.filterData.globalSearch
          : "",
    };
    if (this.type !== "building") {
      reqData["level3Id"] = this.companyRowData
        ? this.companyRowData?.rowData?.level3Id
        : null;
      reqData["level3Id"] =
        this.userService.isLevel3Admin() &&
          this.userService.getLevel3DidForLevel3Admin()
          ? this.userService.getLevel3DidForLevel3Admin()
          : reqData["level3Id"];
        // location id passed to get employee's location wise for enterprise.
        if (this.ProductType.Enterprise ==  this.productType) {
           reqData['level2Id'] =  this.locationId? this.locationId:this.userService.getUserData().level2List[0].id;
        }
        
      this.commonTabService
        .getEmployee(reqData)
        .pipe(first())
        .subscribe((resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.employeeData = resp.data.list;
            this.totalData = resp.data.totalCount;
          }
        });
    } else {
      reqData["level2Id"] = this.userService.getLevel2DidForLevel2Admin()
        ? this.userService.getLevel2DidForLevel2Admin()
        : null;
      this.commonTabService
        .getLevel2Employee(reqData)
        .pipe(first())
        .subscribe((resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.employeeData = resp.data.list;
            this.totalData = resp.data.totalCount;
          }
        });
    }
  }
  getEmployeeById(displayId) {
    this.commonTabService
      .getEmployeeById(displayId)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.departmentData = resp.data;
        }
      });
  }
  deleteEmployee(event) {
    let obj = {
      displayId: event.displayId,
    };
    this.commonTabService
      .deleteEmployee(obj)
      .pipe(first())
      .subscribe(
        (resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.getEmployeeList();
          }
        },
        (error) => {
          if (error.error.StatusCode === 400 && error.error.Errors === null) {
            this.toastr.warning(error.error.Message, this.translate.instant("pop_up_messages.warning"));
            this.getEmployeeList();
          }
        }
      );
  }
  getBioSecurityDeviceList() {
    let reqData = {
      pageSize:
        this.filterData && this.filterData.pageSize
          ? this.filterData.pageSize
          : defaultVal.pageSize,
      pageIndex:
        this.filterData && this.filterData.pageIndex
          ? this.filterData.pageIndex
          : defaultVal.pageIndex,
      searchStatus:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : defaultVal.searchStatus,
      orderBy:
        this.filterData && this.filterData.orderBy
          ? this.filterData.orderBy
          : "name",
      orderDirection:
        this.filterData && this.filterData.sortBy
          ? this.filterData.sortBy
          : "ASC",
      globalSearch:
        this.filterData && this.filterData.globalSearch
          ? this.filterData.globalSearch
          : "",
      searchByStatus:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : "ACTIVE",
    };
    this.commonTabService
      .getBioSecurityDeviceList(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.bioSecurityDeviceData = resp.data.list;
          this.totalData = resp.data.totalCount;
        }
      });
  }
  contractorsList() {
    let reqData = {
      contractorCompanyId: this.companyRowData.rowData.id,
      pageSize:
        this.filterData && this.filterData.pageSize
          ? this.filterData.pageSize
          : defaultVal.pageSize,
      pageIndex:
        this.filterData && this.filterData.pageIndex
          ? this.filterData.pageIndex
          : defaultVal.pageIndex,
      orderBy:
        this.filterData && this.filterData.orderBy
          ? this.filterData.orderBy == 'Contractor Name' ? 'contractorName' : this.filterData.orderBy
          : "contractorName",
      orderDirection:
        this.filterData && this.filterData.sortBy
          ? this.filterData.sortBy
          : "ASC",
      globalSearch:
        this.filterData && this.filterData.globalSearch
          ? this.filterData.globalSearch
          : "",
      status:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : "ACTIVE",
    };
    this.commonTabService.getAllContractors(reqData).pipe(first()).subscribe((resp) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.contractorsData = resp.data.list;
        this.totalData = resp.data.totalCount;
      } else {
        this.toastr.warning(this.translate.instant("pop_up_messages.empty_list"), this.translate.instant("pop_up_messages.warning"));
      }
    }, error => {
      this.showError(error)
    })
  }

  deleteContractor(event) {
    this.commonTabService.deleteContractor({ id: event.id }).pipe(first()).subscribe((resp) => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.contractorsList();

      }
    })
  }

  /* Bulk Upload For the User  */
  openDialogForBulkUpload() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      height: "100%",
      data: {
        screen: "Employee",
        companyData: this.companyRowData ? this.companyRowData : null,
        isLevel: this.level3Id ? true : false,
        level3Id: this.level3Id,
        // filepath: "level1/" + this.userDetails?.level1DisplayId + "/bulk-appointment/" + new Date().getTime() + "/",
        title: "employee_bulk_upload",
        fileAccept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((statusObj) => {
        if (statusObj && statusObj?.statusCode) {
          if (statusObj.statusCode === 200 && statusObj.errors == null) {
            this.getEmployeeList()
          }
        }
      });
  }
  getsubLocationList() {
    // let levelId = this.companyRowData
    //   ? this.companyRowData.rowData.level3Id
    //   : null;
    // levelId =
    //   this.userService.isLevel3Admin() &&
    //     this.userService.getLevel3DidForLevel3Admin()
    //     ? this.userService.getLevel3DidForLevel3Admin()
    //     : levelId;
    let reqData = {
      pageSize:
        this.filterData && this.filterData.pageSize
          ? this.filterData.pageSize
          : defaultVal.pageSize,
      pageIndex:
        this.filterData && this.filterData.pageIndex
          ? this.filterData.pageIndex
          : defaultVal.pageIndex,
      levelId: this.locationLevel2Id,
      searchStatus:
        this.filterData && this.filterData.searchStatus
          ? this.filterData.searchStatus
          : defaultVal.searchStatus,
      orderBy:
        this.filterData && this.filterData.orderBy
          ? this.filterData.orderBy
          : "name",
      sortBy:
        this.filterData && this.filterData.sortBy
          ? this.filterData.sortBy
          : "ASC",
      globalSearch:
        this.filterData && this.filterData.globalSearch
          ? this.filterData.globalSearch
          : "",
    };
    console.log(reqData,'reqData')
    this.masterService.getCompanies(reqData).pipe(first()).subscribe((resp) => {

      if (resp.statusCode === 200 && resp.errors === null) {
        this.subLocationData = resp.data.list;
        this.totalData = resp.data.totalCount;
      }
    });
  }

  deleteSubLocation(event) {
    let obj = {
      level3Id: event.level3Id
    }
    this.masterService.deleteCompany(obj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
          this.getsubLocationList();
        }
      });
  }

  locationDetailsLevel2ID(event) {
    this.subLocationlevel2Id = event;
    // console.log(this.subLocationlevel2Id, 'event')
  }

  displayCompanyName(event){
    this.getCompanyName.emit(event)
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

}