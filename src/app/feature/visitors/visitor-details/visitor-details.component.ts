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
  selector: 'app-visitor-details',
  templateUrl: './visitor-details.component.html',
  styleUrls: ['./visitor-details.component.scss']
})
export class VisitorDetailsComponent implements OnInit {

  displayId: any;
  apntDetails: any;
  logoUrl: any;
  bannerImage: any;
  poweredByImage:any;
  partnerImage: any;
  invalidToken: boolean;

  constructor(
    private appointmentDetailService: AppointmentDetailService,
    private toastr: ToastrService,
    private router: Router,
    private titleService: Title,
    private _sanitizer: DomSanitizer,
    private fileUploadService: FileUploadService,
  ) { }
  ngOnInit(): void {
    this.displayId = this.router.url.split("/")[3]
    this.validateToken(this.displayId);

    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64 ? environment.LogoBase64 : "assets/images/login-vams-logo.png"));
    this.partnerImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultPartnerImage ? environment.DefaultPartnerImage : "assets/images/zkteco-logo-vector.png"));
    this.poweredByImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultPoweredByImage ? environment.DefaultPoweredByImage : "assets/images/powerdby.png"));
    this.bannerImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.DefaultBannerImage ? environment.DefaultBannerImage : "assets/images/group.jpg"));
    this.titleService.setTitle("Visitor Details");
 
  }

  // visitorData() {
  //   this.appointmentDetailService.visitorDetailsForQRPage({"displayId": this.displayId}).subscribe(
  //     (res: any) => {
  //       console.log(res,'res.......')
  //       if (res.statusCode == 200 && res.data) {
  //         this.apntDetails = res.data;
  //         this.handleQrCode(this.apntDetails);
  //         this.invalidToken = true;
  //       } else this.toastr.error("Visitor Details not available", "Error");
  //     },
  //     (error: any) => {
  //       this.invalidToken = false;
  //       this.toastr.error("something went wrong", "Error");
  //     }
  //   );
  // }


  async handleQrCode(visitorDetails) {
    try {
      let parserContent = s3ParseUrl(visitorDetails.qrCodeUrl);
      let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
      this.apntDetails.qrCodeUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    catch (e) {
      this.apntDetails.qrCodeUrl = "assets/images/profile-pic.png";
    }
  }

  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }

  validateToken(displayId) {
    this.appointmentDetailService
      .visitorDetailsForQRPage({"displayId": this.displayId})
      .subscribe(
        (response) => {
          if (response.statusCode == 200 && response.data) {
            this.apntDetails = response.data;
            this.handleQrCode(this.apntDetails);
            // this.invalidToken = true;
          } else this.toastr.error("Visitor Details not available", "Error");
        },
        (error) => {
          // this.invalidToken = false;
        }
      );
  }

}
