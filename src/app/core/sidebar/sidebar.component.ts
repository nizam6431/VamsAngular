import { UserService } from 'src/app/core/services/user.service';
import {
  Component,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ThemeService } from "src/app/core/services/theme.service";
import { environment } from "src/environments/environment";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { sideBarBottomMenu,sideBarTopMenu,sequenceOfsideBarBottomMenu,sequenceOfsideBarTopMenu,MenuPermissions } from '../constants/side-menu';
import { ProductTypes } from 'src/app/core/models/app-common-enum';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  permissionKeyObj = permissionKeys
  permissions: any[] = [];
  locationId: number = 0;
  isDarkTheme: any = false;
  locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]");
  locationName: string = "";
  logoUrl: string;
  userShortName: string = "";
  isShowMobileMenu: boolean = false;
  @ViewChild("scheduleappointment") scheduleAppointmentModal: TemplateRef<any>;
  sideBarTopMenu: any[] = [];
  sideBarBottomMenu: any[] = [];
  productType:string;
  productTypes = ProductTypes;
  userDetails: any;

  constructor(
    private themeService: ThemeService,
    private userService: UserService,  
    private dialogService: NgbModal  ) {
    this.locationId = 0;
    this.locationName = "";
    this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;
    this.productType = this.userService.getProductType();
     this.userDetails = this.userService.getUserData()
  }

  ngOnInit(): void {
    
    sequenceOfsideBarTopMenu.forEach((menu)=>{
        if(this.isPermissiable(MenuPermissions.TopMenu[menu]['permissions'])){
          if (menu == 'contractor_pass') {
            if(this.productType == this.productTypes.Enterprise) {
              this.sideBarTopMenu.push(sideBarTopMenu[menu]);
            }
          }
          else if (menu == 'appointments' && (this.userDetails.feature.workFlow == 'SEEPZ' && (this.userDetails.role.shortName == 'L3Admin'))) {
            // dont push appointments
          }
          else{
            this.sideBarTopMenu.push(sideBarTopMenu[menu]);
          }
          
      }
     
        //this if because ,appointment is visible to all,no permission is needed
        // if(menu == 'appointments'){
        //   this.sideBarTopMenu.push(sideBarTopMenu[menu]);
        // }
    })
     console.log(this.sideBarTopMenu)
    sequenceOfsideBarBottomMenu.forEach((menu)=>{
      if(this.isPermissiable(MenuPermissions.BottumMenu[menu]['permissions'])){
        this.sideBarBottomMenu.push(sideBarBottomMenu[menu]);
      }
    })
    console.log(sideBarTopMenu,this.sideBarBottomMenu)
  }

  isPermissiable(permissions:any[]){
    let isPermissable = 0
    permissions.forEach((element)=>{
      if(environment.Permissions[element]){
        isPermissable = 1
      }
    })
    return (isPermissable==1)?true:false;
  }


  scheduleAppointment() {
    this.dialogService.open(this.scheduleAppointmentModal, {
      centered: true,
      backdrop: "static",
      keyboard: false,
      windowClass: "slideInUp",
    });
  }

  appointmentScheduled(event: any) {}
}
