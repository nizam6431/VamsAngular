import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { noWhitespaceValidator } from 'src/app/core/functions/functions';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { AppointmentCancelReasonComponent } from '../../../popup/appointment-cancel-reason/appointment-cancel-reason.component';
import { Constants } from 'src/app/feature/configure/constants/column'
import { first } from 'rxjs/operators';
import { ConfigureService } from '../../../services/configure.service';
import { defaultVal } from 'src/app/core/models/app-common-enum';
@Component({
  selector: 'app-appointment-reject-reason-master',
  templateUrl: './appointment-reject-reason-master.component.html',
  styleUrls: ['./appointment-reject-reason-master.component.scss']
})
export class AppointmentRejectReasonMasterComponent implements OnInit, OnChanges {
  @Input() formData: any;
  @Input() aaptCancelReasonAdd: any;
  @Output() modeEmmiter = new EventEmitter();
  columns: any[] = Constants.appointment_reject_reason;
  displayedColumns: any[];
  mode: string = "show";
  data: any;
  dataSource: any;

  // public hasSearchValue: boolean = false;
  // searchKey: string = "";
  // clearSerach :any ;

  rejectedReasonForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  reasonData: any;
  // pageSize: any;
  totalCount: any;
  @Input() pageSize: number;
  constructor(public dialog: MatDialog,
    private configureService: ConfigureService,
    private translate:TranslateService,
    private toastr: ToastrService) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.aaptCancelReasonAdd) {
      this.getReasonData();
    }
  }

  ngOnInit(): void {
    // console.log("",this.dataSource)
    this.getReasonData()
  }

  // applyFilter(filterValue, clearSearch = false) { console.log(filterValue.length, this.hasSearchValue)
  //   if(this.hasSearchValue )
  //   {
  //     this.searchKey = filterValue.trim().toLowerCase();
  //   }
  //   else{
  //     this.searchKey = filterValue.trim().toLowerCase();
  //   }
  //   if (clearSearch) {
  //     this.getReasonData();
  //   }
  //   let data = {
  //     globalSearch: filterValue,
  //     orderBy: "reason",
  //     orderDirection: "ASC",
  //     pageIndex: 1,
  //     pageSize: 25
  //   }
  //   if (filterValue.length == 0) {
  //     this.hasSearchValue = false;
  //     this.getReasonData()
  //   } else {
  //     this.hasSearchValue = true;
  //       setTimeout(()=>{ 
  //         if(this.searchKey === filterValue){
  //         data.globalSearch = filterValue;
  //         console.log(data.globalSearch, filterValue, this.searchKey)
  //         this.getReasonData(data)
  //       }
  //       }, 500);
  //   }
  // }

  // applyFilter_(filterValue){
  //   if(this.hasSearchValue )
  //   {
  //     this.searchKey = filterValue.trim().toLowerCase();
  //   }
  //   else{
  //     this.searchKey = filterValue.trim().toLowerCase();
  //   }
  //   let data = {
  //     globalSearch: filterValue,
  //     orderBy: "reason",
  //     orderDirection: "ASC",
  //     pageIndex: 1,
  //     pageSize: 25
  //   }
  //   if (filterValue.length > 0) {
  //     this.hasSearchValue = true;
  //     this.getReasonData(data)
  //   } else {
  //     this.hasSearchValue = false;
  //     this.getReasonData()
  //   }
  // }

  // cleanSearchBox(event?) {
  //   this.clearSerach= event;
  //   const filterValue = (event.value = "");
  //   this.applyFilter(filterValue, true);
  // }

  rowData(event: any) {
    this.data = event;
    this.mode = "show";
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppointmentCancelReasonComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "appointment_reject_reason_master", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getReasonData();
    });
  }

  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "Appointment Cancel Reason",
        name: rowData.reason,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result){
        this.deleteReasonData(rowData);
      }
      // if (result) this.modeEmmiter.emit(rowData);
      // this.deleteReasonData(rowData);
    });
  }

  changeMode(event) {
    this.data = event.rowData;
    this.mode = event.mode;
    if (this.mode == "delete") {
      this.openDialogForDelete(this.data);

    } else {
      this.openDialog()
    }

  }

  getReasonData(data?:any) {
    let requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : null,
      orderDirection: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
    };
    this.configureService.getCancelAppointmentReason(requestObject).subscribe((data: any) => {
      this.displayedColumns = Constants.appointment_reject_reason;
      this.dataSource = data["data"].list;
      this.pageSize = data.data.pageCount
      this.totalCount = data.data.totalCount
    });
  }

  deleteReasonData(event) {
    let obj = {
      id: event.id,
    };
    this.configureService
      .deleteAppointmentCancelReason(obj)
      .pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {        
          // this.toastr.success(resp.message, 'Success');
          this.toastr.success(this.translate.instant("pop_up_messages.appointment_deleted_sucessfully"))
          this.getReasonData();
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      });
  }
  appointmentDataChange(event){
    this.data = event;
    this.getReasonData(this.data);
  }
}
