import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dashboard-filters',
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.css']
})
export class DashboardFiltersComponent implements OnInit {

  isShowSearchFilter = false;
  isShowStatusFilter = true;
  searchTexts: string = '';
  status: string = 'All';

  @Output() sendStatus = new EventEmitter<string>();
  @Output() sendSearchTexts = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  showSearchFilter() {
    this.isShowStatusFilter = false;
    this.isShowSearchFilter = true;
  }

  showStatusFilter() {
    this.isShowSearchFilter = false;
    this.isShowStatusFilter = true;
  }

  statusChanged(){
    this.sendStatus.emit(this.status);
  }

  searchTextEnterKey(){
    this.sendSearchTexts.emit(this.searchTexts);
  }
}
