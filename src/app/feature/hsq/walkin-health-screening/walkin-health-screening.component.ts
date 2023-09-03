import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Select2OptionData } from 'ng-select2';
import { first } from 'rxjs/operators';
import { calcTime, matcherResult, templateResult, templateSelection } from 'src/app/core/functions/functions';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { AppointmentDetailService } from 'src/app/core/services/appointment-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { atLeastOne } from 'src/app/core/validators/atleastOne.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-walkin-health-screening',
  templateUrl: './walkin-health-screening.component.html',
  styleUrls: ['./walkin-health-screening.component.css']
})
export class WalkinHealthScreeningComponent implements OnInit {

  dateFormat: string = 'dd/MM/yyyy';
  maxDate: string = formatDate(new Date(), "dd-MM-YYYY HH:mm:ss", "en");
  datePickerConfig: any = null;
  isShowError: boolean = false;
  getWalkinHsqErrorMessage: string = '';
  companyName: string = "";
  locationName: string = "";
  locationId: number = 0;
  isHSQAlreadyFilled: boolean = false;
  HSQAlreadyFilledErrorMessage: string = '';
  currentScreen: number = 1;
  public walkinUserForm: FormGroup;
  public walkinHSQForm: FormGroup;
  public companyId = environment.CompanyId;
  public apiEndPoint = environment.CompanyAPIURL;
  public isdCodes: Array<Select2OptionData> = [];
  allIsdCodes: any[] = [];
  options: any;
  constructor(
    private appointmentDetailService: AppointmentDetailService,
    private commonService: CommonService,
    private translate: TranslateService,
    private router: Router,
    private titleService: Title,
    private dialogService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private _fb: FormBuilder) {
    this.titleService.setTitle("Health Screening Questionnaire");
    this.options = {
      templateResult: templateResult,
      templateSelection: templateSelection,
      dropdownCssClass: 'isd-space',
      width: '100%',
      matcher: matcherResult
    };

    this.activatedRoute.paramMap.subscribe(params => {
      let qrCode = atob(params.get('token')!);
      this.appointmentDetailService.getWalkinForHSQ(qrCode)
        .pipe(first())
        .subscribe(
          (data: any) => {
            data.Data.ListIsdCodeMaster.forEach((element: any) => {
              this.isdCodes.push({
                id: element.IsdCode,
                text: "+" + element.IsdCode,
                additional: element.ISOCode
              });
            });
            this.allIsdCodes = data.Data.ListIsdCodeMaster;
            this.companyName = data.Data.CompanyName;
            this.locationName = data.Data.LocationName;
            this.locationId = data.Data.LocationId;
            this.dateFormat = data.Data.DateFormat;
            this.isdCodeChange(data.Data.IsdCode);
            this.commonService.getTimezone(new Date(), data.Data.Timezone).subscribe((res: any) => {
              var date = calcTime(Number(res));
              this.maxDate = formatDate(date, this.dateFormat + " HH:mm:ss", "en");
              this.datePickerConfig = {
                format: this.dateFormat.toUpperCase(),
                max: this.maxDate,
              dayBtnCssClassCallback: (day: moment.Moment) => {
                if (date.toDateString() == day.toDate().toDateString()) {
                  return 'dp-current-day dp-selected'
                }
                return 'date-without-border'
              },
              };
            });

            data.Data.ListHSQ.forEach((element: any) => {
              this.CreateHSQ(element.Question,
                element.IsVaccineQuestion, element.HSQId);
            });

          }, (error: any) => {
            this.isShowError = true;
            this.getWalkinHsqErrorMessage = error.error.ErrorMessages[0];
          });
    });

    this.walkinHSQForm = this._fb.group({
      HSQArray: this._fb.array([])
    });

    this.walkinUserForm = this._fb.group({
      email: ['', [Validators.email, Validators.maxLength(250)]],
      cellnumber: ['', [Validators.pattern("[0-9]{10}")]],
      isdCode: ['', [Validators.required]],
      firstname: ['', [Validators.required, Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.maxLength(50)]],
    }, { validator: atLeastOne(Validators.required, ['cellnumber', 'email']) });
  }

  ngOnInit(): void {
  }

  onHsQValueChange(control: AbstractControl | null, hsqValue: string, isVaccineQuestion: boolean) {
    if (hsqValue == 'Yes' && isVaccineQuestion == true) {
      control?.setValidators(Validators.required);
      control?.updateValueAndValidity();
    }
    else {
      control?.clearValidators();
      control?.updateValueAndValidity();
    }
  }

  CreateHSQ(question: string, isVaccinated: boolean, hsqId: number) {
    this.HSQArray.push(this._fb.group({
      HSQValue: [null, [Validators.required]],
      HSQId: [hsqId, [Validators.required]],
      question: [question, []],
      isVaccineQuestion: [isVaccinated, []],
      vaccineDate: ['', []]
    })
    );
  }

  get HSQArray(): FormArray {
    return this.walkinHSQForm.get('HSQArray') as FormArray;
  }

  isdCodeChange(event: any) {
    this.isdCode?.patchValue(event);
    var selectedISDCode = this.allIsdCodes.filter(item => item.IsdCode == this.isdCode?.value);
    this.cellnumber?.reset();
    this.cellnumber?.setValidators(Validators.pattern("[0-9]{" + selectedISDCode[0].MinMobileLength + "," + selectedISDCode[0].MaxMobileLength + "}"));
    this.cellnumber?.updateValueAndValidity();
  }

  saveHSQResponse(confirmModal: TemplateRef<any>) {
    this.isHSQAlreadyFilled = false;
    if (this.walkinHSQForm.invalid) {
      return;
    }

    this.dialogService.open(
      confirmModal, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });

  }
  SaveHSQ() {

    let walkinHSQDetails = {
      FirstName: this.firstname?.value,
      LastName: this.lastname?.value,
      IsdCode: this.isdCode?.value,
      Mobile: this.cellnumber?.value,
      Email: this.email?.value,
      HSQConfirmed: true,
      LocationId: this.locationId,
      Language: this.translate.currentLang,
      HSQs: this.walkinHSQForm.controls.HSQArray.value
    }

    this.appointmentDetailService.saveWalkinHSQ(walkinHSQDetails)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.dialogService.dismissAll("closing modal");
          this.router.navigate([localStorage.getItem('companyCode') + '/hsq/hsqsuccess'])
        }, (error: any) => {
          this.isHSQAlreadyFilled = true;
          this.HSQAlreadyFilledErrorMessage = error.error.ErrorMessages[0];
        });
  }

  validateDetails() {
    if ((this.email?.disabled || this.email?.valid) && (this.cellnumber?.value == "" || this.cellnumber?.value == null)) {
      this.cellnumber?.setErrors(null);
    }

    if ((this.cellnumber?.disabled || this.cellnumber?.valid) && (this.email?.value == "" || this.email?.value == null)) {
      this.email?.setErrors(null);
    }

    if (this.walkinUserForm.invalid) {
      return;
    }

    this.appointmentDetailService.checkHSQWalkinExistByDate(this.isdCode?.value,
      this.cellnumber?.value, this.email?.value, this.locationId).subscribe((res: any) => {
        this.currentScreen = 2;
      }, (error: any) => {
        this.isHSQAlreadyFilled = true;
        this.HSQAlreadyFilledErrorMessage = error.error.ErrorMessages[0];
      });
  }

  dismissAll() {
    this.dialogService.dismissAll("closing modal");
  }

  get firstname() { return this.walkinUserForm.get('firstname'); }
  get lastname() { return this.walkinUserForm.get('lastname'); }
  get cellnumber() { return this.walkinUserForm.get('cellnumber'); }
  get email() { return this.walkinUserForm.get('email'); }
  get isdCode() { return this.walkinUserForm.get('isdCode'); }

}
