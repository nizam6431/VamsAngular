import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { noWhitespaceValidator } from 'src/app/core/functions/functions';
import { defaultVal } from "../../../core/models/app-common-enum";
import { MasterService } from 'src/app/feature/master/services/master.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

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
  inputText:boolean = true;
  showRestrictorVisitor:boolean = false
  isMultiDayReschedule:boolean = false;
  isRescheduleMultiDay:string = "false";

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private dialogRef: MatDialogRef<PopupComponent>,
    private masterService: MasterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.languageTokens = this.translateService.instant("pop_up")
    this.setValues();
    this.yes_button = this.languageTokens['yes_button']
    this.no_button = this.languageTokens['no_button']
    this.createForm();
  }

  createForm(){
    this.reasonForm = this.formBuilder.group({
      remark: [null, [noWhitespaceValidator,Validators.required, Validators.maxLength(250)]],
    })
  }

  setValues() {
    switch (this.data.pop_up_type) {
      case 'restricted_visitor':
          this.restrict_visitor_messages();
        break;
      case 'unblock_visitor':
          this.unblock_visitor_messages();
        break;
      case 'block_visitor':
        this.block_visitor_messages();
        break;
    }
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

  close(decision: boolean) {
    let dataSendToBack = {
      decision:decision,
      remark:this.reasonForm.controls['remark'].value
    }
    this.dialogRef.close(dataSendToBack)
  }

}
