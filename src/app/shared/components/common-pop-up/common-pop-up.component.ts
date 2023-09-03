import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { noWhitespaceValidator } from 'src/app/core/functions/functions';
import { defaultVal } from "../../../core/models/app-common-enum";
import { MasterService } from 'src/app/feature/master/services/master.service';
import { first } from 'rxjs/operators';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-common-pop-up',
  templateUrl: './common-pop-up.component.html',
  styleUrls: ['./common-pop-up.component.scss']
})
export class CommonPopUpComponent implements OnInit {
  public reasonForm: FormGroup;
  message: string = ""
  messages: any = [];
  icon: string = ""
  alt_string: string = ""
  title: string = ""
  languageTokens: any = null;
  no_button = "";
  yes_button = "";
  ok_button = false;
  ok_buttonText: string = "";
  inputText: boolean = false;
  showRestrictorVisitor: boolean = false
  isMultiDayReschedule: boolean = false;
  isRescheduleMultiDay: string = "false";
  configDetails: { configFieldName: string; configFieldValue: string; };


  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<CommonPopUpComponent>,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.languageTokens = this.translateService.instant("pop_up")
    this.setValues();
    this.yes_button = this.languageTokens['yes_button']
    this.no_button = this.languageTokens['no_button']
    this.createForm();
  }

  createForm() {
    this.reasonForm = this.formBuilder.group({
      remark: [null, [noWhitespaceValidator, Validators.required, Validators.maxLength(250)]],
    })
  }

  setValues() {
    switch (this.data.pop_up_type) {
      case 'delete':
        this.message = this.data && this.data.name ? `${this.languageTokens[this.data.pop_up_type].string1} ${this.data.type} <b>"${this.data.name}"</b>?` : `${this.languageTokens[this.data.pop_up_type].string1} ${this.data.type}?`;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'hsq':
        this.message = this.languageTokens[this.data.pop_up_type].string1;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'contact_admin':
        this.message = this.languageTokens[this.data.pop_up_type].string1;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        this.ok_button = true;
        this.ok_buttonText = this.languageTokens['ok_button'];
        break;
      case 'restrictVisitorConfirm':
        this.message = this.languageTokens[this.data.pop_up_type].string1;
        this.alt_string = this.data.pop_up_type || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'allRestrictVisitorConfirm':
        this.message = this.languageTokens[this.data.pop_up_type].string1;
        this.alt_string = this.data.pop_up_type || "pop up logo";
        this.icon = this.data.icon || "";
        this.inputText = true;
        this.showRestrictorVisitor = true
        break;
      case 'restricted_visitor':
        this.restrict_visitor_messages();
        break;
      case 'unblock_visitor':
        this.unblock_visitor_messages();
        break;
      case 'block_visitor':
        this.block_visitor_messages();
        break;
      case 'drivingLicenceSubmitConfirm':
        this.message = `${this.languageTokens[this.data.pop_up_type].string1} <b>"${this.data.name}"</b>?`;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'cancel':
        this.title = this.languageTokens[this.data.pop_up_type].title;
        this.message = `${this.languageTokens[this.data.pop_up_type].string1} <b>"${this.data.reason}"</b>?`;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'nda':
        this.title = "NDA",
          this.message = this.languageTokens.nda.string1,
          this.icon = this.data.icon
        break;
      case 'privacy_policy':
        this.title = "Privacy Policy",
          this.message = this.languageTokens.nda.string1,
          this.icon = this.data.icon
        break;
      case 'terms_conditions':
        this.title = "Terms & Conditions";
        this.message = this.languageTokens.nda.string1;
        this.icon = this.data.icon;
        break;
      case 'multi_reschedule':
        this.title = "",
        this.message = this.languageTokens.multiday_cancel_and_reschedule.message;
        this.icon = this.data.icon;
        this.isMultiDayReschedule = this.data.isMultiDayReschedule;
        break;
      case 'multiday_cancel':
        this.title = "",
        this.message = this.languageTokens.multiday_cancel_and_reschedule.message1;
        this.icon = this.data.icon;
        this.isMultiDayReschedule = this.data.isMultiDayReschedule;
        break;
      case 'checkout_confirm':
        this.title = "",
          this.message = this.languageTokens.checkout_confirm.message;
        this.icon = this.data.icon;
        break;
      case 'question_list_empty':
        this.message = this.languageTokens.question_list_empty.string1
        // this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'contractor_config':
        this.title = "",
        this.message = this.languageTokens.contractor_company.message;
        this.icon = this.data.icon;
        this.configDetails = {
          configFieldName : this.data.configData.configFieldName,
          configFieldValue : this.data.configData.configValue
        }
        break;
      case 'reject':
        this.title = this.languageTokens[this.data.pop_up_type].title;
        this.message = `${this.languageTokens[this.data.pop_up_type].string1} <b>"${this.data.reason}"</b>?`;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'activeDevice':
        this.activeNewAccessController()
        break;
      case 'deleteRate':
        this.message = this.data && this.data.name ? `${this.languageTokens[this.data.pop_up_type].string} <b>"${this.data.name}"</b>?` : `${this.languageTokens[this.data.pop_up_type].string} ${this.data.type}?`;
        this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
        this.icon = this.data.icon || "";
        break;
      case 'SOS':
        this.icon = this.data.icon;
        this.message = "SOS Sent Successfully"
        break;
    }
  }

  close(decision: boolean) {
    if (this.inputText) {
      if (this.reasonForm.invalid && decision == true) {
        this.reasonForm.markAllAsTouched();
        return
      } else {
        this.dialogRef.close({ decision: decision, remark: this.reasonForm.value.remark });
      }
    } else if (this.isMultiDayReschedule) {
      this.dialogRef.close({ decision: decision, isRescheduleMultiDay: this.isRescheduleMultiDay });
    }
    else {
      this.dialogRef.close(decision);
    }
  }
  activeNewAccessController() {
        this.title = '',
        this.message =`${this.data.activeAccessControler}  ${this.languageTokens[this.data.pop_up_type].string1} ${this.data.location}. ${this.languageTokens[this.data.pop_up_type].string2} ${this.data.toActiveAccessControler}  ${this.languageTokens[this.data.pop_up_type].string3}`,
        this.icon = this.data.icon;
  }
  restrict_visitor_messages() {
    this.title = this.languageTokens[this.data.pop_up_type].title;
    this.messages.push(`<b>${this.data.name}</b> ${this.languageTokens[this.data.pop_up_type].string1}`)
    this.messages.push(`${this.data.visitorData} ${this.languageTokens[this.data.pop_up_type].string4}`)
    this.messages.push(`<b>${this.data.visitorRemark}</b>`)
    this.messages.push(`${this.languageTokens[this.data.pop_up_type].string2} ${this.data.apnt_type} ${this.languageTokens[this.data.pop_up_type].string3}`)
    this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
    this.icon = this.data.icon || "";
  }

  unblock_visitor_messages() {
    this.message = this.languageTokens[this.data.pop_up_type].string1;
    this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
    this.icon = this.data.icon || "";
  }
  block_visitor_messages() {
    this.message = this.languageTokens[this.data.pop_up_type].string1;
    this.alt_string = this.languageTokens[this.data.pop_up_type].alt || "pop up logo";
    this.icon = this.data.icon || "";
  }
  buildingListForComplex() {
    let reqData = {
      pageSize: defaultVal.pageSize,
      pageIndex: defaultVal.pageIndex,
      searchStatus: defaultVal.searchStatus,
      orderBy: "name",
      sortBy: "ASC",
      globalSearch: "",
    };
    this.masterService
      .getBuildings(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          // this.selectBuildingDialog(resp.data.list);
        }
      });
  }
}
