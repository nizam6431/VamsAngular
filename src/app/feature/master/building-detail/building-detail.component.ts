import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { UserService } from "src/app/core/services/user.service";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { Status } from "../constants/dropdown-enums";
import { BuildingObject } from "../models/building-details";
import { AppBuildingEvent } from "../models/complex-details";
import { MasterService } from "../services/master.service";

@Component({
  selector: "app-building-detail",
  templateUrl: "./building-detail.component.html",
  styleUrls: ["./building-detail.component.scss"],
})
export class BuildingDetailComponent implements OnInit {
  permissionKeyObj =permissionKeys;
  statusList = Object.keys(Status);
  private validationMessages: { [key: string]: { [key: string]: string } };
  public formBuilding: FormGroup;
  public buildingObject: BuildingObject;
  public isEdit: boolean = false;
  public level2Object: any;

  constructor(
    private formBuilder: FormBuilder,
    private masterService: MasterService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate:TranslateService
  ) {
    this.validationMessages = {
      name: {
        required: this.translate.instant("Company.buildingRequired"),
        pattern:this.translate.instant("Company.FirstNameValidation") ,
        maxlength: this.translate.instant("Company.buildingMaxlength"),
      },
      status: {
        required:this.translate.instant("Company.statusRequired"),
      },
    };
  }

  ngOnInit() {
    this.level2Object = this.userService.getLevel2DidForLevel2Admin();

    if (this.level2Object) {
      this.getBuildingDetails(this.level2Object);
    }
  }

  createForm() {
    this.formBuilding = this.formBuilder.group({
      name: [
        this.buildingObject.data.name ? this.buildingObject.data.name : null,
        [Validators.required, Validators.maxLength(50)],
      ],
      status: [this.buildingObject.data.status],
    });
  }

  onSubmit() {
    if (this.formBuilding.invalid) {
      this.toastr.warning(
        this.translate.instant("pop_up_messages.error_in_form_buildding"),
        this.translate.instant("pop_up_messages.could_not_save")
      );
      Object.keys(this.formBuilding.controls).forEach((field) => {
        this.formBuilding.controls[field].markAsDirty();
        this.formBuilding.controls[field].markAsTouched();
      });
    } else {
      let updateObj = {
        level2Id:  this.userService.getLevel2DidForLevel2Admin(),
        name: this.formBuilding.value.name.trim(),
        status: this.formBuilding.value.status,
      };
      this.masterService
        .updateBuilding(updateObj)
        .pipe(first())
        .subscribe(
          (resp) => {
            if (resp.statusCode === 200 && resp.errors === null) {
              this.isEdit = false;
              this.getBuildingDetails(this.level2Object.displayId);
              this.reformatBuildingList(updateObj)
              this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
            }
          },
          (error) => {
            if ( error && error.error && 'errors' in error.error) {
              error.error.errors.forEach(element => {
                this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
              })
            }
            else {
              this.toastr.error(error.error.Message,  this.translate.instant("pop_up_messages.error"));
            }
          }
        );
    }
  }

  reformatBuildingList(updateObj) {
    let userData = this.userService.getUserData()
    if(userData && userData.level2List) {
      userData['level2List'].map((ele) => {
        if(ele.id == updateObj.level2Id) {
            ele.name = updateObj.name;
            ele.status = updateObj.status;
            userData.selectedBuilding = ele;
        }
      });
      this.userService.dispatch(new AppBuildingEvent("BUILDING_CHANGED", updateObj));
    }
  }

  getBuildingDetails(level2Id) {
    //Note: this is because data will come from backend they will check there so no need to send level2Id
    //TODO need to remove level2Id after
    level2Id = null;
    this.masterService
      .getBuildingDetail(level2Id)
      .pipe(first())
      .subscribe(
        (response) => {
          if (response.statusCode === 200 && response.errors == null) {
            this.buildingObject = response;
            this.createForm();
          } else {
            this.toastr.error(response.message);
          }
        },
        (error) => {
          this.toastr.error(error.message);
        }
      );
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach((validator) => {
      if (
        (this.formBuilding.get(control).touched ||
          this.formBuilding.get(control).dirty) &&
        this.formBuilding.get(control).errors
      ) {
        if (this.formBuilding.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  cancel() {
    this.isEdit = false;
  }
  resetForm() {
    this.formBuilding.reset();
  }
}
