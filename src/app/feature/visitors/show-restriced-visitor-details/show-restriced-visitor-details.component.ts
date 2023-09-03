import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { capitalizeFirstLetter, formatPhoneNumber, removeSpecialCharAndSpaces } from 'src/app/core/functions/functions';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { VisitorsService } from '../services/visitors.service';
import { AddRestrictVisitor } from '../models/restrict-visitor';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-show-restriced-visitor-details',
  templateUrl: './show-restriced-visitor-details.component.html',
  styleUrls: ['./show-restriced-visitor-details.component.scss']
})
export class ShowRestricedVisitorDetailsComponent implements OnInit {
  restrictedVisitorsData: any;
  permissionKeyObj = permissionKeys;
  addRestrictVisitor: any;
  remarkValue : any = null;
  selfPhotoUrl: any = "assets/images/profile-pic.png";
  levelType: string;
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public rowData: any,
    public dialog: MatDialog,
    private visitorsService: VisitorsService,
    private toastr: ToastrService,
    private fileUploadService:FileUploadService,
    private _sanitizer: DomSanitizer,
    private userService:UserService,
    private translate:TranslateService
    // public addRestrictVisitor: AddRestrictVisitor = new AddRestrictVisitor()
    ) { }

  ngOnInit(): void {
    this.restrictedVisitorsData = this.rowData;
    if(this.restrictedVisitorsData && this.restrictedVisitorsData.imageURLLink){
      this.selfPhotoUrl = this.restrictedVisitorsData.imageURLLink;
    }
    this.checkLevel()
  }

  cancel() {
    this.dialogRef.close();
  }

  formatCellNumber(cellNumber: any) {
    return formatPhoneNumber(cellNumber);
  }

  openRestrictDialog(value?){
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        pop_up_type: "allRestrictVisitorConfirm",
        icon: "assets/images/alert.png",
        inputText: true
      },
      panelClass: ["vams-dialog-confirm"],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result.decision){
         this.remarkValue = result.remark
        this.restrictVisitor()
      }
    });
  }

  restrictVisitor() {
    const remarkValue ={
      "remark" : this.remarkValue ? this.remarkValue :this.restrictedVisitorsData.remark ,
      "firstName":this.restrictedVisitorsData.firstName,
      "lastName":this.restrictedVisitorsData.lastName,
      "email":this.restrictedVisitorsData.email,
    }
   this.remarkValue = null;
    this.visitorsService.addRestrictedVisitor(remarkValue)
      .pipe(first()).subscribe((response) => {
        if (response.statusCode === 200 && response.errors == null) {
          // this.formRestrictVisitor.reset();
          this.toastr.success(response.message,this.translate.instant("pop_up_messages.success"));
          this.cancel();
          this.dialogRef.close(response);
        } else {
          this.toastr.error(response.message,this.translate.instant("pop_up_messages.error"));
        }
      },
      (error) => {
        if ("errors" in error.error) {
          error.error.errors.forEach((element) => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          });
        } else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      })
  }

  async handleIamge(PhotoUrl,type){
    let parserContent = s3ParseUrl(PhotoUrl);
    let  resp = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.selfPhotoUrl =  this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
  }
  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  checkLevel(){
    if(this.userService.getLevel2Id()){
      this.levelType = 'level2'
    }
    else if( this.userService.getLevel3Id()){
      this.levelType ='level3'
    }
    else{
      this.levelType ='level1'
    }
    console.log(this.levelType,'levelType')
  }
}
