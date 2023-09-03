import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-share-appointment-form',
  templateUrl: './share-appointment-form.component.html',
  styleUrls: ['./share-appointment-form.component.css']
})

export class ShareAppointmentFormComponent implements OnInit {
  @Input() formData: any;
  isoCode: any[] = [
    "+91", "+92"
  ]

  private validationMessages: { [key: string]: { [key: string]: string } };
  public shareAppointmentForm: FormGroup;

  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    private translate:TranslateService,
    public dialogRef: MatDialogRef<ShareAppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      cell: {
        required: this.translate.instant("UpdateProfile.cellNumber_Placeholder"),
        pattern: this.translate.instant("Company.CellPattern"),
        minlength: this.translate.instant("Company.minmum_digit_10"),
        maxlength: this.translate.instant("Company.Cellmaxlength"),
      },
      email: {
        required:this.translate.instant("Company.emailRequired"),
        email: this.translate.instant("Company.emailVaild"),
        maxlength:this.translate.instant("Company.CompanyNameMaxlength"), 
      },
    };
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.shareAppointmentForm = this.formBuilder.group({
      email: ['null', [Validators.required, Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*')]],
      call: ['null', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.shareAppointmentForm.invalid) {
      // this.toastrService.warning('There are errors in the shareAppointmentForm', 'Could Not Save');
      Object.keys(this.shareAppointmentForm.controls).forEach(field => {
        this.shareAppointmentForm.controls[field].markAsDirty();
        this.shareAppointmentForm.controls[field].markAsTouched();
      });
    } else {
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.shareAppointmentForm.get(control).touched || this.shareAppointmentForm.get(control).dirty) && this.shareAppointmentForm.get(control).errors) {
        if (this.shareAppointmentForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  cancel() {
    this.dialogRef.close();
  }
}

