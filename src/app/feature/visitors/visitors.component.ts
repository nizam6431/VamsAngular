import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, first, filter } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmReasonComponent } from 'src/app/shared/components/confirm-reason/confirm-reason.component';
import { RestrictVisitorComponent } from './restrict-visitor/restrict-visitor.component';
import { VisitorsService } from './services/visitors.service';
import { ShowRestricedVisitorDetailsComponent } from './show-restriced-visitor-details/show-restriced-visitor-details.component';
import { Constants } from './constants/columns';
import { defaultVal } from '../../core/models/app-common-enum';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AllRestrictedVisitorRequest, visitorScheduleDetails } from '../appointment/models/appointment-schedule';
import moment from 'moment';
import { DateRangeComponent } from 'src/app/shared/components/date-range/date-range.component';
import { FormBuilder, FormGroup } from '@angular/forms/';
import { fromEvent, Subscription } from 'rxjs';
import { GridComponent } from './grid/grid.component';
import { AppointmentService } from '../appointment/services/appointment.service';
import { UserService } from 'src/app/core/services/user.service';
import { threadId } from 'worker_threads';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss']
})
export class VisitorsComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  filterData: any;
  selectedIndex: number = 0;
  displayedColumns: any[] = Constants.blacklisted_columns;
  displayedColumns1:any[]=Constants.all_visitor_column;
  dataSource: any;
  allVisitorDataSource;
  totalData: any;
  pageSize: number;
  timeFilter: string = "thisMonth";
  visitorDataShowType: string = "restrictVisitor";
  toggleView: string = "restrictVisitor";
  selectedStatus: string = "";
  showStatus: string = "";
  searchKey: string = "";
  pageIndex: number = 1;
  dateFormat: any = "";
  todayDateTime: any;
  startDate: any;
  endDate: any;
  allVisitorDataShowType: string
  public getAllVisitorRequest: AllRestrictedVisitorRequest =
    new AllRestrictedVisitorRequest();
  visitorScheduleDetails: visitorScheduleDetails;
  dateRange: FormGroup;
  openDateFilter: boolean = false;
  public hasSearchValue: boolean = false;
  subscription: Subscription;
  showRestrictorVisitor:any;
  @ViewChild('serchKeyValue') serchKeyValue: ElementRef;
  @ViewChild("container") allRestrictorVisitor: ElementRef;
  @ViewChild('restrictVisitors') restrictVisitors: GridComponent;
  statusFilter = [
    { value: "INPROGRESS", viewValue: "In Progress" },
    { value: "SCHEDULED", viewValue: "Scheduled" },
  ];
  userDetails: any;
  userShortName: string = "";
  isRestricted: any;
  pageCount: number;
  clearSerach :any ;
  constructor(private router: Router,
    private titleService: Title,
    private translateService: TranslateService,
    private commonService: CommonService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private visitorsService: VisitorsService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    // private dialogRef: MatDialogRef<CommonPopUpComponent>,
    private userService:UserService) {
    this.translateService.get(['Visitors.Visitors_Title'])
      .pipe(first())
      .subscribe(
        translations => {
          let title = translations['Visitors.Visitors_Title'];
          this.titleService.setTitle(title);
          this.commonService.setTitle(title);
        });

    this.dateRange = this.fb.group({
      'start': [null],
      'end': [null],
    })

    this.userDetails = this.userService.getUserData();
    
    if (this.userDetails) {
      this.userShortName =
        this.userDetails.firstName.charAt(0) +
        this.userDetails.lastName.charAt(0);
      // this.logoUrl = this.commonService.getLogo();
    }
  }


  ngOnInit(): void {
     this.getDetails();
  }

  ngAfterViewInit() {
    this.getFilteredData();
  }

  getFilteredData() {
    this.subscription = fromEvent(this.serchKeyValue.nativeElement, "keyup")
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
      ).subscribe(text => {
        this.onChangeTimeFilter(
          this.timeFilter,
          this.selectedStatus,
          this.searchKey
        );
      })
  }

  navigateToAppointments() {
    this.router.navigate([localStorage.getItem("companyCode") + '/appointment']);
  }
  unBlockVisitor(event) {
   const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
       visitorType: event.visitorDataShowType,
        pop_up_type: "unblock_visitor",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
   });
    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      // this.dialogClosed(result)
      if (result) {
        this.deleteUnblockVisitor(event)
      }
    });
  }
  deleteUnblockVisitor(event) {
    let requestObject = {
      restrictedVisitorId: event.id
    }
    this.visitorsService.RemoveRestrictedVisitor(requestObject)
      .pipe(first()).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.toastr.success(response.message, this.translate.instant("pop_up_messages.success"));
          // this.dialogRef.close(response);
          // -----------get refresh data--------
          this.getRestrictedVisitorsList();
        } else {
          this.toastr.error(response.message, this.translate.instant("pop_up_messages.error"));
        }
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        })
  }

  restrictVisitorForm() {
    const dialogRef = this.dialog.open(RestrictVisitorComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.dialogClosed(result)
    });
  }

  dialogClosed(statusObj) {
    if (statusObj && statusObj?.statusCode) {
      if (statusObj.statusCode === 200 && statusObj.errors == null) {
        if(this.visitorDataShowType == 'restrictVisitor')
        {
          this.getRestrictedVisitorsList();
        }
        else{
          this.getAllVisitorsList()
        }
      }
    }
  }

  // unblockUser1(row) {
  //   const dialogRef = this.dialog.open(ConfirmReasonComponent, {
  //     height: "100%",
  //     position: { right: "0" },
  //     data: row,
  //     panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
  //     autoFocus: false
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.dialogClosed(result);
  //     }
  //   });
  // }
  blockUser(event) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: {
        visitorType: event.visitorDataShowType,
        pop_up_type: "block_visitor",
        icon: "assets/images/error.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });
    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      // console.log(result);
      if (result && result.decision) {
        // console.log(result);
        this.blockVisitor(event,result.remark)
      }
    });
  }
  blockVisitor(formData,remark) {
    // console.log(formData,remark);
    const remarkValue = {
      "remark":remark,
      "firstName": formData.firstName,
      "lastName": formData.lastName,
      "company": formData.company,
      "email": formData.email,
      "isdCode": formData.isdCode,
      "level2Id": formData.level2Id,
      "level3Id": formData.level3Id,
      "phone": formData.phone,
      "visitorId":formData.visitorId
      // "appointmentId":formData.id
    }
    this.visitorsService.addRestrictedVisitor(remarkValue)
      .pipe(first()).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.getAllVisitorsList();
          if (!response.data) {
            this.toastr.success(response.message, this.translate.instant("pop_up_messages.success"));
          } else {
            this.toastr.warning(response.message, this.translate.instant("pop_up_messages.warning"));
          }
        } else {
          this.toastr.error(response.message, this.translate.instant("pop_up_messages.error"));
        }
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        })
  }

  gridRowClick(rowData) {
    this.openRestrictedVisitor(rowData);
  }

  openRestrictedVisitor(rowData) {
    rowData.showRestrictorVisitor = this.visitorDataShowType
    const dialogRef = this.dialog.open(ShowRestricedVisitorDetailsComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogClosed(result);
      }
    });
  }

  visitorDataChange(event) {
    this.filterData = event;
    this.getRestrictedVisitorsList();
  }
  AllvisitorDataChange(event) {
    this.filterData = event;
    this.getAllVisitorsList();
  }
  getRestrictedVisitorsList(data?) {
    let visitorObj = {
      pageSize: this.filterData && this.filterData.pageSize ? this.filterData.pageSize : defaultVal.pageSize,
      pageIndex: this.filterData && this.filterData.pageIndex ? this.filterData.pageIndex : defaultVal.pageIndex,
      orderBy: this.filterData && this.filterData.orderBy ? this.filterData.orderBy : "firstName",
      orderDirection: this.filterData && this.filterData.sortBy ? this.filterData.sortBy : "ASC",
      globalSearch: this.searchKey && this.searchKey ? this.searchKey : "",
    }

    this.visitorsService.getRestrictedVisitorsList(visitorObj).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalData = resp.data.totalCount;
          this.pageSize = resp.data.pageSize;
          
          this.displayedColumns = Constants.blacklisted_columns
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], 'Error');
          })
        }
        else {
          this.toastr.error(error.error.Message, 'Error');
        }
        // this.dialogRef.close({ type: 'employee', status: false });
      });
  }

  getAllVisitorsList() {
    let visitorObj = {
      pageSize: this.filterData && this.filterData.pageSize ? this.filterData.pageSize : defaultVal.pageSize,
      pageIndex: this.filterData && this.filterData.pageIndex ? this.filterData.pageIndex : defaultVal.pageIndex,
      orderBy: this.filterData && this.filterData.orderBy ? this.filterData.orderBy : "firstName",
      orderDirection: this.filterData && this.filterData.sortBy ? this.filterData.sortBy : "ASC",
      globalSearch: this.searchKey && this.searchKey ? this.searchKey :""
    }
    if (this.searchKey != '' && this.visitorDataShowType == 'allVisitor') {
      this.visitorsService
      .getAllVisitorsList(visitorObj)
      .pipe(first())
      .subscribe(
        (response) => {
          for(let i in response.data.list)
          {
            this.isRestricted = response.data.list[i].isRestricted
          }
          
          if (response.statusCode === 200 && response.errors === null) {
            this.allVisitorDataSource = response.data.list;
            this.totalData = response.data.totalCount;
            this.displayedColumns1 = Constants.all_visitor_column;
            this.pageSize = response.data.pageSize;
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
    }else{
      this.allVisitorDataSource = null
      return;
      
    }
 
  }


  onToggleRestrictedAndAllvisitor(viewMode) {
    this.visitorDataShowType = viewMode
    this.searchKey = ''
    this.serchKeyValue.nativeElement.value = "";
    this.allVisitorDataSource = null
    this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey)
    if(this.searchKey == '' && this.visitorDataShowType == 'allVisitor'){
      this.pageSize = 0
    }
  }

  getDetails() {
    if (this.userDetails && this.userDetails?.level2List && this.userDetails?.level2List.length > 0) {
      let locationId = this.userDetails?.level2List?.find(location => location.isDefault == true);
      if (locationId) {
        this.getVisitorSettings(locationId.id);
      } else {
        this.toastr.error("Default location not found.");
      }
    }
    else if (this.userDetails && this.userDetails?.level1Id) {
      this.getVisitorSettings(null);
      
    }
  }
  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.dateFormat = response.data.dateFormat || "dd-MM-yyyy"
        let currentTimeZone = response?.data?.timeZone;
        this.getCurrentTimeZone(currentTimeZone);
        this.appointmentService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
      } else {
        this.toastr.error(response.message);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], 'Error');
        })
      } else {
        this.toastr.error(error.error.Message, 'Error');
      }
    })
  }

  getCurrentTimeZone(timezone?) {
    timezone = timezone ? timezone : 'India Standard Time';
    this.visitorsService.getCurrentTimeByZone(timezone).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.todayDateTime = moment(response?.data);
        this.onSelectEvent();
      }
    },
      (error) => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], 'Error');
          })
        } else {
          this.toastr.error(error.error.Message, 'Error');
        }
      })

  }

  public onChangeTimeFilter(
    timeFilter,
    selectedStatus: string,
    searchKey: string
  ) {
    this.timeFilter = timeFilter;
    let todayDate = this.datePipe.transform(this.todayDateTime, this.dateFormat);
    let startOfMonth = moment(this.todayDateTime).startOf('month');
    let startOfYear = moment(this.todayDateTime).startOf('year');
    this.pageIndex = 1;
    if (this.allRestrictorVisitor)
      this.allRestrictorVisitor.nativeElement.scrollTop = 0;
    if (timeFilter != undefined) {
      switch (timeFilter) {
        case "thisMonth":
          let startDate = moment(this.todayDateTime).clone().startOf('month').format(this.dateFormat.toUpperCase())
          let thisMonth = moment(this.todayDateTime).clone().endOf('month').format(this.dateFormat.toUpperCase())
          this.allVisitorGetRequestObject(
            searchKey,
            startDate,
            // todayDate,
            thisMonth,
            "",
            "",
            selectedStatus,
            "",
            ""
          );
          if(this.visitorDataShowType == 'restrictVisitor')
          {
            this.getRestrictedVisitorsList()
          }
          else{
            this.getAllVisitorsList()
          }
          break;
        case "thisYear":
          let startDateLastMonth = moment(this.todayDateTime).clone().startOf('year').format(this.dateFormat.toUpperCase())
          let lastMonth = moment(this.todayDateTime).clone().endOf('year').format(this.dateFormat.toUpperCase())
          // let startDateLastMonth = moment(this.todayDateTime).clone().startOf('month').format(this.dateFormat.toUpperCase())
          // let lastMonth = moment(startOfMonth).subtract(1, 'month').clone().endOf('month').format(this.dateFormat.toUpperCase())
          this.allVisitorGetRequestObject(
            searchKey,
            startDateLastMonth,
            // todayDate,
            lastMonth,
            "",
            "",
            selectedStatus,
            "",
            ""
          );
          if(this.visitorDataShowType == 'restrictVisitor')
          {
            this.getRestrictedVisitorsList()
          }
          else{
            this.getAllVisitorsList()
          }
         
          break;
        case "lastYear":
          // let startLastThreeMonthDate = moment(startOfMonth).subtract(3, 'month').format(this.dateFormat.toUpperCase())
          let startLastThreeMonthDate = moment(this.todayDateTime).clone().startOf('year').format(this.dateFormat.toUpperCase())
          let lastThreeMonth =moment(startOfMonth).subtract(12, 'month').clone().endOf('month').format(this.dateFormat.toUpperCase())
          this.allVisitorGetRequestObject(
            searchKey,
            // todayDate,
            startLastThreeMonthDate,
            lastThreeMonth,
            "",
            "",
            selectedStatus,
            "",
            ""
          );
          if(this.visitorDataShowType == 'restrictVisitor')
          {
            this.getRestrictedVisitorsList()
          }
          else{
            this.getAllVisitorsList()
          }
        
          break;
          case "custom":
            break;
        
      }
    }
  }

  allVisitorGetRequestObject(
    globalSearch,
    fromTime,
    toTime,
    orderBy,
    orderDirection,
    status,
    pageSize,
    pageIndex
  ): AllRestrictedVisitorRequest {
    this.getAllVisitorRequest.globalSearch = globalSearch;
    this.getAllVisitorRequest.fromTime = fromTime;
    this.getAllVisitorRequest.toTime = toTime;
    this.getAllVisitorRequest.orderBy = orderBy;
    this.getAllVisitorRequest.orderDirection = orderDirection;
    // this.getAllVisitorRequest.status = [status]; //['schedule']; default values
    this.getAllVisitorRequest.pageSize = pageSize ? pageSize : 20; //20
    this.getAllVisitorRequest.pageIndex = pageIndex ? pageIndex : 1; //0
    return this.getAllVisitorRequest;
  }
  onSelectEvent() {
    if (this.selectedStatus === this.showStatus) {
      this.showStatus = "";
      this.selectedStatus = "thisMonth";
    } else {
      // this.showStatus = value;
      this.selectedStatus = this.showStatus;
    }
    this.onChangeTimeFilter(
      this.timeFilter, this.selectedStatus, this.searchKey);
  }

  applyFilter(filterValue, clearSearch = false) {
    if(this.hasSearchValue && this.visitorDataShowType == 'restrictVisitor')
    {
      this.searchKey = filterValue.trim().toLowerCase();
    }
    else{
      this.searchKey = filterValue.trim().toLowerCase();
    }
    if (clearSearch) {
      this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey);
    }
    
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
    if (this.restrictVisitors && this.restrictVisitors.paginator) {
      this.restrictVisitors.paginator.firstPage();
    }
  }
  
  cleanSearchBox(event?) {
    this.clearSerach= event;
    const filterValue = (event.value = "");
    this.applyFilter(filterValue, true);
  }
}
