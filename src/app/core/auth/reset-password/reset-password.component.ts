import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/core/services/account.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { ConfirmedValidator } from 'src/app/core/validators/confirmPassword';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from '../../constants/rest-api.constants';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  errors: any[] = [];
  languages: any[] = [];
  showPassword = false; successMessage: string = "";
  showTooltip: boolean = true;
  currentSlide: number = 1;
  @ViewChild('passwordField', { static: false }) passwordField: ElementRef;
  @Output() showPrivaycPolicy = new EventEmitter();
  isPassword8CharLong: boolean = false;
  isPasswordContainsLowerCaseChar: boolean = false;
  isPasswordContainsUpperCaseChar: boolean = false;
  isPasswordContainsNumber: boolean = false;
  isPasswordContainsSpecialChar: boolean = false;
  logoUrl: string;
  forgotPassword: boolean = false;
  private restApi;
  constructor(
    private _fb: FormBuilder,
    private accountService: AccountService,
    private themeService: ThemeService,
    private authenticationService: AccountService,
    private titleService: Title,
    private router: Router,
    private dialogService: NgbModal,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
    private translate: TranslateService,
    public dialog: MatDialog,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
    this.logoUrl = this.commonService.getLogo();
    this.titleService.setTitle("Reset Password");
    let newForm = this._fb.group({
      newpassword: ['', [Validators.required, Validators.pattern("^.*(?=.{8,})(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!*@#$%^&+=]).*$")]],
      confirmpassword: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('newpassword', 'confirmpassword')
    });

    this.resetPasswordForm = newForm;
    this.commonService.getLanguages(environment.CompanyAPIURL,
      environment.CompanyId).pipe(first()).subscribe(data => {
        this.languages = data.Data;
      });
  }

  ngOnInit(): void {
    if (this.router.url.split("/")[2] && this.router.url.split("/")[2] == "forgot-password") {
      this.forgotPassword = true;
    }
  }

  passwordChanged() {
    if (this.newpassword?.value.length >= 8) {
      this.isPassword8CharLong = true;
    }
    else {
      this.isPassword8CharLong = false;
    }
    this.showTooltip = (this.isPasswordContainsSpecialChar && this.isPasswordContainsUpperCaseChar &&
      this.isPasswordContainsLowerCaseChar && this.isPasswordContainsNumber) ? false : true;
    this.isPasswordContainsSpecialChar = /[*@!#%&()^~{}]+/.test(this.newpassword?.value);
    this.isPasswordContainsUpperCaseChar = /[A-Z]+/.test(this.newpassword?.value);
    this.isPasswordContainsLowerCaseChar = /[a-z]+/.test(this.newpassword?.value);
    this.isPasswordContainsNumber = /[0-9]+/.test(this.newpassword?.value);


  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword ? 'text' : 'password';
  }


  updateLanguage(languageAbbrevation: string, isRTL: boolean) {
    this.themeService.updateLanguageAndSetTheme(languageAbbrevation, isRTL);
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.accountService.resetPassword(this.newpassword?.value,
      this.confirmpassword?.value, JSON.parse(localStorage.getItem('currentUserToken')), this.forgotPassword)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.toastr.success(data.message, this.translate.instant("toster_message.success"));
          this.router.navigate(["auth/login"], { state: { 'from': 'reset-password' }, skipLocationChange: true });
        }, (error: any) => {
          if (error && error.error && 'errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
            })
          }
          else {
            this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
          }
          // this.toastr.error(error.Message, 'Error');
          // this.router.navigate(["auth/login"]);
        });
  }

  closeModal() {
    this.dialogService.dismissAll("Just closing modal");
    this.router.navigate([localStorage.getItem('companyCode') + '/auth/login']);
  }

  get newpassword() { return this.resetPasswordForm.get('newpassword'); }
  get confirmpassword() { return this.resetPasswordForm.get('confirmpassword'); }



}
