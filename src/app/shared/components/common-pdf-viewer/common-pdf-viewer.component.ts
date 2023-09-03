import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-pdf-viewer',
  templateUrl: './common-pdf-viewer.component.html',
  styleUrls: ['./common-pdf-viewer.component.scss']
})
export class CommonPdfViewerComponent implements OnInit {
  @Input() pdfUrl;
  doc: string ="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"

  constructor() { }

  ngOnInit(): void {
    console.log(this.pdfUrl)
  }

}
