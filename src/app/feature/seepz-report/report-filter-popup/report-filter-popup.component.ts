import { AfterViewInit, Component, Inject, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms/';
import { ProductTypes } from "../../../../app/core/models/app-common-enum"
import { UserService } from 'src/app/core/services/user.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { ReoprtsService } from '../reoprts.service';
import { CardService } from '../../daily-pass/Services/card.service'
import { defaultVal } from "../../../core/models/app-common-enum";
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/core/models/users';
import { AppointmentService } from '../../appointment/services/appointment.service';
import { TranslateService } from '@ngx-translate/core';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-report-filter-popup',
  templateUrl: './report-filter-popup.component.html',
  styleUrls: ['./report-filter-popup.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ReportFilterPopupComponent implements OnInit, AfterViewInit {
  @ViewChild('selectedCategoryType') mySelect: MatSelect;
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
  visitorPurposeObject: any;
  showVisitorPurposeStatus;
  showVisitorTypeStatus;
  userDetails: any;
  l2Building: any;
  showList: boolean = true;
  todayDate = new Date();
  today = new Date();
  tomorrow = new Date;
  categoryType: any;
  requestDatas: { pageIndex: any; pageSize: any; level3Id: number; passType: any; categoryType: any; CategoryId: any; checkInDate: any; checkOutDate: string; globalSearch: string; flagged: boolean; };
  public pageSize: number;
  public pageIndex: 1;
  tenantList: any;
  hasSearchValue: boolean;
  searchKey: any;
  requestParameter = {
    pageIndex: defaultVal.pageSize,
    pageSize: defaultVal.pageSize,
    level3Id: 0,
    categoryType: this.data.categoryType,
    CategoryId: "",
    checkInDate: null,
    checkOutDate: null,
    globalSearch: "",
    passType: this.data.passType,
    flagged: false,
    cellNumber: "",
    lastName: "",
    vehicleNumber: '',
    tenantList: "",
    tenantListId: ""
  }
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.India,
    CountryISO.UnitedArabEmirates,
  ];
  public phoneValidation: boolean = true;
  public selectedCountry: CountryISO = CountryISO.India;
  reportData: any;
  CategoryId: any;
  cellNumber: any;
  isSelecetAll: boolean = true;
  valueType: any;
  originalTenantDisplayList;
  tenantListDisplayId: any;
  roleName: any;
  minDate: Date;
  maxDate: any;
  categoryTypeName: any;
  cType: any = [{ name: null }];
  selectedCategoryType: any;
  tenantId: any[] = [];
  checkOutDate: Date;
  dateNotValid: boolean;
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<ReportFilterPopupComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private reoprtsService: ReoprtsService,
    private cartService: CardService,
    private toastr: ToastrService,
    private apptService: AppointmentService,
    private translate: TranslateService,

  ) {

    let today = moment().subtract(0, "days").format("YYYY-MM-DD");
    const start = moment().startOf('month')
    this.minDate = moment(this.today).subtract(30, 'days').toDate();
    this.maxDate = moment(this.today).add(0, 'days').toDate();
    this.minDate = null;
    this.todayDate = null

    this.checkOutDate = this.maxDate
    this.userDetails = this.userService.getUserData();
    this.roleName = this.userDetails.role.shortName
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getVisitorSettings(null);
    this.getCategoryType();
    this.createForm();

    this.tenantList = this.data.tenantList
    this.tenantList.map(element => element.checked = true)
    this.originalTenantDisplayList = this.data.originalTenantDisplayList
    this.originalTenantDisplayList.map(element => element.checked = true)
    if (this.data.tenantListId != undefined) {
      this.tenantId = this.data.tenantListId;
      let tenantArray = this.data.tenantList.forEach(element => {
        element.checked = false;
      })
      for (var j = 0; j < this.data.tenantList.length; j++) {
        let index = this.data.tenantListId.findIndex(element => element == this.data.tenantList[j].companyId)
        if (index >= 0) {
          this.data.tenantList[j]['checked'] = true
        }
        else {
          this.isSelecetAll = false
        }
      }
    }

    this.valueType = this.data.selectedReport.value
    console.log(this.data, 'data')
    if (this.data.isFilterApplied) {
      // this.cType[0].name = this.data.categoryTypeName
      let checkIn = this.data.checkInDate
      let checkOut = this.data.checkOutDate
      let cellNo = this.data.cellNumber
      let vehicleN = this.data.vehicleNumber
      let fName = this.data.firstName
      let lName = this.data.lastName
      let tenantId = this.data.tenantListId
      this.CategoryId = this.data.CategoryId
      this.categoryTypeName = this.data.categoryTypeName
      this.filterForm.controls.firstName.patchValue(fName);
      this.filterForm.controls.lastName.patchValue(lName);
      this.filterForm.controls.checkInDate.patchValue(checkIn);
      this.filterForm.controls.checkOutDate.patchValue(checkOut);
      this.filterForm.controls.vehicleNumber.patchValue(vehicleN);
      this.filterForm.controls.cellNumber.patchValue(cellNo);
      // this.filterForm.controls.categoryType.patchValue(this.cType[0]);
    }
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      categoryType: [this.cType[0].name],
      checkInDate: [],
      checkOutDate: [],
      firstName: [''],
      lastName: [''],
      vehicleNumber: [''],
      CategoryId: [''],
      cellNumber: [''],
      selectAllTenant: [''],
      selectedTenant: [''],
      tenantName: [''],
      tenantListId: ['']
    })
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  selectionChange(event) {
    this.CategoryId = event.value.id
    this.categoryTypeName = event.value.name
  }

  applyFilter() {
    this.tenantId = [];
    let checkIn = new Date(this.filterForm.controls.checkInDate.value)
    let checkOut = new Date(this.filterForm.controls.checkOutDate.value);
    if (checkIn <= checkOut) {
      this.dateNotValid = false;
    } else {
      this.dateNotValid = true;
    }
    let check = false;
    if (this.filterForm.controls.checkOutDate.value == null && this.filterForm.controls.checkInDate.value == null) {
      check = true;
    } else if (this.filterForm.controls.checkOutDate.value != null && this.filterForm.controls.checkInDate.value != null) {
      check = true;
    }
    if (!this.dateNotValid && check) {
      this.tenantId = (this.tenantList.map(element => {
        if (element.checked) {
          return element.companyId
        }
      })).filter(ele => ele != null)
      this.filterApplied = true;
      this.dialogRef.close({
        selectedReport: this.data.selectedReport,
        filterApplied: this.filterApplied,
        checkInDate: this.filterForm.controls.checkInDate.value,
        checkOutDate: this.filterForm.controls.checkOutDate.value,
        firstName: this.filterForm.controls.firstName.value,
        lastName: this.filterForm.controls.lastName.value,
        CategoryId: this.CategoryId,
        categoryTypeName: this.categoryTypeName,
        cellNumber: this.filterForm.controls.cellNumber.value,
        vehicleNumber: this.filterForm.controls.vehicleNumber.value,
        tenantList: this.data.tenantList,
        tenantListId: this.tenantId
      });
    } else {
      this.dateNotValid = true;
    }
  }

  clearFilter() {
    this.tenantId = []
    this.isSelecetAll = false
    for (var i = 0; i < this.data.tenantList.length; i++) {
      this.data.tenantList[i]['checked'] = false;
    }
    for (var i = 0; i < this.tenantList.length; i++) {
      this.tenantList[i]['checked'] = false;
    }
    this.selectedStatus = null;
    this.minDate = null;
    this.todayDate = null;
    this.checkOutDate = this.maxDate
    this.dateNotValid = false
    this.CategoryId = null
    this.categoryTypeName = null
    this.filterForm.reset()
  }

  cancel() {
    this.dialogRef.close({ status: false });
  }
  getCategoryType() {
    let obj = {
      passType: this.data?.passType,
      categoryType: this.data?.categoryType,
    }
    this.cartService.getPassCategoryType(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list;
        if (this.data.isFilterApplied) {
          let obj = this.categoryType.find(o => o.name === this.data.categoryTypeName);
          this.selectedCategoryType = obj;
        }
      }
    });
  }

  selectAll(event) {
    this.tenantId = []
    this.isSelecetAll = !this.isSelecetAll;
    this.tenantList.map(ele => {
      ele.checked = event.checked;
      if (event.checked) {
        this.tenantId.push(ele.companyId)
      }
      else {
        let index = this.tenantId.findIndex(ele => ele == ele.companyId)
        if (index >= 0) {
          this.tenantId.splice(index, 1);
        }
      }
    })
  }
  selectionChanges(event, index) {
    this.tenantList[index].checked = !this.tenantList[index].checked
    let count = 0;
    this.tenantList.map(ele => {
      if (ele.checked) {
        count = count + 1
      }
    })

    if (event.option._selected && (this.tenantId.findIndex(ele1 => ele1 == this.tenantList[index].companyId)) < 0) {
      this.tenantId.push(this.tenantList[index].companyId)
    }
    else {
      let index1 = this.tenantId.findIndex(ele2 => ele2 == this.tenantList[index].companyId)
      if (index1 >= 0 && index1 == index) {
        this.tenantId.splice(index, 1);
      }
    }

    // this.tenantList.forEach(ele => {
    //   if (event.option._selected && (this.tenantId.findIndex(ele1 => ele1 == ele.companyId)) < 0) {
    //     this.tenantId.push(ele.companyId)
    //   }
    //   else {
    //     let index1 = this.tenantId.findIndex(ele2 => ele2 == ele.companyId)
    //     if (index1 >= 0 && index1 == index) {
    //       this.tenantId.splice(index, 1);
    //     }
    //   }
    // console.log(this.tenantId.findIndex(ele1 => ele1 == ele.companyId), this.tenantId);
    // })


    if (count == this.tenantList.length) {
      this.isSelecetAll = true
    } else {
      this.isSelecetAll = false
    }
  }

  searchTenant(value: any, event) {
    const filterValue = this.filterForm.controls.tenantName.value.toLowerCase()
    this.tenantList = []
    this.originalTenantDisplayList.forEach(elemant => {
      if (elemant.name.toLowerCase().startsWith(filterValue) || elemant.shortName.toLowerCase().startsWith(filterValue) || elemant.buildingName.toLowerCase().startsWith(filterValue) || elemant.officeNumber.toLowerCase().startsWith(filterValue)) {
        let objToStored = JSON.parse(JSON.stringify(elemant))
        let index = this.tenantId.findIndex(ele => ele == objToStored.companyId)
        if (index >= 0) {
          // console.log(index, '111')
          objToStored['checked'] = true;
        }
        else {
          // console.log(index, '222')
          objToStored['checked'] = false;
        }
        this.tenantList.push(objToStored)
      }
    })
    if (event.key == 'Backspace') {
      this.isSelecetAll = false
    }
  }

  checkOutDateChange() {

    this.minDate = moment(this.filterForm.controls.checkInDate.value).subtract(0, 'days').toDate();
    let firstDate = formatDate(new Date(), "MM/dd/YYYY", "en");
    let secondDate = formatDate(this.minDate, "MM/dd/YYYY", "en");

    let diffDays = (moment(firstDate).diff(moment(secondDate), 'minutes') / 60) / 24;

    if (diffDays <= 30) {
      this.maxDate = moment(new Date()).add(0, 'days').toDate();
    } else {
      this.maxDate = moment(this.minDate).add(30, 'days').toDate();
    }
    this.checkOutDate = this.maxDate
    this.todayDate = this.minDate
    // test if geting isse then we will comment above line
    this.filterForm.controls.checkOutDate.setValue(this.checkOutDate)
    //   
    let checkIn = new Date(this.filterForm.controls.checkInDate.value)
    let checkOut = new Date(this.filterForm.controls.checkOutDate.value);
    if (checkIn <= checkOut) {
      this.dateNotValid = false;
    }

  }
  checkInDateChange() {
    //this.minDate = moment(this.filterForm.controls.checkOutDate.value).subtract(0, 'days').toDate();
    this.checkOutDate = this.filterForm.controls.checkOutDate.value
    this.todayDate = moment(this.filterForm.controls.checkOutDate.value).subtract(30, 'days').toDate();
    this.minDate = this.todayDate
    this.maxDate = this.checkOutDate
    // 
    let checkIn = new Date(this.filterForm.controls.checkInDate.value)
    let checkOut = new Date(this.filterForm.controls.checkOutDate.value);
    if (checkIn <= checkOut) {
      this.dateNotValid = false;
    }

  }

  clearStatus(event) {
    event.stopPropagation();
    this.filterForm.get('categoryType').setValue(null);
    this.selectedCategoryType = null;
    this.CategoryId = null
    this.categoryTypeName = null
    this.filterForm.updateValueAndValidity();
    this.mySelect.close();
  }

  getVisitorSettings(locationId) {
    this.apptService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
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
