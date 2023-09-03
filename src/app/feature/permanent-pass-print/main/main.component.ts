import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { defaultVal } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { permissionKeys } from 'src/app/shared/constants/permissionKeys';
import { Constants } from '../Constants/column';
import { PermanentPassPrintService } from '../Services/permanent-pass-print.service';
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from "src/app/shared/services/file-upload.service";
import { SpinnerOverlayService } from 'src/app/core/services/spinner-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @Output() companyValueChange = new EventEmitter();
  @Output() modeEmmiter = new EventEmitter();
  permissionKeyObj = permissionKeys;
  columns = Constants.permanent_pass_print;
  pageSize: number = defaultVal.pageSize;
  dataSource: any;
  totalCount: any;
  userDetails: any;
  passLoad:boolean= false;
  // getAllCardReq: { pageSize: any; pageIndex: any; orderBy: any; orderDirection: any; fromTime: any; toTime: any; globalSearch: any; level2Ids: any; level3Ids: any; status: any[]; };
  printPassDocu: any;
  printData = {mode:"",rowData:[], pageData:{}}
  spinnerSubscription: Subscription;
  dynamicPageData: any;
  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private userService: UserService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private fileUploadService: FileUploadService,
    private permanentPassPrintService: PermanentPassPrintService,
    private readonly spinnerOverlayService: SpinnerOverlayService
  ) { }

  ngOnInit(): void {
    this.getAllPErmanentPassPrintList();
  }
  getAllPErmanentPassPrintList(data?) { 
    // console.log(data,'data')
    let reqData = {
      pageSize: data && data.pageSize ? data.pageSize : defaultVal.pageSize,
      pageIndex: data && data.pageIndex ? data.pageIndex : defaultVal.pageIndex,
      orderBy: data && data.orderBy ? data.orderBy : "print",
      orderDirection: data && data.sortBy ? data.sortBy : "desc",
      globalSearch: data && data.globalSearch ? data.globalSearch : "",
      status:'Approved'
    };
    // console.log(reqData,'reqData')
    this.permanentPassPrintService.getAllPermanentPassPrint(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) {
          this.dataSource = resp.data.list;
          this.totalCount = resp.data.totalCount;
        }
      });
  }

  rowData(event){

  }

  changeMode(event) {
    if (event.selected) {
      this.printData.mode='multiple'
    } else {
      this.printData.mode = 'all';
    }
    this.printData.rowData = event.rowData;
    if( event.mode == 'single' ){
      this.singleMultiplePrint('single')
    }
    // if( event.mode == 'multiple' ){
    //   this.singleMultiplePrint('multiple')
    // }
  }
  singleMultiplePrint_(){
    //if( event.mode == 'all' ){
      this.singleMultiplePrint('all')
    //}
  }
  singleMultiplePrint_2(){ 
    if(this.printData.rowData.length > 0){
      if( this.printData.mode == 'multiple' || 'all' ){ 
        this.singleMultiplePrint('multiple')

        this.paginate( this.dynamicPageData)
      }
    }else{
      this.toastr.warning("Please Select Atleast One Print Pass")
    }
    
  }
  singleMultiplePrint(type){
  
      let all = false;
      let ids = this.printData.rowData;
      if(type == 'all'){
        all = true;
        ids = [];
      }
      let reqData = {
        passType:"Permanent",
        globalSearch: "",
        printAll: all,
        passIdToPrint: ids,
        includePrinted: type == 'all' ? false : true
      };
      this.permanentPassPrintService.printPermanentPass(reqData)
      .pipe(first())
      .subscribe((resp) => {
        if (resp.statusCode === 200 && resp.errors === null) { 

        this.spinnerSubscription= this.spinnerOverlayService.spinner$.subscribe();
          
          let url = "https://vams-development.s3.ap-south-1.amazonaws.com/"+resp.data.passPdfUrl;
          // 'https://vams-development.s3.ap-south-1.amazonaws.com/level1/536/Badge/a2320eb9-1aa8-48c6-88f3-b1701c97a968.pdf'
          this.getPdf_(resp.data.passPdfUrl);
          // https://vams-development.s3.ap-south-1.amazonaws.com/level1/339/Badge/3396407708.pdf
          if(type == 'single'){
            this.paginate( this.dynamicPageData)
          } else {
             this.paginate( this.dynamicPageData)
          }
         
          this.printData.rowData = [];
          this.printData.mode = '';
        }                                                                   
      }, (error) => {
        this.toastr.error(error.error.Message);
      });
      
    //}
  }
  private pdf: PDFDocumentProxy;
  onLoaded(pdf: PDFDocumentProxy) { 
    this.pdf = pdf;
    //this.isPdfLoaded = true;
  }
  print(htmlData = null) {
    if(htmlData == null){
      this.pdf.getData().then((u8) => {
          let blob = new Blob([u8.buffer], {
              type: 'application/pdf'
          });
          const blobUrl = window.URL.createObjectURL((blob));
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = blobUrl;
          document.body.appendChild(iframe);
          iframe.contentWindow.print();
      });
    }else{
      //var mywindow = window.open('', '', '');
				//mywindow.document.write('<html><title>Print</title><style>* {margin: 0; padding:0;}</style><body style="margin:0;padding:0;">');
				//mywindow.document.write(htmlData);
        //mywindow.document.write('</body></html>');
				//mywindow.document.close();
        setTimeout(() => {
          //mywindow.print();
          //mywindow.window.close();
        }, 0);
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(htmlData);
        iframe.contentWindow.document.close();
        setTimeout(() => {
          iframe.contentWindow.print();
          iframe.contentWindow.close();
          $("body > iframe:last-child").remove()
        }, 0);
    }
  }
  async getPdf_(url) {
    let parserContent = s3ParseUrl(url);
    let data = await this.fileUploadService.getContentFromS3Url(parserContent.key).promise();
    this.printPassDocu = this._base64ToArrayBuffer(this.encode(data?.Body));
     this.spinnerSubscription.unsubscribe()
     this.passLoad = false
    setTimeout(() => {       
      this.print()
    }, 1000);
    //this.printPdfCall(this.printPassDocu)
  }
  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  encode(data) {
    var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  }
  paginate(event) {
   this.printData.mode = 'all'
    this.dynamicPageData = event;
    this.getAllPErmanentPassPrintList( this.dynamicPageData)
  }
}
