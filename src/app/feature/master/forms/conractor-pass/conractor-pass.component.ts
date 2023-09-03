import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { first } from "rxjs/operators";
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { ContractorService } from '../../services/contractor.service';
import { encode } from "src/app/core/functions/functions";
import { DomSanitizer, Title } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-conractor-pass',
  templateUrl: './conractor-pass.component.html',
  styleUrls: ['./conractor-pass.component.scss']
})
export class ConractorPassComponent implements OnInit {
  @Input() selectedContractor: any;
  contractorData: any = {};
  profileImage: any;
  QRCodeImage: any;
  logoImage: any;
  userDetails: any;
  displayId: string;

  constructor(
    private contractorService: ContractorService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private uploadService: FileUploadService,
    private commonService: CommonService,
    private router: Router,
    private titleService: Title,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    if (this.router.url.split("/")[2] == "e-pass") {
      this.displayId = this.router.url.split("/")[3]
      this.titleService.setTitle("Contracor E-Pass");
      this.contractorEPassDetails();
    } else {
      this.contractorPassDetails();
    }
  }

  contractorPassDetails() {
    let reqObj = {
      "contractorPassId": this.selectedContractor?.data?.contractorPassId,
      "contractorId": this.selectedContractor?.data?.id
    }
    this.contractorService.createContractorPass(reqObj).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.handleUploadedIamge(resp.data?.contractorPhotoURL, "profileImage");
        this.handleUploadedIamge(resp.data?.qrCodeLink, "QRCode");
        this.handleUploadedIamge(this.commonService.getLogo(), "logo");
        this.contractorData.name = resp.data.firstName + " " + resp.data.lastName;
        this.contractorData.company = resp.data.companyName;
        this.contractorData.designation = resp.data.departmentName;
        this.contractorData.dateRange = resp.data.startDate + " To " + resp.data.endDate;
      } else {
        this.toastr.error(resp.message ? resp.message : "Something went wrong please try again.", this.translate.instant("pop_up_messages.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  contractorEPassDetails() {
    let reqObj = {
      "displayId": this.displayId,
    }
    this.contractorService.createContractorEPass(reqObj).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {

        this.profileImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.data?.contractorPhotoURL);
        this.QRCodeImage = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + resp.data?.qrCodeLink);
        this.logoImage =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + environment.LogoBase64);
        this.contractorData.name = resp.data.firstName + " " + resp.data.lastName;
        this.contractorData.company = resp.data.companyName;
        this.contractorData.designation = resp.data.departmentName;
        this.contractorData.dateRange = resp.data.startDate + " To " + resp.data.endDate;
      } else {
        this.toastr.error(resp.message ? resp.message : "Something went wrong please try again.", this.translate.instant("pop_up_messages.error"));
      }
    }, (error) => {
      this.showError(error);
    })
  }

  async handleUploadedIamge(url, type, imageType?) {
    let newUrl;
    let imgType = imageType ? 'data:' + imageType + ';base64,' : 'data:image/png;base64,';
    try {
      let parserContent = s3ParseUrl(url);
      let resp = await this.uploadService.getContentFromS3Url(parserContent.key).promise();
      if (type == "profileImage") {
        this.profileImage = this._sanitizer.bypassSecurityTrustUrl(imgType + encode(resp?.Body));
      } else if (type == "QRCode") {
        this.QRCodeImage = this._sanitizer.bypassSecurityTrustUrl(imgType + encode(resp?.Body));
      } else if (type == "logo") {
        this.logoImage = this._sanitizer.bypassSecurityTrustUrl(imgType + encode(resp?.Body));
      }
    }
    catch (e) {
      newUrl = null;
      this.toastr.error(this.translate.instant("pop_up_messages.failed_qr_code"), this.translate.instant('pop_up_messages.error'))
    }
  }

  showError(error) {
    if ("errors" in error.error) {
      error.error.errors.forEach((element) => {
        this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
      });
    } else if ("Message" in error.error) {
      this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
    } else {
      this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
    }
  }

}
