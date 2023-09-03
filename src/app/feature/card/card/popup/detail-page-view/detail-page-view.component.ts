import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { CardService } from '../../Services/card.service';
import s3ParseUrl from 's3-url-parser';
import { Constants } from '../../constant/column';
import { defaultVal } from 'src/app/core/models/app-common-enum';
// import { ViewDocumentComponent } from '../../View/view-document/view-document.component';
import { DomSanitizer } from '@angular/platform-browser';
import {ViewDocumentComponent} from '../../../../permanent-pass-request/View/view-document/view-document.component'
import { formatPhoneNumber } from 'src/app/core/functions/functions';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-detail-page-view',
  templateUrl: './detail-page-view.component.html',
  styleUrls: ['./detail-page-view.component.scss']
})
export class DetailPageViewComponent implements OnInit {
  permanentData: any;
  photoUrl: any = "assets/images/profile-pic.png";
  postDocumentData: any[] = [];
  columns = Constants.ViewdocumentCard;
  pageSize: defaultVal.pageSize;
  testDate:any;
  categoryType: any;
  status: any;
  currentSlide: number = 1;
  reasonData: any;
  index: number = -1;
  reason: any;
  dateOfBirth: any;
  constructor(
    public dialogRef: MatDialogRef<DetailPageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
     private translate: TranslateService,
     private toastr: ToastrService,
    public cardService : CardService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getDeatilsView();
  }

  cancel(){
    this.dialogRef.close()
  }
  getResonDeactivate() {
    this.currentSlide = 2;
    this.getDeactivateResons();
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
      // let DOB = response.data.dateOfBirth
      // this.dateOfBirth = DOB.slice(0,9)
      // console.log(" this.permanentData", this.permanentData)
    })
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
 
  openDialogForDocument(rowData){
    const dialogRef = this.dialog.open(ViewDocumentComponent, {
      data: {
        data : rowData
      },
      panelClass: ["vams-dialog-confirm","vams-dialog-popup-view-detail"]
    });
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
  deactivate() {
    let req = {
      displayId: this.permanentData.displayId,
      reasonId: this.index < this.reasonData.length - 1 ? this.reason.id : this.reasonData[this.reasonData.length - 1]['id'],
      reason: this.reason?.name ? this.reason?.name : this.reason
    }
    console.log(req)
    if ((!req.reason.replace(/\s/g, '').length) && req.reasonId > 0) {
      console.log("test")
          this.toastr.warning(this.translate.instant("pop_up_messages.dont_add_only_space"));
          return;
    }
     if (req.reasonId == -1 || req.reason === null) {
      this.toastr.warning("Please select atleast one reason")
     } else {
       req.reason.trim();
        this.cardService.deactivatePass(req).subscribe((resp) => {
          if (resp.statusCode == 200 && resp.errors == null) {
            this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
            // this.getAllRateCard(this.pageData)
            this.dialogRef.close()
          }
        },
          (error) => {
            if ("errors" in error.error) {
              error.error.errors.forEach((element) => {
                this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
              });
            } else {
              this.toastr.error(error.message, this.translate.instant("toster_message.error"));
            }
          })
  }
  }
 getDeactivateResons() {
   let req = {
        "masterName": "DeactivationReason"
     }
     this.cardService.getDeactivateReasons(req).subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors == null) {
          console.log(resp.data)
          this.reasonData = resp.data;
        } 
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("toster_message.error"));
          }
        })
  }
  
  getIndex(event,index){
    this.index = index;
    console.log(index)
    if (index == this.reasonData.length - 1) {
      this.reason = null;
    }
   for(let i=0; i<this.reasonData.length-1 ; i++){
      if( i == index ){
        this.reason = this.reasonData[i]
        console.log(this.reason);
      }
   }
  }
}


