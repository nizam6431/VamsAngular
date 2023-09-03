import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {
  public toDelete: string;
  public name: string;
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    /**
     * @description need to handle confirm delete text language wise token is added, but need to format string in TS file 
     */
    this.toDelete = this.data.type;
    this.name = this.data.name
  }

  close(decision: boolean) {
    this.dialogRef.close(decision);
  }
}
