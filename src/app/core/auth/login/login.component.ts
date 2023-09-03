import {
  Component,
  ElementRef,
  ErrorHandler,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { catchError, first } from "rxjs/operators";
import { parseErrors } from "src/app/core/functions/functions";
import { ErrorsService } from "src/app/core/handlers/errorHandler";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { EncrDecrService } from "src/app/core/services/encryptionDecryptionService";
import { environment } from "src/environments/environment";
import { AccountService } from "../../services/account.service";
import { CommonService } from "../../services/common.service";
import { ThemeService } from "../../services/theme.service";
import { UserService } from "../../services/user.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { SelectBuildingComponent } from "../../../shared/components/select-building/select-building.component";
import { Level, Level2Roles, Level1Roles, defaultVal } from "../../models/app-common-enum";
import { MasterService } from "src/app/feature/master/services/master.service";
import { ConfirmLoginComponent } from "src/app/shared/components/confirm-login/confirm-login.component";
import { PrivacyPolicyAndTermsConditionComponent } from "../privacy-policy-and-terms-condition/privacy-policy-and-terms-condition.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  languages: any[] = [];
  errors: any[] = [];
  isDarkTheme: boolean = false;
  currentTheme: string = "";
  companyCode: string = "";
  showPassword = false;
  logoUrl: string;
  isExcel: boolean = false;
  isForgotPassword: boolean = true;
  selectedBuilding = null;
  userDetails: any;
  isLoggedIn: boolean = true;
  doc: any;
  @ViewChild("passwordField", { static: false }) passwordField: ElementRef;
  loginData: any;
  isForceUpdate: boolean = false;
  goToCheckLogin: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private router: Router,
    private dashboardService: DashboardService,
    private accountService: AccountService,
    private themeService: ThemeService,
    private encryptionService: EncrDecrService,
    private titleService: Title,
    private errorService: ErrorsService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private userService: UserService,
    public dialog: MatDialog,
    private masterService: MasterService,
    private route: ActivatedRoute
  ) {
    let extraNavigation = this.router.getCurrentNavigation();
    if (extraNavigation && extraNavigation.extras && extraNavigation.extras.state) {
      if (extraNavigation.extras.state.from && (extraNavigation.extras.state.from == "reset-password")) {
        this.goToCheckLogin = false;
      }
      else {
        this.goToCheckLogin = true;
      }
    }
    this.checkIfLoggedIn();
    this.logoUrl = this.commonService.getLogo();
    this.titleService.setTitle("User Login");
    let newForm = this._fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
      rememberme: [, []],
    });

    this.loginForm = newForm;
    // this.commonService.getLanguages(environment.CompanyAPIURL,
    //   environment.CompanyId).pipe(first()).subscribe(data => {
    //     this.languages = data.Data;
    //   });

    this.isDarkTheme = this.themeService.currentThemeValue.indexOf("dark") > -1;
  }

  ngOnInit(): void {
    // if(!this.checkIfLoggedIn()) {
    this.isExcel = environment.IsExcel;
    this.isForgotPassword = environment.IsForgotPassword;
    if (!this.isExcel) {
      this.loginForm.controls.email.setValidators([Validators.required]);
    }
    // }
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword
      ? "text"
      : "password";
  }

  updateLanguage(languageAbbrevation: string, isRTL: boolean) {
    this.themeService.updateLanguageAndSetTheme(languageAbbrevation, isRTL);
  }

  login() {
    this.errors = [];
    if (this.loginForm.invalid) {
      return;
    }
    this.loginEndpointCalls(
      this.email?.value,
      this.password?.value,
      this.rememberme?.value
    );
  }

  // async getBuildingData() {
  //   (await this.companyServiceObject.getSampleData()).subscribe((data: any) => {
  //     // this.displayedColumns = Object.keys((data['data'][0]));
  //     this.dataSource = data['data'];
  //   });
  // }

  goToHomePage(data: any) {

    if (data?.data?.isLoggedInOnAntherDevice) {
      this.openDiloage()
    } else {
      localStorage.setItem(
        "currentUserToken",
        JSON.stringify(data.data.jwtToken)
      );
      this.userDetails = data;
      let setData = true;
      if (this.userDetails.data.employeeOf == Level.Level1) {
        if (data.data.level2List && data.data.level2List.length === 1) {
          this.userDetails.data["selectedBuilding"] = data.data.level2List[0];
        } else if (data.data.level2List && data.data.level2List.length > 1) {
          if (
            data.data.role &&
            (data.data.role.shortName === Level2Roles.l2Reception ||
              data.data.role.shortName === Level2Roles.l2Security)
          ) {
            setData = false;
            this.selectBuildingDialog(data.data.level2List);
          }
        }
      }

      if (setData) {
        this.setUserDetails(data);
      }


      // this.userService.setUserData(data.data)
      // localStorage.setItem('currentUserToken', JSON.stringify(data.data.jwtToken));
      // this.toastr.success(data.message, 'Success');
      // TODO: Add password change based on first time login
      // if (data.isPwdResetRequired) {
      //   this.router.navigate(['josh/auth/reset-password']);
      // }
      // else {
      // if(this.userService.getUserData().isPwdResetRequired) {
      //   this.router.navigate(['auth/reset-password']);
      //   } else {
      //this.router.navigate(['auth/reset-password', {jwt: JSON.parse(localStorage.getItem('currentUserToken'))}]);
      // this.router.navigate(['dashboard']);
      //}
      // }
    }
  }

  loginEndpointCalls(email: string, password: string, rememberme: boolean) {
    this.accountService
      .login(email, password, this.isForceUpdate)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data.statusCode === 200 && data.errors == null) {
            if (data.data && data.data.isPwdResetRequired) {
              this.goToReset(data.data.invitationToken);
            } else {
              this.goToHomePage(data);
            }
          }
        },
        (error: any) => {
          this.errors = parseErrors(error);
          this.clearRememberMeCookies();
          if (error.status == 401) {
            this.errors.push(error.error.error_description);
          }
        }
      );
  }


  goToReset(invitationToken) {
    let URL = "/auth/reset-password/" + invitationToken;
    this.router.navigate([URL]);
  }

  authLoginUser(data) {

  }


  openDiloage(rowData?) {
    const dialogRef = this.dialog.open(ConfirmLoginComponent, {
      // width: "40%",
      data: {
        // type: this.type,
        // name: this.rowData.name ? this.rowData.name : "",
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ['vams-dialog-confirm'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isForceUpdate = true;
        this.login();
      }
    });
  }

  buildingListForComplex() {
    let reqData = {
      pageSize: defaultVal.pageSize,
      pageIndex: defaultVal.pageIndex,
      searchStatus: defaultVal.searchStatus,
      orderBy: "name",
      sortBy: "ASC",
      globalSearch: "",
    };
    this.masterService
      .getBuildings(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.selectBuildingDialog(resp.data.list);
        }
      });
  }

  setUserDetails(data) {
    this.userService.setUserData(data.data);
     this.userDetails = this.userService.userData;
    // this.toastr.success(data.message, 'Success');
    // TODO: Add password change based on first time login
    // if (data.isPwdResetRequired) {
    //   this.router.navigate(['josh/auth/reset-password']);
    // }
    // else {
    // if(this.userService.getUserData().isPwdResetRequired) {
    //   this.router.navigate(['auth/reset-password']);
    //   } else {
    //this.router.navigate(['auth/reset-password', {jwt: JSON.parse(localStorage.getItem('currentUserToken'))}]);
    this.loginData = data;
    if (environment.Permissions && environment.Permissions['superAdmin']) {
      this.goToNext();
    }
    else {
      if (data.data.isPPAccept == null || data.data.isTCAccept == null) {
        this.openDialogPolicyAccept(this.loginData.data);
      }
      else {
        this.goToNext();
      }
    }

    //}
    // }
  }

  goToNext() {
     this.userDetails = this.userService.getUserData();
    if (environment.Permissions && environment.Permissions['superAdmin']) {
      this.router.navigate(["accounts"]);
    } else {
      console.log("test==================================",this.userDetails)
      if (this.userDetails?.feature?.workFlow == "SEEPZ" &&( this.userDetails.role.shortName == "L3Admin")) {
        console.log("---------------->", this.userDetails?.feature?.workFlow, this.userDetails.role.shortName)
         console.log("navigate  to PermanentPass")
         this.router.navigate(["permanentPass"]);
      } else {
         console.log("navigate  to appointment")
         this.router.navigate(["appointments"]);
      }
    }
  }

  selectBuildingDialog(buildingList) {
    const dialogRef = this.dialog.open(SelectBuildingComponent, {
      // width: '30%',
      // height: '50%',
      data: { buildingList: buildingList },
      panelClass: [
        "animate__animated",
        "vams-dialog-sm",
        "vams-dialog-confirm",
      ],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.setBuilding(result.id, (res) => {
        if (res.statusCode == 200) {
          this.selectedBuilding = result;
          this.userDetails.data["selectedBuilding"] = result;
          this.setUserDetails(this.userDetails);

          // this.openDialogPolicyAccept(this.loginData);
        }

        //TODO what if error occure while setting the building
      });
    });
  }

  setBuilding(buildingId, Callback) {
    let reqObj = {
      level2Id: buildingId,
    };
    this.accountService.changeBuilding(reqObj).subscribe((res) => {
      return Callback(res);
    });
  }

  clearRememberMeCookies() {
    // this.cookieService.delete('username');
    // this.cookieService.delete('rememberme');
    // this.cookieService.delete('password');
  }

  themeChange(event: any) {
    var selectedTheme = event.currentTarget.checked;
    if (selectedTheme) {
      if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
        this.themeService.loadStyle("style-dark-rtl.css");
        this.themeService.loadMenuStyle("menu-dark-rtl.css");
      } else {
        this.themeService.loadStyle("style-dark.css");
        this.themeService.loadMenuStyle("menu-dark.css");
      }
      this.logoUrl = this.commonService.getLogo();
    } else {
      if (this.themeService.currentThemeValue.indexOf("rtl") > -1) {
        this.themeService.loadStyle("style-rtl.css");
        this.themeService.loadMenuStyle("menu-rtl.css");
      } else {
        this.themeService.loadStyle("style.css");
        this.themeService.loadMenuStyle("menu.css");
      }
      this.logoUrl = this.commonService.getLogo();
    }
  }

  getApiUrl() {
    return environment.CompanyAPIURL;
  }

  getCompanyId() {
    return environment.CompanyId;
  }

  get email() {
    return this.loginForm.get("email");
  }
  get password() {
    return this.loginForm.get("password");
  }
  get rememberme() {
    return this.loginForm.get("rememberme");
  }
  checkIfLoggedIn(): any {
    if (this.userService.getUserToken() !== null && this.goToCheckLogin) {
      this.userService.reAuthenticateToken().pipe(first()).subscribe(data => {
        if (data) {
          let dataf = this.userService.getUserData();
          if (dataf.isPPAccept == null || dataf.isTCAccept == null) {
            this.openDialogPolicyAccept(dataf);
            return true;
          } else {
            console.log("test")
            environment.Subdomain == "sysadmin" ? this.router.navigate(['/accounts']) : this.router.navigate(['/appointments']);
            this.isLoggedIn = true;
            return true;
          }
        } else {
          this.isLoggedIn = false;
          return false;
        }
      }, error => {
        this.isLoggedIn = false;
        return false
      })
    } else {
      this.isLoggedIn = false;
      return false;
    }
  }
  openDialogPolicyAccept(data) {
    const dialogRef = this.dialog.open(PrivacyPolicyAndTermsConditionComponent, {
      disableClose: true,
      data: {
        data: data
      },
      panelClass: ['vams-dialog-document'],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.goToNext();
      }
    });
  }
}
