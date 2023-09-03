import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { Constants } from 'src/app/feature/card/card/constant/column';
import { DashBoradSerivce } from '../../dashborad.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-dashboard-level1',
  templateUrl: './dashboard-level1.component.html',
  styleUrls: ['./dashboard-level1.component.scss']
})
export class DashboardLevel1Component implements OnInit {
  @Input() currentValue: string;
  timeChange: any;
  vistorData: any;
  ProductType = ProductTypes;
  productType: string;
  noDataFound: boolean;
  Daily:string ='Daily';
  Permanent:string = 'Permanent';
  @Input() locationId :any;
  @Input() locationEventEmitter:any;
  @Input() locationListId:any;
  @Input() hoursWiseLocationId:any;
  dataSource: any;
  dataSource1:any;
  refreshAppApi:any;
  columns = Constants.walkinVisitorCheckinCount;
  columns1 = Constants.walkinVisitorCheckOutCount
  SeepzWorkFlow: any;
  chechInData: any;
  flaggedCount: any;
  flaggedCount1: any;
  constructor(private dashBoradSerivce: DashBoradSerivce,
    private translate: TranslateService,
    private userService: UserService) {
      this.productType = this.userService.getProductType();
      
      this.SeepzWorkFlow = this.userService.getWorkFlow();
     }

  ngOnInit(): void {
    this.refreshAfterTenMin();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.timeChange = this.currentValue
    if(this.SeepzWorkFlow){
     this.getVisitorCheckInCount();
    //  this.getVisitorCheckOutCount();
    }else{
      if(this.productType == 'Enterprise'){
        this.getTotalVisitorEnterprise()
      }else{
        this.getTotalVisitor();
      }
    }
  }
  getTotalVisitor() {
    this.dashBoradSerivce.getVisitorCount(this.currentValue).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.vistorData = data?.data?.list[0]
        this.noDataFound=false
      }
      else{
        this.noDataFound=true
      }
    }, (error => {
      this.noDataFound=true
      console.log("error");
    })
    )
  }
  getTotalVisitorEnterprise() {
    this.dashBoradSerivce.getVisitorCountEnterprise(this.currentValue,this.locationId).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        this.vistorData = data.data
        this.noDataFound=false
      }else{
        this.noDataFound=true
      }
    }, (error => {
      this.noDataFound=true
      console.log("error");

    })
    )
  }


  convartIntoPrecentage(count) {
    if (this.vistorData) {
      return (count * 100) / (JSON.parse(this.vistorData.count) + JSON.parse(this.vistorData.maxCount) + JSON.parse(this.vistorData.averageCount))
    }
    return 0
  }

  checktimeStatus() {
    if (this.timeChange == "today") {
      return  this.translate.instant("dashboard.today") 
    } else if (this.timeChange == "thisweek") {
      return  this.translate.instant("dashboard.this_week") 
    }
    else if (this.timeChange == 'thisyear') {
      return  this.translate.instant("dashboard.year") 
    }else{
      return  this.translate.instant("dashboard.month") 
    }
  }

  checkHighest(){
    if (this.timeChange == "today") {
      return  this.translate.instant("dashboard.day") 
    } else if (this.timeChange == "thisweek") {
      return  this.translate.instant("dashboard.single_week") 
    }
    else if (this.timeChange == 'thisyear') {
      return  this.translate.instant("dashboard.single_year") 
    }else{
      return  this.translate.instant("dashboard.single_month") 
    }
  }

  convartIntoPrecentageEnterprise(count?) {
    if (this.vistorData) { 
      return (count * 100) / (JSON.parse(this.vistorData.count) + JSON.parse(this.vistorData.highest) + JSON.parse(this.vistorData.average))
    }
    return 0 
  }
  
  checktimeStatusEnterprise() {
    if (this.timeChange == "Today") {
      return  this.translate.instant("dashboard.today") 
    } else if (this.timeChange == "CurrentWeek") {
      return  this.translate.instant("dashboard.this_week") 
    }
    else if (this.timeChange == 'CurrentYear') {
      return  this.translate.instant("dashboard.year") 
    }else{
      return  this.translate.instant("dashboard.month") 
    }
  }
  checkHighestEnterprise(){
    if (this.timeChange == "Today") {
      return  this.translate.instant("dashboard.day") 
    } else if (this.timeChange == "CurrentWeek") {
      return  this.translate.instant("dashboard.single_week") 
    }
    else if (this.timeChange == 'CurrentYear') {
      return  this.translate.instant("dashboard.single_year") 
    }else{
      return  this.translate.instant("dashboard.single_month") 
    }
  }

  getVisitorCheckInCount(){
    this.dashBoradSerivce.walkingVisitorCheckinCount().subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.dataSource = data.data.checkedIn;
        this.dataSource1 = data.data.checkedOut
      }
    });
  }
  // getVisitorCheckOutCount(){
  //   this.dashBoradSerivce.walkingVisitorCheckinCount().subscribe((data) => {
  //     if (!data.error && data.statusCode == 200) {
  //       this.dataSource1 = data.data.checkedOut
  //     }
  //   });
  // }

  flagged(event){
    this.flaggedCount = event
  }
  flaggeEmitter1(event){
    this.flaggedCount1 = event
  }

  refreshAfterTenMin(){
    setInterval(() => {
      this.getVisitorCheckInCount ()
     // this.getVisitorCheckOutCount()
       this.dashBoradSerivce.refreshApi()
      this.refreshAppApi = new Date()
    }, environment.apiRefreshAfterTenMinutes);
  }
}
