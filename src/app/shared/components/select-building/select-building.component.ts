import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { ToastrService } from 'ngx-toastr';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-select-building',
  templateUrl: './select-building.component.html',
  styleUrls: ['./select-building.component.scss']
})
export class SelectBuildingComponent implements OnInit {
  buildingList = [];
  selectedBuilding = null;
  selectAllBuidings
  ForLoginPage: boolean = true;
  isSelecetAll: boolean = true;
  lastBuildingSearchtext: any;
  mainList: any;
  OnlyComplexApnts: boolean = false;
  includeComplexVisitor: boolean = false;
  ProductType = ProductTypes;
  productType: string;
  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<SelectBuildingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service:UserService,
  ) {
    // this.productType = this.service.getProductType();
    this.productType=environment.productType
   }

  ngOnInit(): void {
    this.buildingList = this.data.buildingList;
    if(this.data && this.data.includeComplexVisitor)
      this.includeComplexVisitor = this.data.includeComplexVisitor
    if(this.data && this.data.allselected){
      this.isSelecetAll = this.data.allselected
    }
    if(this.data && this.data.OnlyComplexApnts)
      this.OnlyComplexApnts = true
    this.mainList = JSON.parse(JSON.stringify(this.data.buildingList));
    if (this.data && this.data.filter) {
      this.ForLoginPage = false;
      this.isSelecetAll = this.data.allselected
    } else {
      this.selectedBuilding = this.buildingList.find(item => item.isDefault == true).id;
    }
  }
  onClose(event?) {
    if (this.data.filter) {
      if (this.OnlyComplexApnts) {
        this.includeComplexVisitor = true;
        this.dialogRef.close({ filter: event, selectedBuilding: [], OnlyComplexApnts: this.OnlyComplexApnts, includeComplexVisitor: this.includeComplexVisitor })
      } else {
        this.selectedBuilding = this.buildingList.filter((building) => building['checked'] == true)
        if (this.selectedBuilding.length) {
          this.selectedBuilding = this.selectedBuilding.map(building => {
            if (building['checked'] == true) {
              return building['id']
            }
          })
          this.dialogRef.close({ filter: event, selectedBuilding: this.selectedBuilding, includeComplexVisitor: this.includeComplexVisitor ,OnlyComplexApnts:this.OnlyComplexApnts})
        } else {
          this.dialogRef.close({ filter: event, selectedBuilding: [], includeComplexVisitor: this.includeComplexVisitor ,OnlyComplexApnts:this.OnlyComplexApnts});
        }
      }
    } else {
      if (this.selectedBuilding == null) {
        this.toastr.error("Please select building", 'Error');
      } else {
        this.selectedBuilding = this.buildingList.filter((building) => building.id == this.selectedBuilding)
        this.dialogRef.close(this.selectedBuilding[0]);
      }
    }
  }

  selectionChange(option: MatListOption) {
    let index = this.buildingList.findIndex(b => b.id == option.value.id);
    this.buildingList[index].checked = option.selected;
    if ((this.buildingList.every((element) => (element.checked == true)))) {
      this.isSelecetAll = true;
    } else {
      this.isSelecetAll = false;
    }
  }

  selectAll(event) {
    this.isSelecetAll = !this.isSelecetAll;
    
    this.service.isSelect.next(this.isSelecetAll);
    
    this.buildingList.forEach((element) => {
      element['checked'] = event.checked;
    })
  }

  onlyCompexAppointments(event) {
    console.log(event);
    if(event["checked"])
      this.includeComplexVisitor = event["checked"]
    this.OnlyComplexApnts = event["checked"];
    this.selectedBuilding = [];
    if(event["checked"]){
      this.buildingList.forEach(element=>element.checked = false);
      this.isSelecetAll = false;
    }
  }

  includeVisitor(event) {
    this.includeComplexVisitor = event["checked"];
  }

  searchBuildingAndCompanies(value: any) {
    this.lastBuildingSearchtext = value;
    this.searchBuilding(this.lastBuildingSearchtext)
  }
  searchBuilding(lastBuildingSearchtext: string) {
    let buildingArrayIndex = 0;
    this.buildingList = this.mainList.filter((element) => {
      if (element && element.name) {
        let buildingName = (element.name).toLowerCase();
        if (buildingName.startsWith(lastBuildingSearchtext.toLowerCase())) {
          element['buildingArrayIndex'] = buildingArrayIndex;
          buildingArrayIndex = buildingArrayIndex + 1;
          return true
        }
        return false
      }
      return false;
    });
  }
}
