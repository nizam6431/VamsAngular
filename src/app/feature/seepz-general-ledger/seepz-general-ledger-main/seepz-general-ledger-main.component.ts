
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { MasterService } from '../../master/services/master.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/core/models/users';
import { CardService } from '../../card/card/Services/card.service';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { first } from 'rxjs/operators';
import { Constants } from '../constants/column';
import { UserService } from 'src/app/core/services/user.service';
import { SeepzGeneraLedgerReportService } from '../service/seepz-genera-ledger-report.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { threadId } from 'worker_threads';
import { AppointmentService } from '../../appointment/services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seepz-general-ledger-main',
  templateUrl: './seepz-general-ledger-main.component.html',
  styleUrls: ['./seepz-general-ledger-main.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SeepzGeneralLedgerMainComponent implements OnInit {
  public formGeneralLedger: FormGroup;
  tenantList: any;
  orignalUnitNameList: any;
  todayDate= new Date();
  today=new Date();
  startMonthDate: Date;
  private validationMessages: { [key: string]: { [key: string]: string } };
  dataSource: any;
  totalCount: any;
  columns = Constants.seepz_admin_ledger_report_column;
  pageSize: number = defaultVal.pageSize;
  userDetails: any;
  tenantId: any;
  userRole: any;
  roleName: any;
  lastYear: Date;
  todays: string;
  minDate: Date;
  maxDate: Date;
  nextOneYear: Date;
  filteredValue: any;
  isUserInput = false
  constructor(
    private fb: FormBuilder,
    private masterService: MasterService,
    private translate: TranslateService,
    private userService :UserService,
    private seepzGeneraLedgerReportService :SeepzGeneraLedgerReportService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private apptService: AppointmentService,
     private router:Router
  ) {
    this.getVisitorSettings(null)
    const start = moment().startOf('month')
    this.minDate = new Date(start.subtract(0, 'days').format('YYYY-MM-DD'));
    this.maxDate = new Date(start.subtract(12, 'month').format('YYYY-MM-DD'));

    // this.startMonthDate = moment().startOf('month').subtract(0, 'months').toDate()
    this.todays = moment().subtract(0, "days").format("YYYY-MM-DD");
    this.lastYear = moment(this.todays).subtract(12, 'months').toDate();
    this.nextOneYear = moment(this.todays).add(12,'months').toDate();

    this.validationMessages = {
      tenantName: {
        required: translate.instant("general_ledger.select_Unit_Name"),
      }}
      this.userDetails = this.userService.getUserData();
      this.roleName = this.userService.getRolName();
  }

  ngOnInit(): void {
    // this.getVisitorSettings(null)
    this.createForm()
    this.getTenantList()
    if(this.roleName === 'Level3Admin'){
      this.getAllLedgerReport()
    }
   
  }
  createForm() {
    //  this.getVisitorSettings(null)
    this.startMonthDate = moment().startOf('month').subtract(0, 'months').toDate()
    this.formGeneralLedger = this.fb.group({
      tenantName:[null,[Validators.required]],
      tenantId:[''],
      fromDate:[this.startMonthDate],
      toDate:[new Date()]
    })
  }

  getTenantList() {
    this.masterService.getCompanyAndBuilding().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.tenantList = data.data.companyList;
        this.orignalUnitNameList = this.tenantList;
      }
    });
  }
  displayWith(option) {
    return option?.name;
  }
  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach((validator) => {
      if (
        (this.formGeneralLedger.get(control).touched || this.formGeneralLedger.get(control).dirty) && this.formGeneralLedger.get(control).errors
      ) {
        if (this.formGeneralLedger.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  
  getValue(filterValue) { 
    if (filterValue.length == 0) {
      this.tenantList = this.orignalUnitNameList;
    }
    this.tenantList = this._filter(filterValue);
    if (this.tenantList.length==0) {
        this.isUserInput = true
        this.dataSource = []
    }
     else{
        this.isUserInput = false
      }
    
    if(filterValue == ''){
      this.dataSource = []
    }
  }
  private _filter(value: string): string[] {
    if (typeof (value) == 'string') {
      const filterValue = value.toLowerCase();
      return this.orignalUnitNameList.filter(option => option.name.toLowerCase().startsWith(filterValue) || option.shortName.toLowerCase().startsWith(filterValue) || option.buildingName.toLowerCase().startsWith(filterValue) || option.officeNumber.toLowerCase().startsWith(filterValue));
    }
    else {
      return []
    }
}

getTenantId(event){
  if(event && event.isUserInput){
    this.tenantId = event.source.value.companyId
    this.dataSource = [];
  }
}

getAllLedgerReport(data?){
  if(this.roleName === 'Level1Admin' && this.formGeneralLedger.controls.tenantName.invalid){
    this.toastr.warning(this.translate.instant("Please Select Company Name"));  
  }
  else{
    if(this.tenantList && this.tenantList.length > 0 ){
      let reqData = {
        pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
        pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
        orderBy: data && data.orderBy ? data.orderBy : "status",
        orderDirection:data && data.orderDirection,
        level3Id : this.userDetails.role.shortName == 'L1Admin' ? this.tenantId : this.userDetails.employeeOfId,
        fromDate: this.datePipe.transform(this.formGeneralLedger.controls.fromDate.value,'yyyy-MM-dd'),
        toDate:this.datePipe.transform(this.formGeneralLedger.controls.toDate.value,'yyyy-MM-dd'),
      };
      this.seepzGeneraLedgerReportService.getAllGeneralLedger(reqData).pipe(first()).subscribe((resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
              this.dataSource = resp.data.list;
              this.totalCount = resp.data.totalCount;
          }
        });
    }else{
      this.dataSource = []
    }
 
    }
  }
  
changeMode(event) {}
paginate(event) {
  this.getAllLedgerReport(event)
}

lastYearCalculate(){
  let toDate = this.datePipe.transform(this.formGeneralLedger.controls.toDate.value,'yyyy-MM-dd')
  this.lastYear = moment(toDate).subtract(12,'months').toDate();
}

nextOneYearCalculate(event){
  let fromDate = this.datePipe.transform(this.formGeneralLedger.controls.fromDate.value,'yyyy-MM-dd')
  this.nextOneYear = moment(fromDate).add(12,'months').toDate();
}


exportFile(data?){
  let reqData = {
    pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
    pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
    orderBy: data && data.orderBy ? data.orderBy : "status",
    orderDirection:data && data.orderDirection,
    level3Id : this.userDetails.role.shortName == 'L1Admin' ? this.tenantId : this.userDetails.employeeOfId,
    fromDate: this.datePipe.transform(this.formGeneralLedger.controls.fromDate.value,'yyyy-MM-dd'),
    toDate:this.datePipe.transform(this.formGeneralLedger.controls.toDate.value,'yyyy-MM-dd'),
  };
  this.seepzGeneraLedgerReportService.exportSeepsReportData(reqData)
      .pipe(first())
      .subscribe((response) => {
        this.downLoadFile(response, 'GenaralLedgerReportData_' + new Date().getTime() + ".xlsx");
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

downLoadFile(fileContent: any, fileName: string) {
  if(this.roleName === 'Level1Admin' && this.formGeneralLedger.controls.tenantName.invalid){
    this.toastr.warning("Please Select Company Name");  
  }else{
    var contentType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  var blob = new Blob([fileContent], { type: contentType });
  var downloadUrl = URL.createObjectURL(blob);
  var anchor = document.createElement("a");
  anchor.download = fileName;
  anchor.href = downloadUrl;
  anchor.click();
}
  }

   getVisitorSettings(locationId) {
    this.apptService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.createForm()
       
        this.apptService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
      } else {
        this.toastr.error(response.message, this.translate.instant('pop_up_messages.error'));
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
  }


}
