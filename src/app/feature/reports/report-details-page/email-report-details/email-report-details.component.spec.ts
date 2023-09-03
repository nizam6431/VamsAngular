import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportDetailsComponent } from './appointment-report-details.component';

describe('AppointmentReportDetailsComponent', () => {
  let component: AppointmentReportDetailsComponent;
  let fixture: ComponentFixture<AppointmentReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentReportDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
