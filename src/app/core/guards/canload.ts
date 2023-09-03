import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { Router, CanLoad, ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../auth/services/config.service';
import { ScriptService } from '../services/script.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class UpdateCompanyInfo implements CanLoad {
    //add all optional paths here to check
    optionalRoutes = ['appointments', 'auth', 'hsq', 'master','configure']
    constructor(
        private themeService: ThemeService,
        private scriptService: ScriptService,
        private router: Router,
        private configService: ConfigService,
        private userService: UserService
    ) { }

    canLoad(_route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        if (window.location.hostname.split('.')[0] == "sysadmin") {
            return this.configService.setSuperadmin()
        } else {
            if (!this.userService.getUserData()) {
                return this.configService.getMasterDetails().pipe(first());
            }
            return true;
        }

        // else if (this.userService.getUserData()) {
        //     return true;
        // } else {
        //     // this.router.navigate(['/auth/login']);
        //     return true;
        // }
        // if ((this.optionalRoutes.includes(_route['path'])) && environment.CompanyAPIURL == "") {
        //     return this.configService.getMasterDetails().pipe(first());
        // } else if (_route['path'] !== 'auth' && this.userService.getUserData()) {
        //     return true;
        // }
        // this.router.navigate(['/auth/login']);
        // return false;
    }
}