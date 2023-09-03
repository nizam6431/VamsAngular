import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { defaultVal, pagination, ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { MasterService } from 'src/app/feature/master/services/master.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CardService } from '../../Services/card.service';
import { Router } from '@angular/router';
//import { PayNowComponent } from '../../pay-now/pay-now.component';
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from 'src/app/core/services/common.service';
declare var Razorpay: any;

@Component({
  selector: 'app-checkin-view',
  templateUrl: './checkin-view.component.html',
  styleUrls: ['./checkin-view.component.scss']
})
export class CheckinViewComponent implements OnInit {
  @ViewChild('uniqueId') searchElement: ElementRef;
  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  public pageIndex: 1;
  columnKeys: any;
  hasSearchValue: boolean;
  searchKey: any;
  url: any = '';

  @Input() columns;
  @Input() dataSource;
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  @Input() type;
  @Input() resetLocation = false;
  @Input() displayedColumns;
  @Input() totalCount;
  @Input() pageSizeCount;
  @Input() categoryType;
  pageSize: defaultVal.pageSize;
  @Output() searchEmittor = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();

  sortingDir: string = "";
  sortingColumn: string = "";
  showSearchBox = []
  productType: any;
  isEnterprise: boolean;
  selfPhotoUrl: any;
  toggleActive: boolean = true;
  userPhoto = 'assets/images/dummy-profile-pic.jpg';
  validityNotExpiredPhoto = 'assets/images/Green-Check.png';
  validityExpiredPhoto = 'assets/images/Red-Cross.png';
  passValTrue: boolean = false;
  passData:any;
  checkoutTime = "2022-11-22T08:55:37.0096407";
  s3Img = "https://vams-development.s3.ap-south-1.amazonaws.com/level3/636fb116-1dea-4008-a563-1dec50425780/passDocument/MicrosoftTeams-image.png";
  checkInPage: boolean;
  checkOUtPage: boolean;
  enterUniqueId: any = '';
  displayId: any;
  visitorSettings: any;
  timeFormat: any;
  raiseFlagHide: boolean = false;
  // categoryType: any;
  constructor(
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private configureService: ConfigureService,
    private masterService: MasterService,
    private userService: UserService,
    private fileUploadService:FileUploadService,
    private cardService: CardService,
    private commonService: CommonService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.dataSource && changes.dataSource.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
    }
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
    }
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);
    console.log(this.columns)
    this.url = this.router.url; //console.log(this.url)
    let urls = this.url.split('/'); //console.log(urls[urls.length - 1])
    if( urls[urls.length - 1] == "checkIn" ){
      this.checkInPage = true;
      this.checkOUtPage = false;
    }else if(urls[urls.length - 1] == "checkOut"){
      this.checkInPage = false;
      this.checkOUtPage = true;
    }
    if( this.url.search("payment_id") !== -1){
      //this.getPaymentDetailByPaymentId();
    }
    //this.loadScript();
    this.getVisitorSettings(null)
  }

  getVisitorSettings(locationId) {
    this.commonService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.visitorSettings = response.data; console.log(this.visitorSettings) 
        if( this.visitorSettings.timeformat == 12 ){
          this.timeFormat = 'shortTime';
        }else{
          this.timeFormat = 'HH:mm'
        }
        //this.sendNDA = response?.data?.sendNDA;
        // if( response.data.sendNDA == true ){
        //   this.sendNDA = 1; console.log(this.sendNDA)
        // }else{
        //   this.sendNDA = 0; console.log(this.sendNDA)
        // }
        // this.dateFormat = response.data.dateFormat || "dd-MM-yyyy";
        // this.dateFormatWithTimeFormat = (response.data.timeformat == 12) ? (this.dateFormat.toUpperCase() + " HH:MM A") : (this.dateFormat.toUpperCase() + " HH:MM");
        // let currentTimeZone = response?.data?.timeZone;
        // this.activateDLScanScheduledAppointment = response?.data?.activateDLScanScheduledAppointment;
        // this.isAccessControlEnabled = response?.data?.isAccessControlEnabled;
        // this.getCurrentTimeZone(currentTimeZone);
        // this.appointmentService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
      } else {
        this.toastr.error(response.message);
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

  // getPaymentDetailByPaymentId(){
  //   let urlN = this.router.url.split('/');console.log(urlN[urlN.length - 1]);
  //   urlN = urlN[urlN.length - 1].split('?');
  //   urlN = urlN[urlN.length - 1].split('=');
  //   console.log(urlN[0], urlN[1])
  //   this.cardService.paymentDetail(urlN[1]).subscribe(
  //     (resp) => {console.log(resp)
  //     },
  //     (error) => {
  //       if (error && error.error && "errors" in error.error) {
  //         error.error.errors.forEach((element) => {
  //           this.toastr.error(
  //             element.errorMessages[0],
  //             this.translate.instant("pop_up_messages.error")
  //           );
  //         });
  //       } else {
  //         this.toastr.error(
  //           error.error.Message,
  //           this.translate.instant("pop_up_messages.error")
  //         );
  //       }
  //     }
  //   );
  // }

  // loadScript() {
  //   let body = <HTMLDivElement> document.body;
  //   let script = document.createElement('script');
  //   var form = document.createElement("form");
  //   form.setAttribute("id", "addPaymentButton");
  //   script.innerHTML = '';
  //   script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
  //   //script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  //   script.setAttribute("data-payment_button_id", "pl_KjOSnMOkskxsxu");
  //   script.async = true;
  //   script.defer = true;
  //   form.appendChild(script);
  //   body.appendChild(form);
  //   $("#addForm").append(form)    
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

  getId(event, id){
    if( event.keyCode === 13 ){
      console.log(id, this.enterUniqueId)
      this.checkIn(id)
    }
  }
  checkIn(id){console.log(this.enterUniqueId)
    if( id.trim().length === 0 ){
      this.toastr.warning(this.translate.instant("check_in.uniqueIdError"));
    }else{
      this.enterUniqueId = '';
      let reqBody = { "QRCodeUniqueId":id }
      let urls = this.url.split('/');
      console.log(urls[urls.length - 1])
      if( urls[urls.length - 1] == "checkIn" ){
      this.cardService.checkIn(reqBody).subscribe(
        (resp) => {console.log(resp)
          if (resp.statusCode === 200 && resp.errors === null) {
            this.raiseFlagHide = resp.data.isExpired;
            this.passValTrue = true;
            this.passData = resp.data;
            this.displayId=resp.data.entryLogDisplayId
            this.userPhoto = this.fileUploadService.getS3File(s3ParseUrl(this.passData.photoURL).key);
            if(resp.data.isExpired ){
              
            }else{
              this.toastr.success(
                resp.message,
                this.translate.instant("pop_up_messages.success")
              );
            }
           
          }
        },
        (error) => {
          this.passValTrue = false;
          if (error && error.error && "errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(
                element.errorMessages[0],
                this.translate.instant("pop_up_messages.error")
              );
            });
          } else {
            this.toastr.error(
              error.error.Message,
              this.translate.instant("pop_up_messages.error")
            );
          }
        }
      );
      }else{
        this.cardService.checkOut(reqBody).subscribe(
          (resp) => {console.log(resp)
            if (resp.statusCode === 200 && resp.errors === null) {
              this.passValTrue = true;
              this.passData = resp.data;
               this.displayId=resp.data.entryLogDisplayId
              this.userPhoto = this.fileUploadService.getS3File(s3ParseUrl(this.passData.photoURL).key);
              this.toastr.success(
                resp.message,
                this.translate.instant("pop_up_messages.success")
              );
            }
          },
          (error) => {
            this.passValTrue = false;
            if (error && error.error && "errors" in error.error) {
              error.error.errors.forEach((element) => {
                this.toastr.error(
                  element.errorMessages[0],
                  this.translate.instant("pop_up_messages.error")
                );
              });
            } else {
              this.toastr.error(
                error.error.Message,
                this.translate.instant("pop_up_messages.error")
              );
            }
          }
        );
      }
    }
    console.log(id)
  }
  raiseFlag() {
    console.log("raise flag");
    let reqBody = {
       "displayId":this.displayId
    }
    console.log(reqBody)
    this.cardService.raiseFlag(reqBody).subscribe(
          (resp) => {console.log(resp)
            if (resp.statusCode === 200 && resp.errors === null) {
              this.toastr.success(
                resp.message,
                this.translate.instant("pop_up_messages.success")
              );
            }
          },
          (error) => {
            if (error && error.error && "errors" in error.error) {
              error.error.errors.forEach((element) => {
                this.toastr.error(
                  element.errorMessages[0],
                  this.translate.instant("pop_up_messages.error")
                );
              });
            } else {
              this.toastr.error(
                error.error.Message,
                this.translate.instant("pop_up_messages.error")
              );
            }
          }
        );
}
}
