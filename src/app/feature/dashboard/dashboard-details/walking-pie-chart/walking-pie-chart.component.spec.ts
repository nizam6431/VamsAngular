import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkingPieChartComponent } from './walking-pie-chart.component';

describe('WalkingPieChartComponent', () => {
  let component: WalkingPieChartComponent;
  let fixture: ComponentFixture<WalkingPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkingPieChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkingPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
