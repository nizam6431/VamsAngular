import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorPopupComponent } from 'src/app/common-pages/error-popup/error-popup.component';

@Injectable({ providedIn: 'root' })
export class ErrorsService {

    private modalService: NgbModal
    constructor(private injector: Injector) {
    }

    handleError(error: Error) {
        this.modalService = this.injector.get(NgbModal);
        this.modalService.open(ErrorPopupComponent, 
            {centered: true, backdrop: 'static', keyboard: false, windowClass:'slideInUp'});
    }
}