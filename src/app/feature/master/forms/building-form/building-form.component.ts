import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { Status } from '../../constants/dropdown-enums';
import { MasterService } from '../../services/master.service';
import { noWhitespaceValidator } from 'src/app/core/functions/functions';
@Component({
  selector: 'app-building-form',
  templateUrl: './building-form.component.html',
  styleUrls: ['./building-form.component.scss']
})
export class BuildingFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;
  @Input() formData: any;
  statusList = Object.keys(Status);
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formBuilding: FormGroup;

  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<BuildingFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private masterService: MasterService,
    private toastr: ToastrService,
    private translate:TranslateService) {
    this.validationMessages = {
      name: {
        whitespace: translate.instant('Building.name_placeholder'),
        pattern: translate.instant('Building.buildingVaildation'),
        maxlength: translate.instant('Building.buildingMaxlength'),
      },
      status: {
        required: translate.instant('Building.statusRequired'),
      }
    };
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formBuilding = this.formBuilder.group({
      name: [this.formData.data?.name ? this.formData.data.name : null, [Validators.required, Validators.maxLength(50),noWhitespaceValidator]],
      status: [this.formData.data?.status ? this.formData.data.status : null],
    });
    if (this.formData.data)
      this.formBuilding.controls.status.setValidators([Validators.required]);
    else
      this.formBuilding.controls.status.setValidators(null);
  }

  onSubmit() {
    if (this.formBuilding.invalid) {
      // this.toastrService.warning('There are errors in the formBuilding', 'Could Not Save');
      Object.keys(this.formBuilding.controls).forEach(field => {
        this.formBuilding.controls[field].markAsDirty();
        this.formBuilding.controls[field].markAsTouched();
      });
    } else {
      let updateObj = {
        level2Id: this.formData.data.id,
        name: this.formBuilding.value.name.trim(),
        status: this.formBuilding.value.status
      }
      this.masterService.updateBuilding(updateObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: 'level2', status: true });
          }
        }, error => {
          if ( error && error.error && 'errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            })
          }
          else {
          this.toastr.error(error.message,  this.translate.instant("pop_up_messages.error"));
          }
          // this.dialogRef.close({ type: 'level2', status: false });
        });
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formBuilding.get(control).touched || this.formBuilding.get(control).dirty) && this.formBuilding.get(control).errors) {
        if (this.formBuilding.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  addBldg() {
    if (this.formBuilding.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));
      Object.keys(this.formBuilding.controls).forEach(field => {
        this.formBuilding.controls[field].markAsDirty();
        this.formBuilding.controls[field].markAsTouched();
      });
    } else {
      let addObj = {
        name: this.formBuilding.value.name.trim(),
      }
      this.masterService.addBuilding(addObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message,  this.translate.instant("pop_up_messages.success"));
            this.dialogRef.close({ type: 'level2', status: true });
          }
        }, error => {
          if ( error && error.error && 'errors' in error.error) {
            error.error.errors.forEach(element => {
              this.toastr.error(element.errorMessages[0],  this.translate.instant("pop_up_messages.error"));
            })
          }
          else {
            this.toastr.error(error.error.Message,  this.translate.instant("pop_up_messages.error"));
          }
          //this.dialogRef.close({ type: 'level2', status: false });
        });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formBuilding.reset();
  }
}
