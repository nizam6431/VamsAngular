import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import translate from 'aws-sdk/clients/translate';
import { ToastrService } from 'ngx-toastr';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { Constants } from '../../../constants/column';
import { RateCardPopupComponent } from '../../../popup/rate-card-popup/rate-card-popup.component';
// import { Constants } from 'src/app/feature/card/card/constant/column';
import { ConfigureService } from '../../../services/configure.service';

@Component({
  selector: 'app-rate-card',
  templateUrl: './rate-card.component.html',
  styleUrls: ['./rate-card.component.scss']
})
export class RateCardComponent implements OnInit {
  @Input() refreshRateCard;
   public rateCard: FormGroup;
  columns: any[] = Constants.rateCard;
  dataSource: any[] = [];
  pageSize: number = defaultVal.pageSize;
  totalCount: number = 0;
  pageData: any;
  // dialogRef: any;
  constructor(
    //  public dialogRef: MatDialogRef<RateCardComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private configureService: ConfigureService,
    private userService: UserService,) { }

  ngOnInit(): void {
    this.getAllRateCard();
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.refreshRateCard) {
      this.getAllRateCard(this.pageData);
    }
  }
  rowData(rowData) {
     console.log(rowData);
      const dialogRef = this.dialog.open(RateCardPopupComponent, {
        height: '100%',
        width: '60%',
        position: { right: '0' },
        data: { "data": rowData, "mode": "show" },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });
     dialogRef.afterClosed().subscribe((result) => {
        console.log(result)
        if (result && result.statusCode == 200) {
          // this.contractorConfigAdd = new Date().getTime();
          // refresh data
          this.getAllRateCard(this.pageData)
        }
      });
  }
  rateCardChange(event) {
      // this.getMailServerList(this.data);
    console.log(event);
    this.pageData = event;
    this.getAllRateCard(event);
  }
  getAllRateCard(data?) {
    let obj = {
        pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
        pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
        orderBy: data && data.orderBy ? data.orderBy : null,
        orderDirection: data && data.sortBy ? data.sortBy : "ASC",
        globalSearch: data && data.globalSearch ? data.globalSearch : "",
        passType: null,
        categoryId: null,
        }
    this.configureService.getAllRateCard(obj).subscribe(resp => {
      console.log(resp)
      this.dataSource = resp.data.list ;
      this.totalCount = resp.data.totalCount;

    })
  }
  modeEmmiter(event) {
    console.log(event)
    if (event.mode == 'delete') {
      this.deletePopup(event.rowData)
      // this.deleteRateCard(event.rowData);
    }
    if (event.mode == 'edit') {
      this.updateRateCard(event.rowData)
      // this.deleteRateCard(event.rowData);
    }
  }
   updateRateCard(rowData){
     console.log(rowData);
      const dialogRef = this.dialog.open(RateCardPopupComponent, {
        height: '100%',
        width: '60%',
        position: { right: '0' },
        data: { "data": rowData, "mode": "edit" },
        panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
      });
     dialogRef.afterClosed().subscribe((result) => {
        console.log(result)
        if (result && result.statusCode == 200) {
          // this.contractorConfigAdd = new Date().getTime();
          // refresh data
          this.getAllRateCard(this.pageData)
        }
      });
   }
  deletePopup(rowData) {
    let name = rowData?.categoryName +' ' +'-'+ ' (' + rowData?.validity+')' 
     const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        name: name,
        pop_up_type: "deleteRate",
        icon: "assets/images/delete-icon.png",
      },
      panelClass: ["vams-dialog-confirm"]
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
       this.deleteRateCard(rowData)
      } else {
        dialogRef.close();
      }
    });
  }
  deleteRateCard(data){
     let req = {
        id:data.id
        }
      this.configureService.deleteRateCard(req).subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors == null) {
          this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
          this.getAllRateCard(this.pageData)
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
