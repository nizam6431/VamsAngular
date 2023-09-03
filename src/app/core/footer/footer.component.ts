import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { first } from 'rxjs/operators';
import { ErrorsService } from '../handlers/errorHandler';
import { AccountService } from '../services/account.service';
import { DashboardService } from '../services/dashboard.service';
import { ShareAppointmentComponent } from 'src/app/feature/appointment/share-appointment/share-appointment.component';
import { PrescheduleComponent } from 'src/app/feature/appointment/preschedule/preschedule.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  isShowWalkin: boolean = false;
  permissions: any[] = [];
  logoUrl: string;
  userShortName: string = '';
  isShowMobileMenu: boolean = false;
  locations: any[] = JSON.parse(localStorage.getItem("locations") || "[]");
  locationId: number = 0;
  locationName: string = "";
  
  @ViewChild('scheduleappointment') scheduleAppointmentModal: TemplateRef<any>;

  constructor(private dialogService: NgbModal,
    private authenticationService: AccountService,
    private errorService: ErrorsService,
    private dashboardService: DashboardService,
    public dialog: MatDialog
    ) {
      var currentLocation = ''//JSON.parse(localStorage.getItem("currentLocation")!);
      this.locationId = 0//Number(currentLocation.LocationId);
      //this.getPermissions();
      this.locationName = ''//currentLocation.LocationName;
  }

  ngOnInit(): void {
  }

  toggleWalkin() {
    this.isShowWalkin = !this.isShowWalkin;
  }

  // hasPermission(action: string) {
  //   return (this.permissions.find(element => {
  //     return element.PermissionKey == action;
  //   })?.IsPermissible)
  // }

  openChangeLanguage(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
  }

  appointmentScheduled(event: any) {

  }

  // getPermissions() {
  //   this.permissions = [];
  //   this.dbService.getByKey('LocationPermissions',
  //     this.locationId)
  //     .subscribe((indexDbData: any) => {
  //       if (indexDbData == undefined) {
  //         var locationDetails = this.locations.find(element => {
  //           return element.LocationId == this.locationId;
  //         });
  //         this.dashboardService.getPermissionByUserLocation(this.locationId,
  //           this.authenticationService.currentUserValue.UserId,
  //           locationDetails.GroupName,
  //           locationDetails.Persona, locationDetails.LocationGroupMasterId)
  //           .pipe(first())
  //           .subscribe(
  //             (dbData: any) => {
  //               this.permissions = [];
  //               dbData.Data.forEach((element: any) => {
  //                 this.permissions.push(element);
  //               });
  //             });
  //       }
  //       else {
  //         this.permissions = [];
  //         var permissionDetails = JSON.parse(indexDbData.Permissions);
  //         permissionDetails.Data.forEach((element: any) => {
  //           this.permissions.push(element);
  //         });
  //       }

  //     }, (error: any) => {
  //       this.errorService.handleError(error);
  //     });
  // }

  scheduleAppointment() {
      this.dialogService.open(
        this.scheduleAppointmentModal, { centered: true, backdrop: 'static', keyboard: false, windowClass: 'slideInUp' });
  }

  shareAppointment(){
    this.dialog.open(ShareAppointmentComponent, {
      width: '40%',
      height: '100%',
      position: { right: '0' },
      panelClass: ['animate__animated', 'animate__slideInRight']
    });
  }
  preschedule(){
    this.dialog.open(PrescheduleComponent, {
      width: '40%',
      height: '100%',
      position: { right: '0' },
      panelClass: ['animate__animated', 'animate__slideInRight']
    });
  }
}
