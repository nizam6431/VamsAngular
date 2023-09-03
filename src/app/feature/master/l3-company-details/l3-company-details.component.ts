import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { accessCantrol, Status } from '../constants/dropdown-enums';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShowDetailsComponent } from '../show-details/show-details.component';
import { CommonTabService } from '../services/common-tab.service';
import { MasterService } from '../services/master.service';
import { UserService } from 'src/app/core/services/user.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { formatPhoneNumber, removeSpecialCharAndSpaces, getCountryCode } from 'src/app/core/functions/functions';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import s3ParseUrl from 's3-url-parser';
import { TranslateService } from '@ngx-translate/core';
import { Level2Roles, Level3Roles,LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-l3-company-details',
  templateUrl: './l3-company-details.component.html',
  styleUrls: ['./l3-company-details.component.scss']
})
export class L3CompanyDetailsComponent implements OnInit {

  permissionKeyObj=permissionKeys;
  @Output() dialogClose = new EventEmitter();
  maxLength: string = "15";
  selectedCountry: CountryISO = CountryISO.UnitedStates;
  selectedCountriesFoUnit = [];

  private validationMessages: { [key: string]: { [key: string]: string } };
  public isExcel: boolean = false;
  public viewData: any;
  public formCompanyEdit: FormGroup;
  public statusList = Object.keys(Status);
  public buildingList = [];
  public base64textString = [];
  public base64textStringForDarkImg = [];
  public imgpreview = false;
  public darkLogoPreview = false;
  public imageURL;
  separateDialCode = true;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates];
  SearchCountryField = SearchCountryField;
  public adminsList = new Map<string, Array<Object>>();
  public isEdit: boolean = false;
  public employeeData: any;
  disabled = true;
  public loginUser: any;
  acessCantrolList = (accessCantrol);
  selectedAccessCantrol:any[]=[];
  disabledAccessCantrol:any[]=[]
  accessCantrolNumber: number=0;
  originalAccessCantrol: any;
  enviroment = environment
  userDetails: any;
  LightLogoUrl: any = environment.DefaultLightTheamLogoUrl;
  darkLogoUrl: any = environment.DefaultDarkTheamLogoUrl;
  lightLogoImageUrl:string = environment.DefaultLightTheamLogoUrl;
  darkLogoImageUrl:string = environment.DefaultDarkTheamLogoUrl;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow: any;

  constructor(
    private _sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private commonTabService: CommonTabService,
    private masterService: MasterService,
    private toastr: ToastrService,
    private userService: UserService,
    private commonService: CommonService,
    private uploadService:FileUploadService,

    private translate :TranslateService
    ) {
      this.productType = this.userService.getProductType();
      this.SeepzWorkFlow = this.userService.getWorkFlow();

    this.validationMessages = {
      name: {
        required: translate.instant('Company.CompanyNameRequired'),
        pattern: translate.instant('Company.CompanyValidation'),
        maxlength: translate.instant('Company.CompanyNameMaxlength'),
      },
      shortName: {
        required: translate.instant('Company.CompanyShortNameRequired'),
        pattern: translate.instant('Company.ShortNameValidation'),
        maxlength: translate.instant('Company.ShortNameMaxlength'),
      },
      building: {
        required: translate.instant('Company.buildingRequired'),
        pattern: translate.instant('Company.buildingValidation'),
        maxlength: translate.instant('Company.buildingMaxlength'),
      },
      contactMobile: {
        required: translate.instant('Company.CellValidation'),
        pattern: translate.instant('Company.CellPattern'),
        minlength: translate.instant('Company.Cellminlength'),
        maxlength: translate.instant('Company.Cellmaxlength'),
      },
      email: {
        required: translate.instant('Company.emailIDPattern'),
        email: translate.instant('Company.emailVaildation'),
        maxlength: translate.instant('Company.emailIdMaxlength'),
        pattern: translate.instant('Company.emailIDPattern'),
      },
      status: {
        required: translate.instant('Company.PleaseSelectStatus'),
      },
      floor: {
        required: translate.instant('Company.floorRequired'),
        maxlength: translate.instant('Company.floorMaxlength'),
      },
      uploadLogo: {
        required: translate.instant('Company.uploadLogoRequired'),
      },
      companyUrl: {
        required: translate.instant('Company.companyUrlRequired'),
      },
      officeNo: {
        required: translate.instant('Company.office_plaseholder'),
        maxlength:  translate.instant('Company.floorMaxlength'),
      },
      adminPhone: {
        required: translate.instant('Company.CellValidation'),
        pattern: translate.instant('Company.CellPattern'),
        minlength:  translate.instant('Company.Cellminlength'),
        maxlength:  translate.instant('Company.Cellmaxlength'),
      },
      adminEmail: {
        required: translate.instant('Company.emailId'),
        email: translate.instant('Company.emailVaildation'),
        maxlength: translate.instant('Company.emailMaxlength'),
        pattern: translate.instant('Company.emailVaildation'),
      },
      adminFirstName: {
        required: translate.instant('Company.adminFirstName'),
        pattern:  translate.instant('Company.FirstNameValidation'),
        maxlength: translate.instant('Company.FirstNameMaxlength'),
      },
      adminLastName: {
        required: translate.instant('Company.adminLastName'),
        pattern:  translate.instant('Company.LastNameValidation'),
        maxlength: translate.instant('Company.LastNameMaxlength'),
      },
      lightLogo: {
        required: translate.instant('Company.ligthDemo')
      },
      darkLogo: {
        required:translate.instant('Company.darkDemo'),
      },
    };
  }

  ngOnInit(): void {
    // this.handleIamge(this.darkLogoUrl,'darklogo');
    // this.handleIamge(this.LightLogoUrl,'lightLogo');
    this.loginUser = this.userService.getUserData();
    console.log(this.loginUser);
    if (this.loginUser) {
      this.getCompanyData();
    }
    if (environment.IsExcel) {
      this.isExcel = environment.IsExcel;
    }

    this.getComplexDetails();
  }

  getCompanyData() {
    this.selectedAccessCantrol = [];
    this.accessCantrolNumber = 0;
    this.masterService.getCompaniesById(this.loginUser.employeeOfDisplayId).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.viewData = resp;
          // if(!this.SeepzWorkFlow ){
          //   let LightLogoUrl = (this.viewData && this.viewData?.data && this.viewData?.data?.lightThemeLogoUrl)?(this.viewData?.data?.lightThemeLogoUrl):environment.DefaultLightTheamLogoUrl;
          //   let darkLogoUrl = (this.viewData && this.viewData?.data && this.viewData?.data?.darkThemeLogoUrl)?(this.viewData?.data?.darkThemeLogoUrl):environment.DefaultDarkTheamLogoUrl;
          //   this.lightLogoImageUrl = LightLogoUrl;
          //   this.darkLogoImageUrl = darkLogoUrl;
          //   this.handleIamge(darkLogoUrl,'darklogo');
          //   this.handleIamge(LightLogoUrl,'lightLogo');
          // }
          this.darkLogoPreview = (this.viewData && this.viewData?.data && this.viewData?.data?.darkThemeLogoUrl)?true:false;
          this.imgpreview = (this.viewData && this.viewData?.data && this.viewData?.data?.lightThemeLogoUrl)?true:false;
          this.convertToBinary(this.viewData?.data?.accessControl);
          this.originalAccessCantrol = this.viewData?.data?.accessControl;
          this.updateForm();
        } else {
          this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"));
        }
      });
    // this.viewData = {
    //   "statusCode": 200,
    //   "message": null,
    //   "data": {
    //     "level3Id": "847f0504-df41-4a16-ae18-125ec5559493",
    //     "name": "JOshsoftware",
    //     "email": "josh@software.com",
    //     "status": "ACTIVE",
    //     "shortName": "josh",
    //     "lightThemeLogoUrl": null,
    //     "darkThemeLogoUrl": null,
    //     "companyUnits": [
    //       {
    //         "companyUnitId": "9a138690-a245-4d2a-b4d8-408301d86046",
    //         "level3Address": {
    //           "addressId": "1b25a5b1-4b12-4ce3-8118-d8da8d50cc38",
    //           "building": "1396be44-3665-4f23-a781-d97681b79276",
    //           "name": "'A' wing ",
    //           "floorNo": "1",
    //           "officeNo": "11",
    //           "contactIsd": "91",
    //           "contactMobile": "7744950952",
    //           "contactEmail": null
    //         },
    //         "admins": [
    //           {
    //             "employeeId": "50858467-5a52-4c4b-95c8-0bbeb9278667",
    //             "firstName": "Snehal",
    //             "lastName": "11",
    //             "isd": "91",
    //             "mobileNo": "7744950951",
    //             "email": null
    //           }
    //         ]
    //       },
    //       {
    //         "companyUnitId": "2e3dcd16-70a5-4116-a9ec-b2f3ba92cfa8",
    //         "level3Address": {
    //           "addressId": "3096e910-8be3-4f4c-93f7-08711af369d1",
    //           "building": "1833f740-b34b-47cb-8ca0-d0abbfc77f5b",
    //           "name": "ABC",
    //           "floorNo": "5",
    //           "officeNo": "4",
    //           "contactIsd": null,
    //           "contactMobile": "9934324533",
    //           "contactEmail": null
    //         },
    //         "admins": []
    //       }
    //     ]
    //   },
    //   "errors": null
    // }
  }

  onSubmit() {
    this.isEdit = false;
    this.getCompanyData();
  }

  checkNumber(event) {
    this.formCompanyEdit.get("contactmobile").setValue(null);
    let countryData = this.commonService.getCountryData(event.dialCode);
    this.maxLength = countryData
      ? countryData.maxMobileLength.toString()
      : "15";
  }

  onCancel() {
    this.selectedAccessCantrol = [];
    this.convertToBinary(this.originalAccessCantrol);
    this.isEdit = false;
  }

  resetForm() {

  }

  addMoreOffice() {

  }

  updateForm() {
    this.selectedCountry = (this.commonService.getComplexContact()) ? this.commonService.getComplexContact() :  CountryISO.UnitedStates;
    let unitArr = [];
    if (this.viewData.data && this.viewData.data.companyUnits) {
      this.selectedCountriesFoUnit = [];
      this.viewData.data.companyUnits.forEach(unit => {
        this.selectedCountriesFoUnit.push(unit.level3Address.contactIsd? getCountryCode(unit.level3Address.contactIsd):
        (this.commonService.getComplexContact())? this.commonService.getComplexContact(): CountryISO.UnitedStates);
        unitArr.push(
          this.formBuilder.group({
            companyUnitId: [unit.companyUnitId],
            level3Address: this.formBuilder.group({
              addressId: [unit.level3Address.addressId],
              building: [unit.level3Address.building, [Validators.required]],
              name: [unit.level3Address.name, [Validators.required, Validators.maxLength(50)]],
              floorNo: [unit.level3Address.floorNo, [Validators.required, Validators.maxLength(20)]],
              officeNo: [unit.level3Address.officeNo, [Validators.required, Validators.maxLength(20)]],
              contactIsd: [unit.level3Address.contactIsd], 
              contactMobile: [unit.level3Address.contactMobile],
              contactEmail: [unit.level3Address.contactEmail],
            }),
          })
        )
      })
    }
    this.formCompanyEdit = this.formBuilder.group({
      level3Id: [this.viewData.data.level3Id],
      name: [this.viewData.data.name, [Validators.required, Validators.maxLength(100)]],
      shortName: [this.viewData.data.shortName, [Validators.required, Validators.maxLength(20)]],
      email: [this.viewData.data.email, [Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{1,}$/), Validators.maxLength(150)]],
      status: [this.viewData.data.status],
      lightThemeLogoUrl: [null],
      darkThemeLogoUrl: [null],
      level3CompanyUnits: this.formBuilder.array(unitArr),
      accessControl:[0,[]]
    });
    this.initAdmin();
  }

  //adding list of admin for update company
  initAdmin() {
    this.viewData.data.companyUnits.forEach(unit => {
      let key = unit.companyUnitId;
      this.adminsList.set(key, unit.admins)
    });
  }

  removeFromAdminList(employeeId, unitId) {
    let age = this.adminsList.get(unitId);
    if (age.length > 1) {
      age.forEach(element => {
        if (element["employeeId"] == employeeId) {
          let reqObj = {
            "employeeId": element["employeeId"],
            "companyUnitId": unitId
          }
          this.commonTabService.changeAdminRole(reqObj).pipe(first())
            .subscribe(resp => {
              if (resp.statusCode === 200 && resp.errors === null) {
                age = age.splice(age.indexOf(element), 1);
                this.toastr.success(resp.message,this.translate.instant("pop_up_messages.success"));
              }
            }, error => {
              this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
            });
        }
      });
    } else {
      this.toastr.warning(this.translate.instant("pop_up_messages.cant_remove_single_admin"), this.translate.instant("pop_up_messages.warning"));
    }
  }

  updateCompany() {
    if(this.selectedAccessCantrol.length>0){
      this.formCompanyEdit.get('accessControl').setValue(this.accessCantrolNumber);    
    }
    else{
      this.formCompanyEdit.get('accessControl').setValue(0);
    }
    if (this.formCompanyEdit.invalid) {
      // this.toastrService.warning('There are errors in the formCompanyEdit', 'Could Not Save');
      Object.keys(this.formCompanyEdit.controls).forEach(field => {
        this.formCompanyEdit.controls[field].markAsDirty();
        this.formCompanyEdit.controls[field].markAsTouched();
      });
    } else {
      this.formCompanyEdit?.value.level3CompanyUnits?.forEach(element => {
        let phoneNumber = element.level3Address.contactMobile; 
        element.level3Address.contactMobile = (phoneNumber) ? 
        removeSpecialCharAndSpaces(phoneNumber["number"].toString()) : null;
        element.level3Address.contactIsd = (phoneNumber) ? phoneNumber.dialCode.slice(1) : null;

      });

      let updateObj = this.formCompanyEdit.value;
      updateObj['lightThemeLogoUrl']  = this.lightLogoImageUrl;
      updateObj['darkThemeLogoUrl']  = this.darkLogoImageUrl;
      this.commonTabService.updateCompany(updateObj).pipe(first())
        .subscribe(resp => {
          if (resp.statusCode === 200 && resp.errors === null) {
            this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            this.isEdit = false;
            this.getCompanyData();
          }
        },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
          }
        }
        );
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.validationMessages[control]) {
      Object.keys(this.validationMessages[control]).forEach(validator => {
        if ((this.formCompanyEdit.get(control)?.touched || this.formCompanyEdit.get(control)?.dirty) && this.formCompanyEdit.get(control)?.errors) {
          if (this.formCompanyEdit.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  removeOffice(index) {
    // this.items = this.formCompanyEdit.get('level3CompanyUnits') as FormArray;
    // this.items.removeAt(index)
  }

  isEditClick() {
    this.isEdit = true;
    this.updateForm();
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.imgpreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  handleReaderForDarkImg(e) {
    this.base64textStringForDarkImg.push('data:image/png;base64,' + btoa(e.target.result));
    this.darkLogoPreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  onFileChangeForDarkLogo(event) {
    const file = event.target.files[0];
    let level3Id = (this.viewData?.data?.level3Id)?this.viewData.data.level3Id:new Date().getTime();
    let mainfilePath = "level1/" + this.loginUser?.level1DisplayId +"/";
    if(this.loginUser['role']['shortName'] === LevelAdmins.Level3Admin){
      mainfilePath = mainfilePath+"level3/"+level3Id+"/logo"
    }
  this.uploadService.fileUpload(file,mainfilePath+file.name)
  .promise().then(resp=>{
    this.darkLogoImageUrl = resp.Location;
    this.handleIamge(this.darkLogoImageUrl,'darklogo');
    // this.darkLogoUrl =  this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
    this.darkLogoPreview = true;
    })
  }


  onFileChange(event) {
    const file = event.target.files[0];
    let level3Id = (this.viewData?.data?.level3Id)?this.viewData.data.level3Id:new Date().getTime();
    let mainfilePath = "level1/" + this.loginUser?.level1DisplayId +"/";
    if(this.loginUser['role']['shortName'] === LevelAdmins.Level3Admin){
      mainfilePath = mainfilePath+"level3/"+level3Id+"/logo"
    }
    this.uploadService.fileUpload(file,mainfilePath+file.name)
    .promise().then(resp=>{
      this.lightLogoImageUrl = resp.Location;
      this.handleIamge(this.lightLogoImageUrl,'lightlogo');
      // this.LightLogoUrl =  this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
      this.imgpreview = true;
  })
  }

  getEmployeeById(displayId) {
    // this.employeeData = {
    //   company: null,
    //   department: "IT ",
    //   displayId: "0aed2eb0-bebe-4c4b-97e2-01776a2d3470",
    //   email: "anand.chavan@joshsoftware.com",
    //   isd: "91",
    //   mobile: "9689091503",
    //   name: "Anand Chavan",
    //   role: "Level1Admin",
    //   status: "ACTIVE",
    // }
    this.commonTabService.getEmployeeById(displayId).pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.employeeData = {
            company: null,
            department: "IT ",
            displayId: "0aed2eb0-bebe-4c4b-97e2-01776a2d3470",
            email: "anand.chavan@joshsoftware.com",
            isd: "91",
            mobile: "9689091503",
            name: "Anand Chavan",
            role: "Level1Admin",
            status: "ACTIVE",
          }
        } else {
          this.toastr.error( this.translate.instant("pop_up_messages.something_went_wrong"),  this.translate.instant("pop_up_messages.error"));
        }

      });
    this.openDialog()

  }

  openDialog() {
    let applyClass = 'complex-employees-dialog';
    const dialogRef = this.dialog.open(ShowDetailsComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.employeeData, "formType": "employee", "mode": "show" },
      panelClass: ['animate__animated', applyClass, 'animate__slideInRight']
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogClose.emit(result);
    });
  }

  formatCellNumber(cellNumber:any){
    return formatPhoneNumber(cellNumber);
  }


  getAccessCantrol(event:MatCheckboxChange,data:any,index:number){
    if(event.checked){
      this.selectedAccessCantrol.push(parseInt(data.value));
      this.setAccessCantrolNumber(parseInt(data.value));
    }
    else{
      var index = this.selectedAccessCantrol.indexOf(parseInt(data.value));
      this.accessCantrolNumber = this.accessCantrolNumber-(2**this.selectedAccessCantrol[index])
      this.selectedAccessCantrol.splice(index, 1);
    }
  }

  convertToInt(value){
    return parseInt(value)
  }

  convertToBinary(x) {
    this.accessCantrolNumber = 0
    if(x){
      let bin = 0;
      let rem, i = 1, step = 1;
      let iter = 0
      while (x != 0) {
          rem = x % 2;
          if(rem == 1){
            this.selectedAccessCantrol.push(iter);
            this.setAccessCantrolNumber(iter);
          }
          iter++;
          let num = x / 2;
          x = this.convertToInt(num);
          bin = bin + rem * i;
          i = i * 10;
      }
    }
    else{
      this.selectedAccessCantrol = []
    }
  }

  setAccessCantrolNumber(value){
    this.accessCantrolNumber = this.accessCantrolNumber + 2**parseInt(value);
  }

  // handleImage(error){
  //   this.LightLogoUrl = environment.DefaultLightTheamLogoUrl;
  //   this.darkLogoUrl = environment.DefaultDarkTheamLogoUrl;
  // }

  async handleIamge(url,type){
    // console.log(url,type);
    let newUrl;
    try{
      let parserContent = s3ParseUrl(url);
      let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch(e){
      console.log(e);
      let parserContent = s3ParseUrl(type == 'darklogo'?environment.DefaultDarkTheamLogoUrl:environment.DefaultLightTheamLogoUrl);
      let  resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    if(type == 'darklogo')
      this.darkLogoUrl =  newUrl;
    else
      this.LightLogoUrl = newUrl;
  }

  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  getComplexDetails(){
    this.commonTabService.getComplexDetails().subscribe(res=> {
      this.LightLogoUrl = res.data.lightThemeLogoUrl,
      this.darkLogoUrl = res.data.darkThemeLogoUrl
      this.handleIamge(this.darkLogoUrl,'darklogo');
      this.handleIamge(this.LightLogoUrl,'lightLogo');
    })
  }

}