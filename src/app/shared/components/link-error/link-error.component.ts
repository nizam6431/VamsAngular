import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-link-error',
  templateUrl: './link-error.component.html',
  styleUrls: ['./link-error.component.scss']
})
export class LinkErrorComponent implements OnInit {
  @Input() showPage: boolean;
  logoUrl: any = "";
  other: boolean = false;
  reject: boolean = false;
  constructor(
    private router: Router,
    private _sanitizer: DomSanitizer
  ) {
    let UrlData = this.router.getCurrentNavigation()
    if (UrlData && UrlData.extras && UrlData.extras.state && UrlData.extras.state.showPage) {
      this.other = true;
    } else {
      this.reject = true;
    }
  }

  ngOnInit(): void {
    if (this.reject && !this.showPage) {
      this.router.navigate(["auth/login"]);
    }
    if (!this.other && !this.showPage) {
      this.router.navigate(["auth/login"]);
    }
    // this.logoUrl = "assets/images/login-vams-logo.png";
    this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + (environment.LogoBase64?environment.LogoBase64:"assets/images/login-vams-logo.png"));
  }
}
