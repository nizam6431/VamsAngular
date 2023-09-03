import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CheckInOutComponent } from '../popup/check-in-out/check-in-out.component';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AppointmentService } from '../../appointment/services/appointment.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateRangeComponent } from 'src/app/shared/components/date-range/date-range.component';
import { ContractorPassService } from '../services/contractor-pass.service';
import { ContractorCheckInCheckOutReq, ContractorCheckInCheckOutRes, GetAllContractorRes, GetAllContractorsReq, GetContractorDetailsByQrCodeReq, GetContractorDetailsByQrCodeRes } from '../constant/class';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { Constants } from '../constant/column';
import { DetailsPageComponent } from '../popup/details-page/details-page.component';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  showStatus: string = 'ALL';
  statusFilter = [
    // { value: "ALL", viewValue: "All" },
    { value: "INPROGRESS", viewValue: this.translate.instant("drop_down_values.in_progress") },
    { value: "SCHEDULED", viewValue: this.translate.instant("drop_down_values.scheduled") },
    // { value: 'INCHECKOUT', viewValue: this.translate.instant("drop_down_values.pending_checkout") },
    // { value: 'CANCELLED', viewValue: 'CANCELLED' },
    { value: 'COMPLETED', viewValue: this.translate.instant("drop_down_values.completed") },
    // {value: 'WALKIN', viewValue: 'WALKIN'},
    // {value: 'REJECTED', viewValue: 'REJECTED'},
  ]; hasSearchValue: boolean;
  timeFilter: string = "today"
  openDateFilter: boolean;
  startDate: any
  endDate: any;
  selectedStatus: string = 'ALL';
  searchKey: string;
  userDetails: any;
  pageIndex: number = defaultVal.pageIndex;
  pageSize: number = defaultVal.pageSize;
  todayDateTime: string | number | Date | any;
  dateFormat: string;
  visitorSettings: any;
  dateFormatWithTimeFormat: string;
  dateRange: FormGroup;
  getAllContractorsReq = new GetAllContractorsReq();
  getAllContractorRes = new GetAllContractorRes();
  level2Ids: number[] = [];
  level3Ids: number[] = [];
  userData: any;
  columns = Constants.contractor_pass;
  dataSource: any;
  totalCount: any;

  constructor(public dialog: MatDialog,
    private datePipe: DatePipe,
    private userService: UserService,
    private translate: TranslateService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private contractorPassService: ContractorPassService
  ) {
    this.userDetails = this.userService.getUserData();
    this.dateRange = this.fb.group({
      'start': [null],
      'end': [null],
    })
  }

  ngOnInit(): void {
    this.getDetails();
  }

  onSelectEvent() {
    if (this.selectedStatus === this.showStatus) {
      this.showStatus = "";
      this.selectedStatus = "ALL";
    } else {
      this.selectedStatus = this.showStatus;
    }
    this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey);
  }

  applyFilter(searchValue: string) {
    this.searchKey = searchValue;
    this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey);
  }

  cleanSearchBox(searchValue: any) {

  }

  onChangeTimeFilter(timeFilter, selectedStatus: string, searchKey: string) {
    this.timeFilter = timeFilter;
    let todayDate = this.datePipe.transform(this.todayDateTime, this.dateFormat);
    if (timeFilter != undefined) {
      switch (timeFilter) {
        case "all":
          this.getAllContractors(this.pageSize, this.pageIndex, '', 'ASC', todayDate, null, searchKey, this.level2Ids, this.level3Ids, selectedStatus);
          this.hideDaterangeFilter();
          break;
        case "today":
          this.getAllContractors(this.pageSize, this.pageIndex, '', 'ASC', todayDate, todayDate, searchKey, this.level2Ids, this.level3Ids, selectedStatus);
          this.hideDaterangeFilter();
          break;
        case "week":
          let lastDayOfWeek = moment(this.todayDateTime).add(6, 'days').format(this.dateFormat.toUpperCase());
          this.getAllContractors(this.pageSize, this.pageIndex, '', 'ASC', todayDate, lastDayOfWeek, searchKey, this.level2Ids, this.level3Ids, selectedStatus);
          this.hideDaterangeFilter();
          break;
        case "month":
          let lastDay = moment(this.todayDateTime).add(30, 'days').format(this.dateFormat.toUpperCase());
          this.getAllContractors(this.pageSize, this.pageIndex, '', 'ASC', todayDate, lastDay, searchKey, this.level2Ids, this.level3Ids, selectedStatus);
          this.hideDaterangeFilter();
          break;
        case "range":
          this.showStatus = "";
          this.selectedStatus = "ALL";
          this.getAllContractors(this.pageSize, this.pageIndex, '', 'ASC', this.startDate, this.endDate, searchKey, this.level2Ids, this.level3Ids, selectedStatus);
          break;

      }
    }
  }

  getAllContractors(pageSize, pageIndex, orderBy, orderDirection, fromTime, toTime, globalSearch, level2Ids, level3Ids, selectedStatus) {
    this.getAllContractorsReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      orderBy: orderBy,
      orderDirection: orderDirection,
      fromTime: fromTime,
      toTime: toTime,
      globalSearch: globalSearch,
      level2Ids: level2Ids,
      level3Ids: level3Ids,
      status: [selectedStatus]
    }
    this.callGetAllApi();
  }

  callGetAllApi() {
    this.contractorPassService.getAllContractors(this.getAllContractorsReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.dataSource = resp['data']['list'];
        this.totalCount = resp['data']['totalCount'];
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
        });
      } else {
        if ('message' in error.error)
          this.toastr.error(error.error.message, this.translate.instant("toster_message.error"));
        else if ('Message' in error.error)
          this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
        else
          this.toastr.error(error.message, this.translate.instant("toster_message.error"));
      }
    })
  }



  hideDaterangeFilter() {
    this.openDateFilter = false;
  }

  onDateFilterClose() {

  }

  openDateRangeDialog() {
    const dialogRef = this.dialog.open(DateRangeComponent, {
      data: { minDate: this.todayDateTime, format: this.dateFormat.toUpperCase() },
      height: '0px',
      width: '0px',
      panelClass: ["vams-dialog-sm", "vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.dateRange = result.data;
        this.startDate = this.datePipe.transform(this.dateRange.value['start'], this.dateFormat);
        this.endDate = this.datePipe.transform(this.dateRange.value['end'], this.dateFormat);
        this.openDateFilter = true;
        this.onChangeTimeFilter('range', this.selectedStatus, this.searchKey);
      } else {
        // this.toastr.warning("Invalid date range.", "Warning")
      }
    });
  }


  openDialog(type) {
    const dialogRef = this.dialog.open(CheckInOutComponent, {
      height: "100%",
      position: { right: "0" },
      data: { type: type, level2Id: this.level2Ids, level3Id: this.level3Ids },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.callGetAllApi();
    });
  }

  getDetails() {
    if (this.userDetails && this.userDetails?.level2List && this.userDetails?.level2List.length > 0) {
      let locationId = this.userDetails?.level2List?.find(location => location.isDefault == true);
      if (locationId) {
        this.getVisitorSettings(locationId.id);
      } else {
        this.toastr.error(this.translate.instant('pop_up_messages.defalut_location_not_found'));
      }
    }
    else if (this.userDetails && this.userDetails?.level1Id) {
      this.getVisitorSettings(null);
    }
  }

  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.visitorSettings = response.data;
        this.dateFormat = response.data.dateFormat || "dd-MM-yyyy";
        this.dateFormatWithTimeFormat = (response.data.timeformat == 12) ? (this.dateFormat.toUpperCase() + " HH:MM A") : (this.dateFormat.toUpperCase() + " HH:MM");
        let currentTimeZone = response?.data?.timeZone;
        this.getCurrentTimeZone(currentTimeZone);
      } else {
        if (response && response.message)
          this.toastr.error(response.message, this.translate.instant("toster_message.error"));
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {

        if ('message' in error.error)
          this.toastr.error(error.error.message, this.translate.instant("toster_message.error"));
        else if ('Message' in error.error)
          this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
        else
          this.toastr.error(error.message, this.translate.instant("toster_message.error"));
        // this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
  }

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : 'India Standard Time';
    this.appointmentService.getCurrentTimeByZone(timezone).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.todayDateTime = moment(response?.data);
        this.level2Ids = (this.userDetails.level2List.length > 0) ? [this.userDetails.level2List[0].id] : [];
        this.pageIndex = defaultVal.pageIndex;
        this.pageSize = defaultVal.pageSize;
        this.onChangeTimeFilter(this.timeFilter, 'ALL', null);
        // this.onSelectEvent();
      }
    },
      (error) => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          })
        } else {
          if ('message' in error.error)
            this.toastr.error(error.error.message, this.translate.instant("toster_message.error"));
          else if ('Message' in error.error)
            this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
          else
            this.toastr.error(error.message, this.translate.instant("toster_message.error"));
          // this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      })

  }

  emailChange(event) {
    this.pageSize = (event && event.pageSize) ? (event.pageSize) : defaultVal.pageSize;
    this.pageIndex = (event && event.pageIndex) ? (event.pageIndex) : defaultVal.pageIndex;
    this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey);
  }

  rowData(rowData) {
    const dialogRef = this.dialog.open(DetailsPageComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.callGetAllApi();
    });
  }

  changeMode(event) {

  }

}
