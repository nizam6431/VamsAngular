import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import translate from 'aws-sdk/clients/translate';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { CardService } from '../../Services/card.service';
import s3ParseUrl from 's3-url-parser';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { Constants } from '../../constant/column';
import { defaultVal } from 'src/app/core/models/app-common-enum';
@Component({
  selector: 'app-detail-page-view',
  templateUrl: './detail-page-view.component.html',
  styleUrls: ['./detail-page-view.component.scss']
})
export class DetailPageViewComponent implements OnInit {
  currentSlide: number = 1;
  permanentData: any;
  categoryType: string = ''
  status: string = ''
  photoUrl: any = "assets/images/profile-pic.png";
  postDocumentData: any;
  columns = Constants.ViewdocumentCard;
  pageSize: defaultVal.pageSize;
  testDate: any;
  passExpired: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<DetailPageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
     private translate: TranslateService,
     private toastr: ToastrService,
    public cardService : CardService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,) { }

  ngOnInit(): void {
    console.log(this.data);
    // this.permanentData = this.data;
    this.getDeatilsView()
  }
  cancel(){
    this.dialogRef.close()
  }
   async handleIamge(photoUrl){
    let parserContent = s3ParseUrl(photoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.photoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
   formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
   getDeatilsView(){
    let data = {
      seepzPassId : this.data.displayId
    }
    this.cardService.getByIdPermenantAsync(data).subscribe((response) => {
      this.permanentData = response.data
      this.categoryType = response.data.category
      this.status = response.data.status
      this.postDocumentData = response.data.documents
      this.photoUrl = response.data.photoUrl[0]
      let passExpireDate = response.data.passExpiryDate;
    

    })
  }
  resendSMS() {

    let req = {
      id:this.permanentData.displayId
    }
     this.cardService.resendSMS(req).subscribe(response => {
      if (response.statusCode === 200 && response.errors == null) {
        this.toastr.success(response.message, this.translate.instant('pop_up_messages.success'));
      } else {
        this.toastr.warning(response.message, this.translate.instant('pop_up_messages.warning'));
      }
    }, error => {
      if ('errors' in error.error) {
        error.error.errors.forEach(element => {
          this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
        })
      } else {
        this.toastr.warning(error.error.Message, this.translate.instant('pop_up_messages.warning'));
      }
    })
  }
}
