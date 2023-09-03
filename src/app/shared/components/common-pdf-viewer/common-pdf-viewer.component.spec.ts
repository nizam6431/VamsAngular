import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPdfViewerComponent } from './common-pdf-viewer.component';

describe('CommonPdfViewerComponent', () => {
  let component: CommonPdfViewerComponent;
  let fixture: ComponentFixture<CommonPdfViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPdfViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPdfViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
