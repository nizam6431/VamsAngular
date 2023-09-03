import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { stringify } from 'querystring';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/core/services/user.service';

@Directive({
  selector: '[isPermissible]'
})
export class IsPermissibleDirective {

  private permissions: any = null;
  @Input('isPermissible') key: string

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService
  ) {
    this.permissions = environment.Permissions;
  }

  @Input() set isPermissible(isPermissible: string) {
    if (this.userService.checkPermission(isPermissible)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }

}
