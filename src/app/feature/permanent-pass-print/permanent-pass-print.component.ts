import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-permanent-pass-print',
  templateUrl: './permanent-pass-print.component.html',
  styleUrls: ['./permanent-pass-print.component.scss']
})
export class PermanentPassPrintComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private commonService: CommonService,
  ) {
    this.translateService.get(['grid_side_menu.permanent_pass_print'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['grid_side_menu.permanent_pass_print'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
   }

  ngOnInit(): void {
  }

}
