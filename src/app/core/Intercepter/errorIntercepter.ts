import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        //private authenticationService: AccountService
        public router: Router,
        private toastr: ToastrService,
        private translate: TranslateService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.error && err.error.StatusCode && err.error.StatusCode === 401) {
                // auto logout if 401 response returned from api
                this.toastr.error(err.error.Message || this.translate.instant("toster_message.unotherize_access"), this.translate.instant("toster_message.error"));
                this.router.navigate(["auth/login"]);
                localStorage.clear();
                //this.authenticationService.logout();
                // location.reload();
            }
            return throwError(err);
        }))
    }
}