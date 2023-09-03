import { Component, OnInit, SimpleChanges,Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { SettingServices } from '../../services/setting.service';

@Component({
  selector: 'app-employee-setting',
  templateUrl: './employee-setting.component.html',
  styleUrls: ['./employee-setting.component.scss']
})
export class EmployeeSettingComponent implements OnInit, OnChanges{
  EmployeeSettingForm:FormGroup
  @Input() employeeData;
  @Input() action;
  userDetails: any;
  addEmployeeData: boolean;
  constructor(
    private formBuilder:FormBuilder,
    private settingService:SettingServices,
    private toastr:ToastrService,
    private userService:UserService,
    private translate:TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void { 
    // console.log(this.employeeData)
    // console.log(changes)
    if (this.action && this.action == 'update') {
      this.updateEmployeeDetail();
    }
    if (this.action && this.action == 'reset') {
      this.getEmployeeDetail();
    }
    this.employeeData = null;
   
  }
  ngOnInit(): void {
    this.createForm();
    this.getEmployeeDetail();
  }
 
  createForm(){
    this.EmployeeSettingForm = this.formBuilder.group({
      "employeeCreationAlert": ['', Validators.required],
    })
  }

  getEmployeeDetail() {
    this.settingService.getEmployeeData().subscribe((data :any) =>{
      if (data.statusCode === 200 && data.errors === null) {
      this.EmployeeSettingForm.controls.employeeCreationAlert.setValue(data?.data.isInvitationMail)
      }
    },error => {
      if ( error && error.error && 'errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    })
  }

  updateEmployeeDetail(){
    let updateObj ={
      "isInvitationMail":this.EmployeeSettingForm.value.employeeCreationAlert,
      "level2Id": null,
      "productType": this.userService.getProductType()
    }
    console.log(updateObj,'update obj')
    this.settingService.updateEmployeeDetail(updateObj).subscribe(resp => {
      console.log(resp,'res employee update')
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
      }
    },error => {
      if ( error && error.error && 'errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        })
      }
      else {
        this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
      }
    })
    }
  
}
