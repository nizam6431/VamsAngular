import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRejectReasonMasterComponent } from './appointment-reject-reason-master.component';

describe('AppointmentRejectReasonMasterComponent', () => {
  let component: AppointmentRejectReasonMasterComponent;
  let fixture: ComponentFixture<AppointmentRejectReasonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentRejectReasonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentRejectReasonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
