import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { pagination, defaultVal, ProductTypes } from '../../../core/models/app-common-enum';
import { GetAppointmentRequest } from '../models/appointment-schedule';
import { CheckinModalComponent } from '../checkin-modal/checkin-modal.component';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { CancelAppointmentComponent } from '../cancel-appointment/cancel-appointment.component';
import { RescheduleModalComponent } from '../reschedule-modal/reschedule-modal.component';
import { first } from 'rxjs/operators';
import { ShowVisitorsDetailsComponent } from '../show-visitors-details/show-visitors-details.component';
import { LevelAdmins, Level2Roles, AppointmentsStatus, Level3Roles, Level1Roles } from '../../../core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { TimeInOutComponent } from '../time-in-out/time-in-out.component';
import { RejectComponent } from '../reject/reject.component';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { environment } from 'src/environments/environment';
import { DrivingLicenceComponent } from '../driving-licence/driving-licence.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../services/appointment.service';
import { TranslateService } from '@ngx-translate/core';
import { ShareAppointmentComponent } from '../share-appointment/share-appointment.component';
import s3ParseUrl from 's3-url-parser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  @Output() updateView = new EventEmitter();
  public pageSizeOptions = [];
  public pageSize: number;
  public pageIndex: 1;
  @Input() displayedColumns: any;
  @Input() dataSource: any;
  @Output() valueChange = new EventEmitter();
  @Input() type: any;
  @Input() getAppointmentRequest: GetAppointmentRequest;
  @Input() appointmentScheduleDetails: any
  @Input() mainObj;
  typeToDelete: string
  searchKey: string = "";
  sortingColumn: string = "";
  toggleActive: boolean = true;
  public hasSearchValue: boolean = false;
  sortingDir: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Input() activateDLScanScheduledAppointment:any;

  showListFlag: boolean = false;
  rowData: any;
  columns: any;
  tempType: string;
  mode: any;
  dataToDisplay: any[] = [];
  anchorTagColumn: any[] = ['action'];
  specialColumn: any[] = ['hostFirstName', 'visitorFirstName'];
  originalData: any;
  @Input() totalData: any;
  loginUserId: number;
  isL1Admin: boolean;
  isL2Admin: boolean;
  isL3Admin: boolean;
  isReception: boolean;
  isEmployee: boolean;
  isl3frontDesk: boolean;
  appointmentStatus = AppointmentsStatus;
  l1SecurityGuard: boolean;
  l1SecurityHead: boolean;
  l2SecurityGuard: boolean;
  l2SecurityHead: boolean;
  permissionKeyObj = permissionKeys;
  isSignleCheckOutAllowd:boolean = false;
  @Input() isAccessControlEnabled;
  showDl: boolean;

  ProductType = ProductTypes;
  productType: string;
  @Input() sendNDAs: number;
  @Input() visitorSettings;
  printPassDocu: any;
  dateSeperation = '-';


  constructor(private router: Router, public dialog: MatDialog, private userService: UserService,
    private toastr: ToastrService,
    private appointmentService: AppointmentService,
    private fileUploadService: FileUploadService,
    private translate: TranslateService,) {
      this.productType = this.userService.getProductType();
      this.dataSource = new MatTableDataSource(this.dataToDisplay);
    }
  ngOnChanges(changes: SimpleChanges): void { console.log(changes)
    this.displayedColumns = this.mainObj['displayedColumns'];
    this.dataSource = this.mainObj['dataSource'];
    this.totalData = this.mainObj['totalData'];
    if (this.displayedColumns) {
      this.columns = this.displayedColumns.map(data => data.key);
    }
    this.showListFlag = false;
    this.originalData = this.dataSource;
    this.dataSource = new MatTableDataSource(this.dataSource);
    this.isSignleCheckOutAllowd = this.getAppointmentRequest.status[0] === 'INCHECKOUT'? true:false;
  }

  ngOnInit(): void { console.log(this.mainObj);
    //this.dateSeperation = this.visitorSettings.dateFormat.split('-');
    this.displayedColumns = this.mainObj['displayedColumns'];
    this.dataSource = this.mainObj['dataSource'];
    this.totalData = this.mainObj['totalData'];
    this.rolesCheck(this.userService.getUserData().role.shortName);
    this.loginUserId = this.userService.getUserData().employeeId;

    this.pageSizeOptions = Object.keys(pagination)
      .filter(k => typeof pagination[k] === 'number')
      .map(label => pagination[label])
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = 'asc';
    this.sortingColumn = this.displayedColumns && this.displayedColumns[0] && this.displayedColumns[0].key ? this.displayedColumns[0].key : "Name";
    //this.stringToDate(this.appointment.date, this.visitorSettings.dateFormat, this.dateSeperation)
    //console.log(this.dateSeperation)
    // for(let a = 0; a < this.dataSource.length; a++){
    //   this.stringToDate(this.dataSource[a].date, this.visitorSettings.dateFormat, '-')
    // }
    //console.log(this.dataSource)
  }

  stringToDate(_date,_format,_delimiter){
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            var newDate = new Date();
            //return formatedDate;
            // console.log(formatedDate.toDateString())
            // console.log(newDate.toDateString())
            if( formatedDate.toDateString() == newDate.toDateString() ){
              return true;
            }else{
              return false;
            }
}

  // rolesCheck(role) {
  //   switch (role) {
  //     case LevelAdmins.Level1Admin:
  //       this.isL1Admin = true;
  //       break;
  //     case LevelAdmins.Level2Admin:
  //       this.isL2Admin = true;
  //       break;
  //     case LevelAdmins.Level3Admin:
  //       this.isL3Admin = true;
  //       break;
  //     case Level2Roles.l2Reception:
  //       this.isReception = true;
  //       break;
  //     case Level1Roles.l1Reception:
  //       this.isReception = true;
  //       break;
  //     case Level3Roles.l3Reception:
  //       this.isl3frontDesk = true;
  //       break;
  //     case Level3Roles.l3Host:
  //       this.isEmployee = true;
  //       break;
  //     case Level2Roles.l2Host:
  //       this.isEmployee = true;
  //       break;
  //     case Level1Roles.l1Host:
  //       this.isEmployee = true;
  //       break;
  //     case Level1Roles.l1Security:
  //       this.l1SecurityGuard = true;
  //       break;
  //     case Level1Roles.l1SecurityHead:
  //       this.l1SecurityHead = true;
  //       break;
  //     case Level2Roles.l2Security:
  //       this.l2SecurityGuard = true;
  //       break;
  //     case Level2Roles.l2SecurityHead:
  //       this.l2SecurityHead = true;
  //       break;
  //   }
  // }

  rolesCheck(role) {
    switch (role) {
      case LevelAdmins.Level1Admin:
        this.isL1Admin = true;
        break;
      case LevelAdmins.Level2Admin:
        this.isL2Admin = true;
        break;
      case LevelAdmins.Level3Admin:
        this.isL3Admin = true;
        break;
      case Level2Roles.l2Reception:
        this.isReception = true;
        break;
      case Level1Roles.l1Reception:
        this.isReception = true;
        break;
      case Level3Roles.l3Reception:
        this.isl3frontDesk = true;
        break;
      case Level3Roles.l3Host:
        this.isEmployee = true;
        break;
      case Level2Roles.l2Host:
        this.isEmployee = true;
        break;
      case Level1Roles.l1Host:
        this.isEmployee = true;
        break;
      case Level1Roles.l1Security:
        this.l1SecurityGuard = true;
        break;
      case Level1Roles.l1SecurityHead:
        this.l1SecurityHead = true;
        break;
      case Level2Roles.l2Security:
        this.l2SecurityGuard = true;
        break;
      case Level2Roles.l2SecurityHead:
        this.l2SecurityHead = true;
        break;
    }
  }

  ngAfterViewInit() {
    this.sortPagination();
  }

  ngAfterViewChecked(): void {
    if (this.table) {
      this.table.updateStickyColumnStyles();
    }
  }

  isSticky(column: string) {
    return column === 'action' ? true : false;
  }

  getPaginationData(event) {
    this.pageIndex = (this.pageSize == event.pageSize) ? event.pageIndex + 1 : defaultVal.pageIndex;
    if (this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.appointmentRequestObject();
    this.onDataChange.emit(this.getAppointmentRequest)
    this.sortPagination();
  }

  searchFilter() {
    // this.pageSize = defaultVal.pageSize;
    this.pageIndex = defaultVal.pageIndex;
    this.appointmentRequestObject();
    this.onDataChange.emit(this.getAppointmentRequest)
    this.paginator.firstPage();
    this.sortPagination();
  }

  sortData(name) {
    this.sortingDir = name.direction;//this.sortingDir == 'asc' ? 'desc' : 'asc'
    // this.sort.sort(({ id: '', start: '', }) as MatSortable);
    this.sortingColumn = name.active;
    this.appointmentRequestObject();
    this.onDataChange.emit(this.getAppointmentRequest);
    this.paginator.firstPage();
    // this.sortPagination();
  }

  sortPagination() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  getRowData(data: any, appointmentCardData: any) {
    if(environment.Permissions[this.permissionKeyObj["VISITORDETAILVIEW"]]) {
      this.rowData = data;
      this.mode = "show";
      this.dialog.open(ShowVisitorsDetailsComponent, {
        height: '100%',
        position: { right: '0' },
        data: { "appointmentCardData": appointmentCardData },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });
    }
  }

  appointmentRequestObject() {
    this.getAppointmentRequest.pageIndex = this.pageIndex;
    this.getAppointmentRequest.pageSize = this.pageSize;
    this.getAppointmentRequest.orderBy = this.sortingColumn;
    this.getAppointmentRequest.orderDirection = this.sortingDir;
    this.getAppointmentRequest.globalSearch = this.searchKey;
  }

  applyFilter(filterValue) {
    if (this.hasSearchValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.searchFilter()
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cleanSearchBox(event) {
    const filterValue = event.value = "";
    this.applyFilter(filterValue);
  }

  check(rowValue: string) {
    if (this.anchorTagColumn.includes(rowValue)) {
      return true;
    }
    else {
      return false;
    }
  }

  checkIn(appointmentData, event: Event) {
    event.stopPropagation();
    this.dialog.open(CheckinModalComponent, {
      width: '40%',
      height: '100%',
      position: { right: '0' },
      data: {
        startFromSlide: 2,
        appointmentData: appointmentData
      },
      panelClass: ['animate__animated', 'animate__slideInRight']
    });
  }

  checkOut(appointmentData, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(CheckoutModalComponent, {
      height: '100%',
      position: { right: '0' },
      data: {
        startFromSlide: 2,
        appointmentData: appointmentData
      },
      panelClass: ['animate__animated', "vams-dialog", 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.dialogClosed(result);
    });
  }

  cancel(appointmentData, event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(CancelAppointmentComponent, {
      height: "100%",
      position: { right: "0" },
      data: appointmentData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.dialogClosed(result);
    });
  }

  // reschedule(){
  //   this.dialog.open(RescheduleModalComponent, {
  //     width: '40%',
  //     height: '100%',
  //     position: { right: '0' },
  //     data: { },
  //     panelClass: ['animate__animated', 'animate__slideInRight']
  //   });
  // }

  // dialogClosed(statusObj) {
  //   this.onDataChange.emit(this.getAppointmentRequest);
  // }

  // reschedule(appointmentData, event: Event) {
  //   event.stopPropagation();
  //   const dialogRef = this.dialog.open(RescheduleModalComponent, {
  //     height: '100%',
  //     position: { right: '0' },
  //     data: { appointmentData: appointmentData },
  //     panelClass: ['animate__animated', "vams-dialog", 'animate__slideInRight']
  //   });

  //   dialogRef.afterClosed().pipe(first()).subscribe(result => {
  //     this.dialogClosed(result);
  //   });
  // }

  // drivingLicenceDialog(appointmentData,  event: Event) {
  //   event.stopPropagation();
  //   const dialogRef = this.dialog.open(DrivingLicenceComponent, {
  //     height: "100%",
  //     position: { right: "0" },
  //     data: {
  //       appointmentData: appointmentData,
  //     },
  //     panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
  //   });

  //   dialogRef.afterClosed().pipe(first()).subscribe((result) => {
  //     this.dialogClosed(result);
  //   });
  // }

  reschedule(appointmentData , event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(RescheduleModalComponent, {
      height: "100%",
      position: { right: "0" },
      data: { appointmentData: appointmentData },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }

  // drivingLicenceDialog(appointmentData,event) {
  //   event.stopPropagation();
  //   const dialogRef = this.dialog.open(DrivingLicenceComponent, {
  //     height: "100%",
  //     position: { right: "0" },
  //     data: {
  //       appointmentData: appointmentData,
  //     },
  //     panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
  //   });

  //   dialogRef.afterClosed().pipe(first()).subscribe((result) => {
  //     this.dialogClosed(result);
  //   });
  // }

  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }
  private pdf: PDFDocumentProxy;
  onLoaded(pdf: PDFDocumentProxy) { 
    this.pdf = pdf;
    //this.isPdfLoaded = true;
  }
  // print(): void {
  //   this.pdf.getData().then((u8) => {
  //       let blob = new Blob([u8.buffer], {
  //           type: 'application/pdf'
  //       });

  //       const blobUrl = window.URL.createObjectURL((blob));
  //       const iframe = document.createElement('iframe');
  //       iframe.style.display = 'none';
  //       iframe.src = blobUrl;
  //       document.body.appendChild(iframe);
  //       iframe.contentWindow.print();
  //   });
  // }
  print(htmlData = null) {
    if(htmlData == null){
    this.pdf.getData().then((u8) => {
        let blob = new Blob([u8.buffer], {
            type: 'application/pdf'
        });
        const blobUrl = window.URL.createObjectURL((blob));
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();
    });
    }else{console.log(htmlData)
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
iframe.contentWindow.document.open();
iframe.contentWindow.document.write(htmlData);
iframe.contentWindow.document.close();
        setTimeout(() => {
          iframe.contentWindow.print();
          iframe.contentWindow.close();
          $("body > iframe:last-child").remove()
        }, 0);
    }
  }
  async getPdf_(url) {
    let parserContent = s3ParseUrl(url);
    let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.printPassDocu = this._base64ToArrayBuffer(this.encode(data?.Body));
   
    //this.onLoaded(this.printPassDocu)
    setTimeout(() => {       
      this.print()
    }, 1000);   
    //this.printPdfCall(this.printPassDocu)

    
   // this.print()
  }

  printVisitorInfo(appointmentID, event = null){
    if( event != null ){
      event.stopPropagation();
    }
    //if(this.visitorSettings.isPrintPass == true && this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
    if( this.visitorSettings.isPrintPass == true ){
      let data: any;
      if( this.productType == this.ProductType.Commercial ){
        data = {
          "appointmentId": appointmentID,
          // "printerType": "brother",
          // "pdfPageSize": 1,
          // "webPageHeight": 0,
          // "webPageWidth": 0};
          "printerType": "dymo",
          "pdfPageSize": 10,
          "webPageHeight": 110,
          "webPageWidth": 148,
          "marginTop": 10,
          "marginRight": 10,
          // "marginBottom": 10,
          "marginLeft":10
        }
      }else{
        data = {"appointmentId": appointmentID,
      "printerType": "brother",
      "pdfPageSize": 1,
      "webPageHeight": 0,
      "webPageWidth": 0};
      }
      
      this.appointmentService.getPrintPassDocument(data).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          //this.getPdf_(response.data);
          if(response?.data?.html != undefined){
            this.print(response?.data?.html)
          }else{
            this.getPdf_(response.data);
          }
       
    //       var blob = new Blob([response.data.blob()], {type: 'application/pdf'});
    // const blobUrl = URL.createObjectURL(blob);
    //   const iframe = document.createElement('iframe');
    //   iframe.style.display = 'none';
    //   iframe.src = blobUrl;
    //   document.body.appendChild(iframe);
    //   iframe.contentWindow.print();
          
        }
      }, (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message,this.translate.instant('pop_up_messages.error'));
        }
      });
    }
  }

  drivingLicenceDialog(appointmentData ,event) {
    event.stopPropagation();
    let slide = 1;
    if( this.productType == this.ProductType.Commercial ){
      if(this.activateDLScanScheduledAppointment && appointmentData.isBypass == null && (appointmentData.isHSQForIdProof && !appointmentData.isIdProofExists)){
        slide = 1;
        this.showDl = true;
      }
      else{
        slide = 2;
        this.showDl = false;
      }
    }

    const dialogRef = this.dialog.open(DrivingLicenceComponent, {
      height: "100%",
      //width:"70%",
      position: { right: "0" },
      data: {
        productType: this.productType,
        showDl:this.showDl,
        slide : slide,
        appointmentData: appointmentData,
        isAccessControlEnabled:this.isAccessControlEnabled,
        activateDLScanScheduledAppointment:this.activateDLScanScheduledAppointment,
        sendNDAs:this.sendNDAs,
        visitorSettings:this.visitorSettings
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      if(result == undefined){
        this.updateView.emit();
      }else{
        // print pass after check in from preschedule
        if( this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital ){
          this.printVisitorInfo(result.cardData.id);
        }
        // print pass after check in from preschedule
      }
      this.dialogClosed(result);
    });
  }

  rejectAppointment() {
    event.stopPropagation();
    this.dialog.open(RejectComponent, {
      width: '40%',
      height: '100%',
      position: { right: '0' },
      data: {},
      panelClass: ['animate__animated', 'animate__slideInRight']
    });

  }

  // timeInTimeOut(appointmentData, type, event: Event) {
  //   event.stopPropagation();
  //   const dialogRef = this.dialog.open(TimeInOutComponent, {
  //     width: '40%',
  //     height: '100%',
  //     position: { right: '0' },
  //     data: {
  //       appointmentData: appointmentData,
  //       type: type,
  //       startFromSlide: 2
  //     },
  //     panelClass: ['animate__animated', 'animate__slideInRight']
  //   });

  //   dialogRef.afterClosed().pipe(first()).subscribe(result => {
  //     this.dialogClosed(result);
  //   });
  // }

  timeInTimeOut(appointmentData, type, e:Event) { 
    e.stopPropagation()
    this.appointmentService.GetTimeInAndOutById(appointmentData.id, type).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        // const dialogRef = this.dialog.open(ShowVisitorsDetailsComponent, {
        //   height: "100%",
        //   position: { right: "0" },
        //   data: {
        //     appointmentData: appointmentData
        //   },
        //   panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
        // });
        //if (environment.Permissions && environment.Permissions[this.permissionKeyObj["VISITORDETAILVIEW"]]) {
        this.dialog.open(ShowVisitorsDetailsComponent, {
            height: "100%",
            position: { right: "0" },
            data: { appointmentCardData: appointmentData },
            panelClass: [
              "animate__animated",
              "vams-dialog",
              "animate__slideInRight",
            ],
          });
        //}
        // dialogRef
        //   .afterClosed()
        //   .pipe(first())
        //   .subscribe((result) => {
             this.dialogClosed(resp);
        //   });
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
    

    
  }

  dialogClosed(statusObj) {
    if (statusObj && statusObj?.statusCode) {
      if (statusObj.statusCode === 200 && statusObj.errors == null) {
        this.updateView.emit();
      }
    }
  }

  // getStatus(appointment){
  //   if(this.activateDLScanScheduledAppointment){
  //     if("isBypass" in appointment){
  //       if(appointment.isBypass == null){
  //         if(appointment.isHSQForIdProof && !appointment.isIdProofExists){
  //           return true
  //         }
  //         else{
  //           return false
  //         }
  //       }
  //       else{
  //         return false;
  //       }
  //     }
  //     else{
  //       if(appointment.isHSQForIdProof && !appointment.isIdProofExists){
  //         return true
  //       }
  //       else{
  //         return false
  //       }
  //     }
  //   }
  //   else{
  //     return false;
  //   }
  // }

  getStatus(appointment){
    //console.log(appointment)
    if(appointment.status == this.appointmentStatus.scheduled){
      if(this.activateDLScanScheduledAppointment && !this.isAccessControlEnabled){
        if("isBypass" in appointment){
          if(appointment.isBypass == null){
            if(appointment.isHSQForIdProof && !appointment.isIdProofExists){
              return true
            }
            else{
              if(!appointment.isHSQForIdProof && !appointment.isIdProofExists){
                return false
              }
              if(!this.isAccessControlEnabled && appointment.status == this.appointmentStatus.scheduled){
                return true
              }
              return false
            }
          }
          else{
            if(!this.isAccessControlEnabled && appointment.status == this.appointmentStatus.scheduled){
              return true
            }
            return false;
          }
        }
        else {
          if (appointment.isHSQForIdProof && !appointment.isIdProofExists) {
            return true
          }
          else {
            return false
          }
        }
      }
      else if(!this.isAccessControlEnabled && !this.activateDLScanScheduledAppointment){
        if(!appointment.isHSQForIdProof && !appointment.isIdProofExists){
          return false
        }
        if((appointment.isHSQForIdProof && !appointment.isIdProofExists) && appointment.status == this.appointmentStatus.scheduled){
          return true
        }
        return false
      } 
      else if(!this.activateDLScanScheduledAppointment && this.isAccessControlEnabled){
        return false
      }
      else if(this.activateDLScanScheduledAppointment && this.isAccessControlEnabled){
        if("isBypass" in appointment){
          if(appointment.isBypass == null){
            if(appointment.isHSQForIdProof && !appointment.isIdProofExists){
              return true
            }
            else{
              return false
            }
          }
          else{
            return false;
          }
        }
        else{
          if(appointment.isHSQForIdProof && !appointment.isIdProofExists){
            return true
          }
          else{
            return false
          }
        }
      }
      else if(this.isAccessControlEnabled){
        return true;
      }
    }
    else{
      return false
    }
    return true;
  }

  approveWalkingAppointment(appointmentData, event){
    event.stopPropagation();
    this.appointmentService.approveWalkin(appointmentData?.id, appointmentData?.employeeId).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        // this.appointmentService.getAllScheduleAppointment(this.getAppointmentRequest).subscribe((respn) => {
        //   this.appointmentScheduleDetails = respn; 
        // })
        this.updateView.emit();
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }
  approveCheckIn(appointmentData, event){
    event.stopPropagation();
    this.appointmentService.approveCheckin(appointmentData?.id, appointmentData?.employeeId).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        // this.appointmentService.getAllScheduleAppointment(this.getAppointmentRequest).subscribe((respn) => {
        //   this.appointmentScheduleDetails = respn; 
        // });
        this.updateView.emit();
        this.printVisitorInfo(appointmentData?.id);
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }

}

