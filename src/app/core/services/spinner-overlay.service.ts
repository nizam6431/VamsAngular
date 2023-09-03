import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { defer, NEVER } from 'rxjs';
import { finalize, share } from 'rxjs/operators';
import { SpinnerOverlayComponent } from 'src/app/common-pages/spinner-overlay/spinner-overlay.component';

@Injectable({ providedIn: 'root' })
export class SpinnerOverlayService {
    private overlayRef: OverlayRef | undefined = undefined;

    constructor(private injector: Injector) { 
        
    }

    public readonly spinner$ = defer(() => {
        this.show();
        return NEVER.pipe(
            finalize(() => {
                this.hide();
            })
        );
    }).pipe(share());
    
    private show(): void {
       var overlay =  this.injector.get(Overlay);
        // Hack avoiding `ExpressionChangedAfterItHasBeenCheckedError` error
        Promise.resolve(null).then(() => {
            if (!this.overlayRef) {
                this.overlayRef = overlay.create({
                    positionStrategy: overlay
                        .position()
                        .global()
                        .centerHorizontally()
                        .centerVertically(),
                    hasBackdrop: true
                });
                this.overlayRef.attach(new ComponentPortal(SpinnerOverlayComponent));
            }
        });
    }

    private hide(): void {
        if (this.overlayRef) {
            this.overlayRef.detach();

            this.overlayRef = undefined;
        }
    }
}