import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { AddRestrictVisitor } from '../models/restrict-visitor';
import { capitalizeFirstLetter, getCountryCode, noWhitespaceValidator, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { UserService } from 'src/app/core/services/user.service';
import { VisitorsService } from '../services/visitors.service';
import { first } from 'rxjs/operators';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
@Component({
  selector: 'app-restrict-visitor',
  templateUrl: './restrict-visitor.component.html',
  styleUrls: ['./restrict-visitor.component.scss']
})
export class RestrictVisitorComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formRestrictVisitor: FormGroup;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India, CountryISO.UnitedArabEmirates];
  public selectedCountry: CountryISO = CountryISO.India;
  public phoneValidation: boolean = true;
  public addRestrictVisitor: AddRestrictVisitor = new AddRestrictVisitor();
  cellFormat: any;
  base64textString: any[];
  imgpreview: boolean;
  imageURL: string;
  imageNameUrl: any;
  file: any;
  userDetails: any;
  @ViewChild('fileInput') myInputVariable: ElementRef;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RestrictVisitorComponent>,
    private toastr: ToastrService,
    private userService: UserService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private visitorsService: VisitorsService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.userDetails = this.userService.getUserData();
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());

    this.validationMessages = {
      firstName: {
        whitespace: translate.instant('Schedule.FirstNameRequireError'),
        maxlength: translate.instant('Schedule.FirstNameMaxLengthError'),
      },
      lastName: {
        whitespace: translate.instant('Schedule.LastNamePlaceholder'),
        maxlength: translate.instant('Schedule.LastNameMaxlength'),
      },
      company: {
        required: translate.instant('Schedule.CompanyPlaceholder'),
        maxlength: translate.instant('Schedule.CompanyMaxLength'),
      },
      emailId: {
        pattern: translate.instant('Schedule.EmailValid'),
        required: translate.instant('Schedule.EmailIdPlaceholder'),
        maxlength: translate.instant('Schedule.EmailMaxLengthError'),
      },
      visitorMobileNumber: {
        required: this.translate.instant("pop_up_messages.enter_mobile")
      },
      remark: {
        whitespace: translate.instant('Schedule.remark_Placeholder'),
        maxlength: translate.instant('Schedule.remark_Maxlength_Message'),
      }
    };

  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit() {
    this.formRestrictVisitor = this.formBuilder.group({
      firstName: [null, [Validators.maxLength(50), noWhitespaceValidator]],
      lastName: [null, [Validators.maxLength(50), noWhitespaceValidator]],
      company: [null, [Validators.maxLength(100)]],
      visitorMobileNumber: [null],
      remark: [null, [noWhitespaceValidator, Validators.maxLength(250)]],
      emailId: [null, [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)],]
    });
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if (this.formRestrictVisitor && this.formRestrictVisitor.get(control)) {
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if ((this.formRestrictVisitor.get(control).touched || this.formRestrictVisitor.get(control).dirty) && this.formRestrictVisitor.get(control).errors) {
          if (this.formRestrictVisitor.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
  }

  onSubmit() {
    if (this.formRestrictVisitor.invalid) {
      this.toastr.warning(this.translate.instant("pop_up_messages.visitor_setting_update"), this.translate.instant("pop_up_messages.could_not_save"));
      Object.keys(this.formRestrictVisitor.controls).forEach((field) => {
        this.formRestrictVisitor.controls[field].markAsDirty();
        this.formRestrictVisitor.controls[field].markAsTouched();
      });
    } else {
      this.confrimationDailog(this.formRestrictVisitor.value.firstName + " " + this.formRestrictVisitor.value.lastName);
    }
  }

  restrictVisitor() {
    this.uploadImage();
   
  }

  requestDataObject(): AddRestrictVisitor {
    const formData = this.formRestrictVisitor.value;

    this.addRestrictVisitor.firstName = capitalizeFirstLetter(formData.firstName);
    this.addRestrictVisitor.lastName = capitalizeFirstLetter(formData.lastName);
    this.addRestrictVisitor.email = formData.emailId;
    this.addRestrictVisitor.company = capitalizeFirstLetter(formData.company);
    this.addRestrictVisitor.remark = formData.remark;
    this.addRestrictVisitor.level2Id = this.userService.getLevel2Id();
    this.addRestrictVisitor.level3Id = this.userService.getLevel3Id();
    this.addRestrictVisitor.isdCode = formData.visitorMobileNumber?.dialCode != null ? formData.visitorMobileNumber?.dialCode.substring(1) : null;
    this.addRestrictVisitor.phone = formData.visitorMobileNumber?.number != null ? removeSpecialCharAndSpaces(formData.visitorMobileNumber?.number.toString()) : null;
    this.addRestrictVisitor.imageURLLink = this.imageNameUrl;
    return this.addRestrictVisitor;
  }

  confrimationDailog(name) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        pop_up_type: "restrictVisitorConfirm",
        icon: "assets/images/alert.png",
      },
      panelClass: ["vams-dialog-confirm"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.restrictVisitor();
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  checkNumber(event) {
    this.selectedCountry = event.iso2;
  }

  resetForm() {
    this.myInputVariable.nativeElement.value = null;
    this.imgpreview =false;
    this.formRestrictVisitor.reset();
  }

  onKeyUpEvent(event: any, backspace?) {
    // this.cellFormat = event.target.value.replace(/^(\d{3})(\d{3})(\d+)$/, "($1) $2-$3")
    // this.formRestrictVisitor.controls.visitorMobileNumber.patchValue(this.cellFormat)

    let cellFormat = event.target.value.replace(/\D/g, '');
    if (backspace && cellFormat.length <= 6) {
      cellFormat = cellFormat.substring(0, cellFormat.length - 1);
    }
    if (cellFormat.length === 0) {
      cellFormat = '';
    } else if (cellFormat.length <= 3) {
      cellFormat = cellFormat.replace(/^(\d{0,3})/, '($1)');
    } else if (cellFormat.length <= 6) {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
    } else if (cellFormat.length <= 10) {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      cellFormat = cellFormat.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    }
    this.formRestrictVisitor.controls.visitorMobileNumber.patchValue(cellFormat)
  }



  /*  image Upload */
  onFileChange(event) {
    this.file = event.target.files[0];
   this.base64textString = [];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(this.file);
    } 
  }
  handleReaderLoaded(e) {
    this.base64textString.push(
      "data:image/png;base64," + btoa(e.target.result)
    );
    this.imgpreview = true;
    this.imageURL = btoa(e.target.result).toString();
  }

  uploadImage() {
    if(this.file){
    const buketPath = "level1/" + this.userDetails?.level1DisplayId + "/restricted-visitor/" + new Date().getTime() + "/"
    this.fileUploadService.imageUplod(this.file, buketPath).promise().then(data=>{
      this.imageNameUrl=data.Location
      this.callRestrictedVistor()
    })}
    else{
      this.callRestrictedVistor()
    }
  }

  callRestrictedVistor(){
    this.visitorsService.addRestrictedVisitor(this.requestDataObject())
    .pipe(first()).subscribe((response) => {
      if (response.statusCode === 200 && response.errors == null) {
        this.formRestrictVisitor.reset();
        this.toastr.success(response.message);
        this.cancel();
        this.dialogRef.close(response);
      } else {
        this.toastr.error(response.message);
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      })
  }
}
