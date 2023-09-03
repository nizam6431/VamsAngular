import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Status } from '../../constants/dropdown-enums';
import { CommonTabService } from '../../services/common-tab.service';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss']
})

export class DepartmentFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;
  @Input() formData: any;
  statusList = Object.keys(Status);
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formDepartment: FormGroup;

  // private toastrService: ToastrService  service
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DepartmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private userService: UserService,
    public translate:TranslateService) {
    this.validationMessages = {
      name: {
        required: translate.instant('Department.nameRequired'),
        maxlength: translate.instant('Department.departmentMaxlength'),
      },
      status: {
        required: translate.instant('Department.statusRequired'),
      }
    };
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formDepartment = this.formBuilder.group({
      name: [this.formData.data?.name ? this.formData.data.name : null, [Validators.required, Validators.maxLength(50)]],
      status: [this.formData.data?.status ? this.formData.data.status : null],
    });
    if(this.formData.data)
      this.formDepartment.controls.status.setValidators([Validators.required]);
    else
      this.formDepartment.controls.status.setValidators(null);
  }  

  onSubmit() {
    if (this.formDepartment.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));  
      Object.keys(this.formDepartment.controls).forEach(field => {
        this.formDepartment.controls[field].markAsDirty();
        this.formDepartment.controls[field].markAsTouched();
      });
    } else {
        let updateObj = {
          displayId: this.formData.data.displayId,
          name: this.formDepartment.value.name.trim(),
          status: this.formDepartment.value.status
        }

      this.commonTabService.updateDepartment(updateObj).pipe(first())
      .subscribe(resp => {
        if(resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
          this.dialogRef.close({type: 'department', status: true});
        }
      }, error => {
        if ( error && error.error && 'errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
          })
        }
        else {
        this.toastr.error(error.message, this.translate.instant("toster_message.error"));
        }
        //this.dialogRef.close({type: 'department', status: false});
      });      
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formDepartment.get(control).touched || this.formDepartment.get(control).dirty) && this.formDepartment.get(control).errors) {
        if (this.formDepartment.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  addDept() {
    if (this.formDepartment.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));  
      Object.keys(this.formDepartment.controls).forEach(field => {
        this.formDepartment.controls[field].markAsDirty();
        this.formDepartment.controls[field].markAsTouched();
      });
    } else {
      let level3Id = this.formData.companyData?this.formData.companyData?.rowData?.level3Id:null
      level3Id = (this.userService.isLevel3Admin() && this.userService.getLevel3DidForLevel3Admin()) ?
    this.userService.getLevel3DidForLevel3Admin() : level3Id;
        let addObj = {
          name: this.formDepartment.value.name.trim(),
          level3Id: level3Id
        }

      this.commonTabService.addDepartment(addObj).pipe(first()).subscribe(resp => {
      if(resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close({type: 'department', status: true});
      }
      }, error => {
        this.toastr.error(error.error.errors[0].errorMessages[0], this.translate.instant("toster_message.error"));  
        //this.dialogRef.close({type: 'department', status: false});
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formDepartment.reset();
  }
}

