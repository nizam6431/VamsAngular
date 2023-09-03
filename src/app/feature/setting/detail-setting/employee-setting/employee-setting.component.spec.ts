import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSettingComponent } from './employee-setting.component';

describe('EmployeeSettingComponent', () => {
  let component: EmployeeSettingComponent;
  let fixture: ComponentFixture<EmployeeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
