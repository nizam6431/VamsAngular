import { Component, Input, OnInit ,SimpleChanges,ViewChild} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import ApexCharts from 'apexcharts';
import {ChartComponent,ApexAxisChartSeries, ApexChart, ApexFill, ApexYAxis, ApexTooltip, ApexTitleSubtitle, ApexXAxis} from "ng-apexcharts";
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../../dashborad.service';

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  yaxis: any | any[];
  title: any;
  labels: any[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: any;
  tooltip: any;
  colors: any;
  responsive :any;
};
@Component({
  selector: 'app-mixed-chart',
  templateUrl: './mixed-chart.component.html',
  styleUrls: ['./mixed-chart.component.scss']
})
export class MixedChartComponent {
  public chartOptions: Partial<ChartOptions>;
  noDataFound: boolean;
  @ViewChild("chart") chart: ChartComponent;
  @Input() timeChange: any;
  @Input() locationId :number 
  @Input() locationEventEmitter;
  @Input() hoursWiseLocationId;
  ProductType = ProductTypes;
  productType: string;
  seriesData1: any[]=[];
  seriesData2: any[]=[];
  tenatName: any[];
  name: any;
  mixedData: any[];
  
  
  constructor(private dashboradService: DashBoradSerivce,private userService: UserService,private translate: TranslateService) {

    this.productType = this.userService.getProductType();
  }

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getMixedMapData();
  }

  getMixedMapData(){
    this.seriesData1=[]
    this.seriesData2=[]
    this.tenatName=[];
    this.chartOptions = {}
    this.mixedData = []
    this.dashboradService.getVisitorHoursWiseCount(this.timeChange,this.hoursWiseLocationId).subscribe(data=>{
      if (!data?.message && !data.errors && data?.data?.length>0) {
        this.noDataFound=false
        this.mixedData = data.data
      data?.data?.forEach(element => {
      this.seriesData1.push(element.heatMapHours)
      this.seriesData2.push(element.total)
      this.tenatName.push(element.name)
      });
      this.chartOptions = {
        series: this.getSeriesDataEnterprise(),
        chart: {
          height: 350,
          type: "line",
          toolbar: {
            export: {
              svg: {
                filename: 'Visitor Hourly',
              },
              png: {
                filename: 'Visitor Hourly',
              },
              csv: {
                filename: 'Visitor Hourly',
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
        xaxis: {
              type: 'time',
              title: {
                text: this.translate.instant("dashboard.time")
              }
          },
          yaxis: [{
            title: {
              text: 'No of Visitor',
            },
          
          }, 
        ],
        colors: ["#758FFC"],
       
      };

    }else{
      this.noDataFound=true
    }
    },(error)=>{
      this.noDataFound=true
      console.log("error in api ");
      
    })
  }

  getSeriesDataEnterprise(): any {
    var mixMapChangedData = [];
    this.mixedData.forEach((element, index) => {
      mixMapChangedData.push(
        {
          "name": element?.name,
          data:
            this.changedValueHeapMap(Object.entries(element.heatMap))
        }
      )  
      // console.log(this.changedValueHeapMap(Object.entries(element.heatMap)),'changedValueHeapMap')
      //   console.log(mixMapChangedData,'heapmapchangedata')
      // })
    });
    return mixMapChangedData;
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
    if (this.timeChange == "Today" || this.timeChange == "CurrentWeek" || this.timeChange == "CurrentMonth" || this.timeChange == "CurrentYear") {
      return this.forHours(element)
    } 
    else{
      return element.x
    }
  }

  forHours =  (element:any) => [0,1,2,3,4,5,6,7,8,9].includes(element[0]) ? ('0' + element[0].substring(4)): element[0].substring(4) + ':00';
 
}
