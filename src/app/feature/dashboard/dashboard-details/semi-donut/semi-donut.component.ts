import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../../dashborad.service';

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
};
@Component({
  selector: 'app-semi-donut',
  templateUrl: './semi-donut.component.html',
  styleUrls: ['./semi-donut.component.scss']
})
export class SemiDonutComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() locationId :number 
  @Input() locationEventEmitter;
  @Input() timeChange: any;
  @Input() refreshAppApi:any;
  @Output() flaggeEmitter1 = new EventEmitter()
  nodataFound: boolean;
  SeepzWorkFlow: any;
 
  constructor(
    private dashboradService: DashBoradSerivce,
    private userService: UserService,private translate: TranslateService
  ) {
    this.SeepzWorkFlow = this.userService.getWorkFlow();
   }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.SeepzWorkFlow){
      this.getPermanentPassPiechartData();
    }
  }
  getPermanentPassPiechartData(){
    this.chartOptions = {}
    this.dashboradService.barChartWalkinPermanentPassCheckinCheckout().subscribe(data =>{
      if(data?.data?.totalCheckInCount > 0){
        this.flaggeEmitter1.emit(data.data.totalFlaggedCount)
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
            formatter: function(val: any, opts: any) {              
              if( val != "Check-in "+data?.data?.totalCheckInCount){
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
              }else{
                return "Check-in - "+data?.data?.totalCheckInCount
              }
            }
          },
          labels: ["Check-out", "Inside Premises", "Check-in " + data?.data?.totalCheckInCount],
          fill: {
            colors: ['#5C791B', '#F78958',"#FBC4AB"],
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
          colors: ['#5C791B', '#F78958',"#FBC4AB"],
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
