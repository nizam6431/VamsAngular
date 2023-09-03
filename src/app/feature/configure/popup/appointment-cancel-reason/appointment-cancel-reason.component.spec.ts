import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentCancelReasonComponent } from './appointment-cancel-reason.component';

describe('AppointmentCancelReasonComponent', () => {
  let component: AppointmentCancelReasonComponent;
  let fixture: ComponentFixture<AppointmentCancelReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentCancelReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentCancelReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
