import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAppointmentFormComponent } from './share-appointment-form.component';

describe('ShareAppointmentFormComponent', () => {
  let component: ShareAppointmentFormComponent;
  let fixture: ComponentFixture<ShareAppointmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareAppointmentFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareAppointmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
