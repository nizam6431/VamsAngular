import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSettingComponent } from './hardware-setting.component';

describe('HardwareSettingComponent', () => {
  let component: HardwareSettingComponent;
  let fixture: ComponentFixture<HardwareSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardwareSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
