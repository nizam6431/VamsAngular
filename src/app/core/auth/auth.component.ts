import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/common.service';
import { ScriptService } from '../services/script.service';
import { ThemeService } from '../services/theme.service';
import s3ParseUrl from 's3-url-parser';
import { encode } from '../functions/functions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  companyCode:string="";
  logoUrl: any;
  constructor(private themeService: ThemeService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private commonService: CommonService) {
    // this.route.params.subscribe(routeParams => {
    //   this.companyCode = this.route.snapshot.params["companyCode"];
    //   localStorage.setItem("companyCode", this.companyCode.toLowerCase());
    //   this.commonService.loadCompanyData(this.companyCode.toLowerCase());
    // });
  }

  ngOnInit(): void {
    if (environment.LogoBase64) {
      this.logoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + environment.LogoBase64);
    }
  } 
}
