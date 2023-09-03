import {
  Component
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../../core/services/common.service";
import { first } from "rxjs/operators";
declare var $: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent {

  constructor(
    private titleService: Title,
    private commonService: CommonService,
    private translate: TranslateService
  ){
    this.translate
      .get(["Dashboard.Dashboard_Title"])
      .pipe(first())
      .subscribe((translations) => {
        let title = translations["Dashboard.Dashboard_Title"];
        this.titleService.setTitle(title);
        this.commonService.setTitle(title);
      });
  }
}
