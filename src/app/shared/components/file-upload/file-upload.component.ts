import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';
import { MasterService } from 'src/app/feature/master/services/master.service';
import { ConfigService } from '../../../core/auth/services/config.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  toFile: any;
  public uploadFileForm: FormGroup;
  // dateFormat: any = ""; //JSON.parse(localStorage.getItem("defaultValuesForLocation")!).DateFormat;
  timeFormat: any;
  currentDate: any;
  currentTime: any;
  dateFormatTranslate1: { dateFormat: string, currentDate: string };
  dateFormatTranslate2: { timeFormat: string, currentTime: string };
  currentDateTranslate: { currentDate: string; };
  timeFormatTranslate: { timeFormat: string; };
  userData: any;
  isUploadEmployee: boolean;
  isL3level: any;
  level2Id: any;
  level3Id: any;
  roleData: any;
  productType:string;
  ProductTypeEnum = ProductTypes;

  constructor(
    private toastr: ToastrService,
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private uploadService: FileUploadService,
    private masterService: MasterService,
    public dialogRef: MatDialogRef<FileUploadComponent>,
    public appointmentService: AppointmentService,
    private translate: TranslateService,
    private UserServices: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.configService.setS3Configuration()
    this.validationMessages = {
      bulkDataFile: {
        required: this.translate.instant("pop_up_messages.select_file"),
      },
      qrCode: {
        required: this.translate.instant("pop_up_messages.qr_code"),
      }
    };
    this.isL3level = this.UserServices?.getLevel3DidForLevel3Admin();
    this.productType = this.UserServices.getProductType();
  }

  ngOnInit() {
    this.userData = this.UserServices.getUserData()
    this.level2Id = this.UserServices.getLevel2Id()
     this.level3Id =this.UserServices.isLevel3Admin()
    this.createForm();
    if (this.data?.screen == "appointment") {
      this.getVisitorSettings();
    }else if(this.data?.screen == "Employee"){
      this.getRole();
    }
   
  }

  getRole() {
    if (this.data?.companyData) {
      this.level3Id = this.data?.companyData?.rowData?.level3Id;
    }
    if (
      this.userData &&
      this.userData["role"].shortName === LevelAdmins.Level3Admin
    ) {
      this.level2Id = this.userData["employeeOfDisplayId"]
        ? this.userData["employeeOfDisplayId"]
        : null;
    }
    if (
      this.userData &&
      this.userData["role"].shortName === LevelAdmins.Level2Admin
    ) {
      this.level2Id = this.userData["employeeOfDisplayId"]
        ? this.userData["employeeOfDisplayId"]
        : null;
    }
    this.masterService.getRole(this.level3Id).pipe(first()).subscribe(resp=>{
      if (resp.statusCode === 200 && resp.errors === null) {
        this.roleData = resp.data;
        }
    })
  }


  createForm() {
    this.uploadFileForm = this.formBuilder.group({
      bulkDataFile: [null, [Validators.required]]
    });
  }


  submit() {
    const file = this.toFile.item(0);
    // Main file path must be end with / eg. level1/dwwdwd/
    // let mainfilePath = (this.data?.filepath);
    // this.uploadService.fileUpload(file,mainfilePath+file.name).promise().then(resp=>{
    // })
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (this.data?.screen == "comapny") {
      this.uploadService.uploadCompanyFile(formData).subscribe((resp) => {
        try {
          const errorJson = JSON.parse(this.blobToString(resp));
          if (errorJson.data && errorJson.data.IsEmptyFile) {
            this.toastr.error(errorJson.data.Message ? errorJson.data.Message : this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
            this.uploadFileForm.reset();
          } else {
            this.toastr.success(this.translate.instant("toster_message.apnt_upload_success"), this.translate.instant("toster_message.success"));
            this.dialogRef.close(errorJson);
          }
        }
        catch (e) {
          this.toastr.error(this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
          this.uploadFileForm.reset();
          this.downloadFile(resp, 'cmp');
        }
      },
        (error) => {
          this.toastr.error(this.translate.instant("toster_message.invalid_file"), this.translate.instant("toster_message.error"));
        })
    }
    else if (this.data?.screen == 'appointment') {
      this.uploadService.uploadByFile(formData).subscribe((resp) => {
        try {
          const errorJson = JSON.parse(this.blobToString(resp));
          if (errorJson.data && errorJson.data.IsEmptyFile) {
            this.toastr.error(errorJson.data.Message ? errorJson.data.Message : this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
            this.uploadFileForm.reset();
          } else {
            this.toastr.success(this.translate.instant("toster_message.apnt_upload_success"), this.translate.instant("toster_message.success"));
            this.dialogRef.close(errorJson);
          }
        }
        catch (e) {
          this.toastr.error(this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
          this.uploadFileForm.reset();
          this.downloadFile(resp, 'appt');
        }
      },
        (error) => {
          this.toastr.error(this.translate.instant("toster_message.invalid_file"), this.translate.instant("toster_message.error"));
        })
    }
  }

  downloadFile(resp, type) {
    let fileName = "sample.xlsx";
    if (type == "templateCmp") {
      fileName = "SampleCompanyFile-" + new Date().getTime() + ".xlsx";
    }
    if (type == "templateEmp") {
      fileName = "SampleEmployeeFile-" + new Date().getTime() + ".xlsx";
    }
    if (type == 'template') {
      fileName = "SampleAppointmentFile-" + new Date().getTime() + ".xlsx";
    }
    if (type == 'appt') {
      fileName = "AppointmentFileWithError-" + new Date().getTime() + ".xlsx";
    }
    if (type == 'emp') {
      fileName = "EmployeeFileWithError-" + new Date().getTime() + ".xlsx";
    }
    if (type == 'cmp') {
      fileName = "CompanyFileWithError-" + new Date().getTime() + ".xlsx";
    }
    var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    var blob = new Blob([resp], { type: contentType });
    var downloadUrl = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = downloadUrl
    anchor.click();
  }

  private blobToString(blob): string {
    const url = URL.createObjectURL(blob);
    const xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', url, false);
    xmlRequest.send();
    URL.revokeObjectURL(url);
    return xmlRequest.responseText;
  }

  onFileChange(event) {
    this.toFile = event.target.files;
    if (this.data.screen == "Employee") {
      this.validateEmployyeFile()
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.uploadFileForm.get(control).touched || this.uploadFileForm.get(control).dirty) && this.uploadFileForm.get(control).errors) {
        if (this.uploadFileForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  downloadTemplate() {
    if (this.data?.screen == "comapny") {
      this.uploadService.downloadCompanyTemplate().pipe(first())
        .subscribe(resp => {
          this.downloadFile(resp, 'templateCmp')
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        });

    }
    else if (this.data?.screen == "Employee") {
      this.uploadService.downloadEmployeeTemplate({
        "isLevel3": this.data.isLevel
      }).pipe(first())
        .subscribe(resp => {
          this.downloadFile(resp, 'templateEmp')
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        });

    }
    else {
      this.uploadService.downloadTemplate().pipe(first())
        .subscribe(resp => {
          this.downloadFile(resp, 'template')
        }, (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
            });
          } else {
            this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
          }
        });

    }

  }



  validateEmployyeFile() {
    this.isUploadEmployee = false;
    const file = this.toFile.item(0);
    const formData = new FormData();
    formData.append("isLevel3", this.data.isLevel)
    formData.append('file', file, file.name);
    if (this.data?.level3Id) {
      formData.append('level3Id', this.data?.level3Id);
    }
    this.uploadService.uploadEmployeeFile(formData).subscribe(resp => {
      try {
        const errorJson = JSON.parse(this.blobToString(resp));
        console.log(errorJson)
        if (errorJson.data && errorJson.data.IsEmptyFile && !errorJson.data?.IsValidFile) {
          this.toastr.error(errorJson.data.Message ? errorJson.data.Message : this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
          this.uploadFileForm.reset();
        } else {
          this.isUploadEmployee = true
          this.toastr.success(errorJson.data.Message, this.translate.instant("toster_message.success"));
          // this.dialogRef.close(errorJson);
        }
      }
      catch (e) {
        this.toastr.error(this.translate.instant("toster_message.upload_file_error"), this.translate.instant("toster_message.error"));
        this.uploadFileForm.reset();
        this.downloadFile(resp, 'emp');
      }

    },
      (error) => {
        this.toastr.error(this.translate.instant("toster_message.invalid_file"), this.translate.instant("toster_message.error"));
      })
  }

  getVisitorSettings() {
    this.appointmentService.getVisitorSettings(null).subscribe(response => {
      let dateFormat;
      let timeFormat;
      let currentDate;
      let currentTime;
      if (response.statusCode === 200 && response.errors == null) {
        dateFormat = response.data.dateFormat || "dd-MM-yyyy",
          timeFormat = response.data.timeformat
        currentDate = moment().format(dateFormat.toUpperCase())
        currentTime = timeFormat == "12" ? moment().format('hh:mm A') : moment().format("HH:mm")
      } else {
        dateFormat = "dd-MM-yyyy",
          timeFormat = "24"
        currentDate = moment().format(dateFormat.toUpperCase())
        currentTime = timeFormat == "12" ? moment().format('hh:mm A') : moment().format("HH:mm")
      }
      this.dateFormatTranslate1 = { dateFormat: dateFormat, currentDate: currentDate }
      this.dateFormatTranslate1.dateFormat = JSON.stringify(this.dateFormatTranslate1.dateFormat).toUpperCase()
      this.dateFormatTranslate2 = { currentTime: currentTime, timeFormat: timeFormat }


    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      } else {
        this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    })
  }

  submitEmployee() {
    this.uploadService.submitEmployeeEmail().subscribe(data => {
      if (data.data?.IsValidFile && data?.statusCode == 200) {
        this.toastr.success(data.data.Message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(data)
      } else {
        this.toastr.error(data.Message, this.translate.instant("toster_message.error"));
      }
    },
      (error) => {
        this.toastr.error(this.translate.instant("toster_message.invalid_file"), this.translate.instant("toster_message.error"));
      })
  }
}
