import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateCacheService } from 'ngx-translate-cache';
import { ReauthenticateComponent } from 'src/app/feature/appointment/reauthenticate/reauthenticate.component';
import { ProductTypes } from '../models/app-common-enum';
import { MyProfileModalComponent } from '../my-profile-modal/my-profile-modal.component';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile-page-modal',
  templateUrl: './profile-page-modal.component.html',
  styleUrls: ['./profile-page-modal.component.scss']
})
export class ProfilePageModalComponent implements OnInit {
userDetails;
ProductType = ProductTypes;
productType: string;
@Output() Signal_R_Emittir =  new EventEmitter();
  constructor(
    public dialog: MatDialog,
    public userService : UserService,
    private authenticationService: AccountService,
    public translateCacheService:TranslateCacheService,
    public router: Router,
    public dialogRef: MatDialogRef<ProfilePageModalComponent>,
  ) { 
    this.userDetails = this.userService.getUserData();
    this.productType = this.userService.getProductType();
  }

  ngOnInit(): void {
  }

    myProfile(){
    const dialogRef = this.dialog.open(MyProfileModalComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", 'vams-dialog-xl', "animate__slideInRight"],
    });
  }

  Reauthenticate(){
    const dialogRef = this.dialog.open(ReauthenticateComponent, {
      height: "100%",
      position: { right: "0" },
      data: {},
      panelClass: ["animate__animated", 'vams-dialog', "animate__slideInRight"],
    });
    this.dialogRef.close()
  }

  logout() {
    this.Signal_R_Emittir.emit({"type":"logout"})
    this.authenticationService
      .logout(
        this.userService.getUserData().employeeId,
        this.userService.getUserData().currentConnectionId
      )
      .subscribe((res) => {
        if (res.errors == null && res.statusCode === 200) {
          // this.toastr.success(res.message, 'Success');
          this.translateCacheService.init();
          this.userService.setUserData(null);
          localStorage.clear();
          this.router.navigate(["/auth/login"]);
          this.dialogRef.close()
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  }


