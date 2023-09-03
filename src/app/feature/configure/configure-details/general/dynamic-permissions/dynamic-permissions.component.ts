import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigureService } from '../../../services/configure.service';
import { PermissionDataObj } from '../../../models/config-models';

@Component({
  selector: 'app-dynamic-permissions',
  templateUrl: './dynamic-permissions.component.html',
  styleUrls: ['./dynamic-permissions.component.scss']
})
export class DynamicPermissionsComponent implements OnInit, OnChanges {

  @Input() permissionsEvent: any;
  @Input() dynamicPermission: any;
  columns = [];
  rowData: any;
  rowData1: PermissionDataObj[] = [];
  formatedData = [];
  requestObj = [];


  columnKeys: any = [];
  constructor(
    private translate: TranslateService,
    private toastr: ToastrService,
    private configureService: ConfigureService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.permissionsEvent) {
      if (this.permissionsEvent == 'save') {
        this.updatePermissions();
      } else if (this.permissionsEvent == 'reset') {
        this.resetPermissions()
      }
    }
  }

  ngOnInit(): void {
    this.roles()
    this.complexPermissions();
  }

  complexPermissions() {
    this.configureService.getPermissions().subscribe(res => {
      if (res.statusCode == 200 && res.data) {
        this.formatData(res.data);
      } else {
        this.toastr.error(res.message ? res.message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  roles() {
    this.configureService.getComplexRoles().subscribe(res => {
      if (res.statusCode == 200 && res.data) {
        this.columns.push({ "key": "key", "value": "Roles" })
        this.columnKeys.push("key")
        res.data.forEach(d => {
          this.columnKeys.push(d.shortName)
          this.columns.push(
            {
              key: d.shortName,
              value: d.roleName
            }
          )
        });
      } else {
        this.toastr.error(res.message ? res.message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  updatePermissions() {
    this.configureService.updatePermissions(this.requestObj).subscribe(res => {
      if (res.statusCode == 200) {
        this.toastr.success(res.message, this.translate.instant("toster_message.success"));
        this.complexPermissions();
      } else {
        this.toastr.error(res.message ? res.message : this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("toster_message.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  resetPermissions() {
    this.formatedData = [];
    this.complexPermissions();

  }

  //formtaing data coming from back end as required for grid
  formatData(data) {
    this.formatedData = []
    for (let d of data) {
      for (let p of d.permissions) {
        let fd = this.formatedData.find(f => f.key == p.permissionKey)
        if (fd) {
          fd[d.shortName] = this.setPermissionObj(p);
        } else {
          let obj = {
            key: p.permissionKey,
            name: p.permissionName
          }
          obj[d.shortName] = this.setPermissionObj(p);
          this.formatedData.push(obj);
        }
      }
    }
    this.formatedData.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  }

  setPermissionObj(p) {
    return {
      "isDisabled": p.isDisabled,
      "isPermissible": p.rolePermissions[0]['isPermissible'],
      "rolePermissions": p.rolePermissions
    };
  }

  onChange(role, permission, data, value) {
    let alreadyChanged = this.requestObj.find(d => d['rolePermissionId'] == data['rolePermissions'][0]['rolePermissionId'])
    if (alreadyChanged) {
      alreadyChanged['isPermissible'] = value;
    } else {
      data['rolePermissions'][0]['isPermissible'] = value;
      this.requestObj.push(data['rolePermissions'][0])
    }
  }

  showError(error) {
    if (error && error.error && 'errors' in error.error) {
      error.error.errors.forEach(element => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
      })
    }
    else {
      this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
    }
  }

  isSticky(column: string) {

    return column == "key" ? true : false;
  }
}
