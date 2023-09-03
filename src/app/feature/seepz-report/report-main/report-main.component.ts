import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { first } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Constants } from "../constants/columns";
import { ReoprtsService } from "../reoprts.service";
import { formatPhoneNumber, removeSpecialCharAndSpaces } from "../../../core/functions/functions";
import { CommonService } from "src/app/core/services/common.service";
import {
  FirstTimeLoginRequest,
  seepzPassReportRequest,
  visitorReportsRequest,
} from "../models/report-req";
import {
  pagination,
  defaultVal,
  ProductTypes,
} from "../../../core/models/app-common-enum";
import { UserService } from "src/app/core/services/user.service";
import {
  fileType,
  advanceFilter,
  seepz_report_type,
} from "../models/report-filter";
import { MatDialog } from "@angular/material/dialog";
import { MasterService } from "../../master/services/master.service";
import { ReportFilterPopupComponent } from "../report-filter-popup/report-filter-popup.component";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ReportDetailViewComponent } from "../report-detail-view/report-detail-view/report-detail-view.component";
import { WalkinVisitorReportComponent } from "../walkin-visitor-report/walkin-visitor-report.component";
import { AppointmentService } from "../../appointment/services/appointment.service";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "src/app/core/models/users";
import { VisitorReportDetailsComponent } from "../../reports/report-details-page/visitor-report-details/visitor-report-details.component";
import { VisitorReportDetailViewComponent } from "../visitor-report-detail-view/visitor-report-detail-view.component";

@Component({
  selector: "app-report-main",
  templateUrl: "./report-main.component.html",
  styleUrls: ["./report-main.component.scss"],
  providers: [
    { provide: DateAdapter,useClass: MomentDateAdapter,deps: [MAT_DATE_LOCALE],},
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],

})
export class ReportMainComponent implements OnInit {
  public visitorReportsRequest: visitorReportsRequest =new visitorReportsRequest();
  public firstTimeLoginRequest: FirstTimeLoginRequest =new FirstTimeLoginRequest();
  public seepzPassReportRequest: seepzPassReportRequest = new seepzPassReportRequest();
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
  visitorReportDetails = [];
  spclColumns = ["visitorPhone", "hostPhone","visitorName", "hostName", "employeeFirstName", "cellNumber", ];
  ProductTypes = ProductTypes;
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
  dateFormat: any;
  onlyComplexVisitor: boolean;
  reportReady: boolean = false;
  reports: any;
  public pageSizeOptions = [];
  public pageSize: number;
  public pageIndex: 1;
  currentTimeZone: any;
  userData: any;
  reportType = Object(seepz_report_type);
  filetype = Object(fileType);
  filterApplied: boolean = false;
  defaultSettting: any = {
    scheduled: true,
    searchQueryByHost: "",
    searchQueryByVisitor: "",
    status: null,
    walkIn: true,
    selectedCompany: [],
    timeRange: "today",
    selectedBuildings: [],
    showOnlyComplexVisitor: false,
    includeVisitorPhoto: false,
    complexLevelVisitor: false,
    selectAllBuilding: true,
    selectAllCompany: true,
    includeComplexVisitor: true,
    noShow: false,
    VisitorTypeId: null,
    visitorPurposeId: null,
  };
  public advanceFilter: advanceFilter = this.defaultSettting;
  public preDefinedFilter: advanceFilter = this.defaultSettting;
  

  appliedFilterString: string;
  isCsv: boolean;
  isExcel: boolean;
  selectedBuildingsAndCompanies: any;
  selectedFiletype: string ;
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
  locationList: any = [];
  selectedReport:any;
  reportTypes = [
    {
      value: "personalPermanentPass",
      viewValues: "Personal Permanent Pass Report",
      passType: "P",
      categoryType: "Visitor",
    },
    {
      value: "VehiclePermanentPass",
      viewValues: "Vehicle Permanent Pass Report",
      passType: "P",
      categoryType: "Vehicle",
    },
    {
      value: "DailyPass",
      viewValues: "Daily Pass Report",
      passType: "D",
      categoryType: "",
    },
    {
      value: "VisitorReport",
      viewValues: "Visitor Report",
    },
  ];
  checkInDate: any;
  checkOutDate: any;
  firstName: any;
  lastName: any;
  passType: any;
  categoryType: any;
  CategoryId: any;
  userDetails: any;
  cellNumber: any;
  isdCode:any;
  vehicleNumber: any;
  tenantList:any[] = [];
  tenantListId :any[] = [];
  originalTenantDisplayList:any[] = [];
  public filterFormMain: FormGroup;
  reportDataSummery: any;
  defaultSeepzPassReportRequest:any;
  categoryTypeName:any;
  tenantId: any[]=[];
  originalTenantId: any[] = [];
  userDatas: any;
  walkinVisitorReport: any;
  globalSearch: any;
  visitorGlobalSearch: any;
  visitorPurposeId: any;
  VisitorTypeId: any;
  SeepzWorkFlow: any;
  searchQueryByHost: any;
  searchQueryByVisitor:any;
  status: any;
  showVisitorReport: boolean;
  constructor(
    private reoprtsService: ReoprtsService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private masterService: MasterService,
    private translate: TranslateService,
    private formBuilder :FormBuilder,
    public apptService : AppointmentService
  ) {
    this.userDetails = this.userService.getUserData();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
  }

  ngAfterViewInit() {
    // this.sortPagination();
  }

  ngOnInit(): void {
    this.getVisitorSettings(null);
    this.getTenantList();
    
   const visitorReportValue = this.reportTypes[3].value
    this.showVisitorReport = (this.userDetails.role.shortName == 'L1Admin') ? true : false;

    if(!this.showVisitorReport){
    this.reportTypes.pop();
    }
    // this was inside the if condition I removed it for bug 606
     this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
      this.userData = this.userService.getUserData();

    this.seepzPassReportRequest = {
      pageIndex: 1,
      pageSize: 25,
      level3Id: null,
      categoryType: "Visitor",
      CategoryId: "",
      checkInDate: null,
      checkOutDate: null,
      hostGlobalSearch: "",
      passType: "P",
      flagged: false,
      firstName: "",
      lastName: "",
      cellNumber: "",
      isdCode:"",
      vehicleNumber: "",
      tenantListId:[],
      VisitorTypeId:"",
      visitorPurposeId:"",
      visitorGlobalSearch:"",
      status:"",
      walkin:"",
      level3Ids:[],
      fromDate:null,
      toDate:null
    };
    this.defaultSeepzPassReportRequest = {
      pageIndex: 1,
      pageSize: 25,
      level3Id: null,
      categoryType: "Visitor",
      CategoryId: "",
      checkInDate: null,
      checkOutDate: null,
      globalSearch: "",
      passType: "P",
      flagged: false,
      firstName: "",
      lastName: "",
      cellNumber: "",
      isdCode:"",
      vehicleNumber: "",
      tenantListId:[],
      visitorPurposeId:"",
      VisitorTypeId:"",
      visitorGlobalSearch:"",
      status:""
    };
   // this.onReportTypeChange(this.reportTypes[0])
  }
  sortPagination() {
    this.dataSource.paginator = this.paginator;
  }

  // createForm() {
  //   this.filterFormMain = this.formBuilder.group({ 
  //     selectedReport:[this.reportTypes[0]]
  //   })
  // }
  onReportTypeChange(selectedReportType) {
    let selectedReport = selectedReportType["value"];
    switch (selectedReport) {
      case "personalPermanentPass":
        if(this.userDetails.role.shortName === 'L1Admin'){
          this.columns = Constants.Personal_permanent_report_column_l1Admin;
        }else{
          this.columns = Constants.Personal_permanent_report_column;
        }
        this.columnKeys = this.columns.map((data) => data.key);
        this.personalPermanentPassReportDetails();
        break;

      case "VehiclePermanentPass":
        if(this.userDetails.role.shortName === 'L1Admin'){
          this.columns = Constants.Vehicle_permanent_report_column_l1Admin;
        }
        else{
          this.columns = Constants.Vehicle_permanent_report_column;
        }
        this.columnKeys = this.columns.map((data) => data.key);
        this.personalPermanentPassReportDetails();
        break;

      case "DailyPass":
        if(this.userDetails.role.shortName === 'L1Admin')
        {
        this.columns = Constants.daily_pass_report_column;
        }else{
          this.columns = Constants.daily_pass_report_column_tenant;
        }
        this.columnKeys = this.columns.map((data) => data.key);
        this.personalPermanentPassReportDetails();
        break;
        case "VisitorReport":
          this.columns = Constants.visitor_report_column;
          this.columnKeys = this.columns.filter((data) => data.key != "building").map(data => data.key);
          this.visitorsReportDetails();;
        break;

      default:
        break;
    }
  }

  applyFilterVisitorReport(){
    const dialogRef = this.dialog.open(WalkinVisitorReportComponent, {
      height: "100%",
      width: "70%",
      data: {
        isFilterApplied: this.filterApplied,
        filters: this.advanceFilter,
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        selectedReport: this.selectedReport,
        searchQueryByHost: this.globalSearch,
        visitorGlobalSearch:this.visitorGlobalSearch,
        visitorPurposeId: this.visitorPurposeId,
        VisitorTypeId:this.VisitorTypeId,
        status:this.status
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      // console.log(result)
        if (result) {
        this.resetPagination();
          this.filterApplied = result?.filterApplied;
          this.advanceFilter = result?.advanceFilter;
          this.checkInDate = result.checkInDate;
          this.checkOutDate = result?.checkOutDate;
          this.status = result?.status;
          this.globalSearch = result?.searchQueryByHost;
          this.visitorGlobalSearch = result?.searchQueryByVisitor;
          this.visitorPurposeId = result?.visitorPurposeId;
          this.VisitorTypeId = result?.VisitorTypeId
        this.onReportTypeChange(this.selectedReport);
        }
      });
  }

  applyFilter() {
    const dialogRef = this.dialog.open(ReportFilterPopupComponent, {
      height: "100%",
      width: "66%",
      data: {
        isFilterApplied: this.filterApplied,
        filters: this.advanceFilter,
        passType: this.selectedReport["passType"],
        categoryType: this.selectedReport["categoryType"],
        checkInDate: this.checkInDate,
        checkOutDate: this.checkOutDate,
        selectedReport: this.selectedReport,
        firstName: this.firstName,
        lastName: this.lastName,
        level3Id: "",
        globalSearch: "",
        flagged: true,
        CategoryId: this.CategoryId,
        cellNumber: this.cellNumber,
        isdCode:this.isdCode,
        vehicleNumber: this.vehicleNumber,
        tenantList : this.tenantList,
        originalTenantDisplayList :this.originalTenantDisplayList,
        categoryTypeName:this.categoryTypeName,
        tenantListId:this.tenantId
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
        if (result) {
          this.resetPagination();
          console.log(result, "result....");
          this.filterApplied = result?.filterApplied;
          this.advanceFilter = result?.advanceFilter;
          this.checkInDate = result.checkInDate;
          this.checkOutDate = result.checkOutDate;
          this.firstName = result.firstName;
          this.lastName = result.lastName;
          this.passType = result.selectedReport.passType;
          this.categoryType = result.selectedReport.categoryType;
          this.CategoryId = result.CategoryId;
          this.cellNumber = result.cellNumber?.number ? removeSpecialCharAndSpaces(result.cellNumber?.number.toString()) : null ;
          this.isdCode = result.cellNumber?.dialCode ? result.cellNumber?.dialCode.substring(1) : null
          this.vehicleNumber = result.vehicleNumber;
          this.tenantList = result.tenantList;
          this.categoryTypeName= result.categoryTypeName
          this.tenantListId = result.tenantListId
          this.tenantId = result.tenantListId
          this.onReportTypeChange(this.selectedReport);
        }
      });
  }

  personalPermanentPassReportDetails(data?) {
    this.reoprtsService.seepzPassReportData(this.generateRequests()).pipe(first()).subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.reportData = response.data.records;
            this.reportDataSummery = response.data;
            this.dataSource = this.reportData.list;
            this.totalRecords = this.reportData.totalCount;
            if(this.selectedReport['value'] == "personalPermanentPass"){
              this.visitorReportDetails = [
                //{show: this.translate.instant("reportFilterView.today")},
                { show: this.translate.instant("labels.total_CheckIn"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckIn']) ? this.reportDataSummery['summery']['totalCheckIn'] : 0 },
                { show: this.translate.instant("labels.total_CheckOut"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckOut']) ? this.reportDataSummery['summery']['totalCheckOut'] : 0 },
              ]
            }else if(this.selectedReport['value'] == "VehiclePermanentPass"){
              this.visitorReportDetails = [
                { show: this.translate.instant("labels.total_CheckIn"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckIn']) ? this.reportDataSummery['summery']['totalCheckIn'] : 0 },
                { show: this.translate.instant("labels.total_CheckOut"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckOut']) ? this.reportDataSummery['summery']['totalCheckOut'] : 0 },
              ]
            }else if(this.selectedReport['value'] == "DailyPass"){
              this.visitorReportDetails = [
                { show: this.translate.instant("labels.total_CheckIn"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckIn']) ? this.reportDataSummery['summery']['totalCheckIn'] : 0 },
                { show: this.translate.instant("labels.total_CheckOut"), value: (this.reportDataSummery && this.reportDataSummery['summery'] && this.reportDataSummery['summery']['totalCheckOut']) ? this.reportDataSummery['summery']['totalCheckOut'] : 0 },
              ]
            }
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          this.dataSource = this.reportData.list;
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

  generateRequests(): seepzPassReportRequest {
    // this.tenantId = (this.tenantList.map(element => {
    //   if(element.checked){
    //     return element.companyId
    //   }
    // } )).filter(ele => ele != null)
    // this.seepzPassReportRequest.tenantListId = tenantId
    this.seepzPassReportRequest.tenantListId = this.userDetails.role.shortName == 'L3Admin'? null : this.tenantId
    this.seepzPassReportRequest.pageSize = this.pageSize? this.pageSize : defaultVal.pageSize;
    this.seepzPassReportRequest.pageIndex = this.pageIndex? this.pageIndex : defaultVal.pageIndex;
    this.seepzPassReportRequest.categoryType = this.categoryType;
    this.seepzPassReportRequest.passType = this.passType;
    if(this.selectedReport.value == 'VisitorReport'){
      let dateChange = null 
      if(this.dateFormat == "dd-MM-yyyy"){
        dateChange = "dd-MM-yyyy"
      }
      else if(this.dateFormat == "MM-dd-yyyy"){
        dateChange = "MM-dd-yyyy"
      }
      this.seepzPassReportRequest.fromDate = this.datePipe.transform(this.checkInDate ? this.checkInDate : null,dateChange),
      this.seepzPassReportRequest.toDate = this.datePipe.transform(this.checkOutDate ? this.checkOutDate : null,dateChange)

      }else if(this.selectedReport.value != 'VisitorReport'){
        this.seepzPassReportRequest.checkInDate = this.datePipe.transform(this.checkInDate ? this.checkInDate : null,"yyyy-MM-dd"),
        this.seepzPassReportRequest.checkOutDate = this.datePipe.transform(this.checkOutDate ? this.checkOutDate : null,"yyyy-MM-dd" )
      }
    
    this.seepzPassReportRequest.flagged = true,
    this.seepzPassReportRequest.firstName = this.firstName,
    this.seepzPassReportRequest.lastName = this.lastName,
    this.seepzPassReportRequest.CategoryId = this.CategoryId ? this.CategoryId : null,
    this.seepzPassReportRequest.cellNumber = this.cellNumber,
    this.seepzPassReportRequest.isdCode = this.isdCode,
    this.seepzPassReportRequest.vehicleNumber = this.vehicleNumber,
    this.seepzPassReportRequest.level3Id = this.userDetails.role.shortName == 'L1Admin' ? null : this.userDetails.employeeOfId;
    this.seepzPassReportRequest.visitorPurposeId = this.visitorPurposeId ? this.visitorPurposeId : null;
    this.seepzPassReportRequest.VisitorTypeId = this.VisitorTypeId ?  this.VisitorTypeId : null;
    this.seepzPassReportRequest.status = (this.status) ? ([this.status]) : null;
    this.seepzPassReportRequest.walkin = true;
    // this.seepzPassReportRequest.visitorGlobalSearch = this.advanceFilter?.searchQueryByVisitor ? this.advanceFilter?.searchQueryByVisitor : null;
    // this.seepzPassReportRequest.globalSearch = this.advanceFilter?.searchQueryByHost ? this.advanceFilter?.searchQueryByHost : null;
    this.seepzPassReportRequest.visitorGlobalSearch = this.visitorGlobalSearch ? this.visitorGlobalSearch : null;
    this.seepzPassReportRequest.hostGlobalSearch = this.globalSearch ? this.globalSearch : null;
    return this.seepzPassReportRequest;
    
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
    // this.visitorsReportDetails();
    this.sortPagination();
    this.onReportTypeChange(this.selectedReport);
  }

  onReportTypeSelect(event: any) {
    this.walkinVisitorReport = event.value.value
    this.resetPagination();
    this.selectedFiletype = null;
    this.filterApplied = false;
    this.selectedReport = event.value;
    this.appliedFilterString = "";
    this.advanceFilter = this.defaultSettting;
    this.dataSource = [];
    this.columns = [];
    this.columnKeys=[];
    this.visitorReportDetails=[];
    // this.tenantId = [];
    this.tenantList = JSON.parse(JSON.stringify(this.originalTenantDisplayList));
    // if(!this.filterApplied)
      this.tenantId = JSON.parse(JSON.stringify(this.originalTenantId));
   // this.seepzPassReportRequest = this.defaultSeepzPassReportRequest
   // this.onReportTypeChange(this.selectedReport);
  }

  resetPagination() {
    this.paginator.firstPage();
    this.paginator.pageIndex = 0;
    this.pageIndex = defaultVal.pageIndex;
    this.pageSize = defaultVal.pageSize;
  }

  onFileFormatSelect(event: any) {
    this.selectedFiletype = event.key;
    this.isCsv = event.key == "csv" ? true : false;
    this.isExcel = event.key == "excel" ? true : false;
  }

  exportFile(selectedReportType) {
    let selectedReport = selectedReportType["value"];
    if(this.selectedFiletype){
      if(this.dataSource.length > 0){
      switch (selectedReport) {
        case "personalPermanentPass":
          this.exportPersonaParmentSeepsPass();
          break;
          case "VehiclePermanentPass":
            this.exportVehicleParmentSeepsPass();
          break;
          case "DailyPass":
            this.exportDailySeepsPass();
          break;  
          case "VisitorReport":
            this.exportVisitorsReport();
          break;  
  
        default:
          break;
      }
    }
      else{
        this.toastr.warning("No Data to be Exported")
      }
    }else{
      this.toastr.warning("Kindly Select File Format")
    }
   
  }
  exportPersonaParmentSeepsPass(){
    this.reoprtsService.exportSeepsReportData(this.generateRequests())
        .pipe(first())
        .subscribe((response) => {
          this.downLoadFile(response, 'PersonalPermanentPassSeepzReport_' + new Date().getTime() + ".xlsx");
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
  exportVehicleParmentSeepsPass(){
    this.reoprtsService.exportSeepsReportData(this.generateRequests())
        .pipe(first())
        .subscribe((response) => {
          this.downLoadFile(response, 'VehiclePermanentPassSeepzReport_' + new Date().getTime() + ".xlsx");
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
  exportDailySeepsPass(){
    this.reoprtsService.exportSeepsReportData(this.generateRequests())
        .pipe(first())
        .subscribe((response) => {
          this.downLoadFile(response, 'DailyPassSeepzReport_' + new Date().getTime() + ".xlsx");
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
  exportVisitorsReport() {
    // if (this.isExcel) {
      this.reoprtsService.exportVisitorsReportData(this.generateRequests())
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
    // }
  }
  downLoadFile(fileContent: any, fileName: string) {
      var contentType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    var blob = new Blob([fileContent], { type: contentType });
    var downloadUrl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = downloadUrl;
    anchor.click();
  }

  getVisitorSettings(response) {
    this.commonService.getVisitorSettings(response).subscribe(res => {
      this.currentTimeZone = res?.data?.timeZone;
      this.dateFormat = res?.data?.dateFormat;
      this.apptService.setDateFormat(res?.data?.dateFormat || "dd-MM-yyyy")
    })
  }



  getTenantList() {
    this.masterService.getCompanyAndBuilding().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.tenantList = data.data.companyList;
        this.tenantList.forEach(element => {
          let displayTenantName = element['name']+" | "+element['shortName']+" | "+element['buildingName']+" | "+element['officeNumber']
          element['displayTenantName'] = displayTenantName;
          this.tenantId.push(element.companyId);
          this.originalTenantId.push(element.companyId);
        })

        this.originalTenantDisplayList = this.tenantList.filter(ele => ele);
      }
    });
  }

  openDialogForReportDetails(ReportType: any, data) {
    const dialogRef = this.dialog.open(ReportType, {
      height: "100%",
      position: { right: "0" },
      data: {
        title: this.selectedReport,
        data: data,
      },
      panelClass: [
        "animate__animated",
        "vams-dialog-xl",
        "animate__slideInRight",
      ],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
      });
  }
  getRowData(data: any){
    if(this.selectedReport.value != 'VisitorReport'){
      this.openDialogForReportDetails(ReportDetailViewComponent,data)
    }
    else{
      this.openDialogForReportDetails(VisitorReportDetailViewComponent,data)
    }
    
  }
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  visitorsReportDetails() {
    this.reoprtsService.visitorsReportData(this.generateRequests()).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.reportData = response.data.records;
        this.reportDataSummery = response.data;
        this.dataSource = this.reportData.list;
        this.totalRecords = this.reportData.totalCount;
        if(this.selectedReport['value'] == "VisitorReport"){
          this.visitorReportDetails = [
            { show: this.translate.instant("labels.Total_Visitors"), value: (this.reportDataSummery && this.reportDataSummery['summary'] && this.reportDataSummery['summary']['totalVisitor']) ? this.reportDataSummery['summary']['totalVisitor'] : 0 },
            { show: this.translate.instant("labels.Checked_Out_Visitors"), value: (this.reportDataSummery && this.reportDataSummery['summary'] && this.reportDataSummery['summary']['checkedOutVisitors']) ? this.reportDataSummery['summary']['checkedOutVisitors'] : 0 },
            { show: this.translate.instant("labels.On_Premises"), value: (this.reportDataSummery && this.reportDataSummery['summary'] && this.reportDataSummery['summary']['onPremises']) ? this.reportDataSummery['summary']['onPremises'] : 0 },
          ]
        }
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
          this.toastr.error(error.error.Message, "Error");
        }
      }
    );
  }

}
