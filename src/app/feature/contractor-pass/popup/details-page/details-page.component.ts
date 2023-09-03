import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetAllContractorRes } from '../../constant/class';

@Component({
  selector: 'app-details-page',
  templateUrl: './details-page.component.html',
  styleUrls: ['./details-page.component.scss']
})
export class DetailsPageComponent implements OnInit {
  getAllContractorRes = new GetAllContractorRes();

  constructor(public dialogRef: MatDialogRef<DetailsPageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    // console.log(this.data);
    this.getAllContractorRes = this.data;
  }

  cancel(){
    this.dialogRef.close()
  }

}
