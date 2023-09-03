import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { observable, Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { ConfigService } from '../auth/services/config.service';


@Injectable({
    providedIn: 'root'
})
export class getMasterOutside implements CanActivate {

    constructor(
        private configService: ConfigService,
        private accountService: AccountService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.configService.getMasterDetails().pipe(first());
    }

}