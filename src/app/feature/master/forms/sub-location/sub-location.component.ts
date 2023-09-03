import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
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
  selector: 'app-sub-location',
  templateUrl: './sub-location.component.html',
  styleUrls: ['./sub-location.component.scss']
})
export class SubLocationComponent implements OnInit {

  permissionKeyObj=permissionKeys;
  @Input() formData: any;
  @Input() subLocationlevel2Id;
  @Input() subLocationDetailsLevel2Id;
  @Input() subLocationDetailsLevel3Id;
  statusList = Object.keys(Status);
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formSubLocation: FormGroup;
  level2id: any;
  level2: any;
  level3: any;
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SubLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private commonTabService: CommonTabService,
    private toastr: ToastrService,
    private userService: UserService,
    public translate:TranslateService) {
    this.validationMessages = {
      name: {
        required: translate.instant('sub_location.nameRequired'),
        maxlength: translate.instant('sub_location.sublocationMaxlength'),
      },
      status: {
        required: translate.instant('sub_location.statusRequired'),
      }
    };
  }

  ngOnInit() {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void { 
    this.level2 = this.subLocationDetailsLevel2Id
    this.level3 = this.subLocationDetailsLevel3Id   
    console.log(this.level2,'level2')
  }
 
  createForm() {
    if(this.formData && this.formData.level2Id)
      this.level2id = this.formData.level2Id
    this.formSubLocation = this.formBuilder.group({
      name: [this.formData.data?.name ? this.formData.data.name : null, [Validators.required, Validators.maxLength(50)]],
      status: [this.formData.data?.status ? this.formData.data.status : null],
    });
    if(this.formData.data)
      this.formSubLocation.controls.status.setValidators([Validators.required]);
    else
      this.formSubLocation.controls.status.setValidators(null);
  }  


  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formSubLocation.get(control).touched || this.formSubLocation.get(control).dirty) && this.formSubLocation.get(control).errors) {
        if (this.formSubLocation.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  addSubLocation() {
    if (this.formSubLocation.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));  
      Object.keys(this.formSubLocation.controls).forEach(field => {
        this.formSubLocation.controls[field].markAsDirty();
        this.formSubLocation.controls[field].markAsTouched();
      });
    } else {
        let addObj = {
            name: this.formSubLocation.value.name.trim(),
            email: "",
            status: "",
            shortName: "",
            lightThemeLogoUrl: "",
            darkThemeLogoUrl: "",
            accessControl: 0,
            level3Address: {
              building: this.level2,
              floorNo: "",
              officeNo: "",
              contactIsd: "",
              contactMobile: "",
              contactEmail: ""
            },
            level3Admin: {
              userName: "",
              firstName: "",
              lastName: "",
              emailId: "",
              isd: "",
              mobileNo: ""
            }
        }

      this.commonTabService.addCompany(addObj).pipe(first()).subscribe(resp => {
      if(resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close({type: 'subLocation', status: true});
      }
      }, error => {
        this.toastr.error(error.error.errors[0].errorMessages[0], this.translate.instant("toster_message.error"));  
      });
    }
  }

  onSubmit() {
    console.log(this.level2,'level2')
    if (this.formSubLocation.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.add_account_warning"), this.translate.instant("toster_message.warning"));  
      Object.keys(this.formSubLocation.controls).forEach(field => {
        this.formSubLocation.controls[field].markAsDirty();
        this.formSubLocation.controls[field].markAsTouched();
      });
    } else {
        let updateObj = {
            level3Id:this.level3,
            name: this.formSubLocation.value.name.trim(),
            email: "",
            status:this.formSubLocation.value.status,
            shortName: "",
            lightThemeLogoUrl: "",
            darkThemeLogoUrl: "",
            accessControl: 0,
            level3CompanyUnits: [
              {
                level3Address: {
                  building:this.level2id,
                  floorNo: "",
                  officeNo: "",
                  contactIsd: "",
                  contactMobile: "",
                  contactEmail: ""
                }
              }
            ]
        }

      this.commonTabService.updateCompany(updateObj).pipe(first())
      .subscribe(resp => {
        if(resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
          this.dialogRef.close({type: 'subLocation', status: true});
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
      });      
    }
  }


  cancel() {
    this.dialogRef.close();
  }

  resetForm() {
    this.formSubLocation.reset();
  }

}
