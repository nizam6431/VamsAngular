import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ErrorsService } from 'src/app/core/handlers/errorHandler';
import { AccountService } from 'src/app/core/services/account.service';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-cancel-modal',
  templateUrl: './cancel-modal.component.html',
  styleUrls: ['./cancel-modal.component.css']
})
export class CancelModalComponent implements OnInit {
  @Input()
  visitorId: number;

  @Input()
  notificationType: number;

  @Input()
  fullname: string;

  @Input()
  modalServiceReference: any;

  @Input()
  dismissModal: any;

  fullnameTranslate: any;

  @Output() actionCompleted = new EventEmitter<boolean>();

  cancelAppointmentForm: FormGroup;

  currentLocation: any = JSON.parse(localStorage.getItem("currentLocation")!);
  constructor(public activeModal: NgbActiveModal,
    private dashboardService: DashboardService,
    private errorService: ErrorsService,
    private _fb: FormBuilder,
    private dialogService: NgbModal) {

    this.cancelAppointmentForm = this._fb.group({
      rejectReason: ['', [Validators.required, Validators.maxLength(250)]],
    });

  }

  ngOnInit(): void {
    this.fullnameTranslate = { fullname: this.fullname };
  }


  dismissAll() {
    this.dismissModal("ddd");
  }

  dismissAllConfirmed() {
    this.dialogService.dismissAll("dd");
  }

  confirmCancel(dialog: TemplateRef<any>) {
    if (this.cancelAppointmentForm.invalid) {
      return;
    }

    this.dashboardService.cancel(this.visitorId, this.rejectReason?.value, this.notificationType)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.dialogService.dismissAll("dd");
          this.dialogService.open(
            dialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
          this.actionCompleted.emit(true);
        }, (error: any) => {
          this.dialogService.dismissAll("dd");
          this.errorService.handleError(error);
        });
  }

  get rejectReason() { return this.cancelAppointmentForm.get('rejectReason'); }
}
