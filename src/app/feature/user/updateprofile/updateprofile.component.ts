import { NgModule, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
// import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { Select2OptionData } from 'ng-select2';
import { Title } from '@angular/platform-browser';
import { matcherResult, templateResult, templateSelection } from 'src/app/core/functions/functions';

@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})


export class UpdateprofileComponent implements OnInit {

  options: any;
  UserData: any;
  ServerMessage: any;
  allIsdCodes: any[] = [];
  UpdateProfileForm: FormGroup;
  public isdCodes: Array<Select2OptionData> = [];
  @ViewChild('profileSuccess') profileSuccess: TemplateRef<any>;

  constructor(private userService: UserService, private _fb: FormBuilder, private dashboardService: DashboardService, private dialogService: NgbModal, private titleService: Title, private errorService: ErrorsService) {
    this.options = {
      templateResult: templateResult,
      templateSelection: templateSelection,
      width: '100%',
      matcher: matcherResult
    };
    this.UpdateProfileForm = this._fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', []],
      email: ['', [Validators.required]],
      isdCode: ['', [Validators.required]],
      cellNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/gm)]],
      userPin: ['', [Validators.required, Validators.pattern(/^\d{6}$/gm)]],
      location: ['', []],
      groupName: ['', []],
      notificationType: ['', []]
    });

    this.titleService.setTitle("User Profile");

  }

  notificationTypes: any[] = [
    { id: 1, name: 'Email' },
    { id: 2, name: 'SMS' },
    { id: 3, name: 'Both' },
    { id: 4, name: 'None' }
  ];

  getIsdCodes() {
    this.dashboardService.getISDCodes()
      .pipe(first())
      .subscribe(
        (data: any) => {
          data.Data.forEach((element: any) => {
            this.isdCodes.push({
              id: element.IsdCode,
              text: "+" + element.IsdCode,
              additional: element.ISOCode
            });
          });
          this.allIsdCodes = data.Data;
        }, (error: any) => {

        });
  }

  updateProfile() {
    if (this.UpdateProfileForm.invalid) {
      return;
    }

    // this.userService.updateUserProfile(this.firstName?.value, this.lastName?.value, this.isdCode?.value, this.cellNumber?.value, this.notificationType?.value, this.userPin?.value).subscribe(
    //   (retVal: any) => {

    //     this.ServerMessage = retVal.SuccessMessage;
    //     this.dialogService.open(this.profileSuccess,
    //       {
    //         centered: true,
    //         backdrop: 'static',
    //         keyboard: false,
    //         windowClass: 'slideInUp'
    //       });

    //     this.updateSessionDetails();
    //   }
    //   , (error: any) => {
    //     this.errorService.handleError(error);
    //   });

  }

  updateSessionDetails() {
    var userProfileDetail = JSON.parse(sessionStorage.getItem('currentUser')!);
    sessionStorage.removeItem('currentUser');
    userProfileDetail!.FirstName = this.firstName?.value;
    userProfileDetail!.LastName = this.lastName?.value;
    userProfileDetail!.IsdCode = this.isdCode?.value;
    userProfileDetail!.CellNumber = this.cellNumber?.value;
    userProfileDetail!.NotificationType = this.notificationType?.value;
    sessionStorage.setItem('currentUser', JSON.stringify(userProfileDetail));
  }

  closeModal() {

    this.dialogService.dismissAll("")
  }


  // getUserData() {

  //   this.userService.getLoginUser().subscribe((res: any) => {
  //     this.UserData = res.Data;

  //     this.firstName?.patchValue(this.UserData.FirstName);

  //     this.lastName?.patchValue(this.UserData.LastName);

  //     this.email?.patchValue(this.UserData.Email);

  //     this.isdCode?.patchValue(this.UserData.IsdCode);

  //     this.cellNumber?.patchValue(this.UserData.CellNumber);

  //     this.userPin?.patchValue(this.UserData.UserPin);

  //     this.location?.patchValue(this.UserData.Location);

  //     this.groupName?.patchValue(this.UserData.GroupName);

  //     this.notificationType?.patchValue(this.UserData.NotificationType);

  //   });
  // }

  ngOnInit(): void {
    this.getIsdCodes();
    // this.getUserData();
  };

  isdCodeChange(event: any) {
    this.isdCode?.patchValue(event);
    var selectedISDCode = this.allIsdCodes.filter(item => item.IsdCode == this.isdCode?.value);
    this.cellNumber?.reset();
    this.cellNumber?.setValidators(Validators.pattern("[0-9]{" + selectedISDCode[0].MinMobileLength + "," + selectedISDCode[0].MaxMobileLength + "}"));
    this.cellNumber?.updateValueAndValidity();
  }

  get firstName() { return this.UpdateProfileForm.get('firstName'); }
  get lastName() { return this.UpdateProfileForm.get('lastName'); }
  get email() { return this.UpdateProfileForm.get('email'); }
  get isdCode() { return this.UpdateProfileForm.get('isdCode'); }
  get cellNumber() { return this.UpdateProfileForm.get('cellNumber'); }
  get userPin() { return this.UpdateProfileForm.get('userPin'); }
  get location() { return this.UpdateProfileForm.get('location'); }
  get groupName() { return this.UpdateProfileForm.get('groupName'); }
  get notificationType() { return this.UpdateProfileForm.get('notificationType'); }

}
