import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-cancel-appointment',
  templateUrl: './confirm-cancel-appointment.component.html',
  styleUrls: ['./confirm-cancel-appointment.component.scss']
})
export class ConfirmCancelAppointmentComponent implements OnInit {
  reasonTranslate: { reason: string; };
  constructor(
    private dialogRef: MatDialogRef<ConfirmCancelAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    let reason = this.data && this.data[0].reason
    this.reasonTranslate = { reason: reason};
  }

  close(decision: boolean) {
    this.dialogRef.close(decision);
  }

}
