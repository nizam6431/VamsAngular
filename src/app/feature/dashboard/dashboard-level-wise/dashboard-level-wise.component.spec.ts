import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLevelWiseComponent } from './dashboard-level-wise.component';

describe('DashboardLevelWiseComponent', () => {
  let component: DashboardLevelWiseComponent;
  let fixture: ComponentFixture<DashboardLevelWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardLevelWiseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLevelWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
