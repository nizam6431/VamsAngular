import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
import { ToastrService } from 'ngx-toastr';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from '../../services/configure.service';
import { ProviderService } from '../../services/provider.service';
@Component({
  selector: 'app-provider-device-popup',
  templateUrl: './provider-device-popup.component.html',
  styleUrls: ['./provider-device-popup.component.scss']
})
export class ProviderDevicePopupComponent implements OnInit {
  buildingList: any;
  // accessLevelList = [{ name: "Level1" }, { name: "Level2" }, { name: "Level3" }]
  accessLevelList: any;
  formData: any;
  providerDetail: any;
  showAccessLevel: boolean = false;
  rowData: any;
  public providerDeviceForm: FormGroup;
  productType: any;
  ProductType = ProductTypes;
  // public levelAccessForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  selectedAccessLevel: any[] = [];
  constructor(public dialogRef: MatDialogRef<ProviderDevicePopupComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private configureService: ConfigureService,
    private providerService: ProviderService,
    private userService:UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      buildingName: {
        required: translate.instant('provider_device.buildingId_req')
      },
      accessLevel: {
        required: translate.instant('provider_device.access_level_req')
      },
      deviceUniqueId: {
        required: translate.instant('provider_setup.device_unique_no_placeholder')
      }
    }
     }

  ngOnInit(): void {
    this.productType = this.userService.getProductType();
    this.providerDetail = this.configureService.providerDetails;
    this.formData = this.data;
    // console.log(this.formData)
    // console.log(this.providerDetail);
    if (this.formData.data) {
      this.getById();
      this.formData.data.accessLevel.map(item => {
        this.selectedAccessLevel.push(item);
      })
    }
    this.getBuildingList();
    this.createForm();
    
  }
  getBuildingList() {
    this.configureService.getBuildingList().subscribe(resp => {
      this.buildingList = resp.data;
    })
  }
  getById() {
    let obj = {
      id: this.formData.data.id
    }
    this.providerService.getAccessLevelById(obj).subscribe(resp => {
      // console.log(resp)
      this.rowData = resp;
      // console.log(this.rowData)
    })
  }
  fieldsChange(event, data) {
    if (event.checked) {
      this.selectedAccessLevel.push(data);
    } else {
      let index = this.selectedAccessLevel.findIndex(element=>element.id == data.id)
      if (index >= 0) {
        this.selectedAccessLevel.splice(index, 1);
      }
    }

  }
  onSubmit() {
    let id = null;
    if (this.providerDeviceForm.value.buildingName) {
      this.buildingList.map(element => {
        if (element.name == this.providerDeviceForm.value.buildingName) {
          id = element.id
        }
      })
    }
    let obj = {
      "accessLevel":this.selectedAccessLevel,
      "providerSetupId": this.providerDetail.id,
      "deviceUniqueId": this.providerDeviceForm.value.deviceUniqueId,
      "level2Id": id
    }
    this.providerService.addNewAccessSetup(obj).subscribe(resp => {
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

  updateForm() {
    let id = null;
    if (this.providerDeviceForm.value.buildingName) {
      this.buildingList.map(element => {
        if (element.name == this.providerDeviceForm.value.buildingName) {
          id = element.id
        }
      })
    }
    let obj = {
      "accessLevel": this.selectedAccessLevel,
      "deviceUniqueId": this.providerDeviceForm.value.deviceUniqueId,
      "id": this.formData.data.id
    }
    this.providerService.updateAccessSetup(obj).subscribe(resp => {
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
  cancel() {
    this.dialogRef.close();
  }
  resetForm() {
    // console.log(this.selectedAccessLevel)
    this.providerDeviceForm.reset();
    this.selectedAccessLevel=[]
    this.accessLevelList.forEach((element) => {
      element['checked'] = false
    })
    // console.log(this.accessLevelList)
    
  }

  createForm() {
    this.providerDeviceForm = this.formBuilder.group({
      buildingName: [
        this.formData?.data?.buildingName ? this.formData.data.buildingName : null, [],
      ],
      accessLevel: [
        this.formData?.data?.accessLevel ? this.formData.data.accessLevel : null, [],
      ],
      deviceUniqueId: [
        this.formData?.data?.deviceUniqueId ? this.formData.data.deviceUniqueId : null, [Validators.required],
      ]
    });
  }
  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.providerDeviceForm && this.providerDeviceForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.providerDeviceForm.get(control).touched ||
            this.providerDeviceForm.get(control).dirty) &&
          this.providerDeviceForm.get(control).errors
        ) {
          if (this.providerDeviceForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }
  getAccessLevel() {
    // call api for access level
    let obj = {
      "providerSetupId": this.providerDetail.id
    }
    this.providerService.getAccessLevelList(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
         this.accessLevelList = resp.data;
        if (this.formData.data) {
          for (let i = 0; i < this.formData.data.accessLevel.length; i++) {
            this.accessLevelList.forEach(element => {
              if (element['name'] == this.formData.data.accessLevel[i].name) {
                element['checked'] = true;
              } 
            })
          }
        }
        this.showAccessLevel = true;
      }
     })
   
  }
  selectedBuilding(buildingName) {
    let id = null;
    this.buildingList.map(element => {
      if (element.name == buildingName) {
        id = element.id
      }
    })
    let obj = {
      "level2Id": id
    }
    this.providerService.getDeviceUniqueId(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        if (resp.data) {
          this.providerDeviceForm.patchValue({ deviceUniqueId: resp.data });
        } else {
          this.providerDeviceForm.patchValue({ deviceUniqueId: this.providerDeviceForm.value.deviceUniqueId });
        }
      }
    })
  }
  editAccessSetup() {
    this.formData.mode = 'edit';
  }
}
