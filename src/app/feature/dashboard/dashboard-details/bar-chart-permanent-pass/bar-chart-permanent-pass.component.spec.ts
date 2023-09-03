import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartPermanentPassComponent } from './bar-chart-permanent-pass.component';

describe('BarChartPermanentPassComponent', () => {
  let component: BarChartPermanentPassComponent;
  let fixture: ComponentFixture<BarChartPermanentPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartPermanentPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartPermanentPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
