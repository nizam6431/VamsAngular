import { forkJoin } from 'rxjs';
import { AfterViewInit, Component, Inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms/';
import { VisitorStatusObject, AppointmentStatusObject, EmailStatusObject, hsqStatusObject } from '../models/report-filter';
import { MasterService } from '../../master/services/master.service';
import { LevelAdmins, ProductTypes } from "../../../../app/core/models/app-common-enum"
import { UserService } from 'src/app/core/services/user.service';
import moment from 'moment';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { DateRangeComponent } from 'src/app/shared/components/date-range/date-range.component';
import { MatListOption } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { ReoprtsService } from '../reoprts.service';

@Component({
  selector: 'app-report-filter-popup',
  templateUrl: './report-filter-popup.component.html',
  styleUrls: ['./report-filter-popup.component.scss']
})
export class ReportFilterPopupComponent implements OnInit, AfterViewInit {
  @ViewChild('statusSelect') mySelect: MatSelect;
  public filterForm: FormGroup;
  statusFilter: any;
  level3Id: any;
  userData: any;
  companyAndBuildingList: any;
  timeFilter: string = "today";
  todayDateTime: any;
  dateFormat: string = "DD-MM-YYYY";
  startDate: any;
  endDate: any;
  openDateFilter: boolean = false;
  showCompanyList: boolean = false;
  showBuildingList: boolean = false;
  filterApplied: boolean;
  selectedBuildingsWithObj: any[] = [];
  selectedcompanyWithObj: any[] = [];
  selectedStatus: any = null;
  isFilterClear: boolean;
  isComplexVisitor: boolean;
  isLevel3: boolean;
  buildingWithCompanyList: any[] = [];
  mainList: any;
  lastBuildingSearchtext: any;
  lastCmpSearchtext: any;
  walkNsheduld: boolean = true;
  isNoShow: boolean = false;
  isOnlyAppointment: boolean = false;
  productType: any;
  productTypeList = ProductTypes;
  visitorsTypeObject: any;
  visitorPurposeObject:any;
  showVisitorPurposeStatus;
  showVisitorTypeStatus;
  userDetails: any;
  l2Building: any;
  showList: boolean = true;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ReportFilterPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private reoprtsService:ReoprtsService
  ) {
    switch (this.data.selectedReport) {
      case "visitor_report":
        this.statusFilter = Object(VisitorStatusObject)
        break;

      case "appointment_report":
        this.isOnlyAppointment = true;
        this.statusFilter = Object(AppointmentStatusObject)
        break;

      case "hsq_report":
        this.statusFilter = Object(hsqStatusObject)
        break;

      case "email_report":
        this.statusFilter = Object(EmailStatusObject)
        break;

      default:
        break;
    }
    this.productType = this.userService.getProductType();
    this.userDetails = this.userService.getUserData();
    if (this.productType == this.productTypeList.Enterprise && this.userDetails?.role?.shortName == 'L2Admin') {
      this.showList = false;
    }
    if (this.productType == this.productTypeList.Commercial && this.userDetails?.role?.shortName == 'L2Reception') {
      // this.showList = false;
    }
    this.userDetails?.level2List?.map(element => {
      if (element.isDefault) {
        this.l2Building=element.name
      }
    })
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void { //console.log(this.data.selectedReport)
    // console.log(this.productType)
     if (this.productType === ProductTypes.Enterprise) {
      let apicall = [];
      apicall.push(this.reoprtsService.getVisitorPurpose());
      apicall.push(this.reoprtsService.getVisitorType());
      forkJoin(apicall).subscribe((resp)=>{

        if(resp && resp[0]){
        this.visitorPurposeObject = resp[0];
        this.visitorsTypeObject =  resp[1];
        // console.log(this.visitorPurposeObject,'visitorPurposeObject resp resp');
        // console.log(this.visitorsTypeObject,'visitorsTypeObject');
        }});
  }
    
    if (this.data.selectedReport == 'hsq_report' || this.data.selectedReport == 'email_report') {
      this.walkNsheduld = false;
    }

    this.userData = this.userService.getUserData();
    this.dateFormat = this.data.dateFormat;
    this.createForm();
    this.filterForm.patchValue(this.data.filters);
    this.selectedStatus = this.data && this.data.filters && this.data.filters.status ? this.data.filters.status : "";
    if (this.filterForm.get('timeRange').value === 'custom') {
      this.commonDisplayForCustom(this.data.startDate, this.data.endDate);
    }
    if (this.data && this.data.buildingWithCompanyList) {
      this.data.buildingWithCompanyList.forEach((element) => {
        element['originalcompanies'] = element['companies'];
      })
    }
    if (this.data && this.data.buildingWithCompanyList) {
      this.buildingWithCompanyList = JSON.parse(JSON.stringify(this.data.buildingWithCompanyList));
      this.mainList = JSON.parse(JSON.stringify(this.data.buildingWithCompanyList));
    }
    this.isComplexVisitor = (this.userData && this.userData["role"].shortName === LevelAdmins.Level1Admin) ? true : false;
    this.isLevel3 = (this.userData && this.userData["role"].shortName === LevelAdmins.Level3Admin) ? true : false;
    if (!this.isLevel3) {
      this.selectAllAfter();
    }
    if (this.userData && this.userData["role"].shortName === LevelAdmins.Level3Admin) {
      this.level3Id = this.userData["employeeOfDisplayId"] ? this.userData["employeeOfDisplayId"] : null;
    }
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      status: [this.data && this.data.filters && this.data.filters.status ? this.data.filters.status : "", []],
      timeRange: [this.data && this.data.filters && this.data.filters.timeRange ? this.data.filters.timeRange : null, []],
      walkIn: [this.data && this.data.filters && this.data.filters.walkIn ? this.data.filters.walkIn : false, []],
      scheduled: [this.data && this.data.filters && this.data.filters.scheduled ? this.data.filters.scheduled : false, []],
      noShow: [this.data && this.data.filters && this.data.filters.noShow ? this.data.filters.noShow : false, []],
      searchQueryByHost: [this.data && this.data.filters && this.data.filters.searchQueryByHost ? this.data.filters.searchQueryByHost : "", []],
      searchQueryByVisitor: [this.data && this.data.filters && this.data.filters.searchQueryByVisitor ? this.data.filters.searchQueryByVisitor : "", []],
      showOnlyComplexVisitor: [this.data && this.data.filters && this.data.filters.showOnlyComplexVisitor ? this.data.filters.showOnlyComplexVisitor : false, []],
      includeVisitorPhoto: [this.data && this.data.filters && this.data.filters.includeVisitorPhoto ? this.data.filters.includeVisitorPhoto : false, []],
      selectedBuildings: [this.data && this.data.filters && this.data.filters.selectedBuildings ? this.data.filters.selectedBuildings : [], []],
      selectedCompany: [this.data && this.data.filters && this.data.filters.selectedCompany ? this.data.filters.selectedCompany : [], []],
      includeComplexVisitor: [this.data && this.data.filters && this.data.filters.includeComplexVisitor ? this.data.filters.includeComplexVisitor : false, []],
      selectAllCompany: [this.data && this.data.filters && this.data.filters.selectAllCompany ? this.data.filters.selectAllCompany : false, []],
      selectAllBuilding: [this.data && this.data.filters && this.data.filters.selectAllBuilding ? this.data.filters.selectAllBuilding : false, []],
      VisitorTypeId: [this.data && this.data.filters && this.data.filters.VisitorTypeId? this.data.filters.VisitorTypeId : false, []],
      visitorPurposeId: [this.data && this.data.filters && this.data.filters.visitorPurposeId ? this.data.filters.visitorPurposeId : false, []],
      selectedBuilding:[this.l2Building]
    })
  }

  selectAllAfter() {
    //  console.log(this.buildingWithCompanyList)
    if (this.buildingWithCompanyList && this.buildingWithCompanyList.length > 0) {
     
      this.filterForm.get('selectAllBuilding').setValue(this.buildingWithCompanyList.every((element) => (element.checked == true)));
      if (this.buildingWithCompanyList && this.buildingWithCompanyList.length > 0 && !this.buildingWithCompanyList.every((element) => (element.checked == false))) {
        let cmpSelectedFlag = true;
        if (this.productType == this.productTypeList.Commercial) {
           this.buildingWithCompanyList.forEach((element) => {
          if (element.checked && element['companies']?.length > 0 && !(element['companies'].every((element) => (element.checked == true)))) {
            cmpSelectedFlag = false;
          }
        })
        }
        this.filterForm.get('selectAllCompany').setValue(cmpSelectedFlag ? true : false);
      }
      else {
        this.filterForm.get('selectAllCompany').setValue(false);
      }
      // this.showCompanyList = this.buildingWithCompanyList.every((element) => (element.checked == false))?false:true;
      if (this.productType==this.productTypeList.Commercial) {
         this.buildingWithCompanyList.forEach((element) => {
        if (element.checked && element['companies'].length > 0) {
          this.showCompanyList = true;
        }
      })
      }
    }
     console.log(this.buildingWithCompanyList);
  }

  onVisitorPurposeSelectEvent(){
  // visitorPurposeId,visitorsTypeId
  if (this.filterForm.value.visitorPurposeId== this.showVisitorPurposeStatus) {
      this.showVisitorPurposeStatus = null;
      this.filterForm.controls['visitorPurposeId'].setValue(null);
    } else {
      this.showVisitorPurposeStatus = this.filterForm.value.visitorPurposeId;
    }
  }

  onVisitorTypeSelectEvent(){
    // visitorPurposeId,visitorsTypeId
    if (this.filterForm.value.VisitorTypeId== this.showVisitorTypeStatus) {
        this.showVisitorTypeStatus = null;
        this.filterForm.controls['VisitorTypeId'].setValue(null);
      } else {
        this.showVisitorTypeStatus = this.filterForm.value.VisitorTypeId;
      }
    }

  openDateRangeDialog(event: Event) {
    let daterangedata = { minDate: null, maxDate: null, format: this.dateFormat.toUpperCase() };
    if (this.data && this.data?.selectedReport && this.data.selectedReport == "visitor_report") {
      daterangedata.maxDate = moment();
    }
    if (this.data && this.data?.selectedReport && this.data.selectedReport == "hsq_report") {
      daterangedata.maxDate = moment();
    }
    if (this.data && this.data?.selectedReport && this.data.selectedReport == "email_report") {
      daterangedata.maxDate = moment();
    }
    this.filterForm.get('timeRange').setValue('custom')
    const dialogRef = this.dialog.open(DateRangeComponent, {
      data: daterangedata,
      height: '0px',
      width: '0px',
      panelClass: ["vams-dialog-sm", "vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        let dateRange = result.data;
        this.commonDisplayForCustom(dateRange.value['start'], dateRange.value['end']);
      } else {
        this.filterForm.get('timeRange').setValue('today');
      }
    });
  }

  commonDisplayForCustom(startDate, endDate) {
    this.startDate = moment(startDate, this.dateFormat.toUpperCase()).format(this.dateFormat.toUpperCase());
    this.endDate = moment(endDate, this.dateFormat.toUpperCase()).format(this.dateFormat.toUpperCase());
    this.openDateFilter = true;
  }

  onDateFilterClose() {
    this.startDate = "";
    this.endDate = "";
    this.openDateFilter = false;
    this.filterForm.get('timeRange').setValue('today');
  }

  showOnlyComplexLevel(event) {

  }

  // TODO : remove if not used for No show case
  // hideFilterOptions(event){
  //   if (event.checked) {      
  //     this.isNoShow = true;
  //     this.filterForm.controls.walkIn.setValue(false);
  //     this.filterForm.controls.scheduled.setValue(true);
  //     this.filterForm.controls.status.setValue("scheduled");
  //   } else {
  //     this.data.filters.noShow = false;
  //     this.isNoShow = false;
  //     this.filterForm.controls.walkIn.setValue(true);
  //     this.filterForm.controls.scheduled.setValue(true);
  //   }
  // }

  selectAll(event, type) {
    let companyOrbuilding = (type == 'company') ? 'selectAllCompany' : 'selectAllBuilding';
    if (companyOrbuilding === 'selectAllBuilding')
      this.filterForm.get('selectAllCompany').setValue(event.checked);
    this.buildingWithCompanyList.forEach((element) => {
      if (this.productType == this.productTypeList.Commercial) { 
        element['companies'].map((element) => {
        element['checked'] = event.checked;
      })
      }
      if (type == 'building')
        element['checked'] = event.checked;
    })
    this.showCompanyList = this.buildingWithCompanyList.every((element) => (element.checked == false)) ? false : true;
  }

  selectionChange(option: MatListOption, type) {
    this.showCompanyList = false;
    if (type == 'building') {
      this.buildingWithCompanyList[option.value.buildingArrayIndex]['checked'] = option.selected;
      if (this.productType == this.productTypeList.Commercial) {
        this.buildingWithCompanyList[option.value.buildingArrayIndex]['companies'].forEach((element) => {
          element['checked'] = option.selected;
        })
      }
    }
    else {
      if (this.productType == this.productTypeList.Commercial) {
        this.buildingWithCompanyList[option.value.buildingArrayIndex]['companies'][option.value.cmpIndex]['checked'] = option.selected;
      }
    }
    this.selectAllAfter();
  }

  applyFilter() {
    if (this.mainList && this.mainList.length > 0) {
      this.mainList.forEach((element, mainIndex) => {
        let index = this.buildingWithCompanyList.findIndex((data) => (data.id == element.id));
        if (index >= 0) {
          element = this.buildingWithCompanyList[index];
          element['buildingArrayIndex'] = mainIndex;
          if (this.productType==this.productTypeList.Commercial) {
              element['companies'].forEach((data, cmpIndex) => {
              let newCmpIndex = this.buildingWithCompanyList[index]['companies'].findIndex((data) => (data.companyId == element.companyId));
              if (newCmpIndex >= 0) {
                data = this.buildingWithCompanyList[index]['companies'][newCmpIndex];
                data['buildingArrayIndex'] = mainIndex;
                data['cmpIndex'] = cmpIndex;
            }
          })
          }
        }
      })
    }
    this.filterApplied = true;
    if (this.filterForm.get('showOnlyComplexVisitor').value == true) {
      this.filterForm.get('includeComplexVisitor').setValue(true);
    }
    this.dialogRef.close({
      selectedReport: this.data.selectedReport,
      filterApplied: this.filterApplied,
      advanceFilter: this.filterForm.value,
      customeDate: {
        startDate: this.startDate,
        endDate: this.endDate
      },
      buildingWithCompanyList: this.buildingWithCompanyList,
    });
  }

  clearFilter() {
    this.filterForm.patchValue(this.data.defaultSettting);
    // this.buildingWithCompanyList = this.data.defaultCmpBuidingObj;
    this.buildingWithCompanyList=this.data?.buildingWithCompanyList
    if (this.productType == this.productTypeList.Enterprise) {
      this.buildingWithCompanyList.map(element => {
        element.checked = true;
      })
      this.filterForm.get('selectAllBuilding').setValue(this.buildingWithCompanyList.every((element) => (element.checked == true)));
       this.buildingWithCompanyList = JSON.parse(JSON.stringify(this.data.buildingWithCompanyList));
    } else {
      this.buildingWithCompanyList = JSON.parse(JSON.stringify(this.data.defaultCmpBuidingObj));
      this.selectAllAfter();
      this.openDateFilter = false;
    }
  }

  cancel() {
    this.dialogRef.close();
  }


  clearStatus(event: Event) {
    event.stopPropagation();
    this.filterForm.get('status').setValue(null);
    this.data.filters.noShow = false;
    this.isNoShow = false;
    this.selectedStatus = null;
    this.filterForm.controls.walkIn.setValue(true);
    this.filterForm.controls.scheduled.setValue(true);
    this.filterForm.controls.noShow.setValue(false);
    this.filterForm.updateValueAndValidity();
    this.mySelect.close();
  }

  onSelectEvent(noshow) {
    if (noshow == "noshow") {
      this.isNoShow = true;
      this.filterForm.controls.walkIn.setValue(false);
      this.filterForm.controls.scheduled.setValue(true);
      this.filterForm.controls.noShow.setValue(true);
    } else {
      this.data.filters.noShow = false;
      this.isNoShow = false;
      this.filterForm.controls.walkIn.setValue(true);
      this.filterForm.controls.scheduled.setValue(true);
      this.filterForm.controls.noShow.setValue(false);
    }
  }

  searchBuildingAndCompanies(searchType: string, event, value: any) {
    if (searchType == 'building') {
      this.lastBuildingSearchtext = value;
      this.searchBuilding(this.lastBuildingSearchtext, this.lastCmpSearchtext)
    }
    if (searchType == 'company') {
      this.lastCmpSearchtext = value;
      this.searchCompany(this.lastCmpSearchtext)
    }
    // this.selectAllAfter();
  }

  searchBuilding(lastBuildingSearchtext: string, lastCmpSearchtext: string) {
    let buildingArrayIndex = 0;
    this.buildingWithCompanyList = this.mainList.filter((element) => {
      if (this.filterForm.get('selectAllBuilding').value) {
        element['checked'] = true;
      }
      else {
        element['checked'] = false;
      }
      if (((element.name).toLowerCase()).startsWith(lastBuildingSearchtext.toLowerCase())) {
        element['buildingArrayIndex'] = buildingArrayIndex;
        if (this.productType == this.productTypeList.Commercial) {
           element['companies'].forEach((data) => {
          data['buildingArrayIndex'] = buildingArrayIndex
        })
        element['originalcompanies'].forEach((data) => {
          data['buildingArrayIndex'] = buildingArrayIndex
        })
        }
        buildingArrayIndex = buildingArrayIndex + 1;
      }
      return ((element.name).toLowerCase()).startsWith(lastBuildingSearchtext.toLowerCase())
    });
  }

  async searchCompany(value) {
    // await Promise.all(    
    this.buildingWithCompanyList.forEach((element) => {
      if (element.checked) {
        let cmpIndex = 0;
        let originalCmp = JSON.parse(JSON.stringify(element['originalcompanies']));
        if (element.checked) {
          originalCmp.forEach((cmpElement, cmpIndex1) => {
            let index = element['companies'].findIndex((element) => (element.companyId == cmpElement.companyId));
            if (index >= 0 && element.checked) {
              originalCmp[cmpIndex1] = element['companies'][index];
              originalCmp['cmpIndex'] = cmpIndex1
            }
          })
        }
        element['companies'] = JSON.parse(JSON.stringify(originalCmp));
        let compnies = element['companies'].filter((data) => {
          if (((data.name).toLowerCase()).startsWith(value.toLowerCase()) || ((data.shortName).toLowerCase()).startsWith(value.toLowerCase())) {
            data['cmpIndex'] = cmpIndex;
            cmpIndex = cmpIndex + 1;
            return ((data.name).toLowerCase()).startsWith(value.toLowerCase()) || ((data.shortName).toLowerCase()).startsWith(value.toLowerCase())
          }
          return false;
        })
        element['companies'] = compnies;
      }
    })
    // )
  }

  getAllCompanyCount() {
    for (let d of this.buildingWithCompanyList) {
      if (d['companies'].length > 0) {
        return true
      }
    }
    return false
  }

  checkVistorOrEmployee(emp) {
    if (emp == 1) {
      if (this.data?.selectedReport == 'first_password') {
        return "report_common.show_only_complex_employee"
      } else if (this.data?.selectedReport == 'email_report') {
        return "report_common.show_only_complex_employee"
      } else {
        return 'report_common.show_only_complex_visitor'
      }
    } else if (emp == 2) {
      if (this.data?.selectedReport == 'first_password') {
        return "report_common.include_Employee_complex_level"
      } else if (this.data?.selectedReport == 'email_report') {
        return "report_common.include_Employee_complex_level"
      } else {
        return "report_common.include_visitor_complex_level"
      }

    }
    return '';
  }

  checkWalkin() {
    if (this.data?.selectedReport != 'first_password') {
      if (this.walkNsheduld) {
        return true
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}