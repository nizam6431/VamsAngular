import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private commonService: CommonService,
  ) { 
    this.translateService.get(['grid_side_menu.pass_request'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['grid_side_menu.pass_request'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }

  ngOnInit(): void {
  }

}
