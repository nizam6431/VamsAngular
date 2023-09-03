import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Constants } from "../constants/columns";
import { AppointmentsStatus, AppointmentStatus } from "../../../core/models/app-common-enum";
import { ConfirmReasonComponent } from "src/app/shared/components/confirm-reason/confirm-reason.component";
import { TranslateService } from "@ngx-translate/core";
import { AppointmentService } from "../services/appointment.service";
import { ToastrService } from "ngx-toastr";
import { visitorInfo } from "../models/visitor-details";

import { formatPhoneNumber } from "../../../core/functions/functions";
import { permissionKeys } from "src/app/shared/constants/permissionKeys";
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import s3ParseUrl from 's3-url-parser';
import { DomSanitizer } from "@angular/platform-browser";
import { UserService } from "../../../core/services/user.service";
import {
  LevelAdmins,
  Level2Roles,
  Level3Roles,
  Level1Roles
} from "../../../core/models/app-common-enum";
// import { CommonPopUpComponent } from "src/app/shared/components/common-pop-up/common-pop-up.component";
// import { first } from "rxjs/operators";
// import { VisitorsService } from "../../visitors/services/visitors.service";
@Component({
  selector: "app-show-visitors-details",
  templateUrl: "./show-visitors-details.component.html",
  styleUrls: ["./show-visitors-details.component.scss"],
})
export class ShowVisitorsDetailsComponent implements OnInit {
  visitorData: any;
  appointmentCardData: visitorInfo;
  visitorImage: any = "assets/images/profile-pic.png";
  appointmentsStatus = AppointmentsStatus;
  permissionKeyObj = permissionKeys;
  remarkValue : any = null;

  loginUserId: number;
  isL1Admin: boolean;
  isL2Admin: boolean;
  isL3Admin: boolean;
  isReception: boolean;
  isEmployee: boolean;
  isl3frontDesk: boolean;
  l1SecurityGuard: boolean;
  l1SecurityHead: boolean;
  l2SecurityGuard: boolean;
  l2SecurityHead: boolean;
  userDetails: any;
  SeepzWorkFlow: any;

  constructor(
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
    @Inject(MAT_DIALOG_DATA) public appointmentData: any,
    public dialogRef: MatDialogRef<any>,
    public dialog: MatDialog,
    private translate: TranslateService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService,
    private userService: UserService
    // private visitorsService:VisitorsService
  ) {
    this.SeepzWorkFlow = this.userService.getWorkFlow();
   }
  displayedColumns: any[] = Constants.visitors_details;
  appointmentStatus = AppointmentStatus;

  ngOnInit(): void {
     this.userDetails = this.userService.getUserData()
    this.appointmentCardData = this.appointmentData.appointmentCardData;
    console.log(this.appointmentCardData)
    if (this.appointmentCardData['visitorPhotoUrl']) {
      this.visitorImage = this.appointmentCardData['visitorPhotoUrl']
    }
    this.getAppointmentData(this.appointmentData.appointmentCardData.id);
    this.rolesCheck(this.userService.getUserData().role.shortName);
  }

  rolesCheck(role) {
    switch (role) {
      case LevelAdmins.Level1Admin:
        this.isL1Admin = true;
        break;
      case LevelAdmins.Level2Admin:
        this.isL2Admin = true;
        break;
      case LevelAdmins.Level3Admin:
        this.isL3Admin = true;
        break;
      case Level2Roles.l2Reception:
        this.isReception = true;
        break;
      case Level1Roles.l1Reception:
        this.isReception = true;
        break;
      case Level3Roles.l3Reception:
        this.isl3frontDesk = true;
        break;
      case Level3Roles.l3Host:
        this.isEmployee = true;
        break;
      case Level2Roles.l2Host:
        this.isEmployee = true;
        break;
      case Level1Roles.l1Host:
        this.isEmployee = true;
        break;
      case Level1Roles.l1Security:
        this.l1SecurityGuard = true;
        break;
      case Level1Roles.l1SecurityHead:
        this.l1SecurityHead = true;
        break;
      case Level2Roles.l2Security:
        this.l2SecurityGuard = true;
        break;
      case Level2Roles.l2SecurityHead:
        this.l2SecurityHead = true;
        break;
    }
  }

  timeInTimeOut(appointmentId, type) {
    // const dialogRef = this.dialog.open(TimeInOutComponent, {
    //   height: "100%",
    //   position: { right: "0" },
    //   data: {
    //     appointmentData: appointmentData,
    //     type: type,
    //     startFromSlide: 2,
    //   },
    //   panelClass: ["animate__animated", "vams-dialog", "animate__slideInRight"],
    // });
    this.appointmentService.GetTimeInAndOutById(appointmentId, type).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.visitorData = resp.data;
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        this.dialogRef.close(resp);
        // if (!this.fromCard)
        //   this.currentSlide = this.currentSlide + 1;
      }
    },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      })

    
  }

  getAppointmentData(appointmentId) {
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      (resp) => {
        if (resp.statusCode == 200 && resp.errors === null) {
          this.visitorData = resp.data;
          if (this.visitorData.visitorPhotoUrl && this.appointmentCardData && this.appointmentCardData.type === 'WALKIN') {
            this.handleIamge(this.visitorData.visitorPhotoUrl)
            // this.visitorImage = this.visitorData.visitorPhotoUrl;
          }
        }
      },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    );
  }

  openConfirmDialog() {
    this.dialog.open(ConfirmReasonComponent, {
      width: "40%",
      data: {
        data: {
          message: this.translate.instant(
            "AppointmentDetails.confirm_restrict_visitor"
          ),
        },
      },
      panelClass: ["animate__animated"],
    });
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  cancel() {
    this.dialogRef.close();
  }

  restrictThisVisitor() {
    let restrictVisitor = {
      firstName: this.appointmentData?.appointmentCardData?.visitorFirstName,
      lastName: this.appointmentData?.appointmentCardData?.visitorLastName,
    };
    this.appointmentService.restrictThisVisitor(restrictVisitor).subscribe(
      (resp) => {
        if (resp.statusCode == 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
          this.dialogRef.close();
        }
      },
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
      }
    );
  }

  handleError(){
    this.visitorImage = "assets/images/profile-pic.png"
  }

  async handleIamge(visitorImage) {
    try{
      let parserContent = s3ParseUrl(visitorImage);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.visitorImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch(e){
      this.visitorImage = "assets/images/profile-pic.png";
    }

  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  // openRestrictDialog(){
  //   const dialogRef = this.dialog.open(CommonPopUpComponent, {
  //     data: {
  //       pop_up_type: "allRestrictVisitorConfirm",
  //       icon: "assets/images/alert.png",
  //       inputText: true
  //     },
  //     panelClass: ["vams-dialog-confirm"],
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if(result.decision){
  //        this.remarkValue = result.remark
  //       this.restrictVisitor()
  //     }
  //   });
  // }

  // restrictVisitor(){
  //   const remarkValue ={
  //     "remark" : this.remarkValue ,
  //     "firstName":this.appointmentCardData.visitorFirstName,
  //     "lastName":this.appointmentCardData.visitorLastName,
  //     "email":this.appointmentCardData.visitorEmail,
     
  //   }
  //  this.remarkValue = null;
  //   this.visitorsService.addRestrictedVisitor(remarkValue)
  //     .pipe(first()).subscribe((response) => {
  //       if (response.statusCode === 200 && response.errors == null) {
  //         // this.formRestrictVisitor.reset();
  //         this.toastr.success(response.message);
  //         this.cancel();
  //         this.dialogRef.close(response);
  //       } else {
  //         this.toastr.error(response.message);
  //       }
  //     },
  //     (error) => {
  //       if ("errors" in error.error) {
  //         error.error.errors.forEach((element) => {
  //           this.toastr.error(element.errorMessages[0], "Error");
  //         });
  //       } else {
  //         this.toastr.error(error.error.Message, "Error");
  //       }
  //     })
  // }
}
