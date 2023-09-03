import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms/';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { AppointmentDetailService } from 'src/app/core/services/appointment-detail.service';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { vaccinationValidator } from 'src/app/core/validators/vaccination.validator';
import { calcTime } from 'src/app/core/functions/functions';

@Component({
  selector: 'app-healthscreening',
  templateUrl: './healthscreening.component.html',
  styleUrls: ['./healthscreening.component.css']
})
export class HealthscreeningComponent implements OnInit {

  dateFormat: string = 'dd/MM/yyyy'; //JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;

  public apiEndPoint = environment.CompanyAPIURL;

  public companyId = 0;

  public HSQForm: FormGroup;

  public isShowError :boolean = false;

  id: any | null;
  appointment: any;

  @ViewChild('hsqsuccess') hsqSuccess: TemplateRef<any>;
  
  public ServerMessage:string;

  minDate: string = formatDate(new Date(), "dd-MM-YYYY HH:mm:ss", "en");

  maxDate: string = formatDate(new Date(), "dd-MM-YYYY HH:mm:ss", "en");

  minTime: string = formatDate(new Date(), "HH:mm:ss", "en");
  isOnSecondScreen: boolean = false;


  datePickerConfig: any =null;


  logoUrl: string;
  constructor(private activatedRoute: ActivatedRoute,
    private appointmentDetailService: AppointmentDetailService,
    private errorService: ErrorsService,
    private commonService: CommonService,
    public sanitizer: DomSanitizer,
    private titleService: Title,
    public _fb: FormBuilder,
    private dialogService: NgbModal,
    private router: Router
  ) {

    this.companyId = environment.CompanyId;

    this.titleService.setTitle("Health Screening Questionnaire");

    this.logoUrl = this.commonService.getLogo();

    this.id = atob(this.activatedRoute.snapshot.paramMap.get('token')!);

    this.getAppointmentDetailsForHSQ();

    this.HSQForm = this._fb.group({
      HSQArray: this._fb.array([])
    });

  }

  onHsQValueChange(control:AbstractControl | null, hsqValue:string, isVaccineQuestion:boolean)
  {
    if(hsqValue == 'Yes' && isVaccineQuestion == true)
    {
      control?.setValidators(Validators.required);
      control?.updateValueAndValidity();
    }
    else
    {
      control?.clearValidators();
      control?.updateValueAndValidity();
    }
  }

  CreateHSQ(question: string,isVaccinated:boolean,hsqId:number,visitorId:number) {
    this.HSQArray.push(this._fb.group({
      HSQValue: [null, [Validators.required]],
      HSQId: [hsqId, [Validators.required]],
      question: [question, []],
      isVaccineQuestion:[isVaccinated,[]],
      vaccineDate:['',[]],
      visitorId:visitorId
    })
    );
  }

  get HSQArray(): FormArray {
    return this.HSQForm.get('HSQArray') as FormArray;
  }

  closeModal() {
       
    this.dialogService.dismissAll("");
  }

  getAppointmentDetailsForHSQ() {
    this.appointmentDetailService.getAppointmentDetailsForHSQ(this.id)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.appointment = data.Data;
          this.dateFormat = data.Data.DateFormat;
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
            this.CreateHSQ(element.Question,element.IsVaccineQuestion,element.HSQId,this.appointment.VisitorId);
          });

        }, (error: any) => {

          this.isShowError = true;

         //  this.errorService.handleError(error);
        });
  }

  addHSQData(confirmModal: TemplateRef<any>) {
    if (this.HSQForm.invalid) {
      return;
    }

    this.dialogService.open(
      confirmModal, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
   
  }

SaveHSQ()
{
  this.appointmentDetailService.saveHSQConfirmation(this.HSQForm.controls.HSQArray.value)
  .pipe(first())
  .subscribe(
    (data: any) => {
      
      this.ServerMessage = data.SuccessMessage;

      this.router.navigate([localStorage.getItem('companyCode') + '/hsq/hsqsuccess'])
      
      this.dialogService.dismissAll("");
      // this.dialogService.open(this.hsqSuccess,
      //   {
      //     centered: true,
      //     backdrop: 'static',
      //     keyboard: false,
      //     windowClass: 'slideInUp'
      //   });
    }, (error: any) => {
      this.errorService.handleError(error);
    });
}

  ngOnInit(): void {

  }

  getApiUrl() {
    return this.apiEndPoint;
  }

  getCompanyId() {
    return this.companyId;
  }

}
