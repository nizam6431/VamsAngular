import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigureService } from '../../services/configure.service';


@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  formData: any;
  buildingList = [];
  private validationMessages: { [key: string]: { [key: string]: string } };
  color: ThemePalette = 'accent';
  checked: boolean = false;
  disabled: boolean = false;
  enableSSl: boolean = false;
  showPassword: boolean = false;
  questionForm: FormGroup;
  isVaccinated: boolean;
  constructor(
    public dialogRef: MatDialogRef<AddQuestionComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private configureService: ConfigureService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.validationMessages = {
      question: {
        required: translate.instant('hsq_questions.question_required'),
      },
      expectedAnswer: {
        required: translate.instant('hsq_questions.answer_required'),
      },
      nonStandardTag: {
        required: translate.instant('hsq_questions.vaccinated_required'),
      },
    }
  }

  ngOnInit(): void {
    this.formData = this.data;
    this.isVaccinated = (this.formData?.data?.nonStandardTag && this.formData?.data?.nonStandardTag.toLowerCase() == 'vac') ? true : false;
    this.createForm();
  }

  createForm() {
    this.questionForm = this.formBuilder.group({
      question: [this.formData?.data?.question ? this.formData.data.question : null, [Validators.required]],
      expectedAnswer: [this.formData?.data?.expectedAnswer ? this.formData.data.expectedAnswer : null, [Validators.required]],
      nonStandardTag: [(this.formData?.data?.nonStandardTag && this.formData?.data?.nonStandardTag.toLowerCase() == 'vac') ? true : false, [Validators.required]],
      level2Id: [this.formData?.data?.level2Id ? this.formData?.data?.level2Id : null]
    });
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.questionForm && this.questionForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.questionForm.get(control).touched ||
            this.questionForm.get(control).dirty) &&
          this.questionForm.get(control).errors
        ) {
          if (this.questionForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  onSubmit() {
    if (this.questionForm.invalid) {
      Object.keys(this.questionForm.controls).forEach(field => {
        if (this.questionForm.controls[field]['controls']) {
          this.questionForm.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.questionForm.controls[field].markAsDirty();
          this.questionForm.controls[field].markAsTouched();
        }
      });
    } else {
      if (this.formData.mode && this.formData.mode == 'edit') {
        this.updateQuestion();
      } else {
        this.addQuestion()
      }
    }
  }


  /**
   *answerType: "boolean"
expectedAnswer: "No"
id: 66
level1Id: 39
level2Id: null
level3Id: null
nonStandardTag: null
question: "Do you have fever?"
sequenceNo: 1
status: "ACTIVE"
   */

  addQuestion() {
    let questionObj =
    {
      "question": this.questionForm.value.question,
      "answerType": "boolean",
      "expectedAnswer": this.questionForm.value.expectedAnswer,
      "status": "ACTIVE",
      "sequenceNo": 1,
      "nonStandardTag": (this.questionForm.value.nonStandardTag) ? "VAC" : null,
      "level2Id": this.configureService.getLocation(),
      "level3Id": null
    }
    this.configureService.addHsqQuestion(questionObj).subscribe(res => {
      if (res) {
        this.toastrService.success(res.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close({ type: 'HSQ_screening_questionnaire', status: true });
        // this.dialogRef.close(res);
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        });
      } else {
        this.toastrService.error(error.message, this.translate.instant("pop_up_messages.error"));
      }
    })
  }

  updateQuestion() {
    console.log(this.formData);
    let questionObj =
    {
      "id": this.formData.data.id,
      "question": this.questionForm.value.question,
      "answerType": this.formData.data.answerType,
      "expectedAnswer": this.questionForm.value.expectedAnswer,
      "status": this.formData.data.status,
      "sequenceNo": this.formData.data.sequenceNo,
      "nonStandardTag": this.questionForm.value.nonStandardTag ? "VAC" : null,
      "level2Id": this.questionForm.value.level2Id ? this.questionForm.value.level2Id : null,
    }
    this.configureService.updateHsqQuestion(questionObj).subscribe(res => {
      if (res) {
        this.toastrService.success(res.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close(res);
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        });
      } else {
        this.toastrService.error(error.message, this.translate.instant("pop_up_messages.error"));
      }
    })
  }

  resetForm() {
    this.questionForm.reset();
  }

  cancel() {
    this.dialogRef.close();
  }

  isVaccinatedChanged(event) {
    this.isVaccinated = event.checked
    this.questionForm.get('nonStandardTag').setValue(event.checked ? 'Yes' : 'No');
  }

}
