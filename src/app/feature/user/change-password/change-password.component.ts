import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms/";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { AccountService } from "src/app/core/services/account.service";
import { CommonService } from "src/app/core/services/common.service";
import { ThemeService } from "src/app/core/services/theme.service";
import { UserService } from "src/app/core/services/user.service";
import { ConfirmedValidator } from "src/app/core/validators/confirmPassword";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  errors: any[] = [];
  languages: any[] = [];
  showPassword = false;
  showOldPassword = false;
  showNewPassword = false;
  successMessage: string = "";
  @ViewChild("passwordField", { static: false }) passwordField: ElementRef;
  @ViewChild("oldPasswordField", { static: false }) oldPasswordField: ElementRef;
  @ViewChild("newPasswordField", { static: false })
  newPasswordField: ElementRef;

  isPassword8CharLong: boolean = false;
  isPasswordContainsLowerCaseChar: boolean = false;
  isPasswordContainsUpperCaseChar: boolean = false;
  isPasswordContainsNumber: boolean = false;
  isPasswordContainsSpecialChar: boolean = false;
  logoUrl: string;
  showTooltip: boolean = true;
  showOldPwd: boolean;
  constructor(
    private _fb: FormBuilder,
    private accountService: AccountService,
    private themeService: ThemeService,
    private authenticationService: AccountService,
    private titleService: Title,
    private router: Router,
    private dialogService: NgbModal,
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private translate:TranslateService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cd: ChangeDetectorRef
  ) {
    this.titleService.setTitle("Change Password");
    let newForm = this._fb.group(
      {
        oldpassword: ["", [Validators.required]],
        newpassword: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^.*(?=.{8,})(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=]).*$"
            ),
          ],
        ],
        confirmpassword: ["", [Validators.required]],
      },
      {
        validator: ConfirmedValidator("newpassword", "confirmpassword"),
      }
    );

    this.changePasswordForm = newForm;
  }

  ngOnInit(): void {
    this.showOldPwd = this.data.invokeFrom === "employeeForm" ? false : true;
    if (!this.showOldPwd) this.changePasswordForm.removeControl("oldpassword");
  }

  passwordChanged() {
    if (this.newpassword?.value.length >= 8) {
      this.isPassword8CharLong = true;
    } else {
      this.isPassword8CharLong = false;
    }
    this.showTooltip =
      this.isPasswordContainsSpecialChar &&
      this.isPasswordContainsUpperCaseChar &&
      this.isPasswordContainsLowerCaseChar &&
      this.isPasswordContainsNumber
        ? false
        : true;

    this.isPasswordContainsSpecialChar = /[*@!#%&()^~{}]+/.test(
      this.newpassword?.value
    );
    this.isPasswordContainsUpperCaseChar = /[A-Z]+/.test(
      this.newpassword?.value
    );
    this.isPasswordContainsLowerCaseChar = /[a-z]+/.test(
      this.newpassword?.value
    );
    this.isPasswordContainsNumber = /[0-9]+/.test(this.newpassword?.value);
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword
      ? "text"
      : "password";
  }

  toggleNewPasswordShow() {
    this.showNewPassword = !this.showNewPassword;
    this.newPasswordField.nativeElement.type = this.showNewPassword
      ? "text"
      : "password";
  }

  toggleOldPasswordShow() {
    this.showOldPassword = !this.showOldPassword;
    this.oldPasswordField.nativeElement.type = this.showOldPassword
      ? "text"
      : "password";
  }

  changePassword() {
    this.successMessage = "";
    this.errors = [];
    if (this.changePasswordForm.invalid) {
      return;
    }
    let oldPassword, employeeId;
    if (this.showOldPwd) {
      oldPassword = this.oldpassword?.value;
      employeeId = this.userService.getUserData().employeeId;
    } else {
      oldPassword = null;
      employeeId = this.data.employeeData.displayId;
    }

    this.accountService
      .changePassword(
        oldPassword,
        this.newpassword?.value,
        this.confirmpassword?.value,
        employeeId
      )
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.toastr.success(data.message, this.translate.instant("pop_up_messages.success"));
          if (this.showOldPwd) {
            this.dialogRef.close();
            this.dialog.closeAll();
            localStorage.removeItem("currentUserToken"); 
            this.userService.setUserData(null);
            this.router.navigate(["auth/login"]);
          } else {
            this.dialogRef.close();
          }
        },
        (error: any) => {
          this.toastr.error(error.error.Message,this.translate.instant("pop_up_messages.error"));
        }
      );
  }

  closeModal() {
    this.dialogService.dismissAll("Just closing modal");
    // this.accountService.logout();
  }

  cancel() {
    this.dialogRef.close();
  }

  get newpassword() {
    return this.changePasswordForm.get("newpassword");
  }
  get confirmpassword() {
    return this.changePasswordForm.get("confirmpassword");
  }
  get oldpassword() {
    return this.changePasswordForm.get("oldpassword");
  }
}
