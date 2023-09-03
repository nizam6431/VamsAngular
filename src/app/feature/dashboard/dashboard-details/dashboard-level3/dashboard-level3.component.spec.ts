import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLevel3Component } from './dashboard-level3.component';

describe('DashboardLevel3Component', () => {
  let component: DashboardLevel3Component;
  let fixture: ComponentFixture<DashboardLevel3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLevel3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLevel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
