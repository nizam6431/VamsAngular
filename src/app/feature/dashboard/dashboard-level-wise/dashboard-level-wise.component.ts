import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { Level, Level2Roles, LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../dashborad.service';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AccountService } from "src/app/core/services/account.service";
import { ToastrService } from 'ngx-toastr';
import { identity } from 'lodash';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-dashboard-level-wise',
  templateUrl: './dashboard-level-wise.component.html',
  styleUrls: ['./dashboard-level-wise.component.scss']
})
export class DashboardLevelWiseComponent implements OnInit {
  @ViewChild('location') input: ElementRef;
  currentValue: any = "today";
  type: string = "level1";
  userDetails: any;
  vistorData: void;
  time: Date;
  ProductType = ProductTypes;
  productType: string;
  selectedLocation :any;
  buildingList = [];
  userLevel;
  LocationList: any;
  locationId:any
  locationEventEmitter:any
  isLevel1 :boolean = false;
  locationListId:any;
  lastTimeDisplay:boolean =false
  isLevel2:boolean
  originalLocationList =[]
  level2Id: any;
  hoursWiseLocationId:any
  SeepzWorkFlow: any;
  refreshAppApi:any;
  // @Output() locationEventEmitter = new EventEmitter();
  constructor(public userService: UserService,
    private dashBoradSerivce: DashBoradSerivce,
    public router: Router,
    private translate: TranslateService,
    private authenticationService :AccountService,
    private toastr: ToastrService,
    private renderer: Renderer2) {
    this.productType = this.userService.getProductType();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
     }


  ngOnInit(): void {
    this.dashBoradSerivce.refreshTime.subscribe(res => {
      this.time = new Date()
    })
    this.time = new Date()
    //this.currentValue = "today"
    this.userDetails = this.userService.getUserData();
    if (this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level1Admin) {
      this.type = 'level1'
    }
    if (this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level2Admin) {
      this.type = 'level2'
    }
    if (this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level3Admin) {
      this.type = 'level3'
    }

    if(this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level2Admin){
      this.selectedLocation =  this.userDetails.level2List[0].id
      this.selectLocation(this.selectedLocation);
    }else{
      this.selectLocation(this.selectedLocation)
    }
   
    if(this.productType === 'Enterprise')
    {
      this.currentValue = "Today";
      this.locationId = this.selectedLocation
    }else
    {
      this.currentValue = "today"
    }
  }
  // private _filter(value: string): string[] {
  //   if(typeof(value) == 'string'){
  //     const filterValue = value.toLowerCase();
  //     console.log(filterValue,'filter value')
  //     return this.originalLocationList.filter(option =>option.locationName.toLowerCase().startsWith(filterValue));
  //   }
  //   else{
  //     return []
  //   }
  // }

  // searchLocation(filterValue){
  //   console.log(filterValue);
  //   this.originalLocationList = this._filter(filterValue);
  //   console.log(this.originalLocationList,'...')
  // }

  changeCurentvalue(event) {
    this.currentValue = this.currentValue;
    this.time = new Date()
  }

  // getLocationIds(locations?){
  //   this.AllLocationids = [];
  //   if(locations.length > 0)
  //   {
  //     locations.forEach(o => this.AllLocationids.push(o.id))
  //   }
  //   this.allLocationList = this.AllLocationids
  //   console.log(this.allLocationList)
   
  // }

    locationChange(value){
      this.selectedLocation = value
      if ((value.locationName).localeCompare('All Location') == 0) {
        this.locationId = this.locationListId
        this.hoursWiseLocationId = []
      }
      else{
        this.locationId = [value.id]
        this.hoursWiseLocationId =[value.id]
      }
    }


  selectLocation(datas?){
    this.locationId = datas?.value
    let reqObj = {
      isDeleted: true,
    };
    this.authenticationService.changeLocation(reqObj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.LocationList = data.data;
         this.locationListId = this.LocationList.map(element => element.id)
        //  let a = data.data; 
        //  const toSelect = a.find(c => c?.id == this.selectedLocation); 
        //  this.selectedLocation = toSelect.id;

        if (this.userDetails.role.shortName == LevelAdmins.Level1Admin) {
          let name = "All Location"
          this.LocationList.splice(0, 0, { locationName: name, id: this.userDetails.level1Id });
          this.originalLocationList.splice(0, 0, { locationName: name+" " + this.userDetails?.levelName, id: this.userDetails.level1Id });
        }
        this.locationChange(this.LocationList[0])
      }

    })
  }
  // onChange(){
  //     this.time = new Date();
  //     this.locationEventEmitter = new Date().getTime();
  // }
  onChange(){
      this.time = new Date();
      this.refreshAppApi = new Date().getTime();
  }
}
