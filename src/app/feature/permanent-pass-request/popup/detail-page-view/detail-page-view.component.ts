import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CardService } from 'src/app/feature/card/card/Services/card.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import s3ParseUrl from 's3-url-parser';
import { Constants } from "../../constant/column";
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { DomSanitizer } from '@angular/platform-browser';
import { formatPhoneNumber } from 'src/app/core/functions/functions';
@Component({
  selector: 'app-detail-page-view',
  templateUrl: './detail-page-view.component.html',
  styleUrls: ['./detail-page-view.component.scss']
})
export class DetailPageViewComponent implements OnInit {
  currentSlide = 1;
  reasonData:any[]=[];
  reason:any;
  index:Number = -1;
  permanentData: any;
  photoUrl: any = "assets/images/profile-pic.png";
  postDocumentData: any[] = [];
  columns = Constants.ViewDocumentCard;
  pageSize: defaultVal.pageSize;
  testDate:any;
  categoryType:any;
  dateOfBirth: any;
  constructor(
    public dialogRef: MatDialogRef<DetailPageViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public cardService :CardService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.getReasonData();
    this.getDeatilsView();
  }

  cancel(){
    this.dialogRef.close({success:false})
  }

  getReasonData(){
    let obj = {
      reason : this.data.reason
    }
   this.cardService.getResaonData(obj).subscribe((resp) =>{
    this.reasonData = resp.data
      
   })
  }

  approvePermanentPass(data){
    let displayId = {
      displayId : this.data.displayId
    }
    this.cardService.approvePermanentPass(displayId).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
        this.dialogRef.close({success:true})
      }},
      (error) => {
        this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
        this.dialogRef.close({success:true})
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

  rejectPass(){
    let obj = {
      displayId : this.data.displayId,
      reasonId : this.index <this.reasonData.length - 1 ? this.index : null,
      reason: this.reason?.name ? this.reason?.name : this.reason
    }
    if(obj.reasonId == -1 || obj.reason === null){
      this.toastr.warning("Please select atleast one reason")
    }else{
      this.cardService.rejectReasonData(obj).subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors === null) {
          this.toastr.success(resp.message, this.translate.instant('pop_up_messages.success'));
          this.dialogRef.close({success:true})
        }},
        (error) => {
          this.toastr.error(error.error.Message, this.translate.instant('pop_up_messages.error'));
          setTimeout(() => {
             this.dialogRef.close({success:true})
          }, 1000);
        })
    }
   
  }

  getDeatilsView(){
    let data = {
      // seepzPassId : this.data.id
      seepzPassId : this.data.displayId
    }
    this.cardService.getByIdPermenantAsync(data).subscribe((response) => {
      this.permanentData = response.data
      this.categoryType= response.data.category
      this.photoUrl = response.data.photoUrl[0]
      this.postDocumentData = response.data.documents
      // let DOB = response.data.dateOfBirth
      // this.dateOfBirth = DOB.slice(0,9)
      // console.log(this.dateOfBirth,',,')
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
  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }
  
 
}
