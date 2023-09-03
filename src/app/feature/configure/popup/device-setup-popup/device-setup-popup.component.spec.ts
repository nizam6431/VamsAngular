import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSetupPopupComponent } from './device-setup-popup.component';

describe('DeviceSetupPopupComponent', () => {
  let component: DeviceSetupPopupComponent;
  let fixture: ComponentFixture<DeviceSetupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceSetupPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSetupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
