import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { UserService } from 'src/app/core/services/user.service';
import { VisitorStatusObject } from '../models/report-filter';
import { ReoprtsService } from '../reoprts.service';
import { forkJoin } from 'rxjs';
import moment from 'moment';
import { formatDate } from '@angular/common';
import { AppointmentService } from '../../appointment/services/appointment.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from 'src/app/core/models/users';

@Component({
  selector: 'app-walkin-visitor-report',
  templateUrl: './walkin-visitor-report.component.html',
  styleUrls: ['./walkin-visitor-report.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class WalkinVisitorReportComponent implements OnInit {
  @ViewChild('selectedStatus') mySelect: MatSelect;
  @ViewChild('showVisitorPurposeStatus') mySelect1: MatSelect;
  @ViewChild('showVisitorTypeStatus') mySelect2: MatSelect;
  public filterForm: FormGroup;
  selectedStatus: any ;
  isNoShow: boolean;
  CategoryId: any;
  categoryTypeName: any;
  visitorPurposeObject:any;
  visitorsTypeObject: any;
  showVisitorTypeStatus;
  filterApplied: boolean;
  minDate: Date;
  today=new Date();
  maxDate: any;
  statusFilter = [
    {value: "Completed", viewValues: "Completed"},
    {value: "Inprogress", viewValues: "InProgress"}]
  showVisitorPurposeStatus: any;
  checkOutDate: any;
  todayDate: Date;
  dateNotValid: boolean;
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<WalkinVisitorReportComponent>,
    public dialog: MatDialog,
    private reoprtsService:ReoprtsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apptService:AppointmentService,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) { 
    let today = moment().subtract(0, "days").format("YYYY-MM-DD");
    const start = moment().startOf('month')
    this.minDate = moment(this.today).subtract(30, 'days').toDate();
    this.maxDate = moment(this.today  ).add(0, 'days').toDate();
    this.minDate = null;
    this.todayDate = null
 
   this.checkOutDate = this.maxDate
  }

  ngOnInit(): void {
    this.getVisitorSettings(null);
    this.createForm();
   
    let apicall = [];
    apicall.push(this.reoprtsService.getVisitorPurpose());
    apicall.push(this.reoprtsService.getVisitorType());
    forkJoin(apicall).subscribe((resp)=>{

      if(resp && resp[0]){
      this.visitorPurposeObject = resp[0];
      this.visitorsTypeObject =  resp[1];
      }
      if(this.data && this.data.status){
        this.selectedStatus = (this.statusFilter.find(ele => ele.value  == this.data.status))
        this.filterForm.controls.status.patchValue(this.selectedStatus);
      }
      if(this.data && this.data.visitorPurposeId){
        this.showVisitorPurposeStatus = (this.visitorPurposeObject.data.find(ele => ele.id  == this.data.visitorPurposeId)).id
        this.filterForm.controls.visitorPurposeId.patchValue(this.showVisitorPurposeStatus);
      }
      if(this.data && this.data.VisitorTypeId){
      this.showVisitorTypeStatus = (this.visitorsTypeObject.data.find(ele => ele.id  == this.data.VisitorTypeId)).id
      this.filterForm.controls.VisitorTypeId.patchValue(this.showVisitorTypeStatus);
      }
    });
    
    this.filterForm.patchValue(this.data);
    if(this.data.isFilterApplied){
      let checkIn = this.data.checkInDate
      let checkOut = this.data.checkOutDate
      let searchQueryByHost = this.data.searchQueryByHost
      let visitorGlobalSearch = this.data.visitorGlobalSearch
      this.selectedStatus = this.statusFilter.find(ele=>ele.value == this.data.status)
      this.filterForm.controls.searchQueryByHost.patchValue(searchQueryByHost);
      this.filterForm.controls.searchQueryByVisitor.patchValue(visitorGlobalSearch);
      this.filterForm.controls.checkInDate.patchValue(checkIn);
      this.filterForm.controls.checkOutDate.patchValue(checkOut);
      this.filterForm.controls.status.patchValue(this.selectedStatus);
    }  
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      status: [],
      searchQueryByHost: [],
      searchQueryByVisitor: [],
      VisitorTypeId: [],
      visitorPurposeId: [],
      checkInDate:[],
      checkOutDate:[],
    })}

    onSelectEvent(noshow){
      this.data.filters.noShow = false;
      this.isNoShow = false;
      this.filterForm.controls.walkIn.setValue(true);
      this.filterForm.controls.scheduled.setValue(true);
      this.filterForm.controls.noShow.setValue(false);
    }  

    clearStatus(event: Event) {
      event.stopPropagation();
      this.filterForm.get('status').setValue(null);
      this.selectedStatus = null;
      this.filterForm.updateValueAndValidity();
      this.mySelect.close();
      this.mySelect1.close();
      this.mySelect2.close();
    }   

    selectionChange(event){
      this.CategoryId = event.value.id
      this.categoryTypeName = event.value.name
    }

    onVisitorPurposeSelectEvent(){
      if (this.filterForm.value.visitorPurposeId== this.showVisitorPurposeStatus) {
          this.showVisitorPurposeStatus = null;
          this.filterForm.controls['visitorPurposeId'].setValue(null);
        } else {
          this.showVisitorPurposeStatus = this.filterForm.value.visitorPurposeId;
        }
      }
    onVisitorTypeSelectEvent(){
      if (this.filterForm.value.VisitorTypeId== this.showVisitorTypeStatus) {
          this.showVisitorTypeStatus = null;
          this.filterForm.controls['VisitorTypeId'].setValue(null);
        } else {
          this.showVisitorTypeStatus = this.filterForm.value.VisitorTypeId;
        }
    }

    onselectedStatusSelectEvent(){
      if (this.filterForm.value.status == this.selectedStatus) {
        this.selectedStatus = null;
        this.filterForm.controls['status'].setValue(null);
      } else {
        this.selectedStatus = this.filterForm.value.status;
      }
    }

    applyFilter(){
      // console.log((this.filterForm.controls.checkInDate.value) ,(this.filterForm.controls.checkOutDate.value))
      let checkIn = new Date(this.filterForm.controls.checkInDate.value)
      let checkOut = new Date(this.filterForm.controls.checkOutDate.value);
    
      if (checkIn <= checkOut || this.filterForm.controls.checkInDate.value == undefined && this.filterForm.controls.checkOutDate.value == undefined ) {
        this.dateNotValid = false;
      } else {
        this.dateNotValid = true;
      }
      let check = false;
      
      if (this.filterForm.controls.checkOutDate.value == null && this.filterForm.controls.checkInDate.value == null ) {
        check = true;
      } else if (this.filterForm.controls.checkOutDate.value != null && this.filterForm.controls.checkInDate.value != null) {
        check = true;
      }
      if (!this.dateNotValid && check) {
      this.filterApplied = true;
      this.dialogRef.close({
        selectedReport: this.data.selectedReport,
        filterApplied: this.filterApplied,
        checkInDate: this.filterForm.controls.checkInDate.value,
        checkOutDate: this.filterForm.controls.checkOutDate.value,
        status:(this.filterForm.controls.status.value)?.value,
        searchQueryByHost:this.filterForm.controls.searchQueryByHost.value,
        searchQueryByVisitor:this.filterForm.controls.searchQueryByVisitor.value,
        VisitorTypeId:this.filterForm.controls.VisitorTypeId.value,
        visitorPurposeId:this.filterForm.controls.visitorPurposeId.value,
      });
    } else {
      this.dateNotValid = true;
    }
    }

    clearFilter(){
      this.filterForm.reset()
      this.showVisitorPurposeStatus = null
      this.showVisitorTypeStatus = null
      this.selectedStatus = null
      this.minDate = null;
      this.todayDate = null;
      this.checkOutDate = this.maxDate
      this.dateNotValid = false
    }

    cancel() {
      this.dialogRef.close(undefined);
    }
   

  checkOutDateChange() {
    this.minDate = moment(this.filterForm.controls.checkInDate.value).subtract(0, 'days').toDate();
    let firstDate = formatDate(new Date(), "MM/dd/YYYY", "en");
    let secondDate = formatDate(this.minDate, "MM/dd/YYYY", "en");
  
    let diffDays = (moment(firstDate).diff(moment(secondDate), 'minutes') / 60)/24;
    
    if (diffDays<=30) {
       this.maxDate = moment(new Date()).add(0,'days').toDate();
    } else {
       this.maxDate = moment(this.minDate).add(30,'days').toDate();
    }
    this.checkOutDate = this.maxDate
    this.todayDate = this.minDate
    // test if geting isse then we will comment above line
    this.filterForm.controls.checkOutDate.setValue( this.checkOutDate)
    //   
    let checkIn = new Date(this.filterForm.controls.checkInDate.value)
    let checkOut =new Date(this.filterForm.controls.checkOutDate.value);
    if (checkIn<=checkOut) {
      this.dateNotValid = false;
    }

  }
  checkInDateChange(){
    //this.minDate = moment(this.filterForm.controls.checkOutDate.value).subtract(0, 'days').toDate();
      this.checkOutDate = this.filterForm.controls.checkOutDate.value
      this.todayDate = moment(this.filterForm.controls.checkOutDate.value).subtract(30,'days').toDate();
      this.minDate = this.todayDate
      this.maxDate = this.checkOutDate
    // 
    let checkIn = new Date(this.filterForm.controls.checkInDate.value)
    let checkOut =new Date(this.filterForm.controls.checkOutDate.value);
    if (checkIn<=checkOut) {
      this.dateNotValid = false;
    } 

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
