import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingServices } from 'src/app/feature/setting/services/setting.service';
import { first } from 'rxjs/operators';
import { Constants } from 'src/app/feature/configure/constants/column';
import { defaultVal, LevelAdmins } from 'src/app/core/models/app-common-enum';
import { MatDialog } from '@angular/material/dialog';
import { SmsTemplateDialogComponent } from '../../../popup/sms-template-dialog/sms-template-dialog.component';
import { buildingListObjClass, smsGetAllReq, grid_resp } from '../../../constants/enum';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { ConfigureService } from '../../../services/configure.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-sms-template',
  templateUrl: './sms-template.component.html',
  styleUrls: ['./sms-template.component.scss']
})
export class SmsTemplateComponent implements OnInit {
  public smsTemplate: FormGroup;
  buildingList: any[] = [];
  columns: any[] = Constants.sms_template_demo;
  dataSource: any[] = [];
  totalCount: number = 0;
  pageSize: number = defaultVal.pageSize;
  grid_resp = new grid_resp()
  get_all_template_obj = new smsGetAllReq()
  userData: any;
  level2Id: any;
  searchKey: any;
  isSMSApproval: boolean = false;


  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private visitorSettingObj: SettingServices,
    public dialog: MatDialog,
    private configureService: ConfigureService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    // this.isSMSApproval = (this.userData && this.userData.country && this.userData.country.isSMSApproval)?this.userData.country.isSMSApproval:false;
    this.level2Id = (this.userData.level2List.length > 0) ? this.userData.level2List[0].id : null;
    this.createForm();
    this.get_all_template_obj = {
      "pageSize": defaultVal.pageSize,
      "pageIndex": defaultVal.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "level2Id": this.level2Id,
      "globalSearch": ""
    }
    this.createForm();
    this.getLevel2ListAndAllSmsTemplates();
  }

  createForm() {
    this.smsTemplate = this.formBuilder.group({
      "level2Id": [null, []]
    })
  }

  getLevel2ListAndAllSmsTemplates() {
    let api_call_list = [];
    api_call_list.push(this.visitorSettingObj.getLevel2List().pipe(first()));
    api_call_list.push(this.configureService.getAllSmsTemplates(this.get_all_template_obj).pipe(first()));
    forkJoin(api_call_list).subscribe((resp) => {
      console.log(resp);
      this.dataSource = resp[1]['data']['list']
      if (resp && resp[0] && resp[0]['data']) {
        this.buildingList = resp[0]['data'];
        if (this.userData && this.userData.role && this.userData.role.shortName == LevelAdmins.Level1Admin) {
          this.buildingList.splice(0, 0, { name: 'Enterprise ' + this.userData?.levelName, id: this.userData.level1Id });
          this.smsTemplate.get('level2Id').setValue(this.buildingList[0].id)
        }
        else {
          this.smsTemplate.get('level2Id').setValue(this.buildingList[0].id)
        }
      }
      if (resp && resp[1] && resp[1]['data'] && resp[1]['data']['list']) {
        this.dataSource = resp[1]['data']['list'];
        this.totalCount = resp[1]['data']['totalCount'];
      }
      if (resp && resp[1] && resp[1]['data'] && resp[1]['data']['isSMSApproval']) {
        this.isSMSApproval = resp[1]['data']['isSMSApproval'];
      }
    })
  }


  getAllSmsTemplates() {
    this.configureService.getAllSmsTemplates(this.get_all_template_obj).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.dataSource = resp['data']['list'];
        this.totalCount = resp['data']['totalCount'];
        this.isSMSApproval = resp['data']['isSMSApproval'];
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
        });
      } else {
        this.toastr.error(error.message, this.translate.instant("toster_message.success"));
      }
    })
  }

  onLevelChange(location: any) {
    if (location == this.userData.level1Id)
      this.level2Id = null;
    else
      this.level2Id = location
    this.get_all_template_obj.level2Id = this.level2Id;
    this.getAllSmsTemplates();
  }

  rowData(event: any) {
    this.grid_resp.data = event;
    this.grid_resp.mode = "show";
    this.openDialog()
  }


  changeMode(event: any) {
    this.grid_resp.data = event.rowData;
    this.grid_resp.mode = event.mode;
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(SmsTemplateDialogComponent, {
      height: '100%',
      width: '65%',
      position: { right: '0' },
      data: { "data": this.grid_resp.data, "mode": this.grid_resp.mode, "level2Id": this.level2Id ,isSMSApproval:this.isSMSApproval},
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.statusCode == 200) {
        this.getAllSmsTemplates()
      }
    });
  }

  smsChange(data) {
    console.log(data);
    this.get_all_template_obj = {
      "pageSize": data.pageSize,
      "pageIndex": data.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "level2Id": this.level2Id,
      "globalSearch": ""
    }
    this.getAllSmsTemplates();
  }

  applyFilter(filterValue) {
    console.log(filterValue);
    if (filterValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.get_all_template_obj.globalSearch = this.searchKey;
      if (this.searchKey.length >= 3)
        this.getAllSmsTemplates();
    }
    else {
      this.searchKey = null;
      this.get_all_template_obj.globalSearch = this.searchKey;
      this.getAllSmsTemplates();
    }
  }

    
}
