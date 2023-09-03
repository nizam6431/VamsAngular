import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { AccountService } from 'src/app/core/services/account.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css']
})
export class MobileMenuComponent implements OnInit {
  isDarkTheme: boolean = false;
  logoUrl: string = "";
  permissions: any[] = [];
  locationId: number = 0;
  locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]").sort((n1: any, n2: any) => {
    if (n1.LocationName > n2.LocationName) {
      return 1;
    }
    if (n1.LocationName < n2.LocationName) {
      return -1;
    }
    return 0;
  });
  @ViewChild('mobilemenu') mobilemenu: ElementRef;
  userName: string = "";
  userThumbnail: string = ""
  constructor(private authenticationService: AccountService,
    private themeService: ThemeService,
    private errorService: ErrorsService,
    private dashboardService: DashboardService,
    private dialogService: NgbModal,
    private commonService: CommonService) {
    this.logoUrl = this.commonService.getLogo();
    var currentLocation = JSON.parse(localStorage.getItem("currentLocation")!);
    this.locationId = Number(currentLocation.LocationId);
    this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;
    this.userName = authenticationService.currentUserValue.FirstName + " " +
      authenticationService.currentUserValue.LastName;
  }

  ngOnInit(): void {
  }

  themeChange(event: any) {
    var selectedTheme = event.currentTarget.checked;
    if (selectedTheme) {
      if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
        this.themeService.loadStyle("style-dark-rtl.css");
        this.themeService.loadMenuStyle("menu-dark-rtl.css");
      }
      else {
        this.themeService.loadStyle("style-dark.css");
        this.themeService.loadMenuStyle("menu-dark.css");
      }
      this.logoUrl = this.commonService.getLogo();
      this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;
    }
    else {
      if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
        this.themeService.loadStyle("style-rtl.css");
        this.themeService.loadMenuStyle("menu-rtl.css");
      }
      else {
        this.themeService.loadStyle("style.css");
        this.themeService.loadMenuStyle("menu.css");
      }
      this.logoUrl = this.commonService.getLogo();
      this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;
    }
  }

  // logout() {
  //   this.authenticationService.logout();
  // }

  hasPermission(action: string) {
    return (this.permissions.find(element => {
      return element.PermissionKey == action;
    })?.IsPermissible)
  }

  getNativeElement() {
    return this.mobilemenu.nativeElement;
  }

  openChangeLanguage(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
  }
}
