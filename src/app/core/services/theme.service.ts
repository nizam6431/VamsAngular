import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private currentThemeSubject: BehaviorSubject<any>;
    constructor(private translate: TranslateService) {
        this.currentThemeSubject = new BehaviorSubject<any>(localStorage.getItem('currentTheme'));
    }

    public get currentThemeValue(): any {
        return (localStorage.getItem('currentTheme') == null || localStorage.getItem('currentTheme') == 'null') ? "style.css" : localStorage.getItem('currentTheme');
    }
    
    loadStyle(styleName: string) {
        //localStorage.setItem('currentTheme', styleName);
        const head = document.getElementsByTagName('head')[0];
        let themeLink = document.getElementById(
            'client-theme'
        ) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = styleName;
        } else {
            const style = document.createElement('link');
            style.id = 'client-theme';
            style.rel = 'stylesheet';
            style.href = `${styleName}`;
            head.appendChild(style);
        }
    }

    loadMenuStyle(styleName: string) {
        const head = document.getElementsByTagName('head')[0];
        let themeLink = document.getElementById(
            'client-menu-theme'
        ) as HTMLLinkElement;
        if (themeLink) {
            themeLink.href = styleName;
        } else {
            const style = document.createElement('link');
            style.id = 'client-menu-theme';
            style.rel = 'stylesheet';
            style.href = `${styleName}`;
            head.appendChild(style);
        }
    }

    updateLanguageAndSetTheme(languageAbbrevation: string, isRTL: boolean) {
        // if (this.translate.currentLang !== languageAbbrevation) {
             this.translate.use(languageAbbrevation);
            if (this.currentThemeValue.indexOf("style-dark") > -1) {
                if (isRTL) {
                    this.loadStyle("style-dark-rtl.css");
                    this.loadMenuStyle("menu-dark-rtl.css");
                }
                else {
                    this.loadStyle("style-dark.css");
                    this.loadMenuStyle("menu-dark.css");
                }
            }
            else {
                if (isRTL) {
                    this.loadStyle("style-rtl.css");
                    this.loadMenuStyle("menu-rtl.css");
                }
                else {
                    this.loadStyle("style.css");
                    this.loadMenuStyle("menu.css");
                }
            }
        //}
    }
}
