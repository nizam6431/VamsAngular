import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-update-bio-security-server',
  templateUrl: './add-update-bio-security-server.component.html',
  styleUrls: ['./add-update-bio-security-server.component.scss']
})
export class AddUpdateBioSecurityServerComponent implements OnInit {

  constructor(  public dialogRef: MatDialogRef<AddUpdateBioSecurityServerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

}
