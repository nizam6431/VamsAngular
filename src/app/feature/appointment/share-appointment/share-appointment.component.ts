
import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { formatPhoneNumber, getCountryCode } from 'src/app/core/functions/functions';
import { UserService } from 'src/app/core/services/user.service';
import { AppointmentService } from '../services/appointment.service';
import { first } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { functions } from 'lodash';
import { FormatCellPipe } from '../../../core/pipes/format-cell.pipe';
import { TranslateService } from '@ngx-translate/core';
import { removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
@Component({
  selector: 'app-share-appointment',
  templateUrl: './share-appointment.component.html',
  styleUrls: ['./share-appointment.component.scss'],
})
export class ShareAppointmentComponent implements OnInit {
  postContactDetails: any[] = [];
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.India, CountryISO.UnitedArabEmirates];
  currentSlide: number = 1;
  private validationMessages: { [key: string]: { [key: string]: string } };
  public shareAppointmentForm: FormGroup;
  maxLength: string = "15";
  isL1Roles:boolean= false;
  showStatus: string = null;

  public selectedCountry: CountryISO = CountryISO.India;
  countryData: any;
  contactDetails= [];
  cellFormat: any;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ShareAppointmentComponent>,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    public userService: UserService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedCountry = getCountryCode(this.userService.getUserCountryCode());   

    if (this.userService.isLevel1Host()|| this.userService.isLevel1Admin()|| this.userService.isLevel1Reception() || this.userService.isLevel1Security() || this.userService.isLevel1SecurityHead()) {
      this.isL1Roles = true;
    }

    this.validationMessages = {
      cell: {
        required: translate.instant('ShareAppointmentForm.PleaseEnterCellNumber'),
      },
      email: {
        required: translate.instant('ShareAppointmentForm.PleaseEnterEmail'),
        pattern: translate.instant('ShareAppointmentForm.EnterEmailId'),
        maxlength: translate.instant('ShareAppointmentForm.EmailMaxLength'),
      },
    };
    // cell: string;
  }

  ngOnInit() {
    this.createForm();
  }

  onSelectEvent(){
    if (this.shareAppointmentForm.value.level2Id == this.showStatus) {
      this.showStatus = null;
      this.shareAppointmentForm.controls['level2Id'].setValue(null);
    } else {
      this.showStatus = this.shareAppointmentForm.value.level2Id;
    }
  }

  createForm() {
    this.shareAppointmentForm = this.formBuilder.group({
      email: [null, [Validators.required,Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(150)]],  
      cell: [null, [Validators.required]],
      level2Id:[null]
    });
  }

  onSubmit() {
    let sendContactDetails;
    if (this.postContactDetails) {
      sendContactDetails = {
          "shareAppointmentDetails": this.postContactDetails,
          "level1Id": this.userService.getUserData().level1Id,
          "level2Id": this.shareAppointmentForm.value.level2Id?this.shareAppointmentForm.value.level2Id:null,
          "level3Id": null
      }
    }

    this.appointmentService
    .shareAppointmentInvitation(sendContactDetails)
    .pipe(first())
    .subscribe(
      (response) => {
        if (response.statusCode === 200 && response.errors == null) {
          this.shareAppointmentForm.reset();
          this.toastr.success(response.message, this.translate.instant('pop_up_messages.success'));
          this.cancel();
          this.dialogRef.close(response);
        } else {
          this.toastr.error(response.message, this.translate.instant('pop_up_messages.error'));
        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0],this.translate.instant('pop_up_messages.error'));
          });
        } else {
          this.toastr.error(error.error.Message,  this.translate.instant('pop_up_messages.error'));
        }
      }
    );

    // setTimeout(() => {
    //   this.dialogRef.close();
    // }, 2000);
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.shareAppointmentForm.get(control).touched || this.shareAppointmentForm.get(control).dirty) && this.shareAppointmentForm.get(control).errors) {
        if (this.shareAppointmentForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  cancel() {
    this.dialogRef.close();
  }

  add(type) {
    if (this.postContactDetails.length < 10) {
      if (type == 'email' && this.shareAppointmentForm.value.email !== null) {
        this.postContactDetails.push(this.shareAppointmentForm.value.email);
      }

      if (type == "cell" && this.shareAppointmentForm.value.cell !== null) {
        let cellnumber = this.shareAppointmentForm.value.cell.dialCode +" "+ String(removeSpecialCharAndSpaces(this.shareAppointmentForm.value.cell.number))
        .replace(/-|\s/g,"");
        this.postContactDetails.push(cellnumber);
      }
      this.shareAppointmentForm.get(type).reset();
    }
  }

  deleteContent(value: any) {
    var index = this.postContactDetails.indexOf(value);
    
    if (index !== -1) {
      this.postContactDetails.splice(index, 1);
    }
  }

  checkNumber(event) {
    this.shareAppointmentForm.get("cell").setValue(null);
    // let countryData = this.commonService.getCountryData(event.dialCode);
    // this.maxLength = countryData
    //   ? countryData.maxMobileLength.toString()
    //   : "15";
  }  

}
