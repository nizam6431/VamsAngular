import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioSecurityDeviceListComponent } from './bio-security-device-list.component';

describe('BioSecurityDeviceListComponent', () => {
  let component: BioSecurityDeviceListComponent;
  let fixture: ComponentFixture<BioSecurityDeviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioSecurityDeviceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioSecurityDeviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
