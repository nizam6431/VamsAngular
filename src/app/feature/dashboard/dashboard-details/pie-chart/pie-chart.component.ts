import { Component, Input, OnInit, SimpleChanges, ViewChild ,Output,EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../../dashborad.service';
import { interval, Subscription} from 'rxjs';
export type ChartOptions = {
  series: any;
  chart: any;
  responsive: any;
  labels: any;
  colors: any;
  fill: any;
  title:any;
  legend:any;
  dataLabels:any;
  plotOptions:any;
  total:any;
};
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})

export class PieChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  @Input() locationId :number 
  @Input() locationEventEmitter;
  @Input() timeChange: any;
  @Input() currentData :any;
  @Input() refreshAppApi:any;
  @Output() flaggeEmitter = new EventEmitter()
  nodataFound: boolean;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow: any;
  constructor(private dashboradService: DashBoradSerivce,
    private userService: UserService,private translate: TranslateService

  ) { 
    this.productType = this.userService.getProductType();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.SeepzWorkFlow){
       this.getDailyPassPiechartData();
    }else{
      if(this.productType === 'Enterprise')
      {
        this.getEnterprisePiechartData()
      }else
      {
        this.getPiechartData()
      }
    }
  }

  getPiechartData() {
    this.chartOptions = {}
    this.dashboradService.pieChartService(this.timeChange).subscribe(data => {
      if (!data?.message && !data.errors && data?.data?.list?.length > 0) {
        this.nodataFound = false;
        this.chartOptions = {
          series: [this.findPrecentageValue(data?.data?.list[0].scheduleCount, data?.data?.list[0].totalCount), this.findPrecentageValue(data?.data?.list[0].walkinCount, data?.data?.list[0].totalCount)],
          chart: {
            type: "donut"
          },
          labels: ["PreSchedule Count : " + data?.data?.list[0].scheduleCount, "WalkIn Count : " + data?.data?.list[0].walkinCount, "Total : " + data?.data?.list[0].totalCount],
          fill: {
            colors: ['#FFCE60', '#EF861D'],
            opacity: 1,
            type: 'solid',
            gradient: {
              shade: 'dark',
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 100],
              colorStops: []
            }
          },
          colors: ['#FFCE60', '#EF861D'],
          responsive: [
            {
              show: false,
              legend: {
                position: "top"
              }
            },

          ]
        };
      }
      else {
        this.nodataFound = true;
        console.log("Something Went Wrong ");

      }

    }, (error) => {
      this.nodataFound = true;
      console.log("Printing the Error Code ");

    })
  }

  findPrecentageValue(value, totalCount) {
    if (totalCount > 0) {
      return Math.round((value * 100) / totalCount);
    } else {
      this.nodataFound = true;
      return 0;
    }

  }
  getEnterprisePiechartData(){
    this.chartOptions = {}
    this.dashboradService.pieChartServiceEnterprise(this.timeChange,this.locationId).subscribe(data =>{
      if(data?.data?.level2?.length > 0){
        this.nodataFound = false;
        this.chartOptions = {
          series: [data?.data?.preScheduleTotal, data?.data?.walkInTotal],
          chart: {
            type: "donut"
          },
          legend: {
            formatter: function(val: any, opts: any) {              
              if( val != "Total "+data?.data?.total){
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
              }else{
                return "Total - "+data?.data?.total
              }
            }
          },
          labels: ["PreSchedule Count ", "WalkIn Count ", "Total " + data?.data?.total],
          fill: {
            colors: ['#FFCE60', '#EF861D'],
            opacity: 1,
            type: 'solid',
            gradient: {
              shade: 'dark',
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 100],
              colorStops: []
            }
          },
          responsive: [
            {
              show: false,
              legend: {
                position: "top"
              }
            },

          ],
          colors: ['#FFCE60', '#EF861D'],
          dataLabels: {
            enabled: true,
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                colors: undefined
            }
          }
        };
      }else {
        this.nodataFound = true;
        console.log("Something Went Wrong ");

      }
    } ,(error) => {
      this.nodataFound = true;
      console.log("Printing the Error Code ");

    })
  }

  getDailyPassPiechartData(){
    this.chartOptions = {}
    this.dashboradService.barChartWalkinCheckinCheckout().subscribe(data =>{
      if(data?.data?.totalCheckInCount > 0){
        this.flaggeEmitter.emit(data.data.totalFlaggedCount)
        this.nodataFound = false;
        this.chartOptions = {
          series: [data?.data?.totalCheckoutCount, data?.data?.totalInPremisesCount],
          chart: {
            type: "donut"
          },
          plotOptions: {
            pie: {
              startAngle: -90,
              endAngle: 90,
              offsetY: 10
            }
          },
          legend: {
            // show:true,
            // position: 'bottom',
            // horizontalAlign: 'left'
          
            formatter: function(val: any, opts: any) {              
              if( val != "Check-in "+data?.data?.totalCheckInCount){
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
              }else{
                return "Check-in - "+data?.data?.totalCheckInCount
              }
            },
           
          },
          labels: ["Check-out", "Inside Premises", "Check-in " + data?.data?.totalCheckInCount],
          fill: {
            colors: ['#2E3092', '#F78958',"#FBC4AB"],
            opacity: 1,
            type: 'solid',
            gradient: {
              shade: 'dark',
              type: "horizontal",
              shadeIntensity: 0.5,
              gradientToColors: undefined,
              inverseColors: true,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 100],
              colorStops: []
            }
          },
          responsive: [
            {
              show: false,
              // legend: {
              //   position: "top"
              // }
            },

          ],
          colors: ['#2E3092', '#F78958',"#FBC4AB"],
          dataLabels: {
            enabled: false,
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                colors: undefined
            }
          }
        };
      }else {
        this.nodataFound = true;
        console.log("Something Went Wrong ");

       }
    } ,(error) => {
      this.nodataFound = true;
      console.log("Printing the Error Code ");

    })
  }
}


