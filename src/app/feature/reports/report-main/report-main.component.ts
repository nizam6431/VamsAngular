import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import moment from 'moment';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Constants } from '../constants/columns';
import { ReoprtsService } from '../reoprts.service';
import { formatPhoneNumber } from "../../../core/functions/functions";
import { CommonService } from 'src/app/core/services/common.service';
import { FirstTimeLoginRequest, visitorReportsRequest } from '../models/report-req';
import { pagination, defaultVal, LevelAdmins, ProductTypes } from "../../../core/models/app-common-enum";
import { UserService } from "src/app/core/services/user.service";
import { type, fileType, advanceFilter } from '../models/report-filter'
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from '../../master/services/master.service';
import { ReportFilterPopupComponent } from '../report-filter-popup/report-filter-popup.component';
import { AppointmentReportDetailsComponent } from '../report-details-page/appointment-report-details/appointment-report-details.component';
import { VisitorReportDetailsComponent } from '../report-details-page/visitor-report-details/visitor-report-details.component';
import { HsqReportDetailsComponent } from '../report-details-page/hsq-report-details/hsq-report-details.component';
import { EmailReportDetailsComponent } from '../report-details-page/email-report-details/email-report-details.component';
import { forkJoin } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../accounts/services/account.service';

@Component({
  selector: 'app-report-main',
  templateUrl: './report-main.component.html',
  styleUrls: ['./report-main.component.scss']
})
export class ReportMainComponent implements OnInit {
  public visitorReportsRequest: visitorReportsRequest = new visitorReportsRequest();
  public firstTimeLoginRequest: FirstTimeLoginRequest = new FirstTimeLoginRequest();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  sortingColumn: string = "";
  sortingDir: string = "";
  columns = [];
  columnKeys: any;
  reportData: any;
  totalRecords: number = 0;
  dataSource: any = [];
  dataSource1: any;
  visitorReportDetails = []
  spclColumns = ['visitorPhone', 'hostPhone', 'visitorName', 'hostName', 'employeeFirstName', 'cellNumber']
  ProductTypes = ProductTypes
  //TODO it will move to filter component
  openDateFilter: boolean = false;
  startDate: any;
  endDate: any;
  selectedStatus: string = "today";
  showStatus: string = "";
  searchKey: string = null;
  selectedBuildings: any = [];
  selectedCompanies: any = [];
  reportReqObj: object = {};
  timeFilter: string = "today";
  todayDateTime: any;
  dateFormat: string = "DD-MM-YYYY";
  onlyComplexVisitor: boolean;
  reportReady: boolean = false;
  reports: any;
  public pageSizeOptions = [];
  public pageSize: number;
  public pageIndex: 1;

  currentTimeZone: any;
  userData: any;
  reportType = Object(type);
  filetype = Object(fileType);
  selectedReport = "visitor_report";
  filterApplied: boolean = false;
  defaultSettting: any = {
    scheduled: true,
    searchQueryByHost: '',
    searchQueryByVisitor: '',
    status: null,
    walkIn: true,
    selectedCompany: [],
    timeRange: 'today',
    selectedBuildings: [],
    showOnlyComplexVisitor: false,
    includeVisitorPhoto: false,
    complexLevelVisitor: false,
    selectAllBuilding: true,
    selectAllCompany: true,
    includeComplexVisitor: true,
    noShow: false,
    VisitorTypeId: null,
    visitorPurposeId: null
  }
  public advanceFilter: advanceFilter = this.defaultSettting
  public preDefinedFilter: advanceFilter = this.defaultSettting

  appliedFilterString: string;
  isCsv: boolean;
  isExcel: boolean;
  selectedBuildingsAndCompanies: any;
  selectedFiletype: string = "excel";
  originalCompanyAndBuildingList: any;
  buildingWithCompanyList: any;
  defaultCmpBuidingObj: any[] = [];
  selectedBuildingString: string = "";
  selectedCompanyString: string = "";
  allBuildings: any[] = [];
  allCompanies: any[] = [];
  buildingApiResponse: unknown;
  productType: any;
  showEmailLogReport: boolean;
  locationList: any=[]

  constructor(
    private commonService: CommonService,
    private reoprtsService: ReoprtsService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialog: MatDialog,
    private masterService: MasterService,
    private translate: TranslateService,
    private accountService: AccountService,
  ) {
  }

  ngAfterViewInit() {
    // this.sortPagination();
  }

  ngOnInit(): void {
    //  console.log(this.advanceFilter)
    this.productType = this.userService.getProductType();
    if (this.productType == 'Enterprise') {
      // this.getLocation();

      this.reportType = {}
      this.reportType = {visitor_report:"visitor_report"}
    }
    //  console.log(this.advanceFilter)
    //Enable email log report for commercial
    
   this.showEmailLogReport = ('email_report' in this.reportType && (this.productType == this.ProductTypes.Commercial)) ? true : false;
    if(!this.showEmailLogReport)
      delete this.reportType['email_report']
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.userData = this.userService.getUserData();
    if (this.userData) {
      this.getDetails();
    }
    // if(this.userData['role']['shortName'] == LevelAdmins.Level2Admin || this.userData['role']['shortName'] == LevelAdmins.Level1Admin){
    //   this.getBuildingAndCompanyDetails();
    // }
    // if (this.userData && this.userData['role']['shortName'] == LevelAdmins.Level3Admin) {
    //   this.onReportTypeChange(this.selectedReport);
    // }
  }
   getLocation(resp) {
    // let obj = {
    //   isDeleted: true
    // }
    //  this.reoprtsService.changeLocation(obj).subscribe(resp => {
    //    if (!resp.error && resp.statusCode == 200) {
    //      this.locationList = resp.data;
    //      this.locationList.map((element,index) => {
    //        element.checked = true;
    //        element.name=element.locationName
    //        element.buildingArrayIndex=index
    //      })
    //      this.buildingWithCompanyList=this.locationList
    //   }
    // });
         this.locationList = resp.data;
         this.locationList.map((element,index) => {
           element.checked = true;
           element.name=element.locationName
           element.buildingArrayIndex=index
         })
     this.buildingWithCompanyList = this.locationList
     let selectedBuilding = []
    //  console.log(this.locationList)
      this.locationList.map(element => {
       selectedBuilding.push(element.id)
     })
    //  console.log(selectedBuilding)
     this.advanceFilter.selectedBuildings = selectedBuilding;
  }

  sortPagination() {
    this.dataSource1.paginator = this.paginator;
  }

  onReportTypeChange(selectedReportType: string) {
    this.selectedReport = selectedReportType;
    this.onChangeTimeFilter(this.advanceFilter.timeRange);
    switch (selectedReportType) {
      case "visitor_report":
        this.columns = Constants.visitor_report_column;
        // // Columns for enterprise appointments table    
        if (this.productType == ProductTypes.Enterprise) {
          this.columnKeys = this.columns.filter((data) => data.key != "building").map(data => data.key);
        } else {
          this.columnKeys = this.columns.filter((data) => data.key != "visitorType" && data.key != "visitorPurposeType" &&  data.key != "location").map(data => data.key);
        }
       
        console.log(this.advanceFilter)
        this.visitorsReportDetails();
        break;

      case "appointment_report":
        this.columns = Constants.appointment_report_column;
        if (this.productType == ProductTypes.Enterprise) {
          this.columnKeys = this.columns.filter((data) => data.key != "building").map(data => data.key);
        } else {
          this.columnKeys = this.columns.filter((data) => data.key != "location" && data.key != "visitorType" && data.key != "visitorPurposeType").map(data => data.key);
        }
        this.appointmentsReportDetails();
        break;

      case "hsq_report":
        this.columns = Constants.hsq_report_column;
        this.columnKeys = this.columns.map((data) => data.key);
        this.hsqReportDetails();
        break;

      case "email_report":
        this.columns = Constants.email_report_column;
        this.columnKeys = this.columns.map((data) => data.key);
        this.emailReportDetails();
        break;

      case "first_password":
        this.columns = Constants.first_time_password_change;
        this.columnKeys = this.columns.map((data) => data.key);
        this.firstTimePassowrdchangeDetail();
        break;
      default:
        break;
    }
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  onStatusSelectEvent() {
    this.appliedFilterString = "";
    this.filterApplied = false;
    this.advanceFilter = this.defaultSettting;
    if (this.selectedStatus === this.showStatus) {
      this.showStatus = "";
      this.selectedStatus = "today";
    } else {
      this.selectedStatus = this.showStatus;
    }
    console.log(this.advanceFilter)
    this.onReportTypeChange(this.selectedReport);
    // this.reportDetails()
  }

  applyFilter() {
    // console.log(this.buildingWithCompanyList);

    let location = null
    if (this.productType == 'Enterprise') {
      location=this.locationList
    }
     if (this.productType == 'Commercial') {
      location=this.buildingWithCompanyList
    }

    console.log(location)

    const dialogRef = this.dialog.open(ReportFilterPopupComponent, {
      height: "100%",
      width: "75%",
      data: {
        startDate: this.startDate,
        endDate: this.endDate,
        filters: this.advanceFilter,
        isFilterApplied: this.filterApplied,
        defaultSettting: this.defaultSettting,
        defaultCmpBuidingObj: this.defaultCmpBuidingObj,
        selectedReport: this.selectedReport,
        dateFormat: this.dateFormat,
        buildingWithCompanyList: location
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.resetPagination();
      if (result) {
      
        this.filterApplied = result?.filterApplied;
        this.advanceFilter = result?.advanceFilter;
        this.advanceFilter.selectedCompany = [];
        this.advanceFilter.selectedBuildings = [];
        this.selectedCompanyString = "";
        this.selectedBuildingString = "";
        if (this.userData && this.userData['role']['shortName'] != LevelAdmins.Level3Admin) {
          this.buildingWithCompanyList = result?.buildingWithCompanyList;
          if (this.buildingWithCompanyList && this.buildingWithCompanyList.length > 0) {
            this.buildingWithCompanyList.forEach((element) => {
              if (element && element['companies'] && element['companies'].length > 0) {
                element['companies'].forEach((data) => {
                  if (data.checked) {
                    this.advanceFilter.selectedCompany.push(data.companyId);
                    if (data && data?.name)
                      this.selectedCompanyString = this.selectedCompanyString + data?.name + ",";
                  }
                })
              }
              if (element.checked) {
                this.advanceFilter.selectedBuildings.push(element.id);
                if (element && element?.name)
                  this.selectedBuildingString = this.selectedBuildingString + element?.name + ",";
              }
            })
          }
        }
        this.locationList = this.buildingWithCompanyList;
        if (this.advanceFilter.timeRange != "custom") {
          this.onChangeTimeFilter(this.advanceFilter.timeRange);
        }
        else {
          if (result && result?.customeDate) {
            this.startDate = result?.customeDate?.startDate;
            this.endDate = result?.customeDate?.endDate;
          }
        }
      }
      this.createStringForShowAppliedFilters();
      this.onReportTypeChange(this.selectedReport);
      // this.visitorsReportDetails();
    });

  }
  createStringForShowAppliedFilters() {
    this.appliedFilterString = "";
    if (this.advanceFilter?.status && this.advanceFilter?.status.length > 0)
      this.appliedFilterString = this.appliedFilterString + "Status :" + this.advanceFilter.status + ",";
    if (this.advanceFilter?.walkIn)
      this.appliedFilterString = this.appliedFilterString + " WalkIn :" + "Yes" + ",";
    if (this.advanceFilter?.scheduled)
      this.appliedFilterString = this.appliedFilterString + " Scheduled :" + "Yes" + ","
    if (this.advanceFilter?.searchQueryByHost)
      this.appliedFilterString = this.appliedFilterString + " Host Search :" + this.advanceFilter.searchQueryByHost + ","
    if (this.advanceFilter?.searchQueryByVisitor)
      this.appliedFilterString = this.appliedFilterString + " Visitor Search :" + this.advanceFilter.searchQueryByVisitor + ","
    if (this.advanceFilter?.includeComplexVisitor)
      this.appliedFilterString = this.appliedFilterString + " Include Complex Visitor :" + "Yes" + ","
    if (this.advanceFilter?.includeVisitorPhoto)
      this.appliedFilterString = this.appliedFilterString + " Include Visitor Visitor :" + "Yes" + ","
    if (!this.advanceFilter?.showOnlyComplexVisitor && this.advanceFilter && this.advanceFilter.selectedBuildings && this.advanceFilter.selectedBuildings.length > 0) {
      this.appliedFilterString = this.appliedFilterString + "Selected Buildings : " + this.selectedBuildingString;
    }
    if (!this.advanceFilter?.showOnlyComplexVisitor && this.advanceFilter && this.advanceFilter.selectedCompany && this.advanceFilter.selectedCompany.length > 0) {
      this.appliedFilterString = this.appliedFilterString + "Selected Companies : " + this.selectedCompanyString;
    }
  }

  visitorsReportDetails() {
    console.log(this.advanceFilter)
    this.reoprtsService.visitorsReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data;
      
        this.setData();

      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        this.setData()
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

  appointmentsReportDetails() {
    this.reoprtsService.appointmentsReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data;
        this.setData();

      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        this.setData()
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }
  firstTimePassowrdchangeDetail() {
    this.reoprtsService.firstTimePasswordChange(this.genrateFirstLoginRequest()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data;
        this.setData();
      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        this.setData()
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

  genrateFirstLoginRequest(): FirstTimeLoginRequest {
    if (this.userData['role']['shortName'] == LevelAdmins.Level1Admin && this.advanceFilter.showOnlyComplexVisitor) {
      this.advanceFilter.selectedBuildings = [];
      this.advanceFilter.selectedCompany = [];
    }
    if (this.userData['role']['shortName'] == LevelAdmins.Level2Admin && this.advanceFilter && this.advanceFilter.selectedBuildings && this.advanceFilter.selectedBuildings.length <= 0) {
      this.advanceFilter.selectedBuildings = this.allBuildings;
      this.advanceFilter.selectedCompany = this.allCompanies;
    }
    if (this.advanceFilter && this.advanceFilter?.selectedBuildings && this.advanceFilter?.selectedBuildings.length <= 0) {
      this.advanceFilter.selectedCompany = [];
    }
    if (this.userData['role']['shortName'] == LevelAdmins.Level2Admin || this.userData['role']['shortName'] == LevelAdmins.Level3Admin) {
      this.advanceFilter.includeComplexVisitor = false;
    }
    this.firstTimeLoginRequest.employeeGlobalSearch = (this.advanceFilter?.searchQueryByHost) ? (this.advanceFilter?.searchQueryByHost) : "";
    this.firstTimeLoginRequest.fromDate = this.startDate;
    this.firstTimeLoginRequest.toDate = this.endDate;
    this.firstTimeLoginRequest.orderBy = "";
    this.firstTimeLoginRequest.orderDirection = "";
    this.firstTimeLoginRequest.pageSize = this.pageSize ? this.pageSize : defaultVal.pageSize;
    this.firstTimeLoginRequest.pageIndex = this.pageIndex ? this.pageIndex : defaultVal.pageIndex;
    this.firstTimeLoginRequest.includeVisitorPhoto = (this.advanceFilter?.includeVisitorPhoto) ? (this.advanceFilter?.includeVisitorPhoto) : false;
    this.firstTimeLoginRequest.level2Ids = (this.advanceFilter?.selectedBuildings) ? (this.advanceFilter?.selectedBuildings) : [];
    this.firstTimeLoginRequest.level3Ids = (this.advanceFilter?.selectedCompany) ? (this.advanceFilter?.selectedCompany) : [];
    this.firstTimeLoginRequest.includeComplexEmployee = (this.advanceFilter?.includeComplexVisitor) ? true : false;
    return this.firstTimeLoginRequest
  }
  hsqReportDetails() {
    this.reoprtsService.hsqReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data;
        this.setData();

      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        this.setData()
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

  emailReportDetails() {
    this.reoprtsService.emailReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data;
        this.setData();

      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        this.setData()
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

  setData() {
    // this.reportData = this.reportService.getReportData();
    this.totalRecords = (this.reportData && this.reportData['records'] && this.reportData['records']['totalCount']) ? this.reportData['records']['totalCount'] : 0;
    this.dataSource = (this.reportData && this.reportData['records'] && this.reportData['records']['list']) ? this.reportData['records']['list'] : 0;
    console.log(this.dataSource)
    this.dataSource1 = new MatTableDataSource<Element>(this.dataSource);
    var label_1;
    var label_2;
    if (this.selectedReport == 'hsq_report') {
      label_1 = "Total HSQ Satisfied";
      label_2 = "Total HSQ Unsatisfied";
      this.visitorReportDetails = [
        { show: this.translate.instant("labels.Total_Visitors"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['totalVisitor']) ? this.reportData['summary']['totalVisitor'] : 0 },
        { show: this.translate.instant("labels.satisfied"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['satisfiedCount']) ? this.reportData['summary']['satisfiedCount'] : 0 },
        { show: this.translate.instant("labels.not_satisfied"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['notSatisfiedCount']) ? this.reportData['summary']['notSatisfiedCount'] : 0 },
      ]
    } else if (this.selectedReport == 'email_report') {
      this.visitorReportDetails = [
        { show: this.translate.instant("labels.Total_Employee"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['totalEmailLogs']) ? this.reportData['summary']['totalEmailLogs'] : 0 },
        { show: this.translate.instant("labels.success_email"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['successEmails']) ? this.reportData['summary']['successEmails'] : 0 },
        { show: this.translate.instant("labels.failed_email"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['failedEmails']) ? this.reportData['summary']['failedEmails'] : 0 },
      ]
    } else {
      label_1 = "Checked Out Visitors";
      label_2 = "On Premises";
      this.visitorReportDetails = [
        // { show: this.translate.instant("labels.Total_Visitors"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['totalVisitor']) ? this.reportData['summary']['totalVisitor'] : 0 },
        // { show: this.translate.instant("labels.Checked_Out_Visitors"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['checkedOutVisitors']) ? this.reportData['summary']['checkedOutVisitors'] : 0 },
        // { show:this.translate.instant("labels.On_Premises"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['onPremises']) ? this.reportData['summary']['onPremises'] : 0 },
        { show: this.translate.instant("labels.Total_Visitors"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['totalVisitor']) ? this.reportData['summary']['totalVisitor'] : 0 },
        { show: this.translate.instant("labels.Checked_Out_Visitors"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['checkedOutVisitors']) ? this.reportData['summary']['checkedOutVisitors'] : 0 },
        { show: this.translate.instant("labels.On_Premises"), value: (this.reportData && this.reportData['summary'] && this.reportData['summary']['onPremises']) ? this.reportData['summary']['onPremises'] : 0 },
      ]
    }

    // this.sortPagination();
  }

  generateRequest(): visitorReportsRequest {
    if (this.userData['role']['shortName'] == LevelAdmins.Level1Admin && this.advanceFilter.showOnlyComplexVisitor) {
      this.advanceFilter.selectedBuildings = [];
      this.advanceFilter.selectedCompany = [];
    }
    if (this.userData['role']['shortName'] == LevelAdmins.Level2Admin && this.advanceFilter && this.advanceFilter.selectedBuildings && this.advanceFilter.selectedBuildings.length <= 0) {
      this.advanceFilter.selectedBuildings = this.allBuildings;
      this.advanceFilter.selectedCompany = this.allCompanies;
    }
    if (this.advanceFilter && this.advanceFilter?.selectedBuildings && this.advanceFilter?.selectedBuildings.length <= 0) {
      this.advanceFilter.selectedCompany = [];
    }
    if (this.userData['role']['shortName'] == LevelAdmins.Level2Admin || this.userData['role']['shortName'] == LevelAdmins.Level3Admin) {
      this.advanceFilter.includeComplexVisitor = false;
    }
    if (this.advanceFilter?.status == 'noshow') {
      this.visitorReportsRequest.status = ["scheduled"];
    } else {
      this.visitorReportsRequest.status = (this.advanceFilter?.status) ? ([this.advanceFilter.status]) : [];
    }

    this.visitorReportsRequest.visitorGlobalSearch = (this.advanceFilter?.searchQueryByVisitor) ? (this.advanceFilter?.searchQueryByVisitor) : "";
    this.visitorReportsRequest.fromDate = this.startDate;
    this.visitorReportsRequest.toDate = this.endDate;
    this.visitorReportsRequest.orderBy = "";
    this.visitorReportsRequest.orderDirection = "";
    this.visitorReportsRequest.pageSize = this.pageSize ? this.pageSize : defaultVal.pageSize;
    this.visitorReportsRequest.pageIndex = this.pageIndex ? this.pageIndex : defaultVal.pageIndex;
    this.visitorReportsRequest.includeVisitorPhoto = (this.advanceFilter?.includeVisitorPhoto) ? (this.advanceFilter?.includeVisitorPhoto) : false;
    this.visitorReportsRequest.level2Ids = (this.advanceFilter?.selectedBuildings) ? (this.advanceFilter?.selectedBuildings) : [];
    if (this.productType == this.ProductTypes.Commercial) {
       this.visitorReportsRequest.level3Ids = (this.advanceFilter?.selectedCompany) ? (this.advanceFilter?.selectedCompany) : [];
    }
    this.visitorReportsRequest.hostGlobalSearch = (this.advanceFilter?.searchQueryByHost) ? (this.advanceFilter?.searchQueryByHost) : "";
    this.visitorReportsRequest.walkin = this.advanceFilter.walkIn;
    this.visitorReportsRequest.scheduled = this.advanceFilter.scheduled;
    this.visitorReportsRequest.noShow = this.advanceFilter.noShow;
    this.visitorReportsRequest.visitorPurposeId = this.advanceFilter.visitorPurposeId;
    this.visitorReportsRequest.VisitorTypeId = this.advanceFilter.VisitorTypeId;

    // this.visitorReportsRequest.walkin = (this.advanceFilter && this.advanceFilter.walkIn)?(this.advanceFilter.walkIn):true;
    // this.visitorReportsRequest.scheduled = (this.advanceFilter && this.advanceFilter.scheduled)?(this.advanceFilter.scheduled):true;
    this.visitorReportsRequest.includeComplexVisitor = (this.advanceFilter?.includeComplexVisitor) ? true : false;
    console.log(this.visitorReportsRequest);
    return this.visitorReportsRequest
  }

  // back() {
  //   this.reportReady = !this.reportReady; 
  // }

  getPaginationData(event) {
    this.pageIndex =
      this.pageSize == event.pageSize
        ? event.pageIndex + 1
        : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    // this.visitorsReportDetails();
    // this.sortPagination();
     console.log(this.advanceFilter)
    this.onReportTypeChange(this.selectedReport);
  }

  onReportTypeSelect(event: any) {
    // if(this.selectedReport != event.value){
    this.resetPagination();
    if (this.buildingApiResponse)
      this.getBuilding(this.buildingApiResponse)
    this.selectedFiletype = null;
    this.isExcel = false;
    this.filterApplied = false;
    this.selectedReport = event.value;
    this.appliedFilterString = "";
    this.advanceFilter = this.defaultSettting;
    this.onChangeTimeFilter(this.advanceFilter.timeRange);
    //  console.log(this.advanceFilter)
    this.onReportTypeChange(this.selectedReport);
    // }
  }

  resetPagination() {
    this.paginator.firstPage();
    this.paginator.pageIndex = 0;
    this.pageIndex = defaultVal.pageIndex;
    this.pageSize = defaultVal.pageSize;
  }

  onFileFormatSelect(event: any) {
    this.selectedFiletype = event.key;
    this.isCsv = (event.key == 'csv') ? true : false;
    this.isExcel = (event.key == 'excel') ? true : false;
  }

  exportFile() {
    switch (this.selectedReport) {
      case "visitor_report":
        this.exportVisitorsReport();
        break;

      case "appointment_report":
        this.exportAppointmentReport();
        break;

      case "hsq_report":
        this.exportHsqReport();
        break;

      case "email_report":
        this.exportEmailReport();
        break;

      case "first_password":
        this.exportFirstPasswordChange();
        break;

      default:
        break;
    }
  }
  exportFirstPasswordChange() {
    this.reoprtsService.exportFirstTmePassword(this.genrateFirstLoginRequest()).pipe(first()).subscribe((response) => {
      this.downLoadFile(response, 'firsttimepassword' + new Date().getTime() + ".xlsx");
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], "Error");
        });
      } else {
        this.toastr.error(error.error.Message, "Error");
      }
    });
  }
  exportHsqReport() {
    this.reoprtsService.exportAppointmentsHsqReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      this.downLoadFile(response, 'HsqReport_' + new Date().getTime() + ".xlsx");
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], "Error");
        });
      } else {
        this.toastr.error(error.error.Message, "Error");
      }
    });
  }

  exportAppointmentReport() {
    this.reoprtsService.exportAppointmentsReportData(this.generateRequest()).pipe(first()).subscribe((response) => {
      this.downLoadFile(response, 'AppointmentReport_' + new Date().getTime() + ".xlsx");
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], "Error");
        });
      } else {
        this.toastr.error(error.error.Message, "Error");
      }
    });
  }


  exportEmailReport() {
    if (this.isExcel) {
      this.reoprtsService.exportEmailReportData(this.generateRequest())
        .pipe(first())
        .subscribe((response) => {
          this.downLoadFile(response, 'EmailReport_' + new Date().getTime() + ".xlsx");
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], "Error");
            });
          } else {
            this.toastr.error(error.error.Message, "Error");
          }
        })
    }
  }

  exportVisitorsReport() {
    if (this.isExcel) {
      this.reoprtsService.exportVisitorsReportData(this.generateRequest())
        .pipe(first())
        .subscribe((response) => {
          this.downLoadFile(response, 'VisitorReport_' + new Date().getTime() + ".xlsx");
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], "Error");
            });
          } else {
            this.toastr.error(error.error.Message, "Error");
          }
        })
    }
  }

  downLoadFile(fileContent: any, fileName: string) {
    var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var blob = new Blob([fileContent], { type: contentType });
    var downloadUrl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = downloadUrl
    anchor.click();
  }

  getDetails() {
    if (this.userData && this.userData?.level2List && this.userData?.level2List.length > 0) {
      let locationId = this.userData?.level2List?.find(location => location.isDefault == true);
      this.callMultipleApi(locationId.id);
    }
    else if (this.userData && this.userData?.level1Id) {
      this.callMultipleApi(null);
    } else {
    }
  }

  callMultipleApi(locationId) {
    let listOfApi = [];
    listOfApi.push(this.commonService.getVisitorSettings(locationId).pipe(first()));
    if (this.productType == ProductTypes.Commercial) {
       if (this.userData['role']['shortName'] == LevelAdmins.Level2Admin || this.userData['role']['shortName'] == LevelAdmins.Level1Admin) {
      listOfApi.push(this.masterService.getCompanyAndBuilding().pipe(first()))
    }
    }
    else {
      // this.getLocation();
       listOfApi.push(this.reoprtsService.changeLocation({isDeleted:true}).pipe(first()))
    }
    forkJoin(listOfApi).subscribe((resp) => {
      if (resp && resp[0]) {
        this.getVisitorSettings(resp[0]);
      }
     
      if (resp && resp[1]) {
        if (this.productType == ProductTypes.Commercial) {
            this.buildingApiResponse = resp[1];
            this.getBuilding(resp[1]);
        } else {
          this.buildingApiResponse = resp[1];
          this.getLocation(resp[1]);
         }
      }
    })
  }

  getVisitorSettings(response) {
    if (response.statusCode === 200 && response.errors == null) {
      this.currentTimeZone = response?.data?.timeZone;
      this.dateFormat = response?.data?.dateFormat;
      this.getCurrentTimeZone(this.currentTimeZone);
    } else {
      this.toastr.error(response.message);
    }
  }

  getBuilding(resp) {

    this.originalCompanyAndBuildingList = resp?.data;
    let selection = true;
     
    this.buildingWithCompanyList = this.originalCompanyAndBuildingList.buildingList.map((element, index) => {
      let companyUnderBuilding = this.originalCompanyAndBuildingList.companyList.filter((company) => {
        return company && company?.buildingId && (company?.buildingId === element?.id)
      })
      element['companies'] = companyUnderBuilding;
      element['companies'].map((data, cmpIndex) => {
        data['checked'] = selection;
        data['cmpIndex'] = cmpIndex;
        data['buildingArrayIndex'] = index;
      })
      element['checked'] = selection;
      element['buildingArrayIndex'] = index;
      return element;
    });
   
    this.defaultCmpBuidingObj = JSON.parse(JSON.stringify(this.buildingWithCompanyList));
    this.extractSelected();
  }

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : "India Standard Time";
    this.commonService.getCurrentTimeByZone(timezone).subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.startDate = moment(response?.data).format(this.dateFormat.toUpperCase());
          this.endDate = moment(response?.data).format(this.dateFormat.toUpperCase());
          this.todayDateTime = moment(response?.data);
          this.onChangeTimeFilter('today');
          //  console.log(this.advanceFilter)
          this.onReportTypeChange(this.selectedReport);
        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], "Error");
          });
        } else {
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

  public onChangeTimeFilter(timeFilter) {
    let dateSet = false;
    this.timeFilter = timeFilter;
    const startOfMonth = moment(this.todayDateTime).startOf('month');
    if (timeFilter != undefined) {
      switch (timeFilter) {
        case "today":
          // this.selectedStatus = "today";
          this.startDate = moment(this.todayDateTime).format(this.dateFormat.toUpperCase())
          this.endDate = moment(this.todayDateTime).format(this.dateFormat.toUpperCase())
          dateSet = true;
          break;
        case "this_month":
          // this.selectedStatus = "this_month";
          // this.startDate = moment(startOfMonth).format(this.dateFormat.toUpperCase())
          // this.endDate = moment(this.todayDateTime).format(this.dateFormat.toUpperCase())
          this.startDate = moment(this.todayDateTime).clone().startOf('month').format(this.dateFormat.toUpperCase())
          this.endDate = moment(this.todayDateTime).clone().endOf('month').format(this.dateFormat.toUpperCase())
          dateSet = true;
          break;
        case "last_month":
          // this.selectedStatus = "last_month";
          this.startDate = moment(startOfMonth).subtract(1, 'month').format(this.dateFormat.toUpperCase())
          this.endDate = moment(startOfMonth).subtract(1, 'month').clone().endOf('month').format(this.dateFormat.toUpperCase())
          dateSet = true;
          break;
        case "custom":
          // this.showStatus = "";
          // this.selectedStatus = "last_month";
          // this.startDate = moment(this.todayDateTime).subtract(30, 'days').format(this.dateFormat.toUpperCase())
          // this.endDate = moment(this.startDate).subtract(30, 'days').format(this.dateFormat.toUpperCase())
          // dateSet = true;
          break;
      }
      if (dateSet) {
        // this.reportDetails()
      }
    }
  }

  extractSelected() {
    this.buildingWithCompanyList.forEach((element) => {
      this.allBuildings.push(element.id);
      element['companies'].forEach((data) => {
        this.allCompanies.push(data.companyId);
        if (data.checked) {
          this.advanceFilter.selectedCompany.push(data.companyId);
          if (data && data?.name)
            this.selectedCompanyString = this.selectedCompanyString + data?.name + ",";
        }
      })
      if (element.checked) {
        this.advanceFilter.selectedBuildings.push(element.id);
        if (element && element?.name)
          this.selectedBuildingString = this.selectedBuildingString + element?.name + ",";
      }
    })
  }

  getRowData(data: any) {
    switch (this.selectedReport) {
      case "visitor_report":
        this.openDialogForReportDetails(VisitorReportDetailsComponent, data);
        break;

      case "appointment_report":
        this.openDialogForReportDetails(AppointmentReportDetailsComponent, data);
        break;

      case "hsq_report":
        this.openDialogForReportDetails(HsqReportDetailsComponent, data);
        break;

      case "email_report":
        this.openDialogForReportDetails(EmailReportDetailsComponent, data);
        break;

      default:
        break;
    }
  }

  openDialogForReportDetails(ReportType: any, data) {
    const dialogRef = this.dialog.open(ReportType, {
      height: "100%",
      position: { right: "0" },
      data: {
        title: this.selectedReport,
        data: data
      },
      panelClass: ["animate__animated", "vams-dialog-xl", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
      });
  }
}
