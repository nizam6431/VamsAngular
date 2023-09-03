import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioSecurityDeviceFormComponent } from './bio-security-device-form.component';

describe('BioSecurityDeviceFormComponent', () => {
  let component: BioSecurityDeviceFormComponent;
  let fixture: ComponentFixture<BioSecurityDeviceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioSecurityDeviceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioSecurityDeviceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
