import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { first } from "rxjs/operators";
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-seepz-general-ledger',
  templateUrl: './seepz-general-ledger.component.html',
  styleUrls: ['./seepz-general-ledger.component.scss']
})
export class SeepzGeneralLedgerComponent implements OnInit {
  userDetails: any;
  roleName: any;
  constructor(
    private titleService: Title,
    private translate: TranslateService,
    private commonService: CommonService,
    private userService :UserService,
  ) { 

    this.roleName = this.userService.getRolName()
    if(this.roleName === 'Level1Admin'){
    this.translate.get(["AppointmentDetails.Appointments_Title"]) .pipe(first()).subscribe((translations) => {
         this.titleService.setTitle("Company Account Ledger");
         this.commonService.setTitle("Company Account Ledger");
    });
  }else{
    this.translate.get(["AppointmentDetails.Appointments_Title"]) .pipe(first()).subscribe((translations) => {
      this.titleService.setTitle(" Account Balance and Ledger details");
      this.commonService.setTitle("Account Balance and Ledger details");
    });
  }
  }

  ngOnInit(): void {
  }

}
