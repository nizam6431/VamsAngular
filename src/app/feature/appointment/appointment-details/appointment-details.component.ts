import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AppointmentDetailService } from "src/app/core/services/appointment-detail.service";
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { environment } from 'src/environments/environment';
import { encode } from 'src/app/core/functions/functions';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.scss']
})
export class AppointmentDetailsComponent implements OnInit {
  apntId: any;
  apntDetails: any;
  logoUrl: any;
  bannerImage: any;
  poweredByImage:any;
  partnerImage: any;
  // mapLink:string="https://www.google.com/maps/place/Santacruz+Electronic+Export+Processing+Zone,+Andheri+East,+Mumbai,+Maharashtra/@19.1259937,72.8692952,15z/data=!3m1!4b1!4m5!3m4!1s0x3be7c81f2814fc29:0x8da7608e8368f0b8!8m2!3d19.1266574!4d72.8766554"
  constructor(
    private appointmentDetailService: AppointmentDetailService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
  ) { }
  ngOnInit(): void {
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64 ? environment.LogoBase64 : "assets/images/login-vams-logo.png"));
    this.partnerImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultPartnerImage ? environment.DefaultPartnerImage : "assets/images/zkteco-logo-vector.png"));
    this.poweredByImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultPoweredByImage ? environment.DefaultPoweredByImage : "assets/images/powerdby.png"));
    this.bannerImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultBannerImage ? environment.DefaultBannerImage : "assets/images/group.jpg"));
    // console.log(this.partnerImage,this.poweredByImage,this.bannerImage)
    // this.logoUrl = environment.LogoBase64?environment.LogoBase64:"assets/images/login-vams-logo.png";
    this.titleService.setTitle("Appointment Details");
    this.apntId = this.router.url.split("/")[3]
    this.appointmentData();
  }

  appointmentData() {
    this.appointmentDetailService.appointmentDetailsForQRPage({"appointmentId": this.apntId}).subscribe(
      (res: any) => {
        if (res.statusCode == 200 && res.data) {
          this.apntDetails = res.data;
          this.handleQrCode(this.apntDetails);
        } else this.toastr.error("Appointment Details not available", "Error");
      },
      (error: any) => {
        this.toastr.error("something went wrong", "Error");
      }
    );
  }

  async handleQrCode(appointment) {
      appointment['qrCodeUrl'] = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + appointment['qrBase64Url']);
  }

  isShow(apntDetails){
    if(apntDetails.hostFirstName==null && apntDetails.hostLastName==null && apntDetails.hostCompany == null){
      return false
    }
    else if(apntDetails.hostFirstName!=null && apntDetails.hostLastName==null){
      return true
    } 
    else if(apntDetails.hostFirstName==null && apntDetails.hostLastName!=null){
      return true
    }
    return true;
  }

  showPolicy(type: string) {
    if (type == 'pp') {
      this.router.navigate(['auth/show-policy/privacy-policy']);
    } else if ('tc') {
      this.router.navigate(['auth/show-policy/terms-condition']);
    }
  }

}
