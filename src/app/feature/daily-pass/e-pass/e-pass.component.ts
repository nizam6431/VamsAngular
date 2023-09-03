import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
// import { first } from 'lodash';
import { CardService } from '../Services/card.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
// import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-e-pass',
  templateUrl: './e-pass.component.html',
  styleUrls: ['./e-pass.component.scss']
})
export class EPassComponent implements OnInit {
  passId: string;
  passExpire: boolean = false;
  passColor: any = [
    { type: "Visitor", id: 0, flag: false },
    { type: "Labour(Ancillary)", id: 1, flag: false },
    { type: "Labour(Manufacturer)", id: 2, flag: false },
    { type: "Daily pass with Vehicle", id: 3, flag: false },
    {type: "Pass Expire1", id: 4, flag: false}
  ]
  epassData: any;
  selfPhotoUrl: any;
  passCheckout: boolean = false;
  isdCode:string="+91"
  type: string;
  address:string=" Unit no 39,G & J Complex 3,Seepz, Andheri(E),Mumbai -400096"
  constructor(
    private router: Router,
    private titleService: Title,
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private cartService: CardService,
    private toastr: ToastrService,
    private fileUploadService:FileUploadService,
  ) {
    //  this.titleService.setTitle("Appointment Details");
    this.passId = this.router.url.split("/")[3]
    this.type=this.router.url.split("/")[1]
    console.log(this.passId)

   }

  ngOnInit(): void {
    if (this.type == "WalkIn") {
       this.appointmentData();
    } else {
       this.getPassDetails();
    }
  }
  getPassDetails() {
    let reqBody = {
      passId:this.passId
    }
     this.cartService.dailyEpassDetails(reqBody).pipe(first()).subscribe(
        (resp) => {
          if (resp.statusCode === 200 && resp.errors === null) {
            console.log(resp);
            this.epassData = resp.data;
            this.passExpire = this.epassData.isPassExpired;
            this.passCheckout = this.epassData.isCheckOut;
            if (this.passCheckout) {
              this.passColor[4].flag = true;
            } else {
               this.passColor.map(element => {
                if (element.type == this.epassData.category) {
                  element.flag = true;
                }
            })
            }
           
          }
        },
       (error) => {
         this.router.navigate(["invalid-link"], {state: {showPage: true}});
          if (error && error.error && "errors" in error.error) {
            error.error.errors.forEach((element) => {
            });
          } else {
          }
        }
      );
  }
   appointmentData() {
    this.cartService.walkInDetails({"id": this.passId}).subscribe(
      (resp: any) => {
        if (resp.statusCode == 200 && resp.data) {
           console.log(resp);
            this.epassData = resp.data;
            this.passExpire = this.epassData?.isPassExpired;
          this.passCheckout = this.epassData?.isCheckOut;
          // this.epassData.qrUrl = resp.data.qrCodeUrl;
            // if (this.passCheckout) {
              this.passColor[4].flag = true;
            // }
        } else this.toastr.error("Appointment Details not available", "Error");
      },
      (error: any) => {
        this.toastr.error("something went wrong", "Error");
      }
    );
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
  async handleIamge(data:any) {
    let photoUrl = data.qrUrl;
    let parserContent = s3ParseUrl(photoUrl);
    let resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.selfPhotoUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  formatPhoneNumber(num) {
    return formatPhoneNumber(num)
  }
 
}
