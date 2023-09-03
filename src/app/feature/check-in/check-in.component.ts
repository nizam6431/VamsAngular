import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  url: any = '';
  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private commonService: CommonService,
    private router: Router
  ) { 
    this.url = this.router.url;
    let urls = this.url.split('/');
    if( urls[urls.length - 1] == "checkIn" ){
      this.translateService.get(['grid_side_menu.check_in'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['grid_side_menu.check_in'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
    }else{
      this.translateService.get(['grid_side_menu.check_out'])
    .pipe(first())
    .subscribe(
      translations => {
        let title = translations['grid_side_menu.check_out'];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
    }
    
  }

  ngOnInit(): void {
  }

}
