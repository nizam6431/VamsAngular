import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { first, ignoreElements } from 'rxjs/operators';
import { permissionKeysWithRoute } from 'src/app/shared/constants/permissionKeys';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../auth/services/config.service';
import { ErrorsService } from '../handlers/errorHandler';
import { AccountService } from '../services/account.service';
import { CommonService } from '../services/common.service';
import { DashboardService } from '../services/dashboard.service';
import { ScriptService } from '../services/script.service';
import { ThemeService } from '../services/theme.service';
import { UserService } from '../services/user.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    permissions: any[] = [];
    permissionsWithRoute: any[] = [
        { PermissionName: "ReAuthenticateVisitor", Route: "re-authenticate" },
        { PermissionName: "share", Route: "shareappointment" },
        { PermissionName: "updateProfile", Route: "updateprofile" },
    ];
    // optionalRoutes = ['login']
    optionalRoutes = ['questions', 'details', 'schedule']
    constructor(
        private themeService: ThemeService,
        private scriptService: ScriptService,
        private commonService: CommonService,
        private authenticationService: AccountService,
        private router: Router,
        private configService: ConfigService,
        private userService: UserService,
        private dialog: MatDialog
    ) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | any {
        if (this.optionalRoutes.includes(state['url'].split('/')[2]) && window.location.hostname.split('.')[0] !== "sysadmin") {
            return this.configService.setSuperadmin()
        }
        if (this.userService.getUserToken() && (state.url == "/" || "")) {
            this.router.navigate(['/auth/login']);
            return true;
        }
        if (this.userService.getUserData() && this.userService.getUserToken()) {
            console.log(state['url'].split('/')[1])
            console.log(this.userService.isPermissible(state['url'].split('/')[1]));
            let currentRoute = state['url'].split('/')[1];
            let permissionKey = Object.values(permissionKeysWithRoute.find((ele) => ele.ROUTE == currentRoute))[0];
            console.log(permissionKey,currentRoute)
            if (this.userService.isPermissible(permissionKey) && this.defaultGoToAppointment(state['url'].split('/')[1])) {
                    return this.userService.reAuthenticateToken().pipe(first());
                }
            else {
                    this.router.navigate(['/auth/login']);
                    return true;
            }

            // return true;
        } else if (!this.userService.getUserData() && this.userService.getUserToken()) {
            return this.userService.reAuthenticateToken().pipe(first());
        } else {
            this.dialog.closeAll();
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
    
    defaultGoToAppointment(route:string) {
        const userData = this.userService.getUserData()
        if (userData.feature.workFlow === "SEEPZ" && userData.role.shortName == "L3Admin" && route === 'appointments') {
            // debugger
            return false
        }
        else {
            // debugger
            return true
        }
    }
    checkPermission() {
        let path="seepzReport"
        return true;
    }
}

