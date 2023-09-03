import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ThemePalette } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from 'ngx-toastr';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { deviceNames } from '../../constants/enum';
import { ConfigureService } from '../../services/configure.service';
import { ProviderService } from '../../services/provider.service';

@Component({
  selector: 'app-provider-setup-popup',
  templateUrl: './provider-setup-popup.component.html',
  styleUrls: ['./provider-setup-popup.component.scss']
})
export class ProviderSetupPopupComponent implements OnInit {
  formData: any;
  public providerSetupForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  versionList = [{ "name": "api 3200" }, { "name": "api 5000" }]
  // cardType = [{ name: "Visitor" }, { name: "Employee" }, { name: "Mobile" }]
  providerList = [];
  selectedProviderName: string = '';
  selectedProviderId: number;
  deviceName:any=deviceNames
  showPassword: boolean = false;
  @ViewChild("passwordField", { static: false }) passwordField: ElementRef;
  userDetails: any;
  cardTypeList: any;
  gallagherId: number = 4;
  buildingList: any;
   productType: any;
  ProductType = ProductTypes;
  level2id: number = null;
  cardTyeAccess: boolean = false;
  selectedCardType: string = null;
  IsOtherProviderInactive: boolean = false;
  selectedLocationName: string = ""
  originalBuildingList: any;
  buildingValidFlag: boolean = false;
  // selectedProviderName:string=''
  constructor(public dialogRef: MatDialogRef<ProviderSetupPopupComponent>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private providerService: ProviderService,
    private configureService: ConfigureService,
    private translate: TranslateService,
    private userService: UserService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      name: {
        required: translate.instant('provider_setup.provider_name_req')
      },
      url: {
        required: translate.instant('provider_setup.url_placeholder')
      },
      token: {
        required: translate.instant('provider_setup.token_placeholder')
      },
      apiVersion: {
        required: translate.instant('provider_setup.version_placeholder')
      },
    }
    this.userDetails = this.userService.getUserData();
  }

  ngOnInit(): void {
     this.productType = this.userService.getProductType();
    if (this.data && this.data.data && this.data.data.id)
      this.getById(this.data.data.id);
    this.formData = this.data;
    this.selectedProviderName = this.formData?.data?.name;
    this.selectedProviderId =this.formData?.data?.providerMasterId
    this.createForm();
    this.getProviderServer();
    this.getBuildingList();
    this.providerSetupForm.controls['buildingName'].valueChanges.subscribe((value) => {
      // console.log(value)
       let count = 0;
      if (value.id && value.name) {
        this.buildingValidFlag = false;
        this.level2id = value.id;
        this.selectedLocationName = value.name;
        for (let i = 0; i < this.buildingList.length; i++){
        if (this.buildingList[i]['name'] == value?.name) {
          // console.log(value);
          this.buildingValidFlag = false;
          count = 1;
          break
        }
      }
      } else {
         for (let i = 0; i < this.buildingList.length; i++){
        if (this.buildingList[i]['name'] == value) {
          // console.log(value);
          this.buildingValidFlag = false;
          count = 1;
          break
        }
      }
      }
      if (count==0) {
        this.buildingValidFlag = true;
      } 
      if (!value) {
         this.buildingValidFlag = false;
      }
      this.buildingList = this._filter(value);
    });
  }
 private _filter(value: string): string[] {
   let filterValue;
   if (value && JSON.stringify(value).includes('name')) {
        filterValue = value['name'].toLowerCase(); 
   }
    else
      filterValue = value.toLowerCase();
    return this.originalBuildingList.filter(option =>option.name.toLowerCase().startsWith(filterValue) );
  }
  getById(id) {
    let obj = {
      "id":id
    }
    this.providerService.getProviderById(obj)
      .subscribe(resp => {
        if(resp.statusCode == 200){
          this.formData.data  = resp.data
          this.createForm();
        }
      })
  }

  getProviderServer(){
    let obj = {
      "pageSize": 20,
      "pageIndex": 1,
      "orderBy": "",
      "orderDirection": ""
    }
    this.providerService.getProviderServer(obj)
    .subscribe(resp => {
      if(resp && resp.statusCode == 200){
        this.providerList = resp.data.list;
      }
    })
  }

  onSubmit() {
    if (this.formData.mode == 'edit') {
      this.updateProviderSetupForm();
    } else {
      // this.addNewProvider();
      this.checkDeviceActive();
    }
  }
  updateProviderSetupForm() {
    let cardTypeAccess = null;
    if (this.providerSetupForm.value.name == 'Gallagher') {
      cardTypeAccess = this.providerSetupForm.value.cardType;
    }
    let req = {
      "id": this.data.data.id,
      "url": this.providerSetupForm.value.url,
      "token": this.providerSetupForm.value.token,
      "apiVersion": this.providerSetupForm.value.apiVersion,
      "cardTypeAccess": cardTypeAccess
    }
    this.providerService.updateProvider(req).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close();
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    });
  }
  updateForm() {
    this.formData.mode = 'edit'

  }
  cancel() {
    this.dialogRef.close();
  }
  resetForm() {
    this.providerSetupForm.reset();
    this.buildingList = this.originalBuildingList;
  }

  createForm() {
    this.providerSetupForm = this.formBuilder.group({
      name: [
        this.formData?.data?.name ? this.formData.data.name : null, [Validators.required,],
      ],
      url: [
        this.formData?.data?.url ? this.formData.data.url : null, [Validators.required],
      ],
      token: [
        this.formData?.data?.token ? this.formData.data.token : null, [Validators.required],
      ],
      apiVersion: [
        this.formData?.data?.apiVersion ? this.formData.data.apiVersion : null, [],
      ],
      buildingName: [
        this.formData?.data?.buildingName ? this.formData.data.buildingName : null, [],
      ],
      cardType: [
        this.formData?.data?.cardTypeAccess ? this.formData.data.cardTypeAccess : null, [],
      ],
      IsEmailRequired: [
          this.formData?.data?.IsEmailRequired ? this.formData.data.IsEmailRequired : false, [],
      ]
      // userId: [
      //   this.formData?.data?.userId ? this.formData.data.userId : null, [],
      // ],
      // password: [
      //   this.formData?.data?.password ? this.formData.data.password :null, [],
      // ],
      // IsEncrypted: [
      //   this.formData?.data?.IsEncrypted ? this.formData.data.IsEncrypted : false, [],
      // ],
      // connectedProgram: [
      //   this.formData?.data?.connectedProgram ? this.formData.data.connectedProgram : null, [],
      // ],
    });
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.providerSetupForm && this.providerSetupForm.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.providerSetupForm.get(control).touched ||
            this.providerSetupForm.get(control).dirty) &&
          this.providerSetupForm.get(control).errors
        ) {
          if (this.providerSetupForm.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }
  selectCardType(event) {
     this.selectedCardType = event;
  }
  addNewProvider() {
    this.providerSetupForm.controls['url'].enable();
    this.providerSetupForm.controls['token'].enable();
    let id = this.selectedProviderId;
    let level2id = null;
    let cardTypeAccess = null;
    if (this.providerSetupForm.value.name == 'Gallagher') {
      cardTypeAccess = this.providerSetupForm.value.cardType;
    }
    let obj = {
      "url": this.providerSetupForm.value.url,
      "token": this.providerSetupForm.value.token,
      "apiVersion": this.providerSetupForm.value.apiVersion,
      "providerMasterId": id,
      "level2Id": this.level2id,
      "cardTypeAccess":this.selectedCardType,
      "IsEmailRequired": this.providerSetupForm.value.IsEmailRequired,
      "IsOtherProviderInactive":this.IsOtherProviderInactive
      // "locationName":this.providerSetupForm.value.buildingName
    }
    this.providerService.addProvider(obj).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastrService.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.dialogRef.close(true);
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          // this.dialogRef.close(false);
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        // this.dialogRef.close(false);
      }
    });
  }
  selectedProvider(event) {
    this.selectedProviderId = event.value;
    this.providerSetupForm.controls['url'].enable();
    this.providerSetupForm.controls['token'].enable();
    this.providerSetupForm.controls['url'].setValue(null);
    this.providerSetupForm.controls['token'].setValue(null);
    // this.form.controls['AuthorityNum'].setValue(null);
    // console.log(this.providerList,this.selectedProviderId);

    this.providerList.map(element => {
      if (this.selectedProviderId == element.id)
        this.selectedProviderName = element.providerName;
    })


    this.cardTyeAccess = false;
    if (this.selectedProviderId == 4) {
      // this.getCardTypeAccss();
      this.providerSetupForm.get('cardType').setValidators([Validators.required])
    } else {
      this.providerSetupForm.get('cardType').clearValidators()
    }
    this.providerSetupForm.get('cardType').updateValueAndValidity()
  }
 
  getCardTypeAccss() {
    let obj = {
      url: this.providerSetupForm.value.url,
      token:this.providerSetupForm.value.token
    }
     this.providerService.getCardTypeAccess(obj).subscribe(resp => {
       if (resp.statusCode === 200 && resp.errors === null) {
         this.cardTypeList = resp.data;
         this.cardTyeAccess = true;
         this.providerSetupForm.controls['url'].disable();
         this.providerSetupForm.controls['token'].disable();
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    });
  }

  onChange(event) {
  }
  toggleShow() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword
      ? "text"
      : "password";
  }
  selectedBuilding(event) {
    this.buildingValidFlag = false;
    this.level2id = event.source.value.id;
    this.selectedLocationName = event.source.value.name;
    //  console.log(event.source.value, this.level2id,this.selectedLocationName);
    // this.buildingList.map(element => {
    //   if (element.id == this.level2id) {
    //     this.selectedLocationName = element.name;
    //   }
    // })
  }
  getBuildingList() {
    this.configureService.getBuildingList().subscribe(resp => {
      this.buildingList = resp.data;
      this.originalBuildingList = resp.data;
     })
  }
   checkDeviceActive() {
    let obj = {
      level2Id: this.level2id,
      ProviderId:this.selectedProviderId
     }   
     this.providerService.checkAlreadyDeviceActive(obj).subscribe(resp => {
       if (resp.statusCode === 200 && resp.errors === null) {
          if(resp.data.isActive){
                const dialogRef = this.dialog.open(CommonPopUpComponent, {
                data: {
                  pop_up_type: "activeDevice",
                  icon: "assets/images/alert.png",
                  activeAccessControler: resp.data.activeProviderName,
                  location: this.selectedLocationName,
                  toActiveAccessControler:this.selectedProviderName
                },
                panelClass: ["vams-dialog-confirm"],
              });
              dialogRef.afterClosed().subscribe((result) => {
                if (result == true) {
                  this.IsOtherProviderInactive = true;   
                  this.addNewProvider();
                }
              });
     }
          else {
            this.IsOtherProviderInactive = false;
            this.addNewProvider();
     }
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastrService.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastrService.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    });
  }
  getValue() {
    
  }
   displayWith(user){    
    return user && user.name ? user.name : '';  
  }

}
