import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import s3ParseUrl from 's3-url-parser';
import { UserService } from 'src/app/core/services/user.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { ConfigureService } from '../../../services/configure.service';
import { ToastrService } from 'ngx-toastr';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {isImageType} from 'src/app/core/functions/functions'
import { bool } from 'aws-sdk/clients/signer';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-dynamic-email-template',
  templateUrl: './dynamic-email-template.component.html',
  styleUrls: ['./dynamic-email-template.component.scss']
})
export class DynamicEmailTemplateComponent implements OnInit,OnChanges {
  userDetails: any;
  editImage: boolean = true;
  bannerLogo: string = "";
  realBannerImage: string;
  imagePriview: boolean = false;
  // isImage: boolean = false;
  // imageSize: boolean = false;
  @Input() editBannerImage;
  @Input() saveBannerImage;
  @Output() saveBtn = new EventEmitter()
  constructor(private uploadService: FileUploadService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private configureService: ConfigureService) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.editBannerImage ) {
       this.getDefaultImage();
    }
    if (this.saveBannerImage == 'success') {
      this.updateBannerImageUrl();
      this.editBannerImage = false;
    }
  }

  ngOnInit(): void {
    this.userDetails = this.userService.getUserData();
     this.getDefaultImage();
     }
  getDefaultImage() {
       // this.bannerLogo = this.uploadService.getS3File(s3ParseUrl("https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/banner%402x.jpg").key);
       this.configureService.getDefaultBannerImage().subscribe(resp => {
      if (resp.statusCode == 200 && resp.erros == null) {
        this.bannerLogo = this.uploadService.getS3File(s3ParseUrl(resp.data.bannerImageURL).key);
      }
    })
  }

  onFileChange(event) {
    const file = event.target.files[0];
          if (!isImageType(event.target.files[0]) && file.size < 1048576) {
            let mainfilePath = "level1/" + this.userDetails?.level1DisplayId + "/emailasset/";
            this.uploadService.fileUpload(file, mainfilePath + file.name)
              .promise().then(resp => {
                this.realBannerImage = resp.Location
                this.bannerLogo = this.uploadService.getS3File(s3ParseUrl(resp.Location).key);
                this.saveBtn.emit(true);
              })
          }
          else {
            this.toastr.error(this.translate.instant('dyanamic_email_template.ristrict_image'), this.translate.instant('pop_up_messages.error'));
          }
      }
  
  updateBannerImageUrl() {
    this.configureService.updateBannerImage(this.realBannerImage).subscribe(resp => {
      if (resp.statusCode == 200 && resp.erros == null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
        this.getDefaultImage();
         }
    })
  }
}
