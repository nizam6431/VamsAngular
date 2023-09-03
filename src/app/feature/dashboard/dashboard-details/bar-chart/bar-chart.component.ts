import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChartComponent } from 'ng-apexcharts';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { DashBoradSerivce } from '../../dashborad.service';
export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  title: any;
  colors: any;
  responsive: any;
  plotOptions: any;
  stroke: any;
  xaxis: any
  fill:any,
  legend:any,
  yaxis:any,
};
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() timeChange: any;
  @Input() locationId :number 
  @Input() locationEventEmitter;
  @Input() refreshAppApi;
  seriesData1: any[]=[];
  seriesData2: any[]=[];
  seriesData3: any[]=[];
  tenatName: any[]=[];
  noDataFound: boolean;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow: any;
  dailyPassData: any[];
  chekInData: any;
  checkInCategoryId: any;
  categoryName: any;
  chekOutData: any;
  CheckOutCategoryId: any;
  inPremisesData: any;

  simpleChangeRec: string;
  constructor(private dashboradService: DashBoradSerivce,
    private userService: UserService,private translate: TranslateService) {
    this.productType = this.userService.getProductType();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
   }

  ngOnInit(): void {
    // if(this.productType == 'Commercial'){
    //   this.getBarchartData()
    // }else{
    //   this.getBarchartDataEnterprise();
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes,'changes')
    if(this.SeepzWorkFlow){
      this.getDailyPassCheckInCheckout();  
    }
    else{
      if(this.productType == 'Enterprise'){
        this.getBarchartDataEnterprise();
      }
      else{
        this.getBarchartData()
      }
    }
  }

  getBarchartData() {
    this.seriesData1=[]
    this.seriesData2=[]
    this.tenatName=[];
    this.chartOptions={};
    let heights; console.warn(this.timeChange);
    this.dashboradService.barChartService(this.timeChange).subscribe(data => {
      if (!data?.message && !data.errors && data?.data?.list.length>0) {
        this.noDataFound=false
      data?.data?.list.forEach(element => {
        
      this.seriesData1.push(element.scheduleCount)
      this.seriesData2.push(element.walkinCount)
      this.tenatName.push(element.tenantName)
      });
      // this.seriesData1 = [];
      // this.seriesData2 = [];
      // this.tenatName = [];
console.warn(this.seriesData1, this.seriesData2, this.tenatName);
// let as = [2,3,4,4,5,2,3,4,4,5,2,3,4,4,5,2,3,4,4,5,2,3,4,4,5,2,3,4,4,5,2,3,4,4,5,2,3,4,4,5];
// let ass = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','w','x','y','z','w','x','y','z','w','x','y','z','y','z'];
// this.seriesData1 = as;
// this.seriesData2 = as;
// this.tenatName = ass;
heights = ( this.seriesData1.length > 50 ) ? 3000 : 700;
      this.chartOptions = {
        series: [
          {
            name: "Scheduled",
            data: this.seriesData1
          },
          {
            name: "Walkin",
            data: this.seriesData2
          }
        ],
        fill: {
          colors: ['#FFCE60', '#EF861D'],
          opacity: 1,
          type: 'solid',
          gradient: {
            // shade: 'dark',
            // type: "horizontal",
            // shadeIntensity: 0.5,
            // gradientToColors: undefined,
            // inverseColors: true,
            // opacityFrom: 1,
            // opacityTo: 1,
            // stops: [0, 50, 100],
            // colorStops: []
          }
        },
        chart: {
          type: "bar",
           height: heights,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: "top"
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -10,
          style: {
            fontSize: "10px",
            colors: ["#FFCE60"]
          }
        },
        // stroke: {
        //   // show: true,
        //   width: 1,
        //   colors: ["#EF861D"]
        // },
        xaxis: {
          categories: this.tenatName,
  
          scrollbar: {
            enabled: true
          },
          markers: {
            colors: ['#FFCE60', '#EF861D']
          }
        },
        colors: ['#FFCE60', '#EF861D']
  
      }
    }else{
      this.noDataFound=true
    }

    },(error)=>{
      this.noDataFound=true
      // console.log("error in api ");
      
    })
  }

  getBarchartDataEnterprise(){
    this.seriesData1=[]
    this.seriesData2=[]
    this.tenatName=[];
    this.chartOptions={};
    let height;
    this.dashboradService.barChartServiceEnterprise(this.timeChange,this.locationId).subscribe(data=>{
      if (!data?.message && !data.errors && data?.data?.level2.length>0) {
        this.noDataFound=false
      data?.data?.level2.forEach(element => {
        //let height = 700;
        height = ( this.locationId.toString().length < 4 )? 200: 700;
      this.seriesData1.push(element.preSchedule)
      this.seriesData2.push(element.walkIn)
      this.tenatName.push(element.name)
      });

      this.chartOptions = {
        series: [
          {
            name: "Scheduled",
            data: this.seriesData1
          },
          {
            name: "Walkin",
            data: this.seriesData2
          }
        ],
        fill: {
          colors: ['#FFCE60', '#EF861D'],
          opacity: 1,
          type: 'solid',
          gradient: {
            // shade: 'dark',
            // type: "horizontal",
            // shadeIntensity: 0.5,
            // gradientToColors: undefined,
            // inverseColors: true,
            // opacityFrom: 1,
            // opacityTo: 1,
            // stops: [0, 50, 100],
            // colorStops: []
          }
        },
        chart: {
          type: "bar",
           height: height,
           toolbar: {
            export: {
              svg: {
                filename: 'Bar-chart',
              },
              png: {
                filename: 'Bar-chart',
              },
              csv: {
                filename: 'Bar-chart',
              }
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: "top"
            }
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -10,
          style: {
            fontSize: "12px",
            fontWeight: 'bold',
            colors: ["#fff"]
          }
        },
        // stroke: {
        //   // show: true,
        //   width: 1,
        //   colors: ["#EF861D"]
        // },
        xaxis: {
          categories: this.tenatName,
  
          scrollbar: {
            enabled: true
          },
          markers: {
            colors: ['#FFCE60', '#EF861D']
          }
        },
       colors: ['#FFCE60', '#EF861D']
  
      }
    }else{
      this.noDataFound=true
    }
    },(error)=>{
      this.noDataFound=true
      // console.log("error in api ");
      
    })
  }

  
  getDailyPassCheckInCheckout(){
    this.seriesData1=[]
    this.seriesData2=[]
    this.seriesData3=[]
    this.dailyPassData =[];
    this.tenatName=[];
    this.chartOptions={};
    let yAxisMin;
    let yAxisMax;
    this.dashboradService.barChartWalkinCheckinCheckout().subscribe(data=>{
      if(data.data.checkedIn.length > 0){
        this.noDataFound = false;
      
      for(var i = 0 ; i < data.data.checkedIn.length ; i++){
          this.chekInData = data.data.checkedIn[i]
          let checkInCount = this.chekInData.count
          this.checkInCategoryId = this.chekInData.categoryId
          this.categoryName = this.chekInData.categoryName
          this.tenatName.push(this.categoryName)
          this.seriesData1.push(checkInCount)
        }
         this.chekOutData = data.data.checkedOut
        for(var j = 0 ; j < data.data.checkedIn.length ; j++){
          let checkOutCount = 0
          if( j < this.chekOutData.length ){
            let result = data.data.checkedIn.find(item => item.categoryId === this.chekOutData[j].categoryId);
            let result2 = this.chekOutData.find(item => item.categoryId === result.categoryId);
            checkOutCount = result2.count
          }else{
            checkOutCount = 0
          }
          this.seriesData2.push(checkOutCount)
        }
        this.inPremisesData = data.data.inPremises
        for(var k = 0 ; k < data.data.checkedIn.length ; k++){
          let checkOutCount = 0
          if( k < this.inPremisesData.length ){
            let result = data.data.checkedIn.find(item => item.categoryId === this.inPremisesData[k].categoryId);
            let result2 = this.inPremisesData.find(item => item.categoryId === result.categoryId);
            checkOutCount = result2.count
          }else{
            checkOutCount = 0
          }
          this.seriesData3.push(checkOutCount)
        }  
        this.chartOptions = {
          series: [
            {
              name: "Check-in",
              data: this.seriesData1,
            },
            {
              name: "Check-out",
              data: this.seriesData2,
            },
            {
              name: "Inside premises",
              data: this.seriesData3,
            },
          ],
          fill: {
            colors: ["#FBC4AB", "#2E3092", "#F78958"],
            opacity: 1,
            type: "solid",
            gradient: {},
          },
          legend: {
            position: "top",
            offsetX: 40,
          },
          chart: {
            type: "bar",
            height: 200,
            toolbar: {
              export: {
                svg: {
                  filename: "Daily-Pass-Bar-chart",
                },
                png: {
                  filename: "Daily-Pass-Bar-chart",
                },
                csv: {
                  filename: "Daily-Pass-Bar-chart",
                },
              },
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              dataLabels: {
                position: "top",
                //enabled: false,
              },
            },
          },
          dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
              fontSize: "12px",
              fontWeight: "bold",
              colors: ["#000"],
            },
          },
          xaxis: {
            categories: this.tenatName,

            scrollbar: {
              enabled: true,
            },
            markers: {
              colors: ["#FBC4AB", "#2E3092", "#F78958"],
            },
            labels: {
              show: true,
              rotate: -20,
              rotateAlways: true,
              hideOverlappingLabels: false,
              trim: false,
            },
            title: {
              offsetX: 0,
              offsetY: 0,
              style: {
                  fontSize: '12px',
                  wordWrap: 'break-word'
              },
            },
            decimalsInFloat: 0,
          },
          yaxis: [
            {
              labels: {
                formatter: function(val) {
                  return val.toFixed(0);
                }
              }
            }
          ],
          colors: ["#FBC4AB", "#2E3092", "#F78958"],
        };
    }else{
      this.noDataFound=true
    }
    },(error)=>{
      this.noDataFound=true
      console.log("error in api ");
      
    })
  }
  

}