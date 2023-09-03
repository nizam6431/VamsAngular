import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLevel2Component } from './dashboard-level2.component';

describe('DashboardLevel2Component', () => {
  let component: DashboardLevel2Component;
  let fixture: ComponentFixture<DashboardLevel2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLevel2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLevel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
