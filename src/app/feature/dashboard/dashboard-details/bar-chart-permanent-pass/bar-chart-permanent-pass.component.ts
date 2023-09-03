import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ChartComponent } from "ng-apexcharts";
import { ProductTypes } from "src/app/core/models/app-common-enum";
import { UserService } from "src/app/core/services/user.service";
import { DashBoradSerivce } from "../../dashborad.service";
export type ChartOptions = {
  series: any;
  chart: any;
  dataLabels: any;
  title: any;
  colors: any;
  responsive: any;
  plotOptions: any;
  stroke: any;
  xaxis: any;
  fill: any;
  legend: any;
  yaxis:any,
};

@Component({
  selector: "app-bar-chart-permanent-pass",
  templateUrl: "./bar-chart-permanent-pass.component.html",
  styleUrls: ["./bar-chart-permanent-pass.component.scss"],
})
export class BarChartPermanentPassComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @Input() timeChange: any;
  @Input() locationId: number;
  @Input() locationEventEmitter;
  seriesData1: any[] = [];
  seriesData2: any[] = [];
  seriesData3: any[] = [];
  tenatName: any[] = [];
  noDataFound: boolean;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow: any;
  chekInData:any;
  chekOutData: any;
  categoryId: any;
  checkInCategoryId: any;
  CheckOutCategoryId: any;
  categoryName: any;
  inPremisesData: any;
  @Input() refreshAppApi:any;
  constructor(
    private dashboradService: DashBoradSerivce,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.productType = this.userService.getProductType();
    this.SeepzWorkFlow = this.userService.getWorkFlow();
  }

  ngOnInit(): void {
    // if (this.SeepzWorkFlow) {
    //   this.getPermanentPassCheckInCheckout();
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (this.SeepzWorkFlow) {
      this.getPermanentPassCheckInCheckout();
    }
  }
  getPermanentPassCheckInCheckout() {
    this.seriesData1 = [];
    this.seriesData2 = [];
    this.seriesData3 = [];
    this.tenatName = [];
    this.chartOptions = {};
    let height;
    this.dashboradService
      .barChartWalkinPermanentPassCheckinCheckout().subscribe((data) => {
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
              colors: ["#FBC4AB", "#5C791B", "#F78958"],
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
                    filename: "Permanent-Pass-Bar-chart",
                  },
                  png: {
                    filename: "Permanent-Pass-Bar-chart",
                  },
                  csv: {
                    filename: "Permanent-Pass-Bar-chart",
                  },
                },
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top",
                },
              },
            },
            dataLabels: {
              enabled: true,
              offsetY: -20,
              style: {
                fontSize: "12px",
                fontWeight: "bold",
                colors: ["#373D3F"],
              },
            },
            xaxis: {
              categories: this.tenatName,

              scrollbar: {
                enabled: true,
              },
              markers: {
                colors: ["#FBC4AB", "#5C791B", "#F78958"],
              },
              labels: {
                show: true,
                rotate: -20,
                rotateAlways: true,
                hideOverlappingLabels: false,
                trim: false
              },
              title: {
                offsetX: 0,
                offsetY: 0,
                style: {
                    fontSize: '12px',
                    wordWrap: 'break-word'
                },
              },
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
            colors: ["#FBC4AB", "#5C791B", "#F78958"],
          };
          }else{
            this.noDataFound=true
          }
        },
        (error) => {
          this.noDataFound = true;
          console.log("error in api ");
        }
      );
  }
}
