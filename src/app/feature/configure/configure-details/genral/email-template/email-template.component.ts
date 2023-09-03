import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingServices } from 'src/app/feature/setting/services/setting.service';
import { first } from 'rxjs/operators';
import { Constants } from 'src/app/feature/configure/constants/column';
import { defaultVal, LevelAdmins } from 'src/app/core/models/app-common-enum';
import { MatDialog } from '@angular/material/dialog';
import { grid_resp ,getAllEmailTemplate} from '../../../constants/enum';
import { EmailTemplatePopupComponent } from '../../../popup/email-template-popup/email-template-popup.component';
import { forkJoin } from 'rxjs';
import { ConfigureService } from '../../../services/configure.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {

  public emailTemplate: FormGroup;
  buildingList: any[] = [];
  columns: any[] = Constants.email_template_demo;
  dataSource: any[] = [];
  totalCount: number = 0;
  pageSize: number = defaultVal.pageSize;
  email_template_grid = new grid_resp()
  get_all_template_obj = new getAllEmailTemplate()
  userData: any;
  level2Id: any;
  searchKey: any;

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private visitorSettingObj: SettingServices,
    private configureService:ConfigureService,
    private userService:UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.level2Id = (this.userData.level2List.length>0)? this.userData.level2List[0].id:null;
    this.createForm();
    this.get_all_template_obj = {
      "pageSize": defaultVal.pageSize,
      "pageIndex": defaultVal.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "name": "",
      "tags": "",
      "level2Id": this.level2Id,
      "globalSearch":""
    }
    this.getLevel2ListAndAllEmailTemplates();
  }

  createForm() {
    this.emailTemplate = this.formBuilder.group({
      "level2Id": [null, []]
    })
  }

  getLevel2ListAndAllEmailTemplates(){
    let api_call_list = [];
    api_call_list.push(this.visitorSettingObj.getLevel2List().pipe(first()));
    api_call_list.push(this.configureService.getAllEmailTemplates(this.get_all_template_obj).pipe(first()));
    forkJoin(api_call_list).subscribe((resp) => {
      this.dataSource = resp[1]['data']['list']
      if(resp && resp[0] && resp[0]['data']){
        this.buildingList = resp[0]['data'];
        if(this.userData && this.userData.role && this.userData.role.shortName == LevelAdmins.Level1Admin){
          this.buildingList.splice(0, 0, { name: 'Enterprise ' + this.userData?.levelName, id: this.userData.level1Id });
          this.emailTemplate.get('level2Id').setValue(this.buildingList[0].id)
        }
        else{
          this.emailTemplate.get('level2Id').setValue(this.buildingList[0].id)
        }
      }
      if(resp && resp[1] && resp[1]['data'] && resp[1]['data']['list']){
        this.dataSource = resp[1]['data']['list'];
        this.totalCount = resp[1]['data']['totalCount'];
      }
    })
  }

  getAllEmailTemplates(){
    this.configureService.getAllEmailTemplates(this.get_all_template_obj).pipe(first()).subscribe((resp)=>{
      if(resp.statusCode == 200 && resp.errors == null){
        this.dataSource = resp['data']['list'];
        this.totalCount = resp[1]['data']['totalCount'];
      }
    },(error)=>{
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
    console.log(location,this.userData.level1Id);
    if (location == this.userData.level1Id)
      this.level2Id = null;
    else
      this.level2Id = location
    this.get_all_template_obj.level2Id = this.level2Id;
    this.getAllEmailTemplates();
  }

  rowData(event: any) {
    this.email_template_grid.data = event;
    this.email_template_grid.mode = "show";
    this.openDialog()
  }

  changeMode(event: any) {
    this.email_template_grid.data = event.rowData;
    this.email_template_grid.mode = event.mode;
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(EmailTemplatePopupComponent, {
      height: '100%',
      width: '100%',
      position: { right: '0' },
      data: { "data": this.email_template_grid.data, "mode": this.email_template_grid.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.statusCode == 200) {
          this.getAllEmailTemplates();
      }
    });
  }

  emailChange(data){
    this.get_all_template_obj = {
      "pageSize": data.pageSize,
      "pageIndex": data.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "name": "",
      "tags": "",
      "level2Id": this.level2Id,
      "globalSearch":this.searchKey
    }
    this.getAllEmailTemplates();
  }

  applyFilter(filterValue) {
    if (filterValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.get_all_template_obj.globalSearch = this.searchKey;
      if(this.searchKey.length>=3)
        this.getAllEmailTemplates();
    }
    else{
      this.searchKey = null;
      this.get_all_template_obj.globalSearch = this.searchKey;
      this.getAllEmailTemplates();
    }
  }

}
