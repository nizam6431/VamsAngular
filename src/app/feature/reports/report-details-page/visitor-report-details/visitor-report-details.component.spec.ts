import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorReportDetailsComponent } from './visitor-report-details.component';

describe('VisitorReportDetailsComponent', () => {
  let component: VisitorReportDetailsComponent;
  let fixture: ComponentFixture<VisitorReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
