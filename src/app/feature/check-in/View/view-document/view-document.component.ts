import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
import { ConfigureService } from 'src/app/feature/configure/services/configure.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
  documentsPhoto:string = "";
  constructor(
    private uploadService: FileUploadService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private configureService: ConfigureService
  ) { }

  ngOnInit(): void {
    this.getDefaultImage();
  }
  getDefaultImage() {
    this.configureService.getDefaultBannerImage().subscribe(resp => {
   if (resp.statusCode == 200 && resp.erros == null) {
    console.log(resp,'resp')
     //this.documentsPhoto = this.uploadService.getS3File(s3ParseUrl(resp.data.bannerImageURL).key);
   }
 })
}
}
