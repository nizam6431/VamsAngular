import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ViewImagesComponent } from 'src/app/common-pages/view-images/view-images.component';
import { defaultVal, pagination } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { CommonPopUpComponent } from 'src/app/shared/components/common-pop-up/common-pop-up.component';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { environment } from 'src/environments/environment';
// import { ViewDocumentComponent } from '../view-document/view-document.component';


@Component({
  selector: 'app-document-grid-view',
  templateUrl: './document-grid-view.component.html',
  styleUrls: ['./document-grid-view.component.scss']
})
export class DocumentGridViewComponent implements OnInit {
  permissionKeyObj = permissionKeys;
  @Input() columns;
  displayColumns :any;
  dataSource:any ;
  @Output() rowData = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  @Input() type;
  @Input() resetLocation = false;
  @Input() displayedColumns;
  @Input() totalCount;
  @Input() pageSizeCount;
  @Input() postDocumentData;
  @Input() originalpostDocumentData;
  pageSize: defaultVal.pageSize;
  @Output() searchEmittor = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() onDataChange: EventEmitter<any> = new EventEmitter();
  @Output() companyValueChange = new EventEmitter();
  @Output() deleteAction = new EventEmitter();
  @Output() changeDocumentList = new EventEmitter();
  @Input() testDate ;
  isViewOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWONLY];
  isEditOnly: boolean = environment.Permissions[this.permissionKeyObj.MASTERVIEWEDIT];
  pageSizeOptions: number[] = [25, 50, 100];
  totalData = 0;
  pageEvent: PageEvent;
  public pageIndex: 1;
  columnKeys: any;
  hasSearchValue: boolean;
  searchKey: any;
  sortingDir: string = "";
  sortingColumn: string = "";
  showSearchBox = []
  productType: any;
  isEnterprise: boolean;
  mode: any;
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.displayColumns = this.columns
    console.log(this.dataSource,'datasource')
    console.log(this.postDocumentData,'post document data')
    this.dataSource = this.postDocumentData.map(ele => {
      //return ele.documentType.documentType
      return ele
      
    })
    if (changes && changes.totalCount && changes.totalCount.currentValue) {
      this.totalCount = changes.totalCount.currentValue;
    }
  }

  ngOnInit(): void {
    this.pageSizeOptions = Object.keys(pagination)
      .filter((k) => typeof pagination[k] === "number")
      .map((label) => pagination[label]);
    this.pageSize = defaultVal.pageSize;
    this.sortingDir = "ASC";
    this.columnKeys = this.columns.map((data) => data.key);
    this.productType = this.userService.getProductType();
  }

  showAction(action: string, event: Event, rowData: any) {
    event.stopPropagation();
    let obj = {
      mode: action,
      rowData: rowData
    }
   
    if (action == "delete") {
      this.openDialogForDelete(rowData);
    }
    this.modeEmmiter.emit(obj);
  }

  diplayRow(data) {
    this.rowData.emit(data);
  }

  showDocument(rowData) {
    rowData.event.stopPropagation();
    this.openDialogForDocument(rowData);
  }

  openDialogForDocument(rowData){
    const dialogRef = this.dialog.open(ViewImagesComponent, {
      data: {
        data: rowData,
        height:"300px"
      },
      panelClass: ["vams-dialog-confirm","vams-dialog-popup-view-detail","vams-dialog-fullview"]
    });
  }

  openDialogForDelete(rowData) {
    const dialogRef = this.dialog.open(CommonPopUpComponent, {
      data: {
        type: rowData.documentType,
        // name:  rowData.documentType,
        pop_up_type: "delete",
        icon: "assets/images/delete-icon.png"
      },
      panelClass: ["vams-dialog-confirm"]
    });

    dialogRef.afterClosed().subscribe((result) => {
       if (result) {
        this.changeDocumentList.emit(rowData.documentType)
        
       }
    });
  }
}
