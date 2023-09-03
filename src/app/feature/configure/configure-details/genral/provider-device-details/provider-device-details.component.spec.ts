import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderDeviceDetailsComponent } from './provider-device-details.component';

describe('ProviderDeviceDetailsComponent', () => {
  let component: ProviderDeviceDetailsComponent;
  let fixture: ComponentFixture<ProviderDeviceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderDeviceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderDeviceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
