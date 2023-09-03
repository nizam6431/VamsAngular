import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAppointmentScheduleComponent } from './share-appointment-schedule.component';

describe('ShareAppointmentScheduleComponent', () => {
  let component: ShareAppointmentScheduleComponent;
  let fixture: ComponentFixture<ShareAppointmentScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareAppointmentScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAppointmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
