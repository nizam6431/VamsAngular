import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import {Constants} from '../../constant/column'
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';
import { CardService } from '../../Services/card.service';
import { CardDetailsComponent } from '../../card-details/card-details.component';
import { DetailPageViewComponent } from '../../popup/detail-page-view/detail-page-view.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() companyValueChange = new EventEmitter();
  permissionKeyObj = permissionKeys;
  columns = Constants.card;
  pageSize: number = defaultVal.pageSize;
  dataSource: any;
  totalCount: any;
  userDetails: any;
  getAllCardReq: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; fromTime: any; toTime: any; globalSearch: any; level2Ids: any; level3Ids: any; status: any[]; };
  categoryType: any;
  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private userService: UserService,
    private translate: TranslateService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cardService: CardService
  ) { 
    this.userDetails = this.userService.getUserData();
  }

  ngOnInit(): void {
    this.getAllCardList();
    this.getCategoryType()
  }

  rowData(rowData) {
    const dialogRef = this.dialog.open(DetailPageViewComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData.data,
      panelClass: ["animate__animated", "vams-dialog-lg", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.getAllCardList(rowData.req);
    });
  }
   getCategoryType() {
    let obj = {
      passType : 'P',
      categoryType:""
    }
    this.cardService.getPassCategoryType(obj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list
        // this.categoryTypeLayout = this.categoryType.map(element => element.layout)
      }

    })
  }
  getAllCardList(data?) {
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      searchByStatus: data && data.searchStatus == "ALL" ? "": defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "status",
      sortBy: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      passType: data && data.passType ? data.passType : "Permanent",
      passStatus:data?.passStatus?data?.passStatus:""
    };
    this.cardService.getAllCards(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalCount = resp.data.totalCount;
        }
      });
  }

  deleteCards(event){

  }

  openDialog(screenType: string) {
    const dialogRef = this.dialog.open(CardDetailsComponent, {
      height: "100%",
      width:"66%",
      position: { right: "0" },
      data: { data: null, formType: "location", mode: "add" },
      panelClass: ["animate__animated", "vams-dialog", "complex-contractorsCcompany-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }

  dialogClosed(statusObj) {
    if (statusObj && statusObj?.statusCode) {
      if (statusObj.statusCode === 200 && statusObj.errors == null) {
        this.getAllCardList();
      }
    }
  }

  changeMode(event) {}
  paginate(event) {
    this.getAllCardList(event)
    console.log(event)
  }
}
