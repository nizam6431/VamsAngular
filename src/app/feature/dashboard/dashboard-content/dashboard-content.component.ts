import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { first } from "rxjs/operators";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { DatePickerDirective } from "ng2-date-picker";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { AccountService } from "src/app/core/services/account.service";
import {
  calcTime,
  calcUTCTimeForSpecificDate,
  convertTime12to24,
  convertTime24to12,
  getUTCDate,
  PrintPDF,
} from "src/app/core/functions/functions";
import { TranslateService } from "@ngx-translate/core";
import { formatDate } from "@angular/common";
import { ErrorsService } from "src/app/core/handlers/errorHandler";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "src/app/core/services/common.service";
// import { SignalRService } from "src/app/core/services/signalr.service";

@Component({
  selector: "app-dashboard-content",
  templateUrl: "./dashboard-content.component.html",
  styleUrls: ["./dashboard-content.component.scss"],
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  pageIndex = 2;
  pageSize = 10;
  selectedNotificationType: number;
  @Input() selectedDate: any = new Date();
  @Input() searchTexts: string = "";
  @Input() status: string = "All";
  @Input() locationId: number = 0;
  @Input() isAllChecked: boolean = true;
  appointments: any[] = [];
  permissions: any[] = [];
  minDate: string = "";

  selectedVisitorName: string = "";
  selectedVisitorId: number = 0;
  selectedAppointmentId: number = 0;
  dateFormat: any; //= JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  upperCaseDateFormat: string;
  timeFormat: any; //= JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeFormat;
  timeZone: string = ""; //= JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
  printerType: string; //= JSON.parse(localStorage.getItem("defaultValuesForLocation")!).PrinterType;
  timeZoneOffset: number;
  datePickerConfig: any = null;
  locations: any[]; //= JSON.parse(localStorage.getItem("locations") || "[]");
  currentLocation: any; //= JSON.parse(localStorage.getItem("currentLocation")!);
  displayDate: any;
  @ViewChild("dateDirectivePicker") datePickerDirective: DatePickerDirective;
  @ViewChild("checkoutConfirmation")
  checkoutConfirmationModal: TemplateRef<any>;
  @ViewChild("cancelAppointment") cancelAppointmentModal: TemplateRef<any>;
  @ViewChild("rescheduleAppointment")
  rescheduleAppointmentModal: TemplateRef<any>;
  @ViewChild("checkinAppointment") checkinAppointmentModal: TemplateRef<any>;
  visibleIndex: number = 0;
  selectedthumbnail: string;
  interval: any;
  inputVar: any;
  isalreadyExecuting: boolean = false;
  connectionId: string = "";
  constructor(
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private dialogService: NgbModal,
    private elRef: ElementRef,
    // private _signalRService: SignalRService,
    private commonService: CommonService,
    private errorService: ErrorsService,
    private titleService: Title,
    private authenticationService: AccountService
  ) {
    this.translate
      .get(["Dashboard.Dashboard_Title"])
      .pipe(first())
      .subscribe((translations) => {
        let title = translations["Dashboard.Dashboard_Title"];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
    // this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
    //   this.timeZoneOffset = Number(res);
    //   var date = calcTime(Number(res));
    //   this.minDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");

    //   this.selectedDate = date;
    //   this.displayDate = moment(date);
    //   this.upperCaseDateFormat = this.dateFormat.toUpperCase()

    //   this.datePickerConfig = {
    //     format: this.dateFormat.toUpperCase(),
    //     min: this.minDate,
    //     dayBtnCssClassCallback: (day: moment.Moment) => {
    //       if (date.toDateString() == day.toDate().toDateString()) {
    //         return 'dp-current-day dp-selected'
    //       }
    //       return 'date-without-border'
    //     },
    //   };

    //   // this.startTimer();
    // });
  }

  // private subscribeToEvents(): void {
  //   this._signalRService.connectionEstablished.subscribe((data: any) => {
  //     this.connectionId = data;
  //   });
  //   this._signalRService.messageReceived.subscribe((message: any) => {
  //     var element = JSON.parse(message);
  //     var appointmentIndex = this.appointments.findIndex(
  //       (item) => item.AppointmentId == element.AppointmentId
  //     );
  //     if (
  //       element.Status == "Completed" ||
  //       element.Status == "Rejected" ||
  //       element.Status == "Cancelled"
  //     ) {
  //       if (appointmentIndex >= 0) {
  //         this.appointments.splice(appointmentIndex, 1);
  //       }
  //     } else {
  //       var currentLocationDate = calcTime(this.timeZoneOffset);
  //       currentLocationDate.setHours(0);
  //       currentLocationDate.setMinutes(0);
  //       currentLocationDate.setSeconds(0);
  //       var fromdateformatted = new Date(this.selectedDate);
  //       fromdateformatted.setHours(0);
  //       fromdateformatted.setMinutes(0);
  //       fromdateformatted.setSeconds(0);
  //       var currentLocationUTCDate = calcUTCTimeForSpecificDate(
  //         fromdateformatted,
  //         this.timeZoneOffset
  //       );
  //       var fromDate = this.isAllChecked
  //         ? calcUTCTimeForSpecificDate(currentLocationDate, this.timeZoneOffset)
  //         : currentLocationUTCDate;
  //       var mainDate = new Date(this.selectedDate);
  //       mainDate.setHours(23);
  //       mainDate.setMinutes(59);
  //       mainDate.setSeconds(59);
  //       var newDate = calcUTCTimeForSpecificDate(mainDate, this.timeZoneOffset);
  //       var toDate = this.isAllChecked ? "" : newDate;
  //       var appiontmentDate = moment(
  //         element.AppointmentStartTimeUtc,
  //         "YYYY-MM-DDTHH:mm:ss"
  //       ).toDate();
  //       if (
  //         (this.status === "All" || element.Status == this.status) &&
  //         (this.searchTexts == "" ||
  //           element.PurposeOfVisit.toLowerCase().includes(
  //             this.searchTexts.toLowerCase()
  //           ) ||
  //           element.FirstName.toLowerCase().includes(
  //             this.searchTexts.toLowerCase()
  //           ) ||
  //           (element.LastName != null &&
  //             element.LastName.toLowerCase().includes(
  //               this.searchTexts.toLowerCase()
  //             )) ||
  //           (element.Email != null &&
  //             element.Email.toLowerCase().includes(
  //               this.searchTexts.toLowerCase()
  //             )) ||
  //           (element.Company != null &&
  //             element.Company.toLowerCase().includes(
  //               this.searchTexts.toLowerCase()
  //             )) ||
  //           (element.Mobile != null &&
  //             element.Mobile.toLowerCase().includes(
  //               this.searchTexts.toLowerCase()
  //             ))) &&
  //         appiontmentDate >= fromDate &&
  //         (toDate == "" || toDate >= appiontmentDate)
  //       ) {
  //         element.cardActions = this.getCardActions(
  //           element.Status,
  //           element.HostId,
  //           element.AppointmentStartTimeUtc
  //         );
  //         if (appointmentIndex >= 0) {
  //           this.appointments[appointmentIndex] = element;
  //         } else {
  //           this.appointments.splice(0, 0, element);
  //         }
  //       } else {
  //         if (appointmentIndex >= 0) {
  //           this.appointments.splice(appointmentIndex, 1);
  //         }
  //       }
  //     }

  //     this.appointments.sort(
  //       (a, b) =>
  //         moment(a.AppointmentStartTimeUtc, "YYYY-MM-DDTHH:mm:ss")
  //           .toDate()
  //           .getTime() -
  //         moment(b.AppointmentStartTimeUtc, "YYYY-MM-DDTHH:mm:ss")
  //           .toDate()
  //           .getTime()
  //     );
  //   });
  // }

  // deleteOldConnection() {
  //   if (this.connectionId != "") {
  //     this._signalRService
  //       .DeleteSignalRConnection(this.connectionId)
  //       .subscribe((data: any) => {
  //       });
  //   }
  // }

  ngOnInit(): void {
    // this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
    //   this.timeZoneOffset = Number(res);
    //   this.changeLocation(this.currentLocation.LocationId)
    // });
  }

  // changeLocation(locationId: any) {
  //   this.deleteOldConnection();
  //   this._signalRService.initializeSignalR();
  //   this.subscribeToEvents();
  //   this.permissions = [];
  //   this.dbService.getByKey('LocationPermissions',
  //     locationId)
  //     .subscribe((indexDbData: any) => {
  //       if (indexDbData == undefined) {
  //         var locationDetails = this.locations.find(element => {
  //           return element.LocationId == locationId;
  //         });
  //         this.dashboardService.getPermissionByUserLocation(locationId,
  //           this.authenticationService.currentUserValue.UserId,
  //           locationDetails.GroupName,
  //           locationDetails.Persona, locationDetails.LocationGroupMasterId)
  //           .pipe(first())
  //           .subscribe(
  //             (dbData: any) => {
  //               this.permissions = [];
  //               dbData.Data.forEach((element: any) => {
  //                 this.permissions.push(element);
  //               });

  //               this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
  //                 this.timeZoneOffset = Number(res);
  //                 var date = calcTime(Number(res));
  //                 this.minDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");
  //                 this.selectedDate = date;
  //                 this.datePickerConfig = {
  //                   format: this.dateFormat.toUpperCase(),
  //                   min: this.minDate,
  //                   dayBtnCssClassCallback: (day: moment.Moment) => {
  //                     if (date.toDateString() == day.toDate().toDateString()) {
  //                       return 'dp-current-day dp-selected'
  //                     }
  //                     return 'date-without-border'
  //                   },
  //                 };

  //                 this.appointments = [];
  //                 this.pageIndex = 1;
  //                 this.getProgressiveRendering(1);
  //               });
  //             });
  //       }
  //       else {
  //         this.permissions = [];
  //         var permissionDetails = JSON.parse(indexDbData.Permissions);
  //         permissionDetails.Data.forEach((element: any) => {
  //           this.permissions.push(element);
  //         });

  //         this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
  //           this.timeZoneOffset = Number(res);
  //           var date = calcTime(Number(res));
  //           this.minDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");
  //           this.selectedDate = date;
  //           this.datePickerConfig = {
  //             format: this.dateFormat.toUpperCase(),
  //             min: this.minDate,
  //             dayBtnCssClassCallback: (day: moment.Moment) => {
  //               if (date.toDateString() == day.toDate().toDateString()) {
  //                 return 'dp-current-day'
  //               }
  //               return 'date-without-border'
  //             },
  //           };

  //           this.appointments = [];
  //           this.pageIndex = 1;
  //           this.getProgressiveRendering(1);
  //         });
  //       }
  //     }, (error: any) => {
  //       this.errorService.handleError(error);
  //     });
  // }

  // startTimer() {
  //   this.interval = setInterval(() => {
  //     //clearInterval(this.interval);
  //     this.appointments = [];
  //     this.pageIndex = 1;
  //     this.getProgressiveRendering(1);
  //   }, 60000)
  // }

  getProgressiveRendering(pageIndex = 1) {
    // this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
    //   this.timeZoneOffset = Number(res);
    if (!this.isalreadyExecuting) {
      this.isalreadyExecuting = true;
      var hasAccessToAllAppointments = this.hasPermission(
        "accessAllAppointments"
      );
      var hostDetails = !hasAccessToAllAppointments
        ? [
            {
              // "UserId": this.authenticationService.currentUserValue.UserId,
              // "FirstName": this.authenticationService.currentUserValue.FirstName,
              // "LastName": this.authenticationService.currentUserValue.LastName
            },
          ]
        : [];

      var currentLocationDate = calcTime(this.timeZoneOffset);
      currentLocationDate.setHours(0);
      currentLocationDate.setMinutes(0);
      currentLocationDate.setSeconds(0);
      var fromdateformatted = new Date(this.selectedDate);
      fromdateformatted.setHours(0);
      fromdateformatted.setMinutes(0);
      fromdateformatted.setSeconds(0);
      var currentLocationUTCDate = calcUTCTimeForSpecificDate(
        fromdateformatted,
        this.timeZoneOffset
      );
      var fromDate = this.isAllChecked
        ? calcUTCTimeForSpecificDate(currentLocationDate, this.timeZoneOffset)
        : currentLocationUTCDate;
      var mainDate = new Date(this.selectedDate);
      mainDate.setHours(23);
      mainDate.setMinutes(59);
      mainDate.setSeconds(59);
      var newDate = calcUTCTimeForSpecificDate(mainDate, this.timeZoneOffset);

      var toDate = this.isAllChecked ? "" : newDate;
      var stringUTCFromDate =
        formatDate(new Date(), "yyyy-MM-ddTHH:mm:ss", "en") + "Z";
      var stringUTCToDate = "";
      if (toDate != "") {
        stringUTCToDate = formatDate(toDate, "yyyy-MM-ddTHH:mm:ss", "en") + "Z";
      }

      // this.dashboardService.getAppointments(this.locationId, stringUTCFromDate,
      //   stringUTCToDate, this.searchTexts, hostDetails, this.status != 'All' ? [this.status] : ['Scheduled', 'InProgress'],
      //   pageIndex, this.pageSize)
      //   .pipe(first())
      //   .subscribe(
      //     (data: any) => {
      //       this.isalreadyExecuting = false;
      //       if (data.StatusCode == 200) {
      //         data.Data.Results.forEach((element: any) => {
      //           element.cardActions = this.getCardActions(element.Status, element.HostId,
      //             element.AppointmentStartTimeUtc);
      //           this.appointments.push(element);
      //         });

      //         if (data.Data.Results.length > 0) {
      //           this.pageIndex++;
      //         }
      //       }
      //     }, (error: any) => {
      //       this.isalreadyExecuting = false;
      //       this.errorService.handleError(error);
      //     });
      // });
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (
      window.innerHeight + window.scrollY + 0.34 >=
      document.body.scrollHeight
    ) {
      this.getProgressiveRendering(this.pageIndex);
    }
  }

  selectDate(value: any) {
    this.selectedDate = value.date;
    this.appointments = [];
    this.pageIndex = 1;
    this.getProgressiveRendering(1);
  }

  ngOnChanges(currentItem: SimpleChanges) {
    if (currentItem.status != undefined) {
      if (!currentItem.status.firstChange) {
        if (
          currentItem.status.previousValue != currentItem.status.currentValue
        ) {
          this.appointments = [];
          this.pageIndex = 1;
          this.getProgressiveRendering(1);
        }
      }
    }
    if (currentItem.selectedDate != undefined) {
      if (!currentItem.selectedDate.firstChange) {
        if (
          currentItem.selectedDate.previousValue !=
          currentItem.selectedDate.currentValue
        ) {
          this.appointments = [];
          this.pageIndex = 1;
          this.getProgressiveRendering(1);
        }
      }
    }

    if (currentItem.searchTexts != undefined) {
      if (!currentItem.searchTexts.firstChange) {
        if (
          currentItem.searchTexts.previousValue !=
          currentItem.searchTexts.currentValue
        ) {
          this.appointments = [];
          this.pageIndex = 1;
          this.getProgressiveRendering(1);
        }
      }
    }

    if (currentItem.locationId != undefined) {
      if (!currentItem.locationId.firstChange) {
        if (
          currentItem.locationId.previousValue !=
          currentItem.locationId.currentValue
        ) {
          this.currentLocation = JSON.parse(
            localStorage.getItem("currentLocation")!
          );
          this.dateFormat = JSON.parse(
            localStorage.getItem("defaultValuesForLocation")!
          ).DateFormat;
          this.timeFormat = JSON.parse(
            localStorage.getItem("defaultValuesForLocation")!
          ).TimeFormat;
          this.printerType = JSON.parse(
            localStorage.getItem("defaultValuesForLocation")!
          ).PrinterType;
          this.timeZone = JSON.parse(
            localStorage.getItem("defaultValuesForLocation")!
          ).TimeZone;

          //this.changeLocation(Number(currentItem.locationId.currentValue));
        }
      }
    }

    if (currentItem.isAllChecked != undefined) {
      if (!currentItem.isAllChecked.firstChange) {
        if (
          currentItem.isAllChecked.previousValue !=
          currentItem.isAllChecked.currentValue
        ) {
          this.appointments = [];
          this.pageIndex = 1;
          this.getProgressiveRendering(1);
        }
      }
    }
  }

  ngOnDestroy() {
    // this.deleteOldConnection();
    clearInterval(this.interval);
  }

  allCheckboxChanged() {
    this.appointments = [];
    this.pageIndex = 1;
    this.getProgressiveRendering(1);
  }

  searchTextEnterKey() {
    this.appointments = [];
    this.pageIndex = 1;
    this.getProgressiveRendering(1);
  }

  statusChanged() {
    if (this.status != "") {
      this.appointments = [];
      this.pageIndex = 1;
      this.getProgressiveRendering(1);
    }
  }

  actionCompleted(event: any) {
    this.appointments = [];
    this.pageIndex = 1;
    this.getProgressiveRendering(1);
  }

  getCardActions(action: any, hostId: any, appointmentDateUtc: any) {
    var returnValue: any[] = [];
    if (action == "InProgress") {
      if (this.hasPermission("checkOut")) {
        returnValue.push({
          id: "checkOut",
          action: this.translate.instant("Dashboard.Check_Out"),
          iconUrl: "assets/images/checkout-icon.png",
        });
      }
      return returnValue;
    } else if (action == "Scheduled") {
      if (this.hasPermission("checkIn")) {
        var currentLocationFromDate = calcTime(this.timeZoneOffset);
        currentLocationFromDate.setHours(0);
        currentLocationFromDate.setMinutes(0);
        currentLocationFromDate.setSeconds(0);

        var currentLocationToDate = calcTime(this.timeZoneOffset);
        currentLocationToDate.setHours(23);
        currentLocationToDate.setMinutes(59);
        currentLocationToDate.setSeconds(59);

        var utcFromDate = calcUTCTimeForSpecificDate(
          currentLocationFromDate,
          this.timeZoneOffset
        );
        var utcToDate = calcUTCTimeForSpecificDate(
          currentLocationToDate,
          this.timeZoneOffset
        );
        var appointmentFromDate = moment(
          appointmentDateUtc,
          "YYYY-MM-DDTHH:mm:ss"
        ).toDate();
        if (
          appointmentFromDate >= utcFromDate &&
          appointmentFromDate <= utcToDate
        ) {
          returnValue.push({
            id: "checkIn",
            action: this.translate.instant("Dashboard.Check_In"),
            iconUrl: "assets/images/checkin-icon.png",
          });
        }
      }

      if (hostId == this.authenticationService.currentUserValue.UserId) {
        if (this.hasPermission("reschedule")) {
          returnValue.push({
            id: "reschedule",
            action: this.translate.instant("Dashboard.Reschedule"),
            iconUrl: "assets/images/rechedule-icon.png",
          });
        }

        if (this.hasPermission("cancel")) {
          returnValue.push({
            id: "cancel",
            action: this.translate.instant("Dashboard.Cancel"),
            iconUrl: "assets/images/cancel-icon.png",
          });
        }
      }
    }

    return returnValue;
  }

  hasPermission(action: string) {
    return this.permissions.find((element) => {
      return element.PermissionKey == action;
    })?.IsPermissible;
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

  hasPrintPermission(status: any) {
    return (
      this.permissions.find((element) => {
        return element.PermissionKey == "rePrintBadge";
      })?.IsPermissible && status == "InProgress"
    );
  }

  isDisplayHostInfo() {
    return this.permissions.find((element) => {
      return element.PermissionKey == "showHostInformation";
    })?.IsPermissible;
  }

  isDisplayVisitorInfo() {
    return this.permissions.find((element) => {
      return element.PermissionKey == "visitorInformationAccess";
    })?.IsPermissible;
  }

  convertTime(time: any) {
    if (this.timeFormat == 12) {
      if (time.indexOf("AM") !== -1 || time.indexOf("PM") !== -1) {
        return time;
      }
      return convertTime24to12(time);
    } else {
      if (time.indexOf("AM") !== -1 || time.indexOf("PM") !== -1) {
        return convertTime12to24(time);
      } else {
        return time;
      }
    }
  }

  // getLocale() {
  //   if (this.translate.currentLang == 'ar-AE') {
  //     return "ar"
  //   }
  //   if (this.translate.currentLang == 'hn-IN') {
  //     return "hi"
  //   }

  //   if (this.translate.currentLang == 'en-US') {
  //     return "en"
  //   }
  //   return "en";
  // }

  performAction(
    actionId: any,
    appointmentId: any,
    firstname: string,
    lastname: string,
    visitorId: any,
    notificationType: number
  ) {
    this.selectedVisitorName = firstname + " " + lastname;
    this.selectedVisitorId = visitorId;
    this.selectedAppointmentId = appointmentId;
    this.selectedNotificationType = notificationType;

    switch (actionId) {
      case "checkOut":
        this.checkoutModal(this.checkoutConfirmationModal);
        break;
      case "checkIn":
        this.checkInModal(this.checkinAppointmentModal);
        break;
      case "reschedule":
        this.rescheduleModal(this.rescheduleAppointmentModal);
        break;
      case "cancel":
        this.cancelAppointment(this.cancelAppointmentModal);
        break;
    }
  }

  checkoutModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  rescheduleModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
    // .dismissed.subscribe(() => {
    //   this.appointments = [];
    //   this.pageIndex = 1;
    //   this.getProgressiveRendering(1);
    // });
  }

  checkInModal(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  openZoomPhotoModal(thumbnailUrl: string, dialog: TemplateRef<any>) {
    if (this.hasPermission("enlargedPhoto")) {
      this.selectedthumbnail = thumbnailUrl;
      this.dialogService.open(dialog, {
        centered: true,
        backdrop: "static",
        keyboard: false,
        windowClass: "slideInUp",
      });
    }
  }

  cancelAppointment(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  getHostPhonenumber(appointment: any) {
    if (appointment.HostIsdCode == "") {
      return "+" + appointment.HostMobile;
    } else {
      return "+" + appointment.HostIsdCode + " " + appointment.HostMobile;
    }
  }

  showPrintBadge(printbadgeDialog: TemplateRef<any>, visitorId: number) {
    this.dialogService.dismissAll("dd");
    this.dialogService.open(printbadgeDialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
    this.dashboardService.GetFileBadge(this.printerType, visitorId).subscribe(
      (res: any) => {
        var pdfFile = new Blob([res.body], {
          type: "application/pdf",
        });
        var thisObject = this;
        var pdfUrl = URL.createObjectURL(pdfFile);
        PrintPDF(pdfUrl, function () {
          thisObject.dialogService.dismissAll("dd");
        });
      },
      (error: any) => {
        this.errorService.handleError(error);
      }
    );
  }
}
