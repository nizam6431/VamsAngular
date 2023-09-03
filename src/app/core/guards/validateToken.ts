import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { observable, Observable, of } from 'rxjs';
import { catchError, first, map, tap } from 'rxjs/operators';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class validateToken implements CanActivate {

  constructor(private accountService: AccountService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let url = route.routeConfig.path.split("/")[0]
    return this.accountService.validateToken(route.params.token, url).pipe(
      map(resp => {
        if (resp.data && resp.statusCode === 200) {
          localStorage.setItem('currentUserToken', JSON.stringify(route.params.token));
          return true;
      }
        this.router.navigate(["invalid-link"], {state: {showPage: true}});
        // this.router.navigate(["auth/invalid-link"],{"data": ""})
        return false;
      }), catchError(() => {
        this.router.navigate(["invalid-link"], {state: {showPage: true}});
        return of(false);
      }))
    
    // .(resp => {
      //   if (!resp) {
      //     this.router.navigate(["auth/login"]); 
      //     return of(false);
      //   }
      //   localStorage.setItem('currentUserToken', JSON.stringify(route.params.jwt));
      //   return of(true);
      // })
    //return of(true);
    // return this.accountService.validateToken(route.params.jwt).pipe(
    //     map(data => {
    //       if(data.statusCode === 200) {
    //         this.router.navigate(["auth/reset-password"]);
    //         return true;
    //       }
    //       return false;
    //     },catchError(() => {
    //       this.router.navigate(["auth/login"])
    //       return of(false);
    //     })))    
  
     }

}
