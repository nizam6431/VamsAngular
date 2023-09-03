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
    this.translateService.get(['card.Title'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['card.Title'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }

  ngOnInit(): void {
  }

}
