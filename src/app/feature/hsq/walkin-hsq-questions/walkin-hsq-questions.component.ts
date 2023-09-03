import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HsqService } from 'src/app/core/services/hsq.service.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { environment } from 'src/environments/environment';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { getCountryCode, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { UserService } from 'src/app/core/services/user.service';
import { AppointmentService } from '../../appointment/services/appointment.service';


@Component({
  selector: 'app-walkin-hsq-questions',
  templateUrl: './walkin-hsq-questions.component.html',
  styleUrls: ['./walkin-hsq-questions.component.scss']
})
export class WalkinHsqQuestionsComponent implements OnInit {
  logoUrl: any = "";
  questionList: any = [];
  HSQForm: FormGroup;
  vistiLocationId = null;
  visitorId = null;
  HsqSuccess: boolean = false;
  HSQError: boolean = false;
  questionnaire: boolean = false;
  @Output() dialogClose = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  visitorAutnticationType: any;
  contactDetails: any[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  userData: any;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  public selectedCountry: CountryISO = CountryISO.India;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public phoneValidation: boolean = true;
  public dialogRef: MatDialogRef<WalkinHsqQuestionsComponent>;
  @Inject(MAT_DIALOG_DATA) public data: any;
  public submitted: boolean = false;
  constructor(
    private fb: FormBuilder,
    private hsqService: HsqService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService
  ) {
    this.HSQForm = this.fb.group({});

    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());

    this.validationMessages = {
      cell: {
        required: translate.instant('Reauthenticate.CellNumberPlaceholder'),
      },
      email: {
        required: translate.instant('Reauthenticate.EmailPlaceholder'),
        email: translate.instant('Reauthenticate.EmailValid'),
        maxlength: translate.instant('Reauthenticate.EmailMaxlength'),
      },
      firstName: {
        required: translate.instant('Schedule.FirstNameRequireError'),
        maxlength: translate.instant('Schedule.FirstNameMaxLengthError'),
      },
      lastName: {
        required: translate.instant('Schedule.LastNamePlaceholder'),
        maxlength: translate.instant('Schedule.LastNameMaxlength'),
      },
    };
  }


  ngOnInit(): void {
    this.getVisitorSettings();
    this.createHsqForm();

    this.titleService.setTitle("HSQ");
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64 ? environment.LogoBase64 : "assets/images/login-vams-logo.png"));
    this.vistiLocationId = this.router.url.split("/")[3]
    this.hsqQuestions();

    if (this.visitorAutnticationType == "Email") {
      console.log(this.visitorAutnticationType, 'type')
    } else if (this.visitorAutnticationType == "Both") {

    } else if (this.visitorAutnticationType == "Cell") {
      this.HSQForm.controls.email.clearValidators()
      this.HSQForm.controls.email.updateValueAndValidity()
      this.HSQForm.controls.cell.setValidators([Validators.required])
      this.HSQForm.controls.cell.updateValueAndValidity()
      this.HSQForm.controls.cell.reset();
    }
  }
  hsqQuestions() {
    if(this.HSQForm.valid){
      this.submitted = false;
    }
    let reqObj = {
      vistiLocationId: this.vistiLocationId
    }
    this.hsqService.getWalkinQuestions(reqObj).pipe(first())
      .subscribe((data: any) => {
        if (data && data.statusCode == 200) {
          this.questionList = data.data && data.data.hsqDetailsDto ? data.data.hsqDetailsDto : [];
          this.questionnaire = true;
          this.createHsqForm();
        } else {
          this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"))
        }
      }, (err) => {
        this.questionnaire = false;
        this.HSQError = true;
      })
  }

  createHsqForm() {
    let qestionObjArray = [];
    for (let q of this.questionList) {
      qestionObjArray.push(
        this.fb.group({
          question: [q.question],
          id: [q.questionId, Validators.required],
          answer: [null, Validators.required],
          ansType: [q.answerType]
        })
      )
    }

    this.HSQForm = this.formBuilder.group({
      email: [null, [Validators.email, Validators.required]],
      cell: [null, [Validators.required, Validators.maxLength(54), Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.maxLength(50)]]
    });

    this.HSQForm.addControl('HSQArray', this.fb.array(qestionObjArray));

  }

  openDialogForConfirm() {
    if (this.HSQForm.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.answer_all_question"), this.translate.instant("pop_up_messages.warning"))
    } else {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        pop_up_type: "hsq",
        icon: "assets/images/hsq-confirm-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addHSQData();
      }
    });
    }
  }

  addHSQData() {
    if (this.HSQForm.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.answer_all_question"), this.translate.instant("pop_up_messages.warning"))
    } 
    if (this.HSQForm.controls.cell.invalid && this.HSQForm.controls.email.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
    }
    else {
      let reqBody = this.formAddRequest()
      this.hsqService.saveWalkinQuestions(reqBody).pipe(first())
        .subscribe((data: any) => {
          if (data && data.statusCode == 200) {
            this.HsqSuccess = true;
            this.questionnaire = false;
          } else {
            this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"))
          }
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
          }
        })
    }
  }

  formAddRequest() {
    let contactMobile = this.HSQForm.value.cell?.number != null ? removeSpecialCharAndSpaces(this.HSQForm.value.cell?.number.toString()) : null
    let isdCode = this.HSQForm.value.cell?.dialCode != null ? this.HSQForm.value.cell?.dialCode.substring(1) : null
    let reqBody = {
      visitLocationId: this.vistiLocationId,
      firstName: this.HSQForm.controls.firstName.value,
      lastName: this.HSQForm.controls.lastName.value,
      isdCode: isdCode,
      phone: contactMobile,
      email: this.HSQForm.controls.email.value,
      answers: [],
    }
    for (let hsq of this.HSQForm.value.HSQArray) {
      reqBody.answers.push({
        "questionId": hsq.id,
        "answer": hsq.answer
      })
    }
    return reqBody;
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.HSQForm && this.HSQForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.HSQForm.get(control).touched ||
            this.HSQForm.get(control).dirty) &&
          this.HSQForm.get(control).errors
        ) {
          if (this.HSQForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  removeValidator(emailOrPhone) {
    if (emailOrPhone == "email") {
      this.HSQForm.controls.email.setValidators([Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)])
      this.HSQForm.controls.email.updateValueAndValidity()
      this.HSQForm.controls.cell.reset();
      this.HSQForm.controls.cell.clearValidators()
      this.HSQForm.controls.cell.updateValueAndValidity()
    } else if (emailOrPhone == "cell") {
      this.HSQForm.controls.email.setValidators([Validators.required])
      this.HSQForm.controls.email.updateValueAndValidity()
      this.HSQForm.controls.email.reset();
      this.HSQForm.controls.email.clearValidators()
      this.HSQForm.controls.email.updateValueAndValidity()
    }
  }

  getVisitorSettings(vistiLocationId?) {
    this.appointmentService.getVisitorSettings(vistiLocationId).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        console.log(response, 'response')
        this.visitorAutnticationType = response.data?.visitorAuthenticationType
      } else {
        this.toastr.error(response.message);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      }
      else {
        this.toastr.error(error.Message, this.translate.instant('pop_up_messages.error'));
      }
    })
  }
}


