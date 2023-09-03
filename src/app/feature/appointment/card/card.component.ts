import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnInit,
  TemplateRef,
  //OnChanges,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { RescheduleModalComponent } from "../reschedule-modal/reschedule-modal.component";
import { ShowVisitorsDetailsComponent } from "../show-visitors-details/show-visitors-details.component";
import { CheckoutModalComponent } from "../checkout-modal/checkout-modal.component";
import { CheckinModalComponent } from "../checkin-modal/checkin-modal.component";
import { CancelAppointmentComponent } from "../cancel-appointment/cancel-appointment.component";
import { RejectComponent } from "../reject/reject.component";
import { AppointmentScheduleDetails, GetAppointmentRequest } from "../models/appointment-schedule";
import { AppointmentService } from "../services/appointment.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { first } from "rxjs/operators";
import { UserService } from "../../../core/services/user.service";
import {
  LevelAdmins,
  Level2Roles,
  AppointmentsStatus,
  Level3Roles,
  Level1Roles,
  defaultVal,
  ProductTypes
} from "../../../core/models/app-common-enum";
import { TimeInOutComponent } from "../time-in-out/time-in-out.component";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { environment } from "src/environments/environment";
import { DrivingLicenceComponent } from "../driving-licence/driving-licence.component";
import { DomSanitizer } from "@angular/platform-browser";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import s3ParseUrl from 's3-url-parser';
import { PDFDocumentProxy } from "ng2-pdf-viewer";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit ,OnChanges{
  @Input() sendNDAs: number;
  @Input() visitorSettings;
  @Input() isAccessControlEnabled;
  @Input() activateDLScanScheduledAppointment;
  @Input() appointmentScheduleDetails: AppointmentScheduleDetails;
  @Input() getAppointmentRequest: GetAppointmentRequest;
  @Output() updateView = new EventEmitter();
  @Output() ShowMoreInCard = new EventEmitter();
  appointmentStatus = AppointmentsStatus;
  loginUserId: number;
  isL1Admin: boolean;
  isL2Admin: boolean;
  isL3Admin: boolean;
  isReception: boolean;
  isEmployee: boolean;
  isl3frontDesk: boolean;
  l1SecurityGuard: boolean;
  l1SecurityHead: boolean;
  l2SecurityGuard: boolean;
  l2SecurityHead: boolean;

  selectedthumbnail: string;
  timeFormat: any = 24;
  permissionKeyObj = permissionKeys;

  typeToDelete: string
  searchKey: string = "";
  sortingColumn: string = "";
  toggleActive: boolean = true;
  sortingDir: string = '';
  public pageIndex: number = 1;
  public pageSizeOptions = [];
  public pageSize: number = 20;
  isShowMore:boolean = false;
  showDl: boolean;

  ProductType = ProductTypes;
  productType: string;
  role:any;
  printPassDocu: any;
  userDetails: any;
  loginLocationName: any;

  cardDataForPrintBadge = undefined;
  dataOne:any = undefined;
  dataTwo:any = undefined;
  dataThree:any = undefined;

  constructor(
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
    public dialog: MatDialog,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private userService: UserService) {
      this.productType = this.userService.getProductType();
   
  }
  ngOnChanges(changes: SimpleChanges): void { 
    console.log(changes,'changes') 
    if( changes?.appointmentScheduleDetails?.currentValue ){
      this.appointmentScheduleDetails.data.list = changes?.appointmentScheduleDetails?.currentValue['data']?.list;
    }
    this.pageIndex = 1;
  }

  showMore() {
    if (this.appointmentScheduleDetails.data.pageCount > this.pageIndex) {
      this.pageIndex = this.pageIndex + 1;
      this.getAppointmentRequest.pageIndex = this.pageIndex;
      this.ShowMoreInCard.emit(this.getAppointmentRequest)
    }
  }


  ngOnInit(): void {
    console.log(this.appointmentScheduleDetails)
    this.appointmentScheduleDetails.data.list.forEach((element) => {
      if (element['type'] === 'WALKIN')
        this.handleIamge(element);
    })

    this.rolesCheck(this.userService.getUserData().role.shortName);
    this.loginUserId = this.userService.getUserData().employeeId;
    this.role = this.userService.getUserData();
    this.userDetails = this.userService.getUserData()
    console.log(this.userDetails);
    this.userDetails?.level2List.map(element => {
      if (element.isDefault) {
       this.loginLocationName = element.name;
     }
    })
  
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
   
    if( formatedDate.toDateString() == newDate.toDateString() ){
      return true;
    }else{
      return false;
    }
  }
 

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

  showCard(appointmentCard) { }

  isDisplayHostInfo() {
    // return (this.permissions.find(element => {
    //   return element.PermissionKey == "showHostInformation";
    // })?.IsPermissible)
    return true;
  }

  isDisplayVisitorInfo() {
    // return this.permissions.find(element => {
    //   return element.PermissionKey == 'visitorInformationAccess';
    // })?.IsPermissible
  }

  convertTime12to24(time12h: any) {
    const [time, modifier] = time12h.split(" ");

    let [hours, minutes] = time.split(":");

    if (hours === "12") {
      hours = "00";
    }

    if (modifier != undefined && modifier.toLowerCase() === "pm") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  convertTime24to12(time: any) {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }

  convertTime(time: any) {
    if (this.timeFormat == 12) {
      if (time.indexOf("AM") !== -1 || time.indexOf("PM") !== -1) {
        return time;
      }
      return this.convertTime24to12(time);
    } else {
      if (time.indexOf("AM") !== -1 || time.indexOf("PM") !== -1) {
        return this.convertTime12to24(time);
      } else {
        return time;
      }
    }
  }

  hasPrintPermission(status: any) {
    // return (this.permissions.find(element => {
    //   return element.PermissionKey == 'rePrintBadge';
    // })?.IsPermissible && status == "InProgress");
    return true;
  }

  openZoomPhotoModal(thumbnailUrl: string, dialog: TemplateRef<any>) {
    // if (this.hasPermission("enlargedPhoto")) {
    //   this.selectedthumbnail = thumbnailUrl;
    //   this.dialogService.open(
    //     dialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
    // }
  }

  getCardActions(action: any, hostId: any, appointmentDateUtc: any) {
    var returnValue: any[] = [
      { cardAction: "Check-In", iconUrl: "" },
      { cardAction: "Re-schedule", iconUrl: "" },
    ];
   

    return returnValue;
  }

  performAction(
    actionId: any,
    appointmentId: any,
    firstname: string,
    lastname: string,
    visitorId: any,
    notificationType: number
  ) {
   
  }

  menuMouseAction(
    event: MouseEvent,
    isOver: any,
    appointmentId: any,
    firstname: string,
    lastname: string,
    visitorId: any
  ): void {
    event.stopPropagation();
    var target = event.target as Element;
    if (!isOver) {
      if (target.querySelector("ul") != null) {
        target.querySelector("ul")!.style.display = "none";
      }
    } else {
      if (target.querySelector("ul") != null) {
        target.querySelector("ul")!.style.display = "block";
      }
    }
  }

  openVisitorsDetailsDialog(appointmentCardData) {
    if (environment.Permissions && environment.Permissions[this.permissionKeyObj["VISITORDETAILVIEW"]]) {
      const dialogRef = this.dialog.open(ShowVisitorsDetailsComponent, {
        height: "100%",
        position: { right: "0" },
        data: { appointmentCardData: appointmentCardData },
        panelClass: [
          "animate__animated",
          "vams-dialog",
          "animate__slideInRight",
        ],
      });
      dialogRef
        .afterClosed()
        .pipe(first())
        .subscribe((result) => {
          this.dialogClosed(result);
        });
    }
  }

  showPrintBadge(printbadgeDialog: TemplateRef<any>, visitorId: number) {
   
  }

  getAction(event: any, appointmentData: any) {
    if (event.value == "checkIn") {
      this.checkIn(appointmentData);
    }
    if (event.value == "checkOut") {
      this.checkOut(appointmentData);
    }
    if (event.value == "reschedule") {
      this.reschedule(appointmentData);
    }
    if (event.value == "cancel") {
      this.cancel(appointmentData);
    }
    if (event.value == "timeIn" || event.value == "timeOut") {
      this.timeInTimeOut(appointmentData, event.value);
    }
  }

  checkIn(appointmentData) {
    this.dialog.open(CheckinModalComponent, {
      width: "40%",
      height: "100%",
      position: { right: "0" },
      data: {
        startFromSlide: 2,
        appointmentData: appointmentData,
      },
      panelClass: ["animate__animated", "animate__slideInRight"],
    });
  }

  checkOut(appointmentData) {
    const dialogRef = this.dialog.open(CheckoutModalComponent, {
      height: "100%",
      position: { right: "0" },
      data: {
        startFromSlide: 2,
        appointmentData: appointmentData,
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.dialogClosed(result);
    });
  }
  private pdf: PDFDocumentProxy;
  onLoaded(pdf: PDFDocumentProxy) { 
    this.pdf = pdf;
    //this.isPdfLoaded = true;
  }
  print(htmlData = null) {
    if(htmlData == null){
    this.pdf.getData().then((u8) => {
        let blob = new Blob([u8.buffer], {
            type: 'application/pdf'
        });

        const blobUrl = window.URL.createObjectURL((blob));
        // console.log(u8)
        // console.log(blobUrl)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = blobUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow.print();

        // var iframe = document.getElementById('iframeId');
        // iframe.setAttribute('src', blobUrl);  
        // iframe.setAttribute('style', 'margin:0;padding:0;width:265px;height:210px;');
        //document.body.appendChild(iframe);
        //iframe.contentWindow.focus();
        //iframe.contentWindow.print();
        //iframe.contentWindow.print();
    });
    }else{console.log(htmlData)
      //let html = eval(htmlData);
      //console.log(html);
      // const iframe = document.createElement('iframe');
      //   iframe.style.display = 'none';
        //iframe.innerHTML = html;
        //var newWin = window.frames["iframeId"];
            //newWin.document.write(htmlData);
//newWin.document.close();

// var docs = new DOMParser().parseFromString(htmlData, "text/xml");
// console.log(docs);


var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
iframe.contentWindow.document.open();
iframe.contentWindow.document.write(htmlData);
iframe.contentWindow.document.close();

// window.frames["printf"].focus();
// window.frames["printf"].print();



//var mywindow = window.open('', '', '');
				//mywindow.document.write('<html><title>Print</title><style>* {margin: 0; padding:0;}</style><body style="margin:0;padding:0;">');
				//mywindow.document.write(htmlData);
                //mywindow.document.write('</body></html>');
				//mywindow.document.close();
        
        setTimeout(() => {
          iframe.contentWindow.print();
          //iframe.contentWindow.document.close();
          iframe.contentWindow.close();
          $("body > iframe:last-child").remove()
          //mywindow.print();
          //mywindow.window.close();
        }, 0);
				

// return;
// const doc = new jsPDF({
//   orientation: "landscape",
//   unit: "in",
//   format: [4, 2]
// });
// doc.autoPrint()
// var hiddFrame = document.createElement('iframe');
// hiddFrame.style.position = 'fixed';
// hiddFrame.style.width = '1px';
// hiddFrame.style.height = '1px';
// hiddFrame.style.opacity = '0.01';
// debugger;
// const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
// if (isSafari) {
//   hiddFrame.onload = () => {
//     try {
//       hiddFrame.contentWindow.document.execCommand('print', false, null);
//     } catch (e) {
//       hiddFrame.contentWindow.print();
//     }
//   };
// }
// hiddFrame.setAttribute("src", doc.output('bloburl').toString());        
// document.body.appendChild(hiddFrame);
// hiddFrame.contentWindow.print();


    }
  }
  // print2(htmlData) {
  //   let printContents, popupWin;
  //   popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
  //   popupWin.document.open();
  //   popupWin.document.write(`${htmlData}
  //     `);
  //   popupWin.document.close();
  // }
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
  
  // printPdfCall(data){
  //   let blobUrl = this.arrayBufferToBase64(data);
  //   var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
  //           'resizable,screenX=50,screenY=50,width=850,height=1050';
  //   var htmlPop = '<embed width=100% height=100%'
  //                        + ' type="application/pdf"'
  //                        + ' src="data:application/pdf;base64,'
  //                        + this.arrayBufferToBase64(data)
  //                        + '#zoom=60'
  //                        + '"></embed>'; 
         
  //       var printWindow = window.open("", "PDF", winparams);
  //      
  //       printWindow.document.write(htmlPop);
  //       printWindow.document.close();
  //       setTimeout(() => {       
  //         printWindow.print();          
  //       }, 1000);        
  // }
  // arrayBufferToBase64( buffer ) {
  //   var binary = '';
  //   var bytes = new Uint8Array( buffer );
  //   var len = bytes.byteLength;
  //   for (var i = 0; i < len; i++) {
  //   binary += String.fromCharCode( bytes[ i ] );
  //   }
  //   return window.btoa( binary );
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

  openPrint(id1,id2,id3){
    if( $("#"+id1).val() != '' && $("#"+id2).val() != '' && $("#"+id3).val() != '' ){
      this.dataOne = $("#"+id1).val();
      this.dataTwo = $("#"+id2).val();
      this.dataThree = $("#"+id3).val();
      
      this.dataOne = parseFloat(this.dataOne);
      this.dataTwo = parseInt(this.dataTwo);
      this.dataThree = parseInt(this.dataThree);
      this.printVisitorInfo(this.cardDataForPrintBadge);
      $("#errorOnSHow").hide()
      $("#printPDFPopup").toggleClass('active');
    }else{
      $("#errorOnSHow").show()
    }
  }
  openPrintDialog(appointmentID, event){
    event.stopPropagation();
    //this.printVisitorInfo(appointmentID);
    $("#printPDFPopup").toggleClass('active');
    this.cardDataForPrintBadge = appointmentID;
  }

  printVisitorInfo(appointmentID, event = null){
    if( event != null ){
      event.stopPropagation();
    }
    //if(this.visitorSettings.isPrintPass == true && this.productType == this.ProductType.Enterprise || this.productType == this.ProductType.Hospital){
    if( this.visitorSettings.isPrintPass == true ){
      let data: any;
      ( this.dataOne == undefined ) ? 1 : this.dataOne;
      ( this.dataTwo == undefined ) ? 0 : this.dataTwo;
      ( this.dataThree == undefined ) ? 0 : this.dataThree;
      if( this.productType == this.ProductType.Commercial ){
        data = {"appointmentId": appointmentID,
          "printerType": "dymo",
          "pdfPageSize": 10,
          "webPageHeight": 110,
          "webPageWidth": 148,
          "marginTop": 10,
          "marginRight": 10,
          // "marginBottom": 10,
          "marginLeft":10
      };
      }else{
        data = {"appointmentId": appointmentID,
      "printerType": "brother",
      "pdfPageSize": 10,
      "webPageHeight": 100,
      "webPageWidth": 148};
      }
      
      this.appointmentService.getPrintPassDocument(data).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
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

  drivingLicenceDialog(appointmentData) {
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
    // else if( this.productType == this.ProductType.Enterprise ){

    // }
    const dialogRef = this.dialog.open(DrivingLicenceComponent, {
      height: "100%",
      position: { right: "0" },
      data: {
        productType: this.productType,
        showDl:this.showDl,
        slide : slide,
        appointmentData: appointmentData,
        isAccessControlEnabled:this.isAccessControlEnabled,
        sendNDAs:this.sendNDAs,
        visitorSettings:this.visitorSettings,
        activateDLScanScheduledAppointment:this.activateDLScanScheduledAppointment
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

  cancel(appointmentData) {
    const dialogRef = this.dialog.open(CancelAppointmentComponent, {
      height: "100%",
      position: { right: "0" },
      data: appointmentData,
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
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
        this.updateView.emit();
      }
    }
  }

  timeIn(appointmentData) {
  }

  timeOut(appointmentData) {
  }

  reschedule(appointmentData) {
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

  rejectAppointment() {
    this.dialog.open(RejectComponent, {
      width: "40%",
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", "animate__slideInRight"],
    });
  }

  timeInTimeOut(appointmentData, type) {
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

  contactAction(type: string, content: any, event: Event) {
    event.stopPropagation();
    if (type == 'email') {
      window.location.href = "mailto:" + content
    }
    else {
      window.location.href = "tel:" + content
    }
  }

  async getValidImage(appointment) {
    try {
      let parserContent = s3ParseUrl(appointment['visitorPhotoUrl']);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      appointment['visitorPhotoUrl'] = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch (e) {
      appointment['visitorPhotoUrl'] = "assets/images/profile-pic.png";
    }
    return appointment['visitorPhotoUrl'];
  }

  async handleIamge(appointment) {
    try {
      let parserContent = s3ParseUrl(appointment['visitorPhotoUrl']);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      appointment['visitorPhotoUrl'] = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch (e) {
      appointment['visitorPhotoUrl'] = "assets/images/profile-pic.png";
    }
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  getStatus(appointment){
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
        // if((appointment.isHSQForIdProof && !appointment.isIdProofExists) && appointment.status == this.appointmentStatus.scheduled && appointment.type == this.appointmentStatus.scheduled){
        //   return true
        // }
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

  getStatusN(date){

    
    const todays = new Date();
const yyyy = todays.getFullYear();
var mm = (todays.getMonth() + 1); 
var dd = todays.getDate();

let dds;
let mms;
if (dd < 10){
  dds = '0' + dd;
}else{
  dds = dd;
}
if (mm < 10){
  mms = '0' + mm;
}else{
  mms = mm;
}

const formattedToday = dds + '-' + mms + '-' + yyyy;
  
    if (date === formattedToday) { 
      return true;
    }else{ 
      return false    
    }
  }

  getStatusWalking(appointment){
    if(appointment.status == 'AWAITINGAPPROVAL' && appointment.type == 'WALKIN'){
      return true;
    }
    else if(appointment.status == 'APPROVED' && appointment.type == 'WALKIN'){
      return true
    }
    return false;
  }

  approveWalkingAppointment(appointmentData){
    this.appointmentService.approveWalkin(appointmentData?.id, appointmentData?.employeeId).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        this.appointmentService.getAllScheduleAppointment(this.getAppointmentRequest).subscribe((respn) => {
          this.appointmentScheduleDetails = respn; 
        })
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }

  approveCheckIn(appointmentData){
    this.appointmentService.approveCheckin(appointmentData?.id, appointmentData?.employeeId).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        this.appointmentService.getAllScheduleAppointment(this.getAppointmentRequest).subscribe((respn) => {
          this.appointmentScheduleDetails = respn; 
        });
        this.printVisitorInfo(appointmentData?.id);
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })
  }
}
