import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanDrivingLicenceComponent } from './scan-driving-licence.component';

describe('ScanDrivingLicenceComponent', () => {
  let component: ScanDrivingLicenceComponent;
  let fixture: ComponentFixture<ScanDrivingLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanDrivingLicenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanDrivingLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
