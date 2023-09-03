import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../../services/provider.service';
import { ConfigureService } from '../../services/configure.service';
import { first } from 'rxjs/operators';
import { commonResponse, contractorConfigGetAllReq, contractorConfigGetAllRes, contractorConfigRow, contractorConfigGetByIdReq, contractorConfigGetByIdRes, contractorConfigUpdateByIdReq, contractorConfigUpdateByIdRes, contractorConfigaAddReq, contractorConfigAddRes, contractorConfigaDeleteReq, contractorConfigDeleteRes } from '../../constants/enum';

@Component({
  selector: 'app-contractor-config-popup',
  templateUrl: './contractor-config-popup.component.html',
  styleUrls: ['./contractor-config-popup.component.scss']
})
export class ContractorConfigPopupComponent implements OnInit {
  @ViewChild('textarea') textarea: any;
  formData: any;
  public contractorConfigForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };

  contractorConfigaAddReq = new contractorConfigaAddReq();
  contractorConfigAddRes = new contractorConfigAddRes();
  contractorConfigGetAllReq = new contractorConfigGetAllReq();
  contractorConfigGetAllRes = new contractorConfigGetAllRes()
  contractorConfigGetByIdReq = new contractorConfigGetByIdReq();
  contractorConfigGetByIdRes = new contractorConfigGetByIdRes();
  contractorConfigUpdateByIdReq = new contractorConfigUpdateByIdReq();
  contractorConfigUpdateByIdRes = new contractorConfigUpdateByIdRes();

  contractorConfigaDeleteReq = new contractorConfigaDeleteReq();
  contractorConfigDeleteRes = new contractorConfigDeleteRes();

  contractorConfigRow = new contractorConfigRow();
  level2Id: Number;
  level3Id: Number;

  constructor(
    private configureService: ConfigureService,
    public dialogRef: MatDialogRef<ContractorConfigPopupComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private providerService: ProviderService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      configFieldName: {
        required: translate.instant('cotract_configure_fields.field_required'),
      },
    }
  }


  ngOnInit(): void {
    this.formData = this.data;
    this.level2Id = this.data.level2Id;
    this.contractorConfigRow = this.data.data;
    this.createForm();
    this.getTemplateById();
  }

  getTemplateById() {
    if (this.contractorConfigRow && this.contractorConfigRow.configId) {
      this.contractorConfigGetByIdReq.configId = this.contractorConfigRow.configId;
      this.configureService.getContractorConfigBYId(this.contractorConfigGetByIdReq).pipe(first()).subscribe((resp: commonResponse) => {
        if (resp.statusCode == 200 && resp.errors == null) {
          this.contractorConfigGetByIdRes = resp.data;
        }
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("toster_message.success"));
          }
        })
    }
  }

  createForm() {
    this.contractorConfigForm = this.formBuilder.group({
      configFieldName: [(this.contractorConfigRow?.configFieldName != null) ? (this.contractorConfigRow?.configFieldName) : null, [Validators.required]],
      // configValue: [(this.contractorConfigRow?.configValue) ? (this.contractorConfigRow?.configValue) : null, [Validators.required]],
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  updateContractorConfig() {
    this.contractorConfigUpdateByIdReq = {
      configFieldName: this.contractorConfigForm.get('configFieldName').value,
      configId: this.contractorConfigGetByIdRes.configId,
      configValue: ""
    }
    this.configureService.updateContractorConfigBYId(this.contractorConfigUpdateByIdReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.contractorConfigUpdateByIdRes = resp;
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(resp)
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.success"));
        }
      })
  }

  addContractorConfig() {
    this.contractorConfigaAddReq = {
      configFieldName: this.contractorConfigForm.get('configFieldName').value,
      // configValue: this.contractorConfigForm.get('configValue').value,
      level2Id: this.level2Id,
      level3Id: this.level3Id
    }
    this.configureService.addContractorConfig(this.contractorConfigaAddReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.contractorConfigUpdateByIdRes = resp;
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(resp)
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.success"));
        }
      })
  }


  deleteContractorConfig() {
    this.contractorConfigaDeleteReq = {
      configId: this.contractorConfigRow.configId
    }
    this.configureService.deleteContractorConfig(this.contractorConfigaDeleteReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.contractorConfigDeleteRes = resp;
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(resp)
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.success"));
        }
      })
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.contractorConfigForm && this.contractorConfigForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.contractorConfigForm.get(control).touched ||
            this.contractorConfigForm.get(control).dirty) &&
          this.contractorConfigForm.get(control).errors
        ) {
          if (this.contractorConfigForm.get(control).errors[validator]) {
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
