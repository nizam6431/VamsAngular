import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorReportDetailViewComponent } from './visitor-report-detail-view.component';

describe('VisitorReportDetailViewComponent', () => {
  let component: VisitorReportDetailViewComponent;
  let fixture: ComponentFixture<VisitorReportDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorReportDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorReportDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
