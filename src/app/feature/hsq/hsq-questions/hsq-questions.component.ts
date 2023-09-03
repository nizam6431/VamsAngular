import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { HsqService } from 'src/app/core/services/hsq.service.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-hsq-questions',
  templateUrl: './hsq-questions.component.html',
  styleUrls: ['./hsq-questions.component.scss']
})
export class HsqQuestionsComponent implements OnInit {
  logoUrl: any = "";
  questionList: any = [];
  HSQForm: FormGroup;
  appointmentId = null;
  visitorId = null;
  HsqSuccess: boolean = false;
  HSQError: boolean = false;
  questionnaire: boolean = false;
  @Output() dialogClose = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private hsqService: HsqService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    public dialog: MatDialog,
    private _sanitizer: DomSanitizer,
    private translate:TranslateService
  ) {
    this.HSQForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.titleService.setTitle("HSQ");
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64?environment.LogoBase64:"assets/images/login-vams-logo.png"));
    console.log(this.logoUrl);
    this.appointmentId = this.router.url.split("/")[3]
    this.hsqQuestions();
  }
  hsqQuestions() {
    let reqObj = {
      appointmentId: this.appointmentId
    }
    this.hsqService.getQuestions(reqObj).pipe(first())
      .subscribe((data: any) => {
        if (data && data.statusCode == 200) {
          this.questionList = data.data && data.data.hsqDetailsDto ? data.data.hsqDetailsDto : [];
          this.questionnaire = true;
          this.createHsqForm();
        } else {
          this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"))
        }
      }, (err) => {
        // if (err.error && err.error.StatusCode && err.error.StatusCode == 412) {
          // this.HsqSuccess = true;
          this.questionnaire = false;
          this.HSQError = true;
        // }
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
    } else {
      // this.toastr.success("thank you for attempting questions", "Success")
      let reqBody = this.formAddRequest()
      this.hsqService.saveQuestions(reqBody).pipe(first())
        .subscribe((data: any) => {
          if (data && data.statusCode == 200) {
            this.HsqSuccess = true;
            this.questionnaire = false;
            // this.toastr.success("thank you for attempting questions", "Success")
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
    let reqBody = {
      appointmentId: this.appointmentId,
      visitorId: this.visitorId,
      answers: []
    }
    for (let hsq of this.HSQForm.value.HSQArray) {
      reqBody.answers.push({
        "questionId": hsq.id,
        "answer": hsq.answer
      })
    }
    return reqBody;
  }
}