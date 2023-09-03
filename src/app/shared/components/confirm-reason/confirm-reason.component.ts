import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { noWhitespaceValidator } from 'src/app/core/functions/functions';
import { VisitorsService } from 'src/app/feature/visitors/services/visitors.service';
import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
@Component({
  selector: 'app-confirm-reason',
  templateUrl: './confirm-reason.component.html',
  styleUrls: ['./confirm-reason.component.scss']
})
export class ConfirmReasonComponent implements OnInit {
  public reasonForm: FormGroup;
  restrictedData: any;
  unblockVisitorData: any;
  remarkValue: any;
  @Input() visitorDataShowType:any;

  constructor(private dialogRef: MatDialogRef<ConfirmReasonComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public formData: any,
    private visitorsService:VisitorsService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {    
    this.reasonForm = this.formBuilder.group({
      remark: [null, [noWhitespaceValidator, Validators.maxLength(250)]],
    })

    this.unblockVisitorData = this.formData
  }

  onSubmit(){
    if (this.reasonForm.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.reasonForm.controls).forEach((field) => {
        this.reasonForm.controls[field].markAsDirty();
        this.reasonForm.controls[field].markAsTouched();
      });
    }
    else{
      this.openUnblockVisitorDialog();
    }
  }

 unblockVisitor(){
  let requestObject = {
    "restrictedVisitorId":this.unblockVisitorData.id,
    "remark": this.reasonForm.value.remark
  }

  this.visitorsService.RemoveRestrictedVisitor(requestObject)
  .pipe(first()).subscribe((response) => {
    if (response.statusCode === 200 && response.errors == null) {
      this.reasonForm.reset();
      this.toastr.success(response.message);
      this.cancel();
      this.dialogRef.close(response);
    } else {
      this.toastr.error(response.message);
    }
  },
  (error) => {
    if ("errors" in error.error) {
      error.error.errors.forEach((element) => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
      });
    } else {
      this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
    }
  })
 }

 blockVisitor(){
  const remarkValue ={
    "remark" : this.reasonForm.value.remark,
    "firstName":this.formData.firstName,
    "lastName":this.formData.lastName,
    "company":this.formData.company,
    "email":this.formData.email,
    "isdCode":this.formData.isdCode,
    "level2Id":this.formData.level2Id,
    "level3Id":this.formData.level3Id,
    "phone":this.formData.phone,
    // "appointmentId":this.formData.id
  }
 this.remarkValue = null;
  this.visitorsService.addRestrictedVisitor(remarkValue)
    .pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.toastr.success(response.message);
        this.cancel();
        this.dialogRef.close(response);
      } else {
        this.toastr.error(response.message);
      }
    },
    (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        });
      } else {
        this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    })
 }

  cancel() {
    this.dialogRef.close();
  }

  changeReason(reason) {
  }

  openUnblockVisitorDialog() {
    var dialogRef
    if(this.formData.isRestricted == 'No')
    {
       dialogRef = this.dialog.open(CommonPopUpComponent, {
        data: {
          visitorType:this.unblockVisitorData.visitorDataShowType,
          pop_up_type: "restrictVisitorConfirm",
          icon: "assets/images/error.png"
        },
        panelClass: ["vams-dialog-confirm"]
      });
    }
    else{
      dialogRef = this.dialog.open(CommonPopUpComponent, {
        data: {
          visitorType:this.unblockVisitorData.visitorDataShowType,
          pop_up_type: "unblock_visitor",
          icon: "assets/images/error.png"
        },
        panelClass: ["vams-dialog-confirm"]
      });
    }
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if(this.formData.isRestricted && this.formData.isRestricted == 'No')
        {
          this.blockVisitor()
        }
        else{
          this.unblockVisitor();
        }
      } else {
        this.dialogRef.close();
      }
    });
  }
}
