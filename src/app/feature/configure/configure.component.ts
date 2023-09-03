import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent implements OnInit {

  constructor(private titleService: Title,
    private translateService: TranslateService,
    private commonService: CommonService) {
    this.translateService.get(['Configure.Configure_Title']).pipe(first()).subscribe(
    translations => {
      let title = translations['Configure.Configure_Title'];
      this.titleService.setTitle(title);
      this.commonService.setTitle(title);
    });
  }

  ngOnInit(): void {
      
  }
}
