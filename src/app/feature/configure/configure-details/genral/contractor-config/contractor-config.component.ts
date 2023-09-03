import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SettingServices } from 'src/app/feature/setting/services/setting.service';
import { first } from 'rxjs/operators';
import { Constants } from 'src/app/feature/configure/constants/column';
import { defaultVal, LevelAdmins } from 'src/app/core/models/app-common-enum';
import { MatDialog } from '@angular/material/dialog';
import { grid_resp, contractorConfigGetAllReq, contractorConfigaDeleteReq, contractorConfigDeleteRes } from '../../../constants/enum';
import { forkJoin } from 'rxjs';
import { ConfigureService } from '../../../services/configure.service';
import { UserService } from 'src/app/core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ContractorConfigPopupComponent } from '../../../popup/contractor-config-popup/contractor-config-popup.component';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
@Component({
  selector: 'app-contractor-config',
  templateUrl: './contractor-config.component.html',
  styleUrls: ['./contractor-config.component.scss']
})
export class ContractorConfigComponent implements OnInit {
  @Output() contractorConfigEmittor = new EventEmitter();
  @Input() contractorConfigAdd: any;
  public contractorConfigFieldsForm: FormGroup;
  buildingList: any[] = [];
  columns: any[] = Constants.contractor_config_fields;
  dataSource: any[] = [];
  totalCount: number = 0;
  pageSize: number = defaultVal.pageSize;
  grid_resp = new grid_resp()
  get_all_template_obj = new contractorConfigGetAllReq()
  userData: any;
  level2Id: number;
  searchKey: string = "";

  contractorConfigaDeleteReq = new contractorConfigaDeleteReq();
  contractorConfigDeleteRes = new contractorConfigDeleteRes();

  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private visitorSettingObj: SettingServices,
    private configureService: ConfigureService,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.contractorConfigAdd) {
      this.getAllContractorConfig();
    }
  }
  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    if (this.userData && this.userData.role && this.userData.role.shortName && this.userData.role.shortName == LevelAdmins.Level1Admin) {
      this.level2Id = null;
    }
    else {
      this.level2Id = (this.userData.level2List.length > 0) ? this.userData.level2List[0].id : null;
    }
    this.createForm();
    this.get_all_template_obj = {
      "pageSize": defaultVal.pageSize,
      "pageIndex": defaultVal.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "level2Id": this.level2Id,
      "globalSearch": "",
      "level3Id": null,
      "searchByStatus": null
    }
    this.contractorConfigEmittor.emit(this.get_all_template_obj)
    this.getLevel2ListAndAllEmailTemplates();
  }

  createForm() {
    this.contractorConfigFieldsForm = this.formBuilder.group({
      "level2Id": [null, []]
    })
  }

  getLevel2ListAndAllEmailTemplates() {
    let api_call_list = [];
    api_call_list.push(this.visitorSettingObj.getLevel2List().pipe(first()));
    api_call_list.push(this.configureService.getAllContractorConfig(this.get_all_template_obj).pipe(first()));
    forkJoin(api_call_list).subscribe((resp) => {
      console.log(resp);
      this.dataSource = resp[1]['data']['list']
      if (resp && resp[0] && resp[0]['data']) {
        this.buildingList = resp[0]['data'];
        if (this.userData && this.userData.role && this.userData.role.shortName == LevelAdmins.Level1Admin) {
          this.buildingList.splice(0, 0, { name: 'Enterprise ' + this.userData?.levelName, id: this.userData.level1Id });
          this.contractorConfigFieldsForm.get('level2Id').setValue(this.buildingList[0].id)
        }
        else {
          this.contractorConfigFieldsForm.get('level2Id').setValue(this.buildingList[0].id)
        }
      }
      if (resp && resp[1] && resp[1]['data'] && resp[1]['data']['list']) {
        this.dataSource = resp[1]['data']['list'];
        this.totalCount = resp[1]['data']['totalCount'];
      }
    })
  }

  getAllContractorConfig() {
    this.configureService.getAllContractorConfig(this.get_all_template_obj).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.dataSource = resp['data']['list'];
        this.totalCount = resp['data']['totalCount'];
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
    console.log(location, this.userData.level1Id);
    if (location == this.userData.level1Id)
      this.level2Id = null;
    else
      this.level2Id = location
    this.get_all_template_obj.level2Id = this.level2Id;
    this.contractorConfigEmittor.emit(this.get_all_template_obj)
    this.getAllContractorConfig();
  }

  rowData(event: any) {
    this.grid_resp.data = event;
    this.grid_resp.mode = "show";
    this.openDialog()
  }

  changeMode(event: any) {
    this.grid_resp.data = event.rowData;
    this.grid_resp.mode = event.mode;
    if (this.grid_resp.mode == 'edit') {
      this.openDialog()
    }
    if (this.grid_resp.mode == 'delete') {
      this.openDialogForDelete(this.grid_resp.data)
    }
  }

  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "contractor_config",
        configData: this.grid_resp.data,
        pop_up_type: "contractor_config",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteContractorConfig();
      }
      else {
        this.getAllContractorConfig();
      }
    });
  }


  openDialog() {
    const dialogRef = this.dialog.open(ContractorConfigPopupComponent, {
      height: '100%',
      width: '100%',
      position: { right: '0' },
      data: { "data": this.grid_resp.data, "mode": this.grid_resp.mode, "level2Id": this.get_all_template_obj.level2Id },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.statusCode == 200) {
        this.getAllContractorConfig();
      }
    });
  }

  emailChange(data) {
    this.get_all_template_obj = {
      "pageSize": data.pageSize,
      "pageIndex": data.pageIndex,
      "orderBy": "name",
      "orderDirection": "ASC",
      "level2Id": this.level2Id,
      "globalSearch": "",
      "level3Id": null,
      "searchByStatus": null
    }
    this.getAllContractorConfig();
  }

  applyFilter(filterValue) {
    if (filterValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.get_all_template_obj.globalSearch = this.searchKey;
      if (this.searchKey.length >= 3)
        this.getAllContractorConfig();
    }
    else {
      this.searchKey = "";
      this.get_all_template_obj.globalSearch = this.searchKey;
      this.getAllContractorConfig();
    }
  }

  deleteContractorConfig() {
    this.contractorConfigaDeleteReq = {
      configId: this.grid_resp.data.configId
    }
    this.configureService.deleteContractorConfig(this.contractorConfigaDeleteReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.contractorConfigDeleteRes = resp;
        this.getAllContractorConfig();
        this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
      }
    },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.success"));
          });
        } else {
          this.toastr.error(error.message, this.translate.instant("toster_message.success"));
        }
      })
  }

}
