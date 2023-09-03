import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { SpinnerOverlayService } from '../services/spinner-overlay.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class OWINIntercepter implements HttpInterceptor {

    constructor(
        private accountAuthService: AccountService,
        // private userService: UserService       
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with OWIN token if available
        let tempArr = request.url.split("/");
        if (tempArr[tempArr.length - 2] == 'Master' && tempArr[tempArr.length - 1] == 'Get') { 
        }else {
            let currentToken = localStorage.getItem('currentUserToken');
            let headers = (currentToken) ? {
                Authorization: "Bearer " + JSON.parse(currentToken),
                Subdomain: environment.Subdomain,
                LanguageCode: environment.LanguaeCode
            } : {
                Subdomain: environment.Subdomain,
                LanguageCode: environment.LanguaeCode
            };
            request = request.clone({
                setHeaders: headers
            });
        }
        // const spinnerOverlayService = this.injector.get(SpinnerOverlayService);
        //const spinnerSubscription: Subscription = spinnerOverlayService.spinner$.subscribe();
        // request = request.clone({
        //     headers: new HttpHeaders({
        //       'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        //       'Pragma': 'no-cache',
        //       'Expires': '0'
        //     })
        //   });

        return next.handle(request);//.pipe(finalize(() => spinnerSubscription.unsubscribe()));
    }
}