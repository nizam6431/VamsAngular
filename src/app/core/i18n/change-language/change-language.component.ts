import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Select2OptionData } from 'ng-select2';
import { optionsConfig } from 'ngx-mask';
import { first } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { ThemeService } from 'src/app/core/services/theme.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.css']
})
export class ChangeLanguageComponent implements OnInit {
  languages: any[] = [];
  selectedLanguage: any;
  allLanguages: any[] = [];
  public options: any;
  constructor(private translateService: TranslateService,
    private dialogService: NgbModal,
    private commonService: CommonService,
    private themeService: ThemeService) {

    this.options = {
      templateResult: this.templateResult,
      templateSelection: this.templateSelection,
      dropdownCssClass:"language-background"
    };
    this.commonService.getLanguages(environment.CompanyAPIURL,
      environment.CompanyId).pipe(first()).subscribe(data => {
        this.allLanguages = data.Data;
        data.Data.forEach((element: any) => {
          this.languages.push({
            id: element.Abbrevation,
            text: element.Language
          });
        });
        this.selectedLanguage = this.translateService.currentLang;
      });
  }

  ngOnInit(): void {

  }

  setLanguage() {
    var selectedLang = this.allLanguages.filter(item => item.Abbrevation == this.selectedLanguage);
    if (this.translateService.currentLang !== this.selectedLanguage) {
      this.translateService.use(this.selectedLanguage);
      this.themeService.updateLanguageAndSetTheme(this.selectedLanguage, selectedLang[0].IsRTL);
    }
    this.dialogService.dismissAll('');
  }

  closeModal() {
    this.dialogService.dismissAll('');
  }

  public templateResult = (state: Select2OptionData): JQuery | string => {
    if (!state.id) {
      return state.text;
    }

    var abbr = state.id.split('-')[1];
    return jQuery('<span><span class="flag-icon flag-icon-' + abbr.toLocaleLowerCase() + ' flag-icon-squared" style="margin-right: 7px;"></span>' + state.text + '</span>');
  }

  public templateSelection = (state: Select2OptionData): JQuery | string => {
    if (!state.id) {
      return state.text;
    }
    var abbr = state.id.split('-')[1];
    return jQuery('<span><span class="flag-icon flag-icon-' + abbr.toLocaleLowerCase() + ' flag-icon-squared" style="margin-right: 7px;"></span>' + state.text + '</span>');
  }
}
