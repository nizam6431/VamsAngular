import { formatDate } from "@angular/common";
import {
  Component,
  ElementRef,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { DatePipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime, distinctUntilChanged, filter, first } from "rxjs/operators";
import { ErrorsService } from "../../core/handlers/errorHandler";
import { CommonService } from "../../core/services/common.service";
import { ThemeService } from "../../core/services/theme.service";
declare var $: any;
import { WalkinComponent } from "./walkin/walkin.component";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleComponent } from "./schedule/schedule.component";

import { ShareAppointmentComponent } from "./share-appointment/share-appointment.component";
import { DataService } from "./services/data.service";
import { Constants } from "./constants/columns";
import { UserService } from "src/app/core/services/user.service";
import { CheckinModalComponent } from "./checkin-modal/checkin-modal.component";
import { CheckoutModalComponent } from "./checkout-modal/checkout-modal.component";
import { ReauthenticateComponent } from "./reauthenticate/reauthenticate.component";
import { AppointmentService } from "./services/appointment.service";
import { ToastrService } from "ngx-toastr";
import {
  AppointmentScheduleDetails,
  GetAppointmentRequest,
} from "./models/appointment-schedule";
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MY_FORMATS } from "../../core/models/users"
import { DateRangeComponent } from "src/app/shared/components/date-range/date-range.component";
import { GridComponent } from "./grid/grid.component";
import { fromEvent, Subscription } from "rxjs";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { FileUploadComponent } from "src/app/shared/components/file-upload/file-upload.component";
import { BulkUploadComponent } from "src/app/shared/components/bulk-upload/bulk-upload.component";
import { SignalRService } from "./services/signal-r.service";
import { defaultVal, LevelAdmins,Level1Roles, Level2Roles, Level3Roles, ProductTypes } from "../../core/models/app-common-enum";
import { MasterService } from "src/app/feature/master/services/master.service";
import { SelectBuildingComponent } from "src/app/shared/components/select-building/select-building.component";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { WalkinNewComponent } from "./walkin-new/walkin-new.component";
import { DrivingLicenceComponent } from "./driving-licence/driving-licence.component";
import { ConfrmSynronizationModalComponent } from "src/app/shared/components/confrm-synronization-modal/confrm-synronization-modal.component";
import { TimeInOutWithQrComponent } from "./time-in-out-with-qr/time-in-out-with-qr.component";
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
// export let MY_FORMATS = {
//   parse: {
//     dateInput: "LL",
//   },
//   display: {
//     dateInput: "MM/DD/YY",
//     monthYearLabel: "YYYY",
//     dateA11yLabel: "LL",
//     monthYearA11yLabel: "YYYY",
//   },
// };

@Component({
  selector: "app-appointment",
  templateUrl: "./appointment.component.html",
  styleUrls: ["./appointment.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AppointmentComponent implements OnInit, OnDestroy {
  @ViewChild('picker') datePicker: MatDatepicker<any>;
  @ViewChild('appointmentTable') appointmentTable: GridComponent;
  @ViewChild('input') input: ElementRef;
  appointmentDataShowType: string = "card";
  filter: string = "all";
  searchTexts: string = "";
  status: string = "All";
  isDarkTheme: boolean = false;
  isAllChecked: boolean = true;
  selectedDate: any = new Date();
  datePickerConfig: any = {
    format: "DD-MM-YYYY",
  };
  subscription: Subscription;
  dateFormat: any = ""; //JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  timeZone: string = ""; //JSON.parse(localStorage.getItem("defaultValuesForLocation")!).TimeZone;
  printerType: string = ""; //JSON.parse(localStorage.getItem("defaultValuesForLocation")!).PrinterType;
  minDate: string = formatDate(new Date(), "dd-MM-YYYY HH:mm:ss", "en");
  companyCode: string = "";
  permissions: any[] = [];
  // locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]");
  logoUrl: string;
  locationId: number = 0;
  locationName: string = "";
  showScrollableHeader: boolean = false;
  isShowSettingMenu: boolean = false;
  isShowProfileMenu: boolean = false;
  pageIndex: number = 1;
  isShowWalkin: boolean = false;
  isShowMobileMenu: boolean = false;
  timeZoneOffset: number = 0;
  userShortName: string = "";
  canSendMessage: Boolean = false;
  connectionId: string = null;
  dataSource: any;
  displayedColumns: any[];
  userDetails: any;
  public hasSearchValue: boolean = false;
  searchKey: string = "";
  openDateFilter: boolean = false;
  isalreadyExecuting: boolean = false;
  public getAppointmentRequest: GetAppointmentRequest =
    new GetAppointmentRequest();
  appointmentScheduleDetails: AppointmentScheduleDetails;
  totalData: number;
  timeFilter: string = "today";
  selectedStatus: string = "";
  showStatus: string = "";
  toggleView: string = "card";
  dateRange: FormGroup;
  showCrossForDateFilter: boolean = false
  startDate: any;
  endDate: any;
  permissionKeyObj = permissionKeys;
  private hubConnection: signalR.HubConnection | null = null;
  private eventId;
  private eventSequenceNumber: number = 0;
  currentRole : any;
  visitorSettings:any;
  sendNDA: number;
  pageNewSize:any;
  SeepzWorkFlow:any;

  statusFilter = [
    // { value: "ALL", viewValue: "All" },
    { value: "INPROGRESS", viewValue: this.translate.instant("drop_down_values.in_progress") },
    { value: "SCHEDULED", viewValue:this.translate.instant("drop_down_values.scheduled") },
    { value: 'INCHECKOUT', viewValue: this.translate.instant("drop_down_values.pending_checkout")},
    // {value: 'CANCELLED', viewValue: 'CANCELLED'},
    // {value: 'COMPLETED', viewValue: 'COMPLETED'},
    // {value: 'WALKIN', viewValue: 'WALKIN'},
    // {value: 'REJECTED', viewValue: 'REJECTED'},
  ];

  todayDateTime: any;
  @ViewChild('container') appointmentContainer: ElementRef;
  selectedBuilding: number[] = [];
  includeComplexVisitor: boolean = false;
  allBuildings: any = [];
  allBuildingSelected: boolean = true;
  buildingButtonText = this.translate.instant("labels.select_buildings");
  showButton: boolean = false;
  OnlyComplexApnts: any;
  isRefresh: boolean = false
  dateFormatWithTimeFormat: string;
  // islevel1: boolean;
  // islevel1Reception: boolean;
  // islevel1Security: boolean;
  // islevel1SecurityHead: boolean;
  // islevel1Head: boolean;
  buildingfilterShow = [Level1Roles.l1Admin,Level1Roles.l1Reception,Level1Roles.l1Security,Level1Roles.l1Security,Level1Roles.l1SecurityHead]

  activateDLScanScheduledAppointment: any;
  changeTime: number;
  isAccessControlEnabled: boolean;
  isL1Roles:boolean = false;
  ProductType = ProductTypes;
  productType: string;
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event): void {
  //   alert("11111")
  //   this.deleteSignalRConnection();
  // }
  // isRefresh: boolean = false
  printPassDocu: any;

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2,
    private translate: TranslateService,
    private titleService: Title,
    private commonService: CommonService,
    private dialogService: NgbModal,
    private errorService: ErrorsService,
    public dialog: MatDialog,
    public dataService: DataService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public signalRService: SignalRService,
    private masterService: MasterService,
    private fileUploadService: FileUploadService,
    private router: Router
  ) {
    this.productType = this.userService.getProductType();
    
    this.userService.isSelect.subscribe(
      res=>{
        this.allBuildingSelected = res;
       
      }
    )
    // window.addEventListener("beforeunload", (event) => {
    //   event.preventDefault();
    //   event.returnValue = "Unsaved modifications";
    //   console.log("Reload");
    //   this.deleteSignalRConnection();
    //   alert("2222")
    //   return event;
    // });
    // if(this.connectionId != null){
    //   this.appointmentService.deleteSignalRConnection(this.connectionId).subscribe(data => {
    //     this.signalRService.getBroadcastAppointmentData();
    //     this.connectionId = null;
    //   },(error)=>{
    //     this.connectionId = null;
    //   });    }
    // else{
    this.signalRImplementation();
    // }
    this.userDetails = this.userService.getUserData();
    if (this.userDetails) {
      this.userShortName =
        this.userDetails.firstName.charAt(0) +
        this.userDetails.lastName.charAt(0);
      this.logoUrl = this.commonService.getLogo();
    }
    this.translate
      .get(["AppointmentDetails.Appointments_Title"])
      .pipe(first())
      .subscribe((translations) => {
        let title = translations["AppointmentDetails.Appointments_Title"];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });

    this.dateRange = this.fb.group({
      'start': [null],
      'end': [null],
    })
    this.initialSetup();

    this.SeepzWorkFlow = this.userService.getWorkFlow();
  }

  ngOnDestroy() {
  }

  toggleMenu() {
    this.isShowProfileMenu = !this.isShowProfileMenu;
  }

  ngOnInit() { 
    let roleFullName = this.userService.getRolName();
   
    if( roleFullName == 'Level3Reception' ){
      this.statusFilter.splice(2,1);
      
    }
  }
    // TODO: uncomment if want to allow for security head and level1host to see all appointments
    // this.islevel1SecurityHead = this.userService.isLevel1SecurityHead();
    // this.islevel1Head = this.userService.isLevel1Host();
    


  initialSetup(){
    this.currentRole = this.userService.getRolName();
    // this.islevel1 = this.userService.isLevel1Admin();
    // this.islevel1Reception = this.userService.isLevel1Reception();
    // this.islevel1Security = this.userService.isLevel1Security();
    if (this.userService.isLevel1Host()|| this.userService.isLevel1Admin()|| this.userService.isLevel1Reception() || this.userService.isLevel1Security() || this.userService.isLevel1SecurityHead()) {
      this.isL1Roles = true;
    }
    
    if (this.permissionKeyObj['CREATEWALKIN'] && this.userService.checkPermission(this.permissionKeyObj['CREATEWALKIN'])) {
      this.isShowWalkin = true;
    }

    this.getBuildingData();
    
    if (this.isL1Roles) {   
      this.includeComplexVisitor = true;
      this.buildingList();
    } 
    else {
      this.getDetails();
    }
  }

  async signalRImplementation() {
    this.signalRService.appointmentData.subscribe(appointmentData => {
      if (appointmentData) { 
        console.log(appointmentData);
        console.log(this.selectedBuilding);
        let parseApptData = JSON.parse(appointmentData);
        console.log(this.userDetails);
        let level1roles = [Level1Roles.l1Admin,Level1Roles.l1Host,Level1Roles.l1Reception,Level1Roles.l1Security,Level1Roles.l1SecurityHead];
        let level2roles = [Level2Roles.l2Admin,Level2Roles.l2Reception,Level2Roles.l2Security,Level2Roles.l2Host];
        let level3roles = [Level3Roles.l3Admin,Level3Roles.l3Host,Level3Roles.l3Reception];
        if(parseApptData && parseApptData.level2Id !=null){
          // if(this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level1Admin){
          if(this.userDetails && this.userDetails.role && level1roles.includes(this.userDetails.role.shortName)){
            if(Level1Roles.l1Admin == this.userDetails.role.shortName){
              if((this.selectedBuilding.findIndex(element=>element == parseApptData.level2Id))>=0){
               
                this.addSignalRAppointment(parseApptData);
              }
            }
            else{
              this.addSignalRAppointment(parseApptData);
            }
          }
          else if(this.userDetails && this.userDetails.role && level2roles.includes(this.userDetails.role.shortName)){
              if(this.userDetails && this.userDetails.selectedBuilding && this.userDetails.selectedBuilding.id && this.userDetails.selectedBuilding.id == parseApptData.level2Id){
              
                this.addSignalRAppointment(parseApptData);
              }
          }
          else if(this.userDetails && this.userDetails.role && level3roles.includes(this.userDetails.role.shortName)){
           
            this.addSignalRAppointment(parseApptData);
          }
        }
        else{
          
          this.addSignalRAppointment(parseApptData);
        }
      }
    }, error => {
      console.log(error,'error')
    });
  }

  addSignalRAppointment(data){
    console.log("Passed");
    let serachFilter = (data.visitorFirstName.toLowerCase().startsWith(this.searchKey) || data.visitorLastName.toLowerCase().startsWith(this.searchKey));
    let statusFilter = (this.selectedStatus == 'ALL' || data.status == this.selectedStatus);
    console.log(statusFilter,data.status,'statusFilter')
    // let timeFilter = (this.timeFilter == 'all' ||  moment(data.date).isBetween(this.getAppointmentRequest.fromTime, this.getAppointmentRequest.toTime))
    let timeFilter = (this.timeFilter == 'all' ||  moment(moment(data.date,this.dateFormat.toUpperCase()).format('YYYY-MM-DD')).isBetween(moment(this.getAppointmentRequest.fromTime ,this.dateFormat.toUpperCase()).format('YYYY-MM-DD'), moment(this.getAppointmentRequest.toTime ,this.dateFormat.toUpperCase()).format('YYYY-MM-DD'),undefined,"[]"))
    console.log(serachFilter,statusFilter,timeFilter);
    if((serachFilter)&&(statusFilter)&&(timeFilter)) {
      this.addData(data);
    }
  }

  addData(data){
    let appointmentIndex = this.appointmentScheduleDetails.data.list.findIndex(item => item.id == data.id);
    console.log(appointmentIndex);
    if (appointmentIndex >= 0) {
      if (data.status == 'CANCELLED' || data.status == 'REJECTED' || data.status == 'COMPLETED' || data.status == 'DECLINED') {
        console.log(data.status,'......')
        this.appointmentScheduleDetails.data.list.splice(appointmentIndex, 1);
        this.totalData = this.totalData - 1;
      } else {
        let datas = this.appointmentScheduleDetails;
        //datas.data.list[appointmentIndex] = data;
        this.appointmentScheduleDetails.data.list[appointmentIndex] = data;
        this.appointmentScheduleDetails = Object.assign({}, this.appointmentScheduleDetails);
        //this.appointmentScheduleDetails = datas;
        this.sortAppointment();
        this.totalData = this.totalData + 1;
       
        // console.log(this.appointmentScheduleDetails.data.list)
      }
    } else {
     
      if(this.appointmentScheduleDetails.data.list.length>0){
        for (let index = 0; index < this.appointmentScheduleDetails.data.list.length; index++) {
          const element = this.appointmentScheduleDetails.data.list[index];
          // if (moment(moment(data.date + " " + data.startTime,this.dateFormat.toUpperCase()).format(this.dateFormatWithTimeFormat)).isSameOrBefore(moment(moment(element.date + " " + element.startTime,this.dateFormat.toUpperCase())).format(this.dateFormatWithTimeFormat))) {
          // console.log((moment(moment(data.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+data.startTime).isSameOrBefore(moment(element.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+element.startTime)))
          if ((moment(moment(data.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+data.startTime).isSameOrBefore(moment(element.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+element.startTime))) {
            this.appointmentScheduleDetails.data.list.splice(index, 0, data);
          
            break;
          } else {
            if (index == this.appointmentScheduleDetails.data.list.length - 1) {
              this.appointmentScheduleDetails.data.list.push(data);
            
              break;
            }
          }
        }
        this.totalData = this.totalData + 1;
      }
      else{
        this.appointmentScheduleDetails.data.list.push(data);
      }
    }
    this.changeTime = new Date().getTime(); 
  }

  sortAppointment(){
    console.log("Sort");
    if(this.appointmentScheduleDetails.data.list.length>0){
      for(let appt = 0; appt < this.appointmentScheduleDetails.data.list.length; appt++){
        let data = this.appointmentScheduleDetails.data.list[appt];
        for (let index = 0; index < this.appointmentScheduleDetails.data.list.length-appt-1; index++) {
          const element = this.appointmentScheduleDetails.data.list[index];
          const element2 = this.appointmentScheduleDetails.data.list[index+1];
          if (!(moment(moment(element.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+element.startTime).isSameOrBefore(moment(element2.date,this.dateFormat.toUpperCase()).format("YYYY-MM-DD")+" "+element2.startTime))) {
          
            let temp = this.appointmentScheduleDetails.data.list[index];
            this.appointmentScheduleDetails.data.list[index] =  this.appointmentScheduleDetails.data.list[index+1];
            this.appointmentScheduleDetails.data.list[index+1] =  temp
          }
        }
      }
      this.changeTime = new Date().getTime(); 
      // let tempArray = this.appointmentScheduleDetails.data.list 
      // this.appointmentScheduleDetails.data.list = [] 
      // this.appointmentScheduleDetails.data.list = tempArray; 
      // console.log(tempArray,'temAppray222') 
      // console.log(this.appointmentScheduleDetails.data.list)
    }
  }

  ngAfterViewInit() {
    this.getFilteredData();
  }

  getFilteredData() {
    this.subscription = fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
      ).subscribe(text => {
        this.onChangeTimeFilter(
          this.timeFilter,
          this.selectedStatus,
          this.searchKey
        );
      })
  }

  selectDate(value: any) {
    this.selectedDate = value.date;
  }

  statusChanged(value: any) {
    this.status = value;
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.getProgressiveRendering();
    }
  }

  getProgressiveRendering() {
    if (!this.isalreadyExecuting) {
      this.isalreadyExecuting = true;
      // var hasAccessToAllAppointments = this.hasPermission(
      //   "accessAllAppointments"
      // );
      // this.onChangeTimeFilter(
      //   this.timeFilter,
      //   this.selectedStatus,
      //   this.searchKey,
      // );
      this.getAppointmentSchedule(true);
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

  allCheckBoxClick(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.isAllChecked = !this.isAllChecked;
  }
  // getVisitorSettings(){
  //   let locationId = (this.userDetails.level2List) ? 
  //   this.userDetails.level2List.find( location=> location.isDefault == true) : 0;
  //   this.appointmentService.getVisitorSettings(locationId.id).subscribe( response=>{      
  //       if (response.statusCode === 200 && response.errors == null) {
  //        this.dateFormat = response?.data?.dateFormat || "dd-MM-yyyy"
  //       } else {
  //       this.dateFormat= "dd-MM-yyyy"
  //       }
  //     }, error =>{
  //       this.dateFormat= "dd-MM-yyyy"
  //   })
  // }


  searchTextEnterKey(value: any) {
    this.searchTexts = value;
  }

  toggleWalkin() {
    this.isShowWalkin = !this.isShowWalkin;
  }

  // locationChange(event: any, locationId: any, mainwrapper: any) {
  // if (mainwrapper) {
  //   mainwrapper.style.display = 'none';
  // }

  // var updatedLocationId: any = null;
  // if (locationId != null) {
  //   updatedLocationId = locationId;
  // }
  // else {
  //   updatedLocationId = Number(this.locationId);
  // }
  // var locationDetails = this.locations.find(element => {
  //   return element.LocationId == updatedLocationId;
  // });

  // this.locationName = locationDetails.LocationName;
  // localStorage.setItem("currentLocation", JSON.stringify(locationDetails));
  //   this.dashboardService.getPermissionByUserLocation(updatedLocationId,
  //     this.authenticationService.currentUserValue.UserId,
  //     locationDetails.GroupName,
  //     locationDetails.Persona, locationDetails.LocationGroupMasterId)
  //     .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         this.permissions = [];
  //         data.Data.forEach((element: any) => {
  //           this.permissions.push(element);
  //         });
  //         this.dbService.getByKey('LocationPermissions', updatedLocationId).toPromise()
  //           .then((key: any) => {
  //             if (key == undefined) {
  //               this.dbService.add('LocationPermissions',
  //                 {
  //                   LocationId: updatedLocationId,
  //                   Permissions: JSON.stringify(data),
  //                 })
  //                 .toPromise().then((key) => {
  //                   this.locationId = updatedLocationId;
  //                 }).catch(function (error) {
  //                   console.error('Add failed', error);
  //                 });
  //             }
  //             else {
  //               this.dbService.update('LocationPermissions',
  //                 {
  //                   LocationId: updatedLocationId,
  //                   Permissions: JSON.stringify(data),
  //                 })
  //                 .toPromise().then((key) => {
  //                   this.locationId = updatedLocationId;
  //                 }).catch(function (error) {
  //                   console.error('Update failed', error);
  //                 });
  //             }
  //           });
  //       }, (error: any) => {
  //         this.errorService.handleError(error);
  //       });

  //   this.dashboardService.getDefaultValuesForLocation(updatedLocationId)
  //     .pipe(first())
  //     .subscribe(
  //       (data: any) => {
  //         if (data.StatusCode == 200) {
  //           localStorage.setItem("defaultValuesForLocation", JSON.stringify(data.Data));
  //           this.timeZone = data.Data.TimeZone;
  //           this.bindDatePicker();
  //           this.printerType = data.Data.PrinterType;
  //         }
  //       }, (error: any) => {
  //         this.errorService.handleError(error);
  //       });
  // }

  // themeChange(event: any) {
  //   var selectedTheme = event.currentTarget.checked;
  //   if (selectedTheme) {
  //     if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
  //       this.themeService.loadStyle("style-dark-rtl.css");
  //       this.themeService.loadMenuStyle("menu-dark-rtl.css");
  //     }
  //     else {
  //       this.themeService.loadStyle("style-dark.css");
  //       this.themeService.loadMenuStyle("menu-dark.css");
  //     }
  //     this.logoUrl = this.commonService.getLogo();
  //   }
  //   else {
  //     if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
  //       this.themeService.loadStyle("style-rtl.css");
  //       this.themeService.loadMenuStyle("menu-rtl.css");
  //     }
  //     else {
  //       this.themeService.loadStyle("style.css");
  //       this.themeService.loadMenuStyle("menu.css");
  //     }
  //     this.logoUrl = this.commonService.getLogo();
  //   }
  // }

  // getApiUrl() {
  //   return environment.CompanyAPIURL;
  // }

  // getCompanyId() {
  //   return environment.CompanyId;
  // }

  // bindDatePicker() {
  //   this.commonService.getTimezone(new Date(), this.timeZone.trim()).subscribe((res: any) => {
  //     this.timeZoneOffset = Number(res);
  //     var date = calcTime(Number(res));
  //     date = new Date(date.getTime());
  //     this.minDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");
  //     this.datePickerConfig = {
  //       format: this.dateFormat.toUpperCase(),
  //       min: this.minDate
  //     }
  //   });
  // }

  // menuMouseAction(event: MouseEvent, ishover: any): void {
  //   event.stopPropagation();
  //   var target = event.target as Element;
  //   if (!ishover) {
  //     if (target.querySelector('ul') != null) {
  //       target.querySelector('ul')!.style.display = 'none';
  //     }
  //   }
  //   else {
  //     if (target.querySelector('ul') != null) {
  //       target.querySelector('ul')!.style.display = 'block';
  //     }
  //   }
  // }

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

  // hasPermission(action: string) {
  //   return (this.permissions.find(element => {
  //     return element.PermissionKey == action;
  //   })?.IsPermissible)
  // }

  // openCloseMenu(target: HTMLElement, ishover: any): void {
  //   if (!ishover) {
  //     target.style.display = 'none';
  //   }
  //   else {
  //     target!.style.display = 'block';
  //   }
  // }

  // logout() {
  // this.authenticationService.logout();
  // }

  // appointmentScheduled(event: boolean) {
  //   this.dashboardContent.pageIndex = 1;
  //   this.dashboardContent.appointments = [];
  //   this.dashboardContent.getProgressiveRendering();
  // }

  // showWalkin(dialog: TemplateRef<any>) {
  //   this.dialogService.open(
  //     dialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
  // }

  getDetails() {
    if (this.userDetails && this.userDetails?.level2List && this.userDetails?.level2List.length > 0) {
      let locationId = this.userDetails?.level2List?.find(location => location.isDefault == true);
      if (locationId) {
        this.getVisitorSettings(locationId.id);
      } else {
        this.toastr.error(this.translate.instant('pop_up_messages.defalut_location_not_found'));
      }
    }
    else if (this.userDetails && this.userDetails?.level1Id) {
      this.getVisitorSettings(null);
    }
  }

  getVisitorSettings(locationId) {
    this.appointmentService.getVisitorSettings(locationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.visitorSettings = response.data; 
        this.sendNDA = response?.data?.sendNDA;
        // if( response.data.sendNDA == true ){
        //   this.sendNDA = 1; console.log(this.sendNDA)
        // }else{
        //   this.sendNDA = 0; console.log(this.sendNDA)
        // }
        this.dateFormat = response.data.dateFormat || "dd-MM-yyyy";
        this.dateFormatWithTimeFormat = (response.data.timeformat == 12) ? (this.dateFormat.toUpperCase() + " HH:MM A") : (this.dateFormat.toUpperCase() + " HH:MM");
        let currentTimeZone = response?.data?.timeZone;
        this.activateDLScanScheduledAppointment = response?.data?.activateDLScanScheduledAppointment;
        this.isAccessControlEnabled = response?.data?.isAccessControlEnabled;
        this.getCurrentTimeZone(currentTimeZone);
        this.appointmentService.setDateFormat(response?.data?.dateFormat || "dd-MM-yyyy")
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

  getCurrentTimeZone(timezone) {
    timezone = timezone ? timezone : 'India Standard Time';
    this.appointmentService.getCurrentTimeByZone(timezone).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.todayDateTime = moment(response?.data);
        this.onSelectEvent();
      }
    },
      (error) => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          })
        } else {
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      })

  }

  onToggleCardAndTableView(viewMode) { console.log(typeof this.getAppointmentRequest, viewMode)
    if(viewMode == 'grid'){
      if(this.getAppointmentRequest.pageIndex == 1 && this.getAppointmentRequest.pageSize < 25){
        console.log('Grid');
        this.pageNewSize = 25;
      }
    }
    if(viewMode == 'card'){
      if(this.getAppointmentRequest.pageIndex == 1){
        console.log('Card');
        this.pageNewSize = undefined;
      }
    }
    
    this.appointmentDataShowType = viewMode;
    this.onChangeTimeFilter(this.timeFilter,
      this.selectedStatus,
      this.searchKey
    )
  }

  openChangeLanguage(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
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
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = blobUrl;
          document.body.appendChild(iframe);
          iframe.contentWindow.print();
      });
    }else{
      //var mywindow = window.open('', '', '');
				//mywindow.document.write('<html><title>Print</title><style>* {margin: 0; padding:0;}</style><body style="margin:0;padding:0;">');
				//mywindow.document.write(htmlData);
        //mywindow.document.write('</body></html>');
				//mywindow.document.close();
        setTimeout(() => {
          //mywindow.print();
          //mywindow.window.close();
        }, 0);
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

    setTimeout(() => {       
      this.print()
    }, 1000);
    //this.printPdfCall(this.printPassDocu)
  }
  // printPdfCall(data){
  //   var winparams = 'dependent=yes,locationbar=no,scrollbars=yes,menubar=yes,'+
  //           'resizable,screenX=50,screenY=50,width=850,height=1050';
  //   var htmlPop = '<embed width=100% height=100%'
  //                        + ' type="application/pdf"'
  //                        + ' src="data:application/pdf;base64,'
  //                        + this.arrayBufferToBase64(data)
  //                        + '#zoom=60'
  //                        + '"></embed>'; 
  //       var printWindow = window.open("", "PDF", winparams);
  //       console.log(this.arrayBufferToBase64(data));
  //       printWindow.document.write(htmlPop);
  //       setTimeout(() => {
  //         printWindow.print();
  //       }, 500);
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
  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }
  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  printVisitorInfo(appointmentID, event = null){
    if( event != null ){
      event.stopPropagation();
    }
    if( this.visitorSettings.isPrintPass == true ){
      let data: any;
      if( this.productType == this.ProductType.Commercial ){
        data = {"appointmentId": appointmentID,
      // "printerType": "brother",
      // "pdfPageSize": 1,
      // "webPageHeight": 216,
      // "webPageWidth": 384
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
      // let data = {"appointmentId": appointmentID,
      // "printerType": "brother",
      // "pdfPageSize": 10,
      // "webPageHeight": 100,
      // "webPageWidth": 148};
      this.appointmentService.getPrintPassDocument(data).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          //this.getPdf_(response.data);
          if(response?.data?.html != undefined){
            this.print(response?.data?.html)
          }else{
            this.getPdf_(response.data);
          }
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

  openWalkinDialog() {
    const dialogRef = this.dialog.open(WalkinNewComponent, {
      height: "100%",
      position: { right: "0" },
      data:{
        productType: this.productType,
        buildingList:this.allBuildings,
        visitorSettings:this.visitorSettings
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef.afterClosed().subscribe((statusObj) => {  console.log(statusObj)
      if (statusObj && statusObj?.statusCode) {
        if (statusObj.statusCode === 200 && statusObj.errors == null) {
          if(this.productType == "Commercial"){
            //if( this.visitorSettings.walkinWithBioAuth == false ){ 
              this.printVisitorInfo(statusObj.data.appointmentId,null);
            //}
          }else{
            if( this.visitorSettings.allowWalkinApproval == false && this.visitorSettings.walkinWithBioAuth == false ){
              this.printVisitorInfo(statusObj.data.appointmentId,null);
            }
          }
          this.getAppointmentSchedule();
        }
      }
    })
  }
  shareAppointment() {
    this.dialog.open(ShareAppointmentComponent, {
      height: "100%",
      position: { right: "0" },
      data:{
        buildingList:this.allBuildings,
        visitorSettings:this.visitorSettings
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
      autoFocus: false
    });
  }

  checkIn() {
    this.dialog.open(CheckinModalComponent, {
      width: "40%",
      height: "100%",
      position: { right: "0" },
      panelClass: ["animate__animated", "animate__slideInRight"],
    });
  }

  public onChangeTimeFilter(
    timeFilter,
    selectedStatus: string,
    searchKey: string
  ) {

    // this.todayDateTime = new Date();
    let buildingIds = this.selectedBuilding;
    this.timeFilter = timeFilter;
    let todayDate = this.datePipe.transform(this.todayDateTime, this.dateFormat);
    this.pageIndex = 1;
    if( this.pageNewSize == undefined ){
      this.pageNewSize = '';
    }
    if (this.appointmentContainer)
      this.appointmentContainer.nativeElement.scrollTop = 0;
    // var future = new Date();
    // future.setDate(future.getDate() + 30);

    if (timeFilter != undefined) {
      switch (timeFilter) {
        case "all":
          this.hideDaterangeFilter();
          this.appointmentGetRequestObject(
            searchKey,
            todayDate,
            null,
            "",
            "",
            selectedStatus,
            this.pageNewSize,
            this.pageIndex,
            buildingIds,
            this.includeComplexVisitor
          );
          this.getAppointmentSchedule();
          break;
        case "today":
          this.hideDaterangeFilter();
          this.appointmentGetRequestObject(
            searchKey,
            todayDate,
            todayDate,
            "",
            "",
            selectedStatus,
            this.pageNewSize,
            this.pageIndex,
            buildingIds,
            this.includeComplexVisitor
          );
          this.getAppointmentSchedule();
          break;
        case "week":
          this.hideDaterangeFilter();
          // let first = this.todayDateTime.getDate() - this.todayDateTime.getDay();
          // let last = first + 6;
          // let firstDayOfWeek = this.datePipe.transform(new Date(this.todayDateTime.setDate(first)), 'MM/dd/yyyy');
          // let lastDayOfWeek =  this.datePipe.transform(new Date(this.todayDateTime.setDate(last)),  'MM/dd/yyyy');
          let lastDayOfWeek = moment(this.todayDateTime).add(6, 'days').format(this.dateFormat.toUpperCase())
          this.appointmentGetRequestObject(
            searchKey,
            todayDate,
            lastDayOfWeek,
            "",
            "",
            selectedStatus,
            this.pageNewSize,
            this.pageIndex,
            buildingIds,
            this.includeComplexVisitor
          );
          this.getAppointmentSchedule();
          break;
        case "month":
          this.hideDaterangeFilter();
          // let firstDayOfMonth = this.datePipe.transform(new Date(this.todayDateTime.getFullYear(), this.todayDateTime.getMonth(), 1),  'MM/dd/yyyy');
          // let lastDayOfMonth = this.datePipe.transform(new Date(this.todayDateTime.getFullYear(), this.todayDateTime.getMonth() + 1, 0),  'MM/dd/yyyy');
          // let lastDay = this.datePipe.transform(
          //   this.todayDateTime.setDate(this.todayDateTime.getDate() + 30),
          //   this.dateFormat
          // );
          let lastDay = moment(this.todayDateTime).add(30, 'days').format(this.dateFormat.toUpperCase())


          this.appointmentGetRequestObject(
            searchKey,
            todayDate,
            lastDay,
            "",
            "",
            selectedStatus,
            this.pageNewSize,
            this.pageIndex,
            buildingIds,
            this.includeComplexVisitor
          );
          this.getAppointmentSchedule();
          break;
        case "range":
          this.showStatus = "";
          this.selectedStatus = "ALL";
          this.appointmentGetRequestObject(searchKey, this.startDate, this.endDate, "", "", "ALL", "", this.pageIndex, buildingIds, this.includeComplexVisitor);
          this.getAppointmentSchedule();
          break;

        case "buildingFilter":
          this.hideDaterangeFilter();
          this.selectedStatus = "ALL";
          this.appointmentGetRequestObject(searchKey, todayDate, todayDate, "", "", "ALL", "", "", buildingIds, this.includeComplexVisitor);
          this.getAppointmentSchedule();
          break;
      }
    }
  }

  openDateRangeDialog() {
    const dialogRef = this.dialog.open(DateRangeComponent, {
      data: { minDate: this.todayDateTime, format: this.dateFormat.toUpperCase() },
      height: '0px',
      width: '0px',
      panelClass: ["vams-dialog-sm", "vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.dateRange = result.data;
        this.startDate = this.datePipe.transform(this.dateRange.value['start'], this.dateFormat);
        this.endDate = this.datePipe.transform(this.dateRange.value['end'], this.dateFormat);
        this.openDateFilter = true;
        this.onChangeTimeFilter('range', "", "");
      } else {
        // this.toastr.warning("Invalid date range.", "Warning")
      }
    });
  }

  hideDaterangeFilter() {
    this.openDateFilter = false;
  }

  //after click cross date range filter will remove and all values get reset
  onDateFilterClose() {
    this.dateRange.reset();
    this.startDate = "";
    this.endDate = "";
    this.openDateFilter = false;
    // this.onChangeTimeFilter('range', "","");
  }

  async getBuildingData() {
    (await this.dataService.getSampleData()).subscribe((data: any) => {
      this.displayedColumns = Constants.appointment_column;
      this.dataSource = data["data"];
    });
  }

  getAppointmentSchedule(progressiveRender = false) { console.log(this.getAppointmentRequest)
    this.appointmentService.getAllScheduleAppointment(this.getAppointmentRequest).pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        if (progressiveRender) {
          this.appointmentScheduleDetails.data.list.push(...response.data.list);
        } else {
          this.appointmentScheduleDetails = response;
          this.totalData = response.data.totalCount;
          console.log(response)
        } 
        this.changeTime = new Date().getTime();
      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.appointmentScheduleDetails.data.list.length = 0;
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.appointmentScheduleDetails.data.list.length = 0;
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      }
    );
  }

  refreshView() {
    this.pageIndex = 1;
    this.getAppointmentRequest.pageIndex = this.pageIndex;
    this.getAppointmentSchedule();
  }

  onSelectEvent() {
    if (this.selectedStatus === this.showStatus) {
      this.showStatus = "";
      this.selectedStatus = "ALL";
    } else {
      // this.showStatus = value;
      this.selectedStatus = this.showStatus;
    }
    if (this.selectedStatus == "INCHECKOUT") {
      this.onToggleCardAndTableView("grid");
      this.toggleView = "grid";
      // this.appointmentDataShowType = ;
    } else{
      this.onChangeTimeFilter(
        this.timeFilter,
        this.selectedStatus,
        this.searchKey
      );
    }    
  }

  openConfirmationDialog(event) {
    event.stopPropagation();
    if (this.appointmentScheduleDetails.data.list.length > 0) {
      const dialogRef = this.dialog.open(CommonPopUpComponent, {
        data: {
          reason: "",
          pop_up_type: "checkout_confirm",
          icon: "assets/images/error.png"
        },
        panelClass: ["vams-dialog-confirm"]
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.checkOutAllAppointment();
        } else {
        }
      });
    } else {
      this.toastr.warning(this.translate.instant("cardView.NoAppointments"));
    }
  }

  checkOutAllAppointment() {
    this.appointmentService.checkOutAllAppointment(this.getAppointmentRequest).subscribe(
      (resp: any) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
          this.refreshView();
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

  applyFilter(filterValue, clearSearch = false) {
    if (this.hasSearchValue) {
      this.searchKey = filterValue.trim().toLowerCase();
    }
    if (clearSearch) {
      this.onChangeTimeFilter(
        this.timeFilter,
        this.selectedStatus,
        this.searchKey
      );
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
    if (this.appointmentTable && this.appointmentTable.paginator) {
      this.appointmentTable.paginator.firstPage();
    }
  }

  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue, true);
  }

  appointmentGetRequestObject(
    globalSearch,
    fromTime,
    toTime,
    orderBy,
    orderDirection,
    status,
    pageSize,
    pageIndex,
    level2Ids?,
    includeComplexVisitor?
  ): GetAppointmentRequest {
    this.getAppointmentRequest.globalSearch = globalSearch;
    this.getAppointmentRequest.fromTime = status =='INCHECKOUT'? moment(this.todayDateTime).subtract(1, 'days').format(this.dateFormat.toUpperCase()): fromTime ;
    this.getAppointmentRequest.toTime =  status =='INCHECKOUT'? moment(this.todayDateTime).subtract(1, 'days').format(this.dateFormat.toUpperCase()): toTime ;
    this.getAppointmentRequest.orderBy = orderBy;
    this.getAppointmentRequest.orderDirection = orderDirection;
    this.getAppointmentRequest.status = [status]; //['schedule']; default values
    this.getAppointmentRequest.pageSize = pageSize ? pageSize : 21; //20
    this.getAppointmentRequest.pageIndex = pageIndex ? pageIndex : 0; //0
    this.getAppointmentRequest.level2Ids = level2Ids || [];
    this.getAppointmentRequest.includeComplexVisitor = this.includeComplexVisitor;

    return this.getAppointmentRequest;
  }

  dialogClosed(statusObj) {
    if (statusObj && statusObj?.statusCode) {
      if (statusObj.statusCode === 200 && statusObj.errors == null) {
        this.getAppointmentSchedule();
      }
    }
  }

  openScheduleDialog() {
    const dialogRef = this.dialog.open(ScheduleComponent, {
      // disableClose: true ,
      height: "100%",
      width: "600px", 
      position: { right: "0" },
      data: { 
              buildingList:this.allBuildings,
              visitorSettings:this.visitorSettings
            },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        this.dialogClosed(result);
      });
  }
  checkout() {
    this.dialog.open(CheckoutModalComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
  }
  reAuthenticate() {
    this.dialog.open(ReauthenticateComponent, {
      width: "40%",
      height: "100%",
      position: { right: "0" },
      panelClass: ["animate__animated", "animate__slideInRight"],
    });
  }

  onDataChange(appointmentConfig) {
    this.getAppointmentRequest = appointmentConfig;
    this.getAppointmentSchedule();
  }

  loadData(appointmentConfig) {
    this.getAppointmentRequest = appointmentConfig;
    this.getAppointmentSchedule(true);
  }


  openDialogForBulk() {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      height: "100%",
      data: {
        screen: "appointment",
        filepath: "level1/" + this.userDetails?.level1DisplayId + "/bulk-appointment/" + new Date().getTime() + "/",
        title: "appointment_bulk_upload",
        fileAccept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      },
      position: { right: "0" },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((statusObj) => {
        if (statusObj && statusObj?.statusCode) {
          if (statusObj.statusCode === 200 && statusObj.errors == null) {
            this.getAppointmentSchedule();
          }
        }
      });
    // this.dialog.open(SharedModule, {
    //   height: "100%",
    //   position: { right: "0" },
    //   data: {
    //     data: {
    //       employeeUpload: "employeeUpload",
    //       employeeTemplateDownload: "employeeTemplateDownload",
    //     },
    //     formType: "bulkUpload",
    //     mode: "upload",
    //   },
    //   panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    // });
  }

  openBuildingFilterDialog() {
    if (this.selectedBuilding && this.selectedBuilding.length && !(this.buildingButtonText == this.translate.instant("labels.selected_buildings"))) {
      this.allBuildings.forEach(element => {
        this.selectedBuilding.forEach(b => {
          if (b == element.id) {
            element['checked'] = true;
          }
        })
      });
    }
    this.selectBuildingDialog(this.allBuildings);
  }

  buildingList() {
    let reqData = {
      pageSize: 0,
      pageIndex: 0,
      searchStatus: defaultVal.searchStatus,
      orderBy: "name",
      sortBy: "ASC",
      globalSearch: "",
    };
    this.masterService
      .getBuildingsForFilter(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.data && resp.data.list) {
          this.allBuildings = resp.data.list;
          // if (this.allBuildings && this.allBuildings.length) {
          //   this.allBuildings.forEach(element => {
          //     this.selectedBuilding.push(element.id)
          //     element['checked'] = true;
          //   });
          // }
          this.Selectedbuilding()
          this.getDetails();
        } else {
          this.toastr.error(this.translate.instant("pop_up_messages.building_not_found"));
        }
      }, (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        }
      });

  }

  Selectedbuilding(remove?) {
    if (this.allBuildings && this.allBuildings.length) {
      this.allBuildings.forEach(element => {
        this.selectedBuilding.push(element.id)
        if (remove) {
          this.selectedBuilding.forEach(b => {
            if (b == element.id) {
              element['checked'] = false;
            }
          });
        }
      });
    }
  }

  selectBuildingDialog(buildingList) {
    const dialogRef = this.dialog.open(SelectBuildingComponent, {
      // width: '30%',
      height: '70%',
      data: {
        buildingList: buildingList,
        filter: true,
        allselected: this.allBuildingSelected,
        includeComplexVisitor: this.includeComplexVisitor,
        OnlyComplexApnts: this.OnlyComplexApnts
      },
      panelClass: [
        "animate__animated",
        "vams-dialog-sm",
        "vams-dialog-confirm",
      ],
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.filter) {
        this.showButton = true;
        this.selectedBuilding = res.selectedBuilding;
        this.includeComplexVisitor = res.includeComplexVisitor;
        this.OnlyComplexApnts = res.OnlyComplexApnts
        if (res.OnlyComplexApnts) {
          this.buildingButtonText = this.translate.instant("labels.only_complex");
        } else if (res.selectedBuilding.length == this.allBuildings.length) {
          this.buildingButtonText = this.translate.instant("labels.all_buildings");
          this.allBuildingSelected = true;
        } else if (res.selectedBuilding.length > 0) {
          this.buildingButtonText = this.translate.instant("labels.selected_buildings");
          this.allBuildingSelected = false;
        }
      }
      this.onChangeTimeFilter(this.timeFilter, this.selectedStatus, this.searchKey);

    });
  }

  removeSelectedBuilding() {
    this.selectedBuilding = [];
    this.Selectedbuilding(true)
    this.buildingButtonText = this.translate.instant("labels.select_buildings");
    // this.allBuildings = [];
    this.showButton = false
    this.allBuildingSelected = true
    this.includeComplexVisitor = true;
    this.OnlyComplexApnts = false;
    // this.onChangeTimeFilter('today', "ALL", "");
  }

  isLevel1Admin() {
    return this.userService.isLevel1Admin()
  }
  isLevel1Reception() {
    return this.userService.isLevel1Reception()
  }
  scanQrCode(){
    let slides;
    if(this.productType == 'Commercial'){
      slides = 2;
    }else{
      slides = 1;
    }
    const dialogRef = this.dialog.open(DrivingLicenceComponent, {
      height: "100%",
      position: { right: "0" },
      data: {
        showDl:false,
        slide : slides,
        checkinByFoo : true,
        sendNDAs:this.sendNDA,
        visitorSettings:this.visitorSettings,
        appointmentData: null,
        isAccessControlEnabled:this.isAccessControlEnabled,
        activateDLScanScheduledAppointment:this.activateDLScanScheduledAppointment,
        productType : this.productType
      },
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {

      if(result == undefined){
      }else{
        if(this.productType != "Commercial"){
          if( this.visitorSettings.walkinWithBioAuth == false ){ 
            this.printVisitorInfo(result.data.appointmentId,null);
          }
        }
      }
      this.dialogClosed(result);
    });
  }
  appointmentSync(){
    this.subscription=this.appointmentService.getAppointmentSync().pipe(first()).subscribe(response=>{
      if(response.data && response.statusCode==200){
        this.openDiloage(response.data)
      }

    },(error)=>{
      this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
    })
  }

  openDiloage(rowData?) {
    const dialogRef = this.dialog.open(ConfrmSynronizationModalComponent, {
      // width: "40%",
      data: {
      type: rowData,
        // name: this.rowData.name ? this.rowData.name : "",
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ['vams-dialog-confirm'],
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  timeInOut(){
    const dialogRef = this.dialog.open(TimeInOutWithQrComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result) => {
      this.dialogClosed(result);
    });
  }
}
