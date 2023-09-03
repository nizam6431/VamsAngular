import { DatePipe, registerLocaleData } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";


@Pipe({
    name: 'localizedDatePipe',
    pure: false
})
export class LocalizedDatePipe implements PipeTransform {
    constructor(private translateService: TranslateService, private datePipe: DatePipe) { 

    }

    transform(value: any, pattern: string = 'mediumDate'): any {
        return this.datePipe.transform(value, pattern, undefined, this.getLocale());
    }

    getLocale() {
        if (this.translateService.currentLang == 'ar-AE') {
          return "ar"
        }
        if (this.translateService.currentLang == 'hn-IN') {
          return "hi"
        }
    
        if (this.translateService.currentLang == 'en-US') {
          return "en"
        }
        return "en";
      }
}