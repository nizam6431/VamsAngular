import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';

@Directive({
  selector: '[isPermissible]'
})
export class IsPermissibleDirective {

  private permissions: any = null;
  @Input('isPermissible') key: string | string[];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
    this.permissions = environment.Permissions;
  }

  @Input() set isPermissible(isPermissible: string | string[]) {
    if (typeof isPermissible == 'string') {
      if (this.userService.checkPermission(isPermissible)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    } else if (typeof isPermissible == 'object') {
      let show = false;
      isPermissible.forEach(element => {
        if (this.userService.checkPermission(element)) {
          show = true;
        } else {
          show = false;
        }
      });
      if(show) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    }
    // if (this.userService.checkPermission(isPermissible)) {
    //   this.viewContainerRef.createEmbeddedView(this.templateRef);
    // } else {
    //   this.viewContainerRef.clear();
    // }
  }

}
