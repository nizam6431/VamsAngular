import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';

@Component({
  selector: 'app-walkin-visitor-checkin',
  templateUrl: './walkin-visitor-checkin.component.html',
  styleUrls: ['./walkin-visitor-checkin.component.scss']
})
export class WalkinVisitorCheckinComponent implements OnInit {
  @Input() columns;
  displayColumns :any;
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  columnKeys: any;
  @Input() dataSource;
  @Input() originalpostDocumentData;
  @Input() totalCount;
  @Input() timeChange: any;
  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  pageSize: defaultVal.pageSize;
  sortingDir: string = "";
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayColumns = this.columns

    if (changes && changes.dataSource&& changes.dataSource.currentValue) {
      this.dataSource = changes.dataSource.currentValue;
    }
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
    }
  }
  ngOnInit(): void {
    this.pageSizeOptions = Object.keys(pagination).filter((k) => typeof pagination[k] === "number").map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "ASC";
    this.columnKeys = this.columns.map((data) => data.key);
  }

}
