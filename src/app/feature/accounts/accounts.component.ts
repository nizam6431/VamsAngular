import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { TranslateService } from "@ngx-translate/core";
import { first } from "rxjs/operators";
import { CommonService } from "../../core/services/common.service";
import { AccountFormComponent } from './account-form/account-form.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  buttonClicked: string = "";

  type: string;
  selectedComplexName: string;
  hasSearchValue: boolean = false;
  searchKey: string = "";
  searchfilter: any;

  constructor(
    public dialog: MatDialog,
    private titleService: Title,
    private translate: TranslateService,
    private commonService: CommonService,
  ) {
    this.translate.get(["titles.accounts"]).pipe(first()).subscribe((translations) => {
      let title = translations["titles.accounts"];
      this.titleService.setTitle(title);
      this.commonService.setTitle(title);
    });
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      // width: '80%',
      height: '100%',
      position: { right: '0' },
      data: { "data": null, "formType": "company", "mode": "add" },
      panelClass: ['animate__animated', 'vams-dialog-xl', 'animate__slideInRight']
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      this.dialogClosed(result);
    });
  }
  dialogClosed(statusObj) {
    if (statusObj && statusObj.status && statusObj.type == 'company') {
      // this.getCompanyList();
    }
  }
  typeChanged(event) {
    this.type = event
    this.buttonClicked = "";
  }

  buttonClickEvent(event?: string) {
    this.hasSearchValue = false;
    this.buttonClicked = event;
  }

  selectedComplex(event?: string) {
    this.selectedComplexName = event
  }

  applyFilter(filterValue) {
    if (this.hasSearchValue) {
      this.searchKey = filterValue.trim().toLowerCase();
      this.searchFilter();
    }
    if (filterValue.length == 0) {
      this.hasSearchValue = false;
    } else {
      this.hasSearchValue = true;
    }
  }
  searchFilter() {
    this.searchfilter = {serach :true,searchKey: this.searchKey}
  }

  cleanSearchBox(event) {
    const filterValue = (event.value = "");
    this.applyFilter(filterValue);
  }
}
