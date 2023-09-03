import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";
import translate from 'aws-sdk/clients/translate';
import { ToastrService } from 'ngx-toastr';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from '../../services/configure.service';
import { ProviderService } from '../../services/provider.service';
@Component({
  selector: 'app-device-setup-popup',
  templateUrl: './device-setup-popup.component.html',
  styleUrls: ['./device-setup-popup.component.scss']
})
export class DeviceSetupPopupComponent implements OnInit {
  public deviceSetupForm: FormGroup;
  // private validationMessages: { [key: string]: { [key: string]: string } };
  formData: any;
  buildingList: any;
  validationMessages: { buildingName: { required: any; }; deviceSrNo: { required: any; }; };
  providerDetails: any;
  productType: any;
  ProductType = ProductTypes;
  constructor(
    public dialogRef: MatDialogRef<DeviceSetupPopupComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private configureService: ConfigureService,
    private translate: TranslateService,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.validationMessages = {
      buildingName: {
        required: translate.instant('provider_setup.provider_name_req')
      },
      deviceSrNo: {
        required: translate.instant('provider_setup.device_sr_no_placeholder')
      },
    }
  }

  ngOnInit(): void {
  this.productType = this.userService.getProductType();
  this.providerDetails = this.configureService.providerDetails;
    // console.log(this.providerDetails);
    this.formData = this.data;
    // console.log(this.formData)
    this.getBuildingList();
    this.createForm()
  }
  getBuildingList() {
    this.configureService.getBuildingList().subscribe(resp => {
      // console.log(resp);
      this.buildingList = resp.data;
     })
  }
  createForm() {
    this.deviceSetupForm = this.formBuilder.group({
      buildingName: [
        this.formData?.data?.buildingName ? this.formData.data.buildingName : null, [],
      ],
      deviceSrNo: [
        this.formData?.data?.deviceSrNo ? this.formData.data.deviceSrNo : null, [Validators.required],
      ],
    });
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.deviceSetupForm && this.deviceSetupForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.deviceSetupForm.get(control).touched ||
            this.deviceSetupForm.get(control).dirty) &&
          this.deviceSetupForm.get(control).errors
        ) {
          if (this.deviceSetupForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }
  cancel() {
    this.dialogRef.close();
  }
  updateForm() {
    this.formData.mode='edit'
  }
  resetForm() {
    this.deviceSetupForm.reset();
  }
  onSubmit() {
    if (this.formData.mode == 'edit') {
      this.updateDeviceSetup();
    } else {
      this.addNewDeviceSetup();
    }
  }
   updateDeviceSetup(){
     let obj = {
       "id": this.formData.data.id,
       "deviceSrNo": this.deviceSetupForm.value.deviceSrNo,
     }
    //  console.log(obj);
     this.providerService.updateDeviceSetup(obj).subscribe(resp => {
       if (resp.statusCode === 200 && resp.errors === null) {
         this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
         this.dialogRef.close(true);
       }
     }, error => {
       if ('errors' in error.error) {
         error.error.errors.forEach(element => {
           this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
           this.dialogRef.close(false);
         })
       }
       else {
         this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
         this.dialogRef.close(false);
       }
     });
   }
  addNewDeviceSetup() {
    let id = null;
    if (this.deviceSetupForm.value.buildingName) {
      this.buildingList.map(element => {
        if (element.name == this.deviceSetupForm.value.buildingName) {
          id = element.id
          console.log(element.name)
        }
      })
    }
    let obj = {
      "providerSetupId": this.providerDetails.id,
      "deviceSrNo": this.deviceSetupForm.value.deviceSrNo,
      "level2Id": id
    }
    // console.log(obj);
    this.providerService.addNewDeviceSetup(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close(true);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          this.dialogRef.close(false);
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        // this.dialogRef.close(false);
      }
    });
  }
  keyPressAlphanumeric(event) {
    console.log(event.keyCode)
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
 
}
