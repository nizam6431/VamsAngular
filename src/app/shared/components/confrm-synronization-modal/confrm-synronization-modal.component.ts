import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confrm-synronization-modal',
  templateUrl: './confrm-synronization-modal.component.html',
  styleUrls: ['./confrm-synronization-modal.component.scss']
})
export class ConfrmSynronizationModalComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ConfrmSynronizationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  close(decision: boolean) {
     this.dialogRef.close(decision);
  }

}
