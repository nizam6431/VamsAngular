
  
import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";

@Component({
  selector: "app-bio-security-device-form",
  templateUrl: "./bio-security-device-form.component.html",
  styleUrls: ["./bio-security-device-form.component.scss"],
})
export class BioSecurityDeviceFormComponent implements OnInit {
  permissionKeyObj=permissionKeys;

  @Input() formData: any;
  allBioSecurityDeviceData: any;

  constructor(
    public dialogRef: MatDialogRef<BioSecurityDeviceFormComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.allBioSecurityDeviceData = this.formData.data;
  }

  add() {}

  update() {}

  cancel() {
    this.dialogRef.close();
  }

  resetForm() {}
}