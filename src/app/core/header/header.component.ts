import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { TranslateCacheService } from "ngx-translate-cache";
import { Subscription } from "rxjs";
import s3ParseUrl from 's3-url-parser';
import { ErrorsService } from "src/app/core/handlers/errorHandler";
import { AccountService } from "src/app/core/services/account.service";
import { CommonService } from "src/app/core/services/common.service";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { UserService } from "src/app/core/services/user.service";
import { AppointmentService } from "src/app/feature/appointment/services/appointment.service";
import { ChangePasswordComponent } from "src/app/feature/user/change-password/change-password.component";
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { environment } from "src/environments/environment";
import { MobileMenuComponent } from "../../common-pages/mobile-menu/mobile-menu.component";
import { AccessQrCodeComponent } from "../../feature/master/access-qr-code/access-qr-code.component";
import { accessCantrol } from '../../feature/master/constants/dropdown-enums';
import { convertToBinary, encode, handleIamge } from "../functions/functions";
import { Level, Level2Roles, Level3Roles, ProductTypes } from "../models/app-common-enum";
// import { SignalRService } from "src/app/feature/appointment/services/signal-r.service";
import { MyProfileModalComponent } from "../my-profile-modal/my-profile-modal.component";
import { ProfilePageModalComponent } from "../profile-page-modal/profile-page-modal.component";
import { PayNowComponent } from "../pay-now/pay-now.component";
import { SOSComponent } from "../sos/sos.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  @Output() Signal_R_Emittir =  new EventEmitter();
  acessCantrolList = (accessCantrol);
  isShowSettingMenu: boolean = false;
  isShowProfileMenu: boolean = false;
  isShowWalkin: boolean = false;
  @ViewChild("profilebutton") toggleButton: ElementRef;
  @ViewChild("profileMenu") profileMenu: ElementRef;
  @ViewChild("settingbutton") settingbutton: ElementRef;
  @ViewChild("settingMenu") settingMenu: ElementRef;

  @ViewChild("user") user: ElementRef;
  @ViewChild(MobileMenuComponent) mobileMenu: MobileMenuComponent;

  @ViewChild("scheduleappointment") scheduleAppointmentModal: TemplateRef<any>;

  isDarkTheme: any = false;
  permissions: any[] = [];
  locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]");
  locationId: number = 0;
  locationName: string = "";
  logoUrl: any;
  userShortName: string = "";
  isProfileMenuOpen: boolean = false;
  title: string = "Master";
  userDetails;
  selectedBuilding = null;
  buildingList = [];
  userLevel;
  subscription: Subscription
  userFullName: string;
  showBuildingName = ""
  showQrCodeMenu: boolean;
  connectionId: any;
 productType:string;
 productTypeList = ProductTypes;
  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2,
    private authenticationService: AccountService,
    private errorService: ErrorsService,
    private dialogService: NgbModal,
    private dashboardService: DashboardService,
    private commonService: CommonService,
    private titleService: Title,
    public userService: UserService,
    private toastr: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
    private appointmentService:AppointmentService,
    public translateCacheService:TranslateCacheService
    // public signalRService: SignalRService,

  ) {
    // this.getConnectionId();
     this.productType = this.userService.getProductType();
    this.userDetails = this.userService.getUserData(); console.log(this.userDetails)
    if((convertToBinary((this.userDetails?.accessControl)?(this.userDetails?.accessControl):(0))).includes(parseInt(this.acessCantrolList['QR']))){
      this.showQrCodeMenu = (this.userDetails.role.shortName == Level3Roles.l3Host || this.userDetails.role.shortName == Level3Roles.l3Admin || this.userDetails.role.shortName == Level3Roles.l3Reception)?true:false;
    }
    this.userFullName = this.userDetails?.firstName+" "+this.userDetails?.lastName;
    if (this.userDetails) {
      this.userShortName =
        this.userDetails.firstName.charAt(0) +
        this.userDetails.lastName.charAt(0);
      this.userLevel = this.userDetails.employeeOf;
      if (this.userLevel == Level.Level1) {
        this.level2BuildingList();
      }
    }
    this.getLogo();
    this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;

    this.renderer.listen("document", "click", (e: Event) => {
      this.isProfileMenuOpen = false;
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.title = navigation.extras.state.title;
    } else {
      this.title = "Dashboard";
    }
    this.subscription = this.commonService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
  }

  async getLogo(){
    this.logoUrl = await handleIamge(this.commonService.getLogo(),this.fileUploadService,this._sanitizer)
  }

  // async getConnectionId(){
  //   // this.connectionId = await this.signalRService.getConnectionId();
  //   if(this.connectionId == null){
  //     await this.signalRService.hubConnectionId.subscribe(id => {
  //       this.connectionId = id;
  //     })
  //   }
  // }

  

  ngOnInit(): void {
    this.commonService.on("LOGO_CHANGED").subscribe(event => {
      this.handleLogo(event.payload.light)
    });

    this.userService.on("BUILDING_CHANGED").subscribe(event => {
      if(this.userDetails && this.userDetails.level2List) {
        this.userDetails['level2List'].map((ele) => {
          if(ele.id == event.payload.level2Id) {
              ele.name = event.payload.name;
              ele.status = event.payload.status;
              this.userDetails.selectedBuilding = ele;
          }
        });
      }
    });
  }

  toggleMenu(e) {
    e.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  openDialog(screen) {
    if(screen == 'password'){
      const dialogRef = this.dialog.open(ChangePasswordComponent, {
        height: "100%",
        position: { right: "0" },
        data: {},
        panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
      });
    }
    else{
      const dialogRef = this.dialog.open(AccessQrCodeComponent, {
        height: "100%",
        position: { right: "0" },
        data: {
          'fileName':this.userDetails?.firstName+" "+this.userDetails?.lastName,
          'employeedata':this.userDetails
        },
        panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
      });
    }
  }

  selectBuilding() {
    // this.deleteSignalR();
    let building = this.buildingList.filter(
      (building) => building.id == this.selectedBuilding
    );
    this.setBuilding(building[0].id, (res) => {
      if (res.statusCode == 200) {
        this.reformatBuildingList(building[0]);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
        }
        this.router.onSameUrlNavigation = 'reload';
        switch (this.router.url) {
          case '/visitors':
            this.router.navigate(["visitors"]);            
            break;        
          case '/reports':
            this.router.navigate(["reports"]);            
            break;
          default:
            this.router.navigate(["appointments"]);
            break;
        }

      } else {
        this.selectedBuilding = null;
        let message = res.message
          ? res.message
          : this.translate.instant("pop_up_messages.something_went_wrong");
        this.toastr.error(message, this.translate.instant("toster_message.error"));
      }
    });
  }

  reformatBuildingList(building) {
    this.userDetails['level2List'].map((ele) => {
      if(ele.id == this.userDetails["selectedBuilding"]["id"]) {
        ele.isDefault = false;
      }
    });
    this.userDetails['level2List'].map((ele) => {
      if(ele.id == building.id) {
        ele.name = building.name;
        ele.isDefault = true;
        this.userDetails["selectedBuilding"] = ele;
      }
    });
    this.userService.setUserData(this.userDetails);
  }

  setBuilding(buildingId, Callback) {
    let reqObj = {
      level2Id: buildingId,
    };
    this.authenticationService.changeBuilding(reqObj).subscribe((res) => {
      return Callback(res);
    });
  }

  level2BuildingList() {
    if (this.userDetails.level2List && this.userDetails.role) {
      if (this.userDetails.role.shortName === Level2Roles.l2Admin) {
        this.buildingList = this.userDetails.level2List
        if(this.userDetails.selectedBuilding) {
          this.selectedBuilding = this.userDetails.selectedBuilding.id;
        } else if (
          this.buildingList.length == 1 &&
          !this.userDetails.selectedBuilding
        ) {
          this.selectedBuilding = this.buildingList[0].id;
          this.selectBuilding();
        } else {
          let defaultBuilding = this.buildingList.filter(
            (building) => building.isDefault == true
          );
          if (defaultBuilding.length > 0) {
            this.selectedBuilding = defaultBuilding[0].id;
            this.userDetails["selectedBuilding"] = defaultBuilding[0];
            this.userService.setUserData(this.userDetails);
            // this.selectBuilding();
          }
        }
      } else if ((this.userDetails.role.shortName === Level2Roles.l2Reception || this.userDetails.role.shortName === Level2Roles.l2Security) && this.userDetails.selectedBuilding) {
        this.selectedBuilding = this.userDetails.selectedBuilding.id;
        this.buildingList.push(this.userDetails.selectedBuilding);
      }
    }
  }

  // async deleteSignalR(){
  //   this.subscription.unsubscribe();
  //   if(this.connectionId!=null){
  //     this.appointmentService.deleteSignalRConnection(this.connectionId).subscribe(data => {
  //       this.signalRService.getBroadcastAppointmentData();
  //       this.connectionId = null
  //     });
  //   }
  // }

  logout() {
    // this.deleteSignalR();
    this.Signal_R_Emittir.emit({"type":"logout"})
    this.authenticationService
      .logout(
        this.userService.getUserData().employeeId,
        this.userService.getUserData().currentConnectionId
      )
      .subscribe((res) => {
        if (res.errors == null && res.statusCode === 200) {
          // this.toastr.success(res.message, 'Success');
          this.translateCacheService.init();
          this.userService.setUserData(null);
          localStorage.clear();
          this.router.navigate(["/auth/login"]);
        }
      });
  }

  menuMouseAction(event: MouseEvent, ishover: any): void {
    event.stopPropagation();
    var target = event.target as Element;
    if (!ishover) {
      if (target.querySelector("ul") != null) {
        target.querySelector("ul")!.style.display = "none";
      }
    } else {
      if (target.querySelector("ul") != null) {
        target.querySelector("ul")!.style.display = "block";
      }
    }
  }

  toggleWalkin() {
    this.isShowWalkin = !this.isShowWalkin;
  }

  hasPermission(action: string) {
    return this.permissions.find((element) => {
      return element.PermissionKey == action;
    })?.IsPermissible;
  }

  appointmentScheduled(event: any) {}

  scheduleAppointment() {
    this.dialogService.open(this.scheduleAppointmentModal, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  openChangeLanguage(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async handleLogo(url){
    try{
      let parserContent = s3ParseUrl(url);
      let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + encode(resp?.Body));
    }
    catch(e){
      let parserContent = s3ParseUrl(environment.defaultLogoUrl);
      let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + encode(resp?.Body));
    }
  }

  /*  change made for my profile for aditya */
  // myProfile(){
  //   const dialogRef = this.dialog.open(MyProfileModalComponent, {
  //     height: "100%",
  //     position: { right: "0" },
  //     data: {},
  //     panelClass: ["animate__animated", 'vams-dialog-xl', "animate__slideInRight"],
  //   });
  // }

  myProfile(){
      const dialogRef = this.dialog.open(ProfilePageModalComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", 'vams-dialog-xs', "animate__slideInRight"],
    });
  }

  openSOS(){
    const dialogRef = this.dialog.open(SOSComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", 'vams-dialog-xl', "animate__slideInRight"],
    })
    dialogRef.afterClosed().subscribe(result => {
      // this.getProviderList()
      if (result) {
        this.sosSuccessPopup();
      }
    });;
  }
  sosSuccessPopup() {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "SOS",
        name: "",
        pop_up_type: "SOS",
        icon: "assets/images/success.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.deleteProvider();
      }
    });
  }



  // Razor pay code start
  openPayDialog(screenType: string) {
    const dialogRef = this.dialog.open(PayNowComponent, {
      height: "100%",
      width:"50%",
      position: { right: "0" },
      data: { data: null, formType: "location", mode: "add" },
      panelClass: ["animate__animated", "vams-dialog", "complex-contractorsCcompany-dialog", "animate__slideInRight"],
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.getProviderList()
      if (result) {
        //this.sosSuccessPopup();
      }
    });;
    // dialogRef
    //   .afterClosed()
    //   .pipe(first())
    //   .subscribe((result) => {
    //     this.dialogClosed(result);
    //   });
  }
}
