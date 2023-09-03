import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateCacheModule, TranslateCacheService, TranslateCacheSettings } from 'ngx-translate-cache';
import { CommonService } from '../services/common.service';
import { first } from 'rxjs/operators';
import { ThemeService } from '../services/theme.service';
import { environment } from 'src/environments/environment';
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms/';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { ProductTypes } from '../models/app-common-enum';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelect2Module,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TranslateCacheModule.forRoot({
      cacheService: {
        provide: TranslateCacheService,
        useFactory: translateCacheFactory,
        deps: [TranslateService, TranslateCacheSettings]
      },
      cacheName: 'mylang', // default value is 'lang'.
              cacheMechanism: 'LocalStorage', // default value is 'LocalStorage'.
              cookieExpiry: 1, // default value is 720, a month.
    })
  ],
  exports: [TranslateModule,
  ChangeLanguageComponent],
  declarations: [
    ChangeLanguageComponent
  ]
})
export class I18nModule {
  ProductType = ProductTypes;
  constructor(translate: TranslateService,
    translateCacheService: TranslateCacheService,
    private userService: UserService,) {
    translateCacheService.init();
    translate.setDefaultLang('en-US');
    var cachedLanguage = translateCacheService.getCachedLanguage();
    var language = cachedLanguage != null || cachedLanguage != undefined ? cachedLanguage : 'en-US';
    translate.use(language);
  }
}

export function translateLoaderFactory(httpClient: HttpClient) {
  //return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');

  // HACK - we are not geeting product type , we need to resolve

  if(environment.productType !== 'Enterprise' && environment.productType !== 'Hospital' ) {
    return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
  } else {
    return new TranslateHttpLoader(httpClient, './assets/i18n/Enterprise/', '.json');
  }
}

export function translateCacheFactory(
  translateService: TranslateService,
  translateCacheSettings: TranslateCacheSettings
) {
  return new TranslateCacheService(translateService, translateCacheSettings);
}