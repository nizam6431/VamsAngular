import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDevicePopupComponent } from './provider-device-popup.component';

describe('ProviderDevicePopupComponent', () => {
  let component: ProviderDevicePopupComponent;
  let fixture: ComponentFixture<ProviderDevicePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderDevicePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDevicePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
