import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingLicenceComponent } from './driving-licence.component';

describe('DrivingLicenceComponent', () => {
  let component: DrivingLicenceComponent;
  let fixture: ComponentFixture<DrivingLicenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivingLicenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
