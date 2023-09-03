import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { AccountService } from 'src/app/core/services/account.service';
import { UserService } from 'src/app/core/services/user.service';
import { AddEmailConfig, UpdateEmailConfig } from '../../models/config-models';
import { ConfigureService } from '../../services/configure.service';
@Component({
  selector: 'app-email-server',
  templateUrl: './email-server.component.html',
  styleUrls: ['./email-server.component.scss']
})

export class EmailServerComponent implements OnInit {
  formData: any;
  public formEmailServer: FormGroup;
  buildingList = [];
  originalBuildingList= [];
  private validationMessages: { [key: string]: { [key: string]: string } };
  color: ThemePalette = 'accent';
  checked: boolean = false;
  disabled: boolean = false;
  enableSSl: boolean = false;
  showPassword: boolean = false;
  buildngPlace = ''; 

  private addEmailConfig: AddEmailConfig = new AddEmailConfig();
  private updateEmailConfig: UpdateEmailConfig = new UpdateEmailConfig();
  @ViewChild("passwordField", { static: false }) passwordField: ElementRef;
  selectedLocation: any;
  locationId: any;
  userDetails: any;
  originalLocationList: any;
  locationListId: any;
  selectedBuilding: any;
  orignalLocationList: any;
  ProductType = ProductTypes;
  productType: string;
  building_location = '';


  constructor(public dialogRef: MatDialogRef<EmailServerComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private configureService: ConfigureService,
    private authenticationService :AccountService,
    public userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      server: {
        required: translate.instant('configure_email_server.server_placeholder'),
        maxlength: translate.instant('EmployeeForm.FirstNameMaxlength'),
      },
      out_port: {
        required: translate.instant('configure_email_server.out_port_placeholder'),
        pattern: translate.instant('configure_email_server.out_port_pattern')
      },
      fromId: {
        required: translate.instant('configure_email_server.form_id_placeholder'),
        pattern: translate.instant('configure_email_server.form_id_pattern')
      },
      require_authentication: {
        required: translate.instant('configure_email_server.require_authentication')
      },
      enable_ssl: {
        required: translate.instant('configure_email_server.require_authentication')
      },
      auth_user_id: {
        required: translate.instant('configure_email_server.auth_user_id_placeholder'),
        pattern: translate.instant('configure_email_server.auth_user_id_pattern')
      },
      password: {
        required: translate.instant('configure_email_server.password_placeholder')
      },
      display_name: {
        required: translate.instant('configure_email_server.display_name_placeholder'),
      },
      building_Id: {
        required: translate.instant('configure_email_server.building_name_placeholder')
      }
    };
    this.buildngPlace = translate.instant('configure_email_server.building_name_placeholder');
    this.productType = this.userService.getProductType();
    if(this.productType == this.ProductType.Commercial){
      this.building_location = translate.instant('labels.select_buildings');
    }else{
      this.building_location = translate.instant('labels.select_Locations');
    }
    this.userDetails = this.userService.getUserData();    
    this.userDetails.level2List.map(element => {
      if (element.isDefault) {
        this.selectedBuilding = element.name;
        return;
      }
    })
  }

  ngOnInit(): void {    
    this.formData = this.data;
    
    this.createForm();
    // this.configureService.getBuildingList().subscribe(res => {
    //   this.buildingList = res.data;
    //   this.originalBuildingList = res.data;
    // });

    this.selectLocation();
    this.formEmailServer.controls['building_Id'].valueChanges.subscribe((value)=>{
      this.buildingList = this._filter(value);
    });
  }

  private _filter(value: string): string[] {
    let filterValue;
    if(value && JSON.stringify(value).includes('name'))
      filterValue = value['name'].toLowerCase();
    else
      filterValue = value.toLowerCase();
    return this.originalLocationList.filter(option =>option.name.toLowerCase().startsWith(filterValue) );
  }

  cancel() {
    this.dialogRef.close();
  }

  createForm() {
    this.formEmailServer = this.formBuilder.group({
       building_Id: [this.formData?.data?.level2Id ? this.formData.data.level2Id : null],
      server: [this.formData?.data?.server ? this.formData.data.server : null, [Validators.required, Validators.maxLength(50)]],
      out_port: [this.formData?.data?.outPort ? this.formData.data.outPort : null, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(50)]],
      fromId: [this.formData?.data?.fromId ? this.formData.data.fromId : null, [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)]],
      require_authentication: [this.formData?.data?.requireAuthentication ? this.formData.data.requireAuthentication : false],
      enable_ssl: [this.formData?.data?.enableSSL ? this.formData.data.enableSSL : false],
      display_name: [this.formData?.data?.displayName ? this.formData.data.displayName : null, [Validators.maxLength(50)]],
      auth_user_id: [this.formData?.data?.authUserId ? this.formData.data.authUserId : null, [Validators.maxLength(150)]],
      password: [this.formData?.data?.authUserP ? this.formData.data.authUserP : null],
    });

    if (this.formData.mode == 'edit') {
      this.buildngPlace = this.formData.data.buildingName;
      let isAuthEnabled = this.formData.data.requireAuthentication? true: false;
      this.toggleReqAuth(true, isAuthEnabled);
    }
  }

  private dataSendToBackend(): AddEmailConfig {
    const formData = this.formEmailServer.value;
    this.addEmailConfig.level2Id = formData?.building_Id?.id?formData.building_Id?.id:null;
    this.addEmailConfig.server = formData.server;
    this.addEmailConfig.outPort = JSON.parse(formData.out_port);
    this.addEmailConfig.fromId = formData.fromId;
    this.addEmailConfig.requireAuthentication = formData.require_authentication;
    this.addEmailConfig.enableSSL = formData.enable_ssl;
    this.addEmailConfig.authUserId = formData.auth_user_id;
    this.addEmailConfig.authUserP = formData.password;
    this.addEmailConfig.displayName = formData.display_name;

    return this.addEmailConfig;
  }

  formValidation() {
    Object.keys(this.formEmailServer.controls).forEach(field => {
      if (this.formEmailServer.controls[field]['controls']) {
        this.formEmailServer.controls[field]['controls'].forEach(formArrayField => {
          Object.keys(formArrayField['controls']).forEach(item => {
            formArrayField['controls'][item].markAsDirty();
            formArrayField['controls'][item].markAsTouched();
          });
        });
      } else {
        this.formEmailServer.controls[field].markAsDirty();
        this.formEmailServer.controls[field].markAsTouched();
      }
    });
  }

  togglePasswordShow(){
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword ? "text" : "password";
  }


  onSubmit() {
    if (this.formEmailServer.invalid) {
      this.toastrService.warning(this.translate.instant('toster_message.warning_message'), this.translate.instant('toster_message.warning'));
      this.formValidation();
    } else {
      this.configureService.addMailServer(this.dataSendToBackend()).subscribe((res: any) => {
        if (res.statusCode === 200 && res.errors === null) {
          this.toastrService.success(res.message, this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close(res);
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        } else {
          this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      }
      );
    }
  }

  updateForm() {
    if (this.formEmailServer.invalid) {
      this.toastrService.warning(this.translate.instant('toster_message.warning_message'), this.translate.instant('toster_message.warning'));
      this.formValidation();
    } else {  
      this.configureService.updateMailServer(this.dataSendToBackendForUpdate()).subscribe((res: any) => {
        if (res.statusCode === 200 && res.errors === null) {
          this.toastrService.success(res.message, this.translate.instant("pop_up_messages.success"));
          this.dialogRef.close(res);
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.success"));
          })
        } else {
          this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.success"));
        }
      }
      );
    }
  }

  resetForm() {
    this.formEmailServer.reset();
  }

  dataSendToBackendForUpdate(): UpdateEmailConfig {
    const formData = this.formEmailServer.value;

    this.updateEmailConfig.mailServerId = this.formData.data.id;
    this.updateEmailConfig.level2Id = formData.building_Id;
    this.updateEmailConfig.server = formData.server;
    this.updateEmailConfig.outPort = JSON.parse(formData.out_port);
    this.updateEmailConfig.fromId = formData.fromId;
    this.updateEmailConfig.requireAuthentication = formData.require_authentication;
    this.updateEmailConfig.enableSSL = formData.enable_ssl;
    this.updateEmailConfig.authUserId = formData.auth_user_id;
    this.updateEmailConfig.authUserP = formData.password;
    this.updateEmailConfig.displayName = formData.display_name;

    return this.updateEmailConfig;
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.formEmailServer && this.formEmailServer.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.formEmailServer.get(control).touched ||
            this.formEmailServer.get(control).dirty) &&
          this.formEmailServer.get(control).errors
        ) {
          if (this.formEmailServer.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  toggleReqAuth(isAuthenticateTrue?: boolean, clickByUser?: boolean) {
    if(!isAuthenticateTrue) {
      if (this.formEmailServer.value.enable_ssl) {
        this.disabled = true;
        this.formEmailServer.controls.require_authentication.setValue(true);
      } else {
        this.disabled = false;
        this.formEmailServer.controls.require_authentication.setValue(false);
      }
    }
    if ((this.formEmailServer.value.require_authentication && clickByUser) || ( this.formData != null && this.formData?.data?.requireAuthentication)|| (this.disabled && this.formEmailServer.value.require_authentication)) {
      this.formEmailServer.get('auth_user_id').setValidators([Validators.required]);
      this.formEmailServer.get('auth_user_id').updateValueAndValidity();

      this.formEmailServer.get('password').setValidators([Validators.required]);
      this.formEmailServer.get('password').updateValueAndValidity();
    } else {
      this.formEmailServer.get('auth_user_id').clearValidators();
      this.formEmailServer.get('auth_user_id').updateValueAndValidity();

      this.formEmailServer.get('password').clearValidators();
      this.formEmailServer.get('password').updateValueAndValidity();
    }
  }

  toggleEnableSSL() {
    this.enableSSl = !this.enableSSl;
  }

  displayWith(user){ 
    return user && user.name ? user.name : '';  
  }

  getValue(event){
  }

  locationChange(value){
    let obj = {
      locationName:  this.selectedBuilding
    }
    console.log(obj,'obj')
    this.selectedBuilding = value
    if ((value.locationName).localeCompare('All Location') == 0) {
      this.locationId = this.locationListId
    }
    else{
      // this.orignalLocationList.push(obj)
      this.locationId = [value.id]
    }
  }

  selectLocation(datas?){
    this.locationId = datas?.value
    let reqObj = {
      isDeleted: false,
    };
    this.authenticationService.changeLocation(reqObj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.buildingList = data.data;
        this.orignalLocationList = data.data;
         this.locationListId = this.buildingList.map(element => element.id)
      }

    })
  }

}
