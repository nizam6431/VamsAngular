import { Component, Input, OnInit, Output, SimpleChanges, ViewChild ,EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';
import { LevelAdmins, ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../../dashborad.service';
export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  title: any;
  colors: any;
  responsive: any;
  xaxis:any;
};
@Component({
  selector: 'app-heapmap',
  templateUrl: './heapmap.component.html',
  styleUrls: ['./heapmap.component.scss']
})
export class HeapmapComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @Input() timeChange: string;
  @Input() locationId :any 
  @Input() locationEventEmitter;
  @Input() locationListId;
  heapmapData: any;
  noDataFound: boolean;
  ProductType = ProductTypes;
  productType: string;
  heapmapDatas:any;
  userDetails: any;
  isLevel1User:any;
  constructor(private dashboradService: DashBoradSerivce,
    private translate: TranslateService,
    private userService: UserService) {
      this.productType = this.userService.getProductType();
     }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserData();
    this.isLevel1User = this.userDetails && this.userDetails.role && this.userDetails.role.shortName == LevelAdmins.Level1Admin


  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.locationListId,'locationListId')
    if(this.productType == 'Enterprise'){
      this.getHeampMapDataEnterprise()
    }else{
      this.getHeampMapData()
    }
    
  }
  getHeampMapData() {
    this.heapmapData = [],
      this.chartOptions = {}
    this.dashboradService.heapMapService(this.timeChange).subscribe(data => {
      if (!data?.message && !data.errors && data.data?.list.length > 0) {
        this.noDataFound = false;
        this.heapmapData = data.data?.list
        this.chartOptions = {
          series: this.getSeriesData(),
          chart: {
            height: 350,
            type: "heatmap",
          },
          dataLabels: {
            enabled: false
          },
          responsive: [
            {

              legend: {
                show: true,
                position: "top"
              }
            }
          ],
          colors: ["#758FFC"],
          title: {
            text: this.translate.instant("dashboard.top10")
          }
        };

      } else {
        this.noDataFound = true;
        console.log("Error ");

      }

    }, (error) => {
      this.noDataFound = true
      console.log("error");

    })

  }
  getSeriesData(): any {
    var heampMapChangedData = [];
    this.heapmapData.forEach((element, index) => {
      heampMapChangedData.push(
        {
          "name": element.name,
          data:
            this.changedValue(element.data)
        }
      )
      // })


    });
    return heampMapChangedData;
  }
  changedValue(arrayValue): any {

    var arrayType = []
    arrayValue.forEach((element, index) => {

      arrayType.push(
        { x: this.searchDataForTime(element), y: element.y }
      )

    });
  
    return arrayType

  }

  searchDataForTime(element: any) {
    if (this.timeChange == "today") {
      return this.forToday(element)
    } else if (this.timeChange == "thisweek") {
      return this.forWeek(element)
    }
    else if (this.timeChange == 'thisyear') {
      return this.forYear(element)
    }else{
      return element.x
    }
  }

  forYear(element: any) {
    switch (element?.x) {
      case "1":
        return "Jan"
        break;
      case "2":
        return "Feb"
        break;
      case "3":
        return "Mar"
        break;
      case "4":
        return "Apr"
        break;
      case "5":
        return "May"
        break;
      case "6":
        return "Jun"
        break;
      case "7":
        return "Jul"
        break;
      case "8":
        return "Aug"
        break;
      case "9":
        return "Sep"
        break;
      case "10":
        return "Oct"
        break;
      case "11":
        return "Nov"
        break;
      case "12":
        return "Dec"
        break;
      default:
        return "error"

    }

  }
  forWeek(element: any) {
    
    switch (element?.x) {
      case "1":
        return "Mon"
        break;
      case "2":
        return "Tue"
        break;
      case "3":
        return "Wed"
        break;
      case "4":
        return "Thu"
        break;
      case "5":
        return "Fri"
        break;
      case "6":
        return "Sat"
        break;
      case "7":
        return "Sun"
   
      default:
        return "error"

    }
  }
  forToday(element: any) {
    //return element.x - 1 +"-"+ element.x
    var a = parseInt(element.x) +1;
    return element.x +"-"+ a
  }
 
  getHeampMapDataEnterprise(){
    this.heapmapData = [],
    this.chartOptions = {}
    this.dashboradService.heapMapServiceEnterprise(this.timeChange,this.locationId).subscribe(data =>{
       for(let i in data.data)
          {
            this.heapmapDatas = data.data[i]
          }
      if (!data?.message && !data.errors && data.data.length > 0) {
        this.noDataFound = false;
        this.heapmapData = data.data.reverse()
        this.chartOptions = {
          series: this.getSeriesDataEnterprise(),
          chart: {
            height: 300,
            type: "heatmap",
            toolbar: {
              export: {
                svg: {
                  filename: 'Heap Map',
                },
                png: {
                  filename: 'Heap Map',
                },
                csv: {
                  filename: 'Heap Map',
                }
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          responsive: [
            {

              legend: {
                show: true,
                position: "top"
              }
            }
          ],
          colors: ['#476bf7' ,'#254ce8'],
          title: {
            text: this.isLevel1User ? this.translate.instant("dashboard.top10") : ""
          },
          xaxis: {
            type: 'time',
            title: {
              text: this.translate.instant("dashboard.time")
            }
        },
        };

      }else {
        this.noDataFound = true;
        console.log("Error ");

      }
    },(error) => {
      this.noDataFound = true
      console.log("error");

    })
  }
  getSeriesDataEnterprise(): any {
    var heampMapChangedData = [];
    this.heapmapData.forEach((element, index) => {
      heampMapChangedData.push(
        {
          "name": element?.level2.name,
          data:
            this.changedValueHeapMap(Object.entries(element.level2.heatMap))
        }
      )  
      // console.log(this.changedValueHeapMap(element.level2?.heatmap),'changedValueHeapMap')
      //   console.log(heampMapChangedData,'heapmapchangedata')
      // })
    });
    return heampMapChangedData;
  }
  changedValueHeapMap(arrayValue): any {
    var arrayType = []
    if(arrayValue[0][0].includes('hour'))
    {
      arrayValue.pop(); 
    }
    if(arrayValue && arrayValue.length > 0){
      arrayValue.forEach((element, index) => {
        arrayType.push(
          { x: this.searchDataForTimeHeap(element), y: element[1] }
        )
      });
    }
    return arrayType

  }

  searchDataForTimeHeap(element: any) {
    if (this.timeChange == "Today") {
      return this.forTodays(element)
    } else if (this.timeChange == "CurrentWeek") {
      return this.forWeeks(element)
    }
    else if (this.timeChange == 'CurrentMonth') {
      return this.forMonth(element)
    }
    else if (this.timeChange == 'CurrentYear') {
      return this.forYears(element)
    }
    else{
      return element.x
    }
  }

  forTodays = (element:any) => [0,1,2,3,4,5,6,7,8,9].includes(element[0]) ? ('0' + element[0].substring(4)): element[0].substring(4) + ':00';

  forWeeks = (element: any) => element[0].substring(0, 3).charAt(0).toUpperCase() + element[0].substring(0, 3).slice(1);

  forYears = (element: any) => element[0].substring(0, 3).charAt(0).toUpperCase() + element[0].substring(0, 3).slice(1);

  forMonth = (element: any) => element[0].substring(3);
   
}
