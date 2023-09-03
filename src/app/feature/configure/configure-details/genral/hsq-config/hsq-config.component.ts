import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ConfigureService } from '../../../services/configure.service';
import { Constants } from 'src/app/feature/configure/constants/column';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AddQuestionComponent } from '../../../popup/add-question/add-question.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-hsq-config',
  templateUrl: './hsq-config.component.html',
  styleUrls: ['./hsq-config.component.scss']
})
export class HsqConfigComponent implements OnInit {

  columns: any[] = Constants.hsq_questions;
  dataSource = [];
  data: any;
  mode: string = "show";
  @Input() hsqQuestionAdd = null;
  @Input() pageSize: number;
  @Input() type;
  @Input() resetLocation: boolean = false;
  // pageSize: any;
  totalCount: number;
  noQuestionsForEnterprise: boolean = false;
  level2Id: string = "";
  noQuestionsForLocation: boolean = false;

  constructor(
    private configureService: ConfigureService,
    private translate: TranslateService,
    private toastr: ToastrService,
    public dialog: MatDialog,

  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hsqQuestionAdd) {
      this.allHSQQuestion();
    }
  }

  ngOnInit(): void {
    if (this.type == "HSQ_screening_questionnaire") {
      this.configureService.setLocation(null);
    }
    this.allHSQQuestion();
  }
  hsqQuestionnaireEvent(event) {
    this.data = event;
    this.allHSQQuestion(this.data);
  }
  allHSQQuestion(data?) {
    let noSearch = (data && data.globalSearch && data.globalSearch.length) ? false : true;
    let requestObject = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : "name",
      orderDirection: data && data.sortBy ? data.sortBy : "ASC",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      searchByStatus: data && data.searchByStatus ? data.searchByStatus : "ACTIVE"
    };
    if (this.level2Id) {
      requestObject['level2Id'] = this.level2Id;
    }

    this.configureService.hsqQuestionList(requestObject).subscribe(res => {
      if (res.statusCode == 200) {
        if (noSearch && res.data.noQuestionsForLocation) {
          this.dataSource = [];
          this.pageSize = defaultVal.pageSize
          this.totalCount = 0
          this.level2Question();
        } else if (noSearch && res.data.noQuestionsForEnterprise) {
          this.noQuestionsForEnterprise = true;
        } else {
          this.noQuestionsForEnterprise = false;
          this.dataSource = res.data.list || [];
          this.pageSize = res.data.pageCount || 0;
          this.totalCount = res.data.totalCount || 0;
        }
      } else {
        this.toastr.error(res.message);
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        });
      } else {
        this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
      }
    })
  }

  changeMode(event) {
    this.data = event.rowData;
    this.mode = event.mode;
    if (this.mode == "delete") {
      this.openDialogForDelete(this.data);
    } else {
      this.openDialog()
    }
  }

  rowData(event: any) {
    this.data = event;
    this.mode = "show";
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddQuestionComponent, {
      height: '100%',
      position: { right: '0' },
      data: { "data": this.data, "formType": "HSQ_screening_questionnaire", "mode": this.mode },
      panelClass: ['animate__animated', 'vams-dialog', 'animate__slideInRight']
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.statusCode == 200) {
        this.allHSQQuestion();
      }
      // this.dialogClosed(result);
    });
  }

  openDialogForDelete(rowData: any) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "question",
        name: rowData.question,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteHsqQuestion(rowData);
      }
    });
  }

  level2Question() {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: "question_list_empty",
        pop_up_type: "question_list_empty",
        icon: "assets/images/alert.png",
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //TODO API call to copy all default apis for selected location
        this.addQuestionsForLocation()
      } else {
        this.level2Id = null;
        this.resetLocation = true;
        this.allHSQQuestion();
      }
    });
  }

  addQuestionsForLocation() {
    let requestObj = {
      "isDefaultHsqAdd": true,
      "level2Id": this.level2Id
    }
    this.configureService.addHsqQuestionsForLocation(requestObj).subscribe(res => {
      if (res) {
        this.toastr.success(res.message, this.translate.instant("pop_up_messages.success"));
        this.allHSQQuestion();
      }
    }, (error) => {
      if ("errors" in error.error) {
        error.error.errors.forEach((element) => {
          this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
        });
      } else {
        this.toastr.error(error.message, this.translate.instant("pop_up_messages.error"));
      }
    })

  }

  deleteHsqQuestion(event) {
    let obj = {
      id: event.id,
    };
    this.configureService
      .deleteHsqQuestion(obj)
      .pipe(first())
      .subscribe(resp => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.toastr.success(resp.message ? resp.message : this.translate.instant("pop_up_messages.question_deleted_sucessfully"), this.translate.instant("pop_up_messages.success"))
          this.allHSQQuestion();
        }
      }, error => {
        if ('errors' in error.error) {
          error.error.errors.forEach(element => {
            this.toastr.error(element.errorMessages[0], this.translate.instant("pop_up_messages.error"));
          })
        }
        else {
          this.toastr.error(error.error.Message, this.translate.instant("pop_up_messages.error"));
        }
      });
  }

  locationChanged(event) {
    this.resetLocation = false;
    this.level2Id = event;
    this.allHSQQuestion();
  }
}
