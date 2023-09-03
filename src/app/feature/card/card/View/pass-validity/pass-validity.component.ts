import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pass-validity',
  templateUrl: './pass-validity.component.html',
  styleUrls: ['./pass-validity.component.scss']
})
export class PassValidityComponent implements OnInit {
  @Input() columns;
  @Input() dateFormat;
  displayColumns :any;
  // dataSource:any ;
  @Output() rowData = new EventEmitter();
  @Output() validityEvent = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  @Input() type;
  @Input() todayDate;
  @Input() expire;
  @Input() dataSource;
  @Input() resetLocation = false;
  @Input() displayedColumns;
  @Input() totalCount;
  @Input() pageSizeCount;
  columnKeys: any;
  tempDate: any;
  selectedRowIndex:number=-1;
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.dataSource)
    this.columnKeys = this.columns.map((data) => data.key);
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.dataSource)
    this.tempDate = this.todayDate;
    this.dataSource.map(element => {
  this.selectedRowIndex=-1;
    
      element.checked = false;
   })
  }
  diplayRow(element, i) {
    // console.log(i)
    this.selectedRowIndex=i
     this.todayDate = this.tempDate;
    // console.log(this.todayDate)
    this.dataSource.map(ele => {
      if (ele.validity === element.validity) {
        ele.checked = true;
        ele.format = true;
      } else {
        ele.checked = false;
        ele.format = false;
      }
    })
    //  console.log(this.dataSource)
     this.validityEvent.emit(element)
  }
  changeValidity(element) {
    this.todayDate = this.tempDate;
    // console.log(this.todayDate)
    this.dataSource.map(ele => {
      if (ele.validity === element.validity) {
        ele.checked = true;
        ele.format = true;
      } else {
        ele.checked = false;
        ele.format = false;
      }
    })


    // if (element.validity != "365 Days") {
    //   let diff = element.validityInDays - 1;
    //   let newDate = myDate.setDate(myDate.getDate() + diff);
    //   this.dataSource.map(ele => {
    //     if (ele.validity == element.validity) {
    //       console.log(newDate)
    //       ele.expireDate = newDate;
    //       ele.format = true;
    //       result = ele;
    //     }
    //   })
    // } else {
    //   let diff = element.validityInDays - 1;
    //   let newDate = myDate.setDate(myDate.getDate() + diff);
    //   this.dataSource.map(ele => {
    //      console.log(newDate)
    //     if (ele.validity == element.validity) {
    //       ele.expireDate = newDate;
    //       ele.format = true;
    //       result = ele;
    //     }
    //   })

    // 
  }
}
