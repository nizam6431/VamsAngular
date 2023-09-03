import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../services/master.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sms-screen-for-access-qr-code',
  templateUrl: './sms-screen-for-access-qr-code.component.html',
  styleUrls: ['./sms-screen-for-access-qr-code.component.scss']
})
export class SmsScreenForAccessQrCodeComponent implements OnInit {
  empId: string;
  url: any;
  extension: string = ".png";
  base64image: string;
  logoUrl: string = "";
  isQrCode: boolean;

  constructor(private router: Router, private _sanitizer: DomSanitizer,
    public masterService: MasterService,) { }

  ngOnInit(): void {
    this.empId = this.router.url.split("/")[4];
    this.logoUrl = "assets/images/login-vams-logo.png";
    this.masterService.accessEmployeeQrCode((this.empId))
      .pipe()
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors == null) {
          this.isQrCode = true;
          this.base64image = "data:image/png;base64," + resp?.data;
          this.url = this._sanitizer.bypassSecurityTrustResourceUrl(this.base64image);
        }
      },
        (error) => {
          this.isQrCode = false;
          if (error.statusCode === 400) {

          }
        })
  }

  cancel() {
  }

  downloadImage() {
    // let fileName = this.data?.fileName+this.extension;
    this.masterService.downloadImage(this.base64image,'myqrcode.png')
  }

}
