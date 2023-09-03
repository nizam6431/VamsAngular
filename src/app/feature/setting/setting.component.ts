import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(private titleService: Title,
    private translateService: TranslateService,
    private commonService: CommonService) {
    this.translateService.get(['Setting.Setting_Title'])
  .pipe(first()).subscribe(
    translations => {
      let title = translations['Setting.Setting_Title'];
      this.titleService.setTitle(title);
      this.commonService.setTitle(title);
    });
  }

  ngOnInit(): void {
  }

}
