import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { commonResponse, smsGetByIdReq, smsGetByIdRes, smsTemplateRowClass, smsUpdateByIdReq, smsUpdateByIdRes } from '../../constants/enum';
import { ConfigureService } from '../../services/configure.service';
import { ProviderService } from '../../services/provider.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-sms-template-dialog',
  templateUrl: './sms-template-dialog.component.html',
  styleUrls: ['./sms-template-dialog.component.scss']
})
export class SmsTemplateDialogComponent implements OnInit {
  @ViewChild('textarea') textarea: any;
  formData: any;
  public smsTemplateForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  tagList: any[] = ["sachin", "sehwag", "dravid", "kohli", "kamble", "sde"];
  smsGetByIdReq = new smsGetByIdReq();
  smsGetByIdRes = new smsGetByIdRes()
  smsUpdateByIdReq = new smsUpdateByIdReq();
  smsUpdateByIdRes = new smsUpdateByIdRes();
  smsTemplateRowClass = new smsTemplateRowClass()
  isSMSApproval: any;

  constructor(public dialogRef: MatDialogRef<SmsTemplateDialogComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private translate: TranslateService,
    private configureService: ConfigureService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
    }
  }

  ngOnInit(): void {
    this.formData = this.data;
    this.smsTemplateRowClass = this.data.data;
    this.isSMSApproval = (this.data && this.data.isSMSApproval) ? (this.data.isSMSApproval) : false;
    this.getTemplateById();
    this.createForm();
  }

  getTemplateById() {
    this.smsGetByIdReq.id = this.smsTemplateRowClass.id;
    this.smsGetByIdReq.level2Id = this.data.level2Id;
    this.configureService.getSmsTemplateBYId(this.smsGetByIdReq).pipe(first()).subscribe((resp: commonResponse) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.smsGetByIdRes = resp.data;
        let tag = this.smsGetByIdRes.tag
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
        this.createForm();
      }
    },
      (error) => {

      })
  }

  createForm() {
    this.smsTemplateForm = this.formBuilder.group({
      content: [(this.smsGetByIdRes.smsContent) ? (this.smsGetByIdRes.smsContent) : "", [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  getValue(value) {
  }

  updateForm() {
    this.smsUpdateByIdReq = {
      id: this.smsTemplateRowClass.id,
      level2Id: this.smsGetByIdReq.level2Id,
      smsContent: this.smsTemplateForm.get('content').value
    }
    this.configureService.updateSmsTemplateBYId(this.smsUpdateByIdReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.smsUpdateByIdRes = resp;
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
          this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
        }
      })
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.smsTemplateForm && this.smsTemplateForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.smsTemplateForm.get(control).touched ||
            this.smsTemplateForm.get(control).dirty) &&
          this.smsTemplateForm.get(control).errors
        ) {
          if (this.smsTemplateForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }



  getSelectedListValue(option) {
    var startPos = this.textarea.nativeElement.selectionStart;
    this.textarea.nativeElement.value = this.textarea.nativeElement.value.substr(0, this.textarea.nativeElement.selectionStart) + " [[" + option + "]] " + this.textarea.nativeElement.value.substr(this.textarea.nativeElement.selectionStart, this.textarea.nativeElement.value.length);
    this.textarea.nativeElement.selectionStart = startPos + option.length + 6;
    this.smsTemplateForm.get('content').setValue(this.textarea.nativeElement.value);
    this.smsTemplateForm.get('content').updateValueAndValidity();
  }

}
