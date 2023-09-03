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
import {Constants} from '../../constant/column';
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';
import { DetailsPageComponent } from 'src/app/feature/contractor-pass/popup/details-page/details-page.component';
import { CardService } from '../../Services/card.service';
//import { CardDetailsComponent } from '../../card-details/card-details.component';
//import {DetailPageViewComponent} from '../../../permanent-pass-request/popup/detail-page-view/detail-page-view.component'
import { DetailPageViewComponent } from 'src/app/feature/permanent-pass-request/popup/detail-page-view/detail-page-view.component';
//import { PayNowComponent } from '../../pay-now/pay-now.component';
declare var Razorpay: any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() companyValueChange = new EventEmitter();
  permissionKeyObj = permissionKeys;
  columns = Constants.permanent_pass_request;
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
    // this.getAllCardList();
    // this.getCategoryType()
  }

  rowData(rowData) {
    const dialogRef = this.dialog.open(DetailPageViewComponent, {
      height: "100%",
      position: { right: "0" },
      data: rowData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      //this.callGetAllApi();
    });
  }
   getCategoryType() {
    this.cardService.getPassCategoryType().subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list
        // this.categoryTypeLayout = this.categoryType.map(element => element.layout)
      }

    })
  }
  getAllCardList(data?) { console.log(data)
    // let reqData = {
    //   pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
    //   pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
    //   searchByStatus: data && data.searchStatus == "ALL" ? "": defaultVal.searchStatus,
    //   orderBy: data && data.orderBy ? data.orderBy : "status",
    //   sortBy: data && data.sortBy ? data.sortBy : "ASC",
    //   globalSearch: data && data.globalSearch ? data.globalSearch : "",
    // };
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      //searchByStatus: data && data.searchStatus == "ALL" ? "": defaultVal.searchStatus,
      orderBy: data && data.orderBy ? data.orderBy : "",
      orderDirection: data && data.sortBy ? data.sortBy : "desc",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
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

  // openDialog(screenType: string) {
  //   const dialogRef = this.dialog.open(CardDetailsComponent, {
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
  // openPayPopup(){
  //   var options = {
  //     "key": "YOUR_KEY_ID", // Enter the Key ID generated from the Dashboard
  //     "amount": "10", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //     "currency": "INR",
  //     "name": "Acme Corp",
  //     "description": "Test Transaction",
  //     "image": "https://example.com/your_logo",
  //     "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //     "handler": function (response){ console.log(response)
  //         alert(response.razorpay_payment_id);
  //         alert(response.razorpay_order_id);
  //         alert(response.razorpay_signature)
  //     },
  //     "prefill": {
  //         "name": "Gaurav Kumar",
  //         "email": "gaurav.kumar@example.com",
  //         "contact": "9999999999"
  //     },
  //     "notes": {
  //         "address": "Razorpay Corporate Office"
  //     },
  //     "theme": {
  //         "color": "#3399cc"
  //     }
  // };
  // var rzpl = new Razorpay(options);
  // rzpl.on('payment.failed', (response)=>{ console.log(response)
  //   alert(response.error.code);
  //   alert(response.error.description);
  //   alert(response.error.source);
  //   alert(response.error.step);
  //   alert(response.error.reason);
  //   alert(response.error.metadata.order_id);
  //   alert(response.error.metadata.payment_id);
  // });
  // //rzpl.open();
  // console.log('opened')
  //   // const dialogRef = this.dialog.open(PayNowComponent, {
  //   //   height: "100%",
  //   //   position: { right: "0" },
  //   //   data:{
  //   //     // productType: this.productType,
  //   //     // buildingList:this.allBuildings,
  //   //     // visitorSettings:this.visitorSettings
  //   //   },
  //   //   panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
  //   // });
  //   // dialogRef.afterClosed().subscribe((statusObj) => { 
  //   //   if (statusObj && statusObj?.statusCode) {
  //   //     if (statusObj.statusCode === 200 && statusObj.errors == null) {
  //   //     }
  //   //   }
  //   // })
  // }
}
