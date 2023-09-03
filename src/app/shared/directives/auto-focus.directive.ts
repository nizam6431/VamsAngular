import { AfterViewInit, Directive, ElementRef,Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit{
@Input() public appAutoFocus:any;
  constructor(private element:ElementRef) {}

    ngAfterViewInit(){
      setTimeout(() => {
        this.element.nativeElement.focus();
      }, 500);
      
    }

}
