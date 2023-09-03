import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../services/provider.service';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfigureService } from '../../services/configure.service';
import { first } from 'rxjs/operators';
import { commonResponse, emailTemplateRowClass, getEmailTemplateByIdReq, getEmailTemplateByIdRes, updateEmailTemplateBYIdReq, updateEmailTemplateBYIdRes } from '../../constants/enum';

@Component({
  selector: 'app-email-template-popup',
  templateUrl: './email-template-popup.component.html',
  styleUrls: ['./email-template-popup.component.scss']
})
export class EmailTemplatePopupComponent implements OnInit {
  @ViewChild('textarea') textarea: any;
  formData: any;
  public emailTemplateForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  tagList: any[] = [];
  htmlContent: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    sanitize: false,
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };
  updateEmailTemplateBYIdReq = new updateEmailTemplateBYIdReq();
  updateEmailTemplateBYIdRes = new updateEmailTemplateBYIdRes()
  getEmailTemplateByIdReq = new getEmailTemplateByIdReq();
  getEmailTemplateByIdRes = new getEmailTemplateByIdRes();
  emailTemplateRow = new emailTemplateRowClass()

  constructor(
    private configureService: ConfigureService,
    public dialogRef: MatDialogRef<EmailTemplatePopupComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
    this.emailTemplateRow = this.data.data;
    this.createForm();
    this.getTemplateById();
  }

  getTemplateById() {
    this.getEmailTemplateByIdReq.emailTemplateId = this.emailTemplateRow.emailTemplateId;
    this.configureService.getEmailTemplateBYId(this.getEmailTemplateByIdReq).pipe(first()).subscribe((resp: commonResponse) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.getEmailTemplateByIdRes = resp.data;
        let tag = this.getEmailTemplateByIdRes.tags
        if (tag && tag.includes('[[') && tag.includes(']]')) {
          this.tagList = ((tag.split('[[')[1]).split(']]')[0]).split(',')
          if (this.tagList && this.tagList.length > 0) {
            this.tagList.sort(function (a, b) {
              var nameA = a.toLowerCase(),
                nameB = b.toLowerCase();
              if (nameA < nameB) //sort string ascending
                return -1;
              if (nameA > nameB)
                return 1;
              return 0; //default return value (no sorting)
            });
          }
          this.tagList = this.tagList.filter(function (el: string) {
            return el.localeCompare("");
          });
        }
        this.emailTemplateForm.get('content').setValue(this.getEmailTemplateByIdRes.htmlContent);
        this.emailTemplateForm.updateValueAndValidity();
      }
    },
      (error) => {

      })
  }

  createForm() {
    this.emailTemplateForm = this.formBuilder.group({
      content: [this.emailTemplateRow.htmlContent, [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  updateForm() {
    this.updateEmailTemplateBYIdReq = {
      emailTemplateId: this.getEmailTemplateByIdRes.emailTemplateId,
      subject: this.getEmailTemplateByIdRes.subject,
      htmlContent: this.emailTemplateForm.get('content').value
    }
    this.configureService.updateEmailTemplateBYId(this.updateEmailTemplateBYIdReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.updateEmailTemplateBYIdRes = resp;
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(resp)
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.error"));
        }
      })
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.emailTemplateForm && this.emailTemplateForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.emailTemplateForm.get(control).touched ||
            this.emailTemplateForm.get(control).dirty) &&
          this.emailTemplateForm.get(control).errors
        ) {
          if (this.emailTemplateForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  getSelectedListValue(option: MatListOption) {

  }

}
