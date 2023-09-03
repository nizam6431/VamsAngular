import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLevel1Component } from './dashboard-level1.component';

describe('DashboardLevel1Component', () => {
  let component: DashboardLevel1Component;
  let fixture: ComponentFixture<DashboardLevel1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLevel1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLevel1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
