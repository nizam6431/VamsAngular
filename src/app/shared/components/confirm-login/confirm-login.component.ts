import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-login',
  templateUrl: './confirm-login.component.html',
  styleUrls: ['./confirm-login.component.scss']
})
export class ConfirmLoginComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  close(decision: boolean) {
     this.dialogRef.close(decision);
  }
}
