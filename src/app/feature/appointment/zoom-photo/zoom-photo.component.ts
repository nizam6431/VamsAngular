import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Panzoom, { PanzoomObject } from '@panzoom/panzoom'

@Component({
  selector: 'app-zoom-photo',
  templateUrl: './zoom-photo.component.html',
  styleUrls: ['./zoom-photo.component.css']
})
export class ZoomPhotoComponent implements OnInit, AfterViewInit {

  @Input()
  thumbnailUrl: string;
  panzoom: PanzoomObject;
  @ViewChild('thumbnail', { static: false }) scene: ElementRef;
  constructor(private dialogService: NgbModal) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // panzoom(document.querySelector('#scene'));
    this.panzoom = Panzoom(this.scene.nativeElement, {
      bounds: false,
      maxScale: 5,
      boundsPadding: 0.1
    });
  }

  zoomin() {
    this.panzoom.zoomIn()
  }

  reset() {
    this.panzoom.reset()
  }

  zoomout() {
    this.panzoom.zoomOut()
  }

  closeModal() {
    this.dialogService.dismissAll("");
  }
}
