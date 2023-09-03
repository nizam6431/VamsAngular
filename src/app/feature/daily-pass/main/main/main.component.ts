import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
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
import { DetailsPageComponent } from 'src/app/feature/contractor-pass/popup/details-page/details-page.component';
import { CardService } from '../../Services/card.service';
import { CardDetailsComponent } from '../../card-details/card-details.component';
import { DetailPageViewComponent } from '../../popup/detail-page-view/detail-page-view.component';
import { CommonService } from 'src/app/core/services/common.service';
//import { PayNowComponent } from '../../pay-now/pay-now.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() companyValueChange = new EventEmitter();
  @Input() visitorSettings;
  permissionKeyObj = permissionKeys;
  columns = Constants.card;
  pageSize: number = defaultVal.pageSize;
  dataSource: any;
  totalCount: any;
  userDetails: any;
  getAllCardReq: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; fromTime: any; toTime: any; globalSearch: any; level2Ids: any; level3Ids: any; status: any[]; };
  categoryType: any;
  visitorSetting:any;
  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private userService: UserService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private cardService: CardService,
    private commonService: CommonService
  ) { 
    this.userDetails = this.userService.getUserData();
  }

  ngOnInit(): void {
    this.getAllCardList();
    this.getCategoryType();
  }

  rowData(rowData) {
    const dialogRef = this.dialog.open(DetailPageViewComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.getAllCardList();
    });
  }
   getCategoryType() {
    let obj = {
      passType : 'D',
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
      orderBy: data && data.orderBy ? data.orderBy : "",
      sortBy: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      passType:"Daily"
    };
    this.cardService.getAllDailyPass(reqData)
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
      data: { data: null, formType: "location", mode: "add", visitorSettings:this.visitorSettings },
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

  // Razor pay code start
  // openPayDialog(screenType: string) {
  //   const dialogRef = this.dialog.open(PayNowComponent, {
  //     height: "100%",
  //     width:"50%",
  //     position: { right: "0" },
  //     data: { data: null, formType: "location", mode: "add" },
  //     panelClass: ["animate__animated", "vams-dialog", "complex-contractorsCcompany-dialog", "animate__slideInRight"],
  //   });
  //   dialogRef
  //     .afterClosed()
  //     .pipe(first())
  //     .subscribe((result) => {
  //       this.dialogClosed(result);
  //     });
  // }
}
