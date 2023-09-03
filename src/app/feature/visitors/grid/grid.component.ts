import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { VisitorsService } from '../services/visitors.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  public pageSizeOptions= [];
  public pageIndex: 1;
  
  @Input() pageSize: number;
  @Input() displayedColumns: any;
  @Input() dataSource: any;
  @Input() totalData: any;
  @Input() cssClass: string;
  @Input() showToggle: boolean = false;
  @Output() unblockUserclick = new EventEmitter<any>();
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Input() type: any;
  @Input() visitorScheduleDetails: any
  @Input() visitorDataShowType:any;
  columns: any;
  sortingDir: string = '';
  searchKey: string = "";
  sortingColumn: string = "";
  public hasSearchValue: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  unblockData: any;
  levelType :any;
  
  constructor(private userService: UserService,
    private visitorsService: VisitorsService) { }


  ngOnInit(): void {  
    console.log(this.dataSource);
    this.checkLevel();
    this.pageSizeOptions = Object.keys(pagination)
      .filter(k => typeof pagination[k] === 'number')
      .map(label => pagination[label])
    // this.pageSize = defaultVal.pageSize;
    this.sortingDir = 'asc';
    this.sortingColumn = this.displayedColumns && this.displayedColumns[0] && this.displayedColumns[0].key ? this.displayedColumns[0].key : "Name";

    if(this.visitorDataShowType == 'allVisitor')
    this.totalData= 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.displayedColumns)
      this.columns = this.displayedColumns.map(data => data.key)

    if ('dataSource' in changes) {
      let data = changes.dataSource.currentValue;
      this.dataSource = new MatTableDataSource(data);
      this.sortPagination();
    }
  }
  ngAfterViewInit() {
    this.sortPagination();
  }

  ngAfterViewChecked(): void {
    
  }

  // cleanSearchBox(event) {
  //   const filterValue = event.value = "";
  //   this.applyFilter(filterValue);
  // }

  sortPagination() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  getRowData(data: any, type: string) {
    this.rowClick.emit(data);
  }

  getPaginationData(event) {
    this.pageIndex = (this.pageSize == event.pageSize) ? event.pageIndex + 1 : defaultVal.pageIndex;
    if(this.pageSize != event.pageSize) {
      this.paginator.firstPage();
    }
    this.pageSize = event.pageSize;
    this.onDataChange.emit({type: this.type, pageSize: this.pageSize, pageIndex: this.pageIndex,searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.sortPagination();
  }

  isSticky(column: string) {
    // return column === 'test2' || column === 'test3' ? true : false;
    return false;
  }
  unblockUser(row, event) {
    event.stopPropagation(); 
    row.visitorDataShowType = this.visitorDataShowType;  
    this.unblockUserclick.emit(row);
  }
  checkLevel(){
    if(this.userService.getLevel2Id()){
      this.levelType = 'level2'
    }
    else if( this.userService.getLevel3Id()){
      this.levelType ='level3'
    }
    else{
      this.levelType ='level1'
    }
  }
  sortData(name) {
    this.sortingDir = name.direction;
    this.sortingColumn = name.active;
    this.onDataChange.emit({type: this.type, globalSearch: this.searchKey, searchStatus: null, orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.paginator.firstPage();
    // this.sortPagination();
  }
  searchFilter() {
    // this.pageSize = defaultVal.pageSize;
    this.pageIndex = defaultVal.pageIndex;
    this.onDataChange.emit({type: this.type, globalSearch: this.searchKey, searchStatus: null,orderBy: this.sortingColumn, sortBy: this.sortingDir })
    this.paginator.firstPage();
    this.sortPagination();
  }
  
  // applyFilter(filterValue) {
  //   if(this.hasSearchValue) {
  //     this.searchKey = filterValue.trim().toLowerCase();
  //     this.searchFilter()
  //   }
  //   if(filterValue.length==0){
  //     this.hasSearchValue = false;
  //   }else{
  //     this.hasSearchValue = true;
  //     // this.searchFilter()
  //   }
  // }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
}
