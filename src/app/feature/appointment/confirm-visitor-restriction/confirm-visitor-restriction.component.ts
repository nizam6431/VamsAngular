import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-visitor-restriction',
  templateUrl: './confirm-visitor-restriction.component.html',
  styleUrls: ['./confirm-visitor-restriction.component.css']
})
export class ConfirmVisitorRestrictionComponent implements OnInit {
  public toDelete: string;
  public name: string;
  fullnameTranslate: { fullname: string; };
  resheduleTranslate: {scheduleText: string};
  visitorData: any;
  remark:{remark: string};
  constructor(
    private dialogRef: MatDialogRef<ConfirmVisitorRestrictionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService) { }
  ngOnInit(): void {
    console.log(this.data,'data...')
    // this.fullnameTranslate = { fullname: this.data?.firstName+" "+this.data?.lastName};
    this.fullnameTranslate = { fullname: this.data?.name};
    this.visitorData =   this.data.visitorData;
    this.remark = (this.data.visitorRemark)
    console.log(this.data)
    if (this.data.apnt_type == "reschedule") {
      this.resheduleTranslate = { scheduleText:this.translate.instant("Reschedule.Reschedule_label") };
    } else {
       this.resheduleTranslate = (this.data?.rescheduleText) ? {scheduleText:this.translate.instant("Reschedule.Reschedule_label")} :  {scheduleText:this.translate.instant("Reschedule.Schedule_label")};
    }
   
  }

  close(decision: boolean) {
    this.dialogRef.close(decision);
  }

}
