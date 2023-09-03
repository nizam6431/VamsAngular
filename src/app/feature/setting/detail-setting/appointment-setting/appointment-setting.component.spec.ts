import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSettingComponent } from './appointment-setting.component';

describe('AppointmentSettingComponent', () => {
  let component: AppointmentSettingComponent;
  let fixture: ComponentFixture<AppointmentSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
