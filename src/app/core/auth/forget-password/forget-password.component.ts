import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/core/services/account.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  languages: any[] = [];
  errors: any[] = [];
  forgetPasswordForm: FormGroup;
  successMessage: string = "";
  logoUrl: string;
  placeholderEmail: any;
  constructor(
    private router: Router,
    private commonService: CommonService,
    private _fb: FormBuilder,
    private accountService: AccountService,
    private themeService: ThemeService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.logoUrl = this.commonService.getLogo();
    let newForm = this._fb.group({
      email: ['', Validators.required],
    });

    this.forgetPasswordForm = newForm;
    // var companyData = this.dbService.getByKey('CompanyData', localStorage.getItem("companyCode") ?? '')
    //   .subscribe((key: any) => {
    //     this.commonService.getLanguages(key.API_URL,
    //       key.CompanyId).pipe(first()).subscribe(data => {
    //         this.languages = data.Data;
    //       });
    //   });
  }

  ngOnInit(): void {
    this.placeholderEmail = this.translate.instant("placeholders.email_and_userName")
  }

  forgetPassword() {
    this.errors = [];
    this.successMessage = "";
    if (this.forgetPasswordForm.invalid) {
      return;
    }
    this.accountService.forgetPassword(this.email?.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.toastr.success(this.translate.instant("toster_message.check_email_admin"));
          if (data && data.statusCode == 200) {
            this.forgetPasswordForm.reset();
            this.goToLogin();
          }
        }, (error: any) => {
          if (error.error && error.error.Message && error.error.Message == this.translate.instant("toster_message.contact_admin")) {
            this.openDialog();
          } else {
            this.toastr.success(this.translate.instant("toster_message.check_email_admin"));
            this.goToLogin();
          }
        });
    //   if (data && data.statusCode == 200) {
    //     this.toastr.success(data.message, 'Success');
    //     // this.successMessage = data.message;
    //     this.forgetPasswordForm.reset();
    //   } else {
    //     this.toastr.error("Please try again later.", 'Error');
    //   }
    // }, (error: any) => {
    //   this.toastr.error("Something went wrong", 'Error');
    // });
  }

  openDialog() {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        pop_up_type: "contact_admin",
        icon: "assets/images/success.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.goToLogin();
    });

  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  updateLanguage(languageAbbrevation: string, isRTL: boolean) {
    this.themeService.updateLanguageAndSetTheme(languageAbbrevation, isRTL);
  }

  getApiUrl() {
    return environment.CompanyAPIURL;
  }

  getCompanyId() {
    return environment.CompanyId;
  }

  get email() { return this.forgetPasswordForm.get('email'); }

}
