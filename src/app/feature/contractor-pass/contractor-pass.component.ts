import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from "@angular/platform-browser";
import { CommonService } from 'src/app/core/services/common.service';
import { first } from "rxjs/operators";


@Component({
  selector: 'app-contractor-pass',
  templateUrl: './contractor-pass.component.html',
  styleUrls: ['./contractor-pass.component.scss']
})
export class ContractorPassComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private commonService: CommonService,
  ) { 
    this.translateService.get(['ContractorPass.Title'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['ContractorPass.Title'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }

  ngOnInit(): void {
  }

}
