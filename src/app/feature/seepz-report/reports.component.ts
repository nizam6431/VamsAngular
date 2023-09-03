import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { first } from "rxjs/operators";
import { CommonService } from "../../core/services/common.service";

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  constructor(
    private titleService: Title,
    private translate: TranslateService,
    private commonService: CommonService,
    private router: Router,

  ) { 
    this.translate
    .get(["AppointmentDetails.Appointments_Title"])
    .pipe(first())
    .subscribe((translations) => {
      // TODO set langauge token for this  
      // let title = translations["AppointmentDetails.Appointments_Title"];
      this.titleService.setTitle("Reports");
      this.commonService.setTitle("Reports");
    });
  }

  ngOnInit(): void {
  }
}
