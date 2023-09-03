import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractorCheckInCheckOutReq, ContractorCheckInCheckOutRes, GetContractorDetailsByQrCodeReq, GetContractorDetailsByQrCodeRes } from '../../constant/class';
import { ContractorPassService } from '../../services/contractor-pass.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-check-in-out',
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.scss']
})
export class CheckInOutComponent implements OnInit {
  qrCode: string;
  type: string;
  currentSlide: number = 1;
  getContractorDetailsByQrCodeReq = new GetContractorDetailsByQrCodeReq();
  getContractorDetailsByQrCodeRes = new GetContractorDetailsByQrCodeRes();
  contractorCheckInCheckOutReq = new ContractorCheckInCheckOutReq();
  ContractorCheckInCheckOutRes = new ContractorCheckInCheckOutRes();
  constructor(
    private contractorPassService: ContractorPassService,
    public dialogRef: MatDialogRef<CheckInOutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.type = this.data?.type
  }

  scanSuccessHandler(data) {
    this.getContractorDetailsByQrCodeReq.appointmentId = this.data.id;
    this.getContractorDetailsByQrCodeReq.qrCode = data
    this.contractorPassService.getContractorDetailsBYQrCOde(this.getContractorDetailsByQrCodeReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.getContractorDetailsByQrCodeRes = resp.data;
        this.currentSlide = this.currentSlide + 1;
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
        });
      } else {
        if ('message' in error.error)
          this.toastr.error(error.error.message, this.translate.instant("toster_message.error"));
        else if ('Message' in error.error)
          this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
        else
          this.toastr.error(error.message, this.translate.instant("toster_message.error"));
        // this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
      }
    })
  }

  cancel() {
    this.dialogRef.close()
  }

  checkInOut() {
    this.contractorCheckInCheckOutReq.appointmentId = this.getContractorDetailsByQrCodeRes.appointmentId
    this.contractorCheckInCheckOutReq.checkinType = this.type;
    this.contractorCheckInCheckOutReq.qrCode = this.getContractorDetailsByQrCodeReq.qrCode;
    this.contractorCheckInCheckOutReq.level2Id = 0;
    this.contractorCheckInCheckOutReq.level3Id = 0;

    this.contractorPassService.checkInCheckOutContractor(this.contractorCheckInCheckOutReq).pipe(first()).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.errors == null) {
        this.ContractorCheckInCheckOutRes = resp;
        this.toastr.success(this.ContractorCheckInCheckOutRes.message, this.translate.instant("toster_message.success"));
        this.dialogRef.close(this.ContractorCheckInCheckOutRes);
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
        });
      } else {
        if ('message' in error.error)
          this.toastr.error(error.error.message, this.translate.instant("toster_message.error"));
        else if ('Message' in error.error)
          this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
        else
          this.toastr.error(error.message, this.translate.instant("toster_message.error"));
        // this.toastr.error(error.error.Message, this.translate.instant("toster_message.error"));
      }
    })
  }

}
