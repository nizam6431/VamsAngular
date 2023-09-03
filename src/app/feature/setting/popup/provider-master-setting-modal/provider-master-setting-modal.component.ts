import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { TranslateService } from '@ngx-translate/core';
import { SettingServices } from '../../services/setting.service';
import { Status } from '../../constant/column';

@Component({
  selector: 'app-provider-master-setting-modal',
  templateUrl: './provider-master-setting-modal.component.html',
  styleUrls: ['./provider-master-setting-modal.component.scss']
})
export class ProviderMasterSettingModalComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  formData: any;
  statusList = Object.keys(Status);
  private validationMessages: { [key: string]: { [key: string]: string } };
  public providerMasterForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ProviderMasterSettingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public translate: TranslateService,
    private settingServices: SettingServices
  ) {
    this.validationMessages = {
      providername: {
        required: translate.instant('provider_master.provider_name_required'),
        maxlength: translate.instant('provider_master.provider_name_Maxlength'),
      },
      shortcode: {
        required: translate.instant('provider_master.shortcode_required'),
        maxlength: translate.instant('provider_master.shortcode_Maxlength'),
      },
      status: {
        required: translate.instant('provider_master.shortcode_required'),
        maxlength: translate.instant('provider_master.shortcode_Maxlength'),
      },
    };
  }

  ngOnInit(): void {
    this.formData = this.data;
    this.createForm();
  }

  createForm() {
    this.providerMasterForm = this.formBuilder.group({
      providername: [this.formData?.data?.providerName ? this.formData.data.providerName : null, [Validators.required, Validators.maxLength(50)]],
      shortcode: [this.formData?.data?.shortCode ? this.formData.data.shortCode : null, [Validators.required, Validators.maxLength(20)]],
      status: [this.formData.data?.status ? this.formData.data.status : this.statusList[0], [Validators.required]],
    });
    if (this.formData.data)
      this.providerMasterForm.controls.status.setValidators([Validators.required]);
    else
      this.providerMasterForm.controls.status.setValidators(null);
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.providerMasterForm.get(control).touched || this.providerMasterForm.get(control).dirty) && this.providerMasterForm.get(control).errors) {
        if (this.providerMasterForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  onSubmit() {
    if (this.providerMasterForm.invalid) {
      this.toastr.warning(this.translate.instant('pop_up_messages.add_account_warning'), this.translate.instant('pop_up_messages.could_not_save'));
      Object.keys(this.providerMasterForm.controls).forEach(field => {
        if (this.providerMasterForm.controls[field]['controls']) {
          this.providerMasterForm.controls[field]['controls'].forEach(formArrayField => {
            Object.keys(formArrayField['controls']).forEach(item => {
              formArrayField['controls'][item].markAsDirty();
              formArrayField['controls'][item].markAsTouched();
            });
          });
        }
        else {
          this.providerMasterForm.controls[field].markAsDirty();
          this.providerMasterForm.controls[field].markAsTouched();
        }
      });
    } else {

      if (this.formData.mode == "add") {
        this.addProviderMaster();
      } else if (this.formData.mode == "edit") {
        this.updateProviderMaster();
      }
    }
  }

  addProviderMaster() {
    this.settingServices.saveProviderMaster(this.providerMasterForm.value).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.toastr.success(res.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close(true)
      } else {
        this.toastr.error(res.message, this.translate.instant("pop_up_messages.error"));
        // this.dialogRef.close(false)
      }
    }, error => {
      this.showError(error);
      // this.dialogRef.close(false)
    })
  }

  updateProviderMaster() {
    let reqObj = {
      "id": this.formData.data.id,
      "status": this.providerMasterForm.value.status,
    }
    this.settingServices.updateProviderMaster(reqObj).subscribe((res) => {
      if (res && res.statusCode == 200) {
        this.toastr.success(res.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close(true)
      } else {
        this.toastr.error(res.message, this.translate.instant("pop_up_messages.error"));
      }
    }, error => {
      this.showError(error);
    })
  }

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.providerMasterForm.reset();
  }

  showError(error) {
    if (error && error.error && 'errors' in error.error) {
      error.error.errors.forEach(element => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
      })
    }
    else {
      this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
    }
  }

}
