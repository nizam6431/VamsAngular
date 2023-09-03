import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPassCheckinCheckoutComponent } from './daily-pass-checkin-checkout.component';

describe('DailyPassCheckinCheckoutComponent', () => {
  let component: DailyPassCheckinCheckoutComponent;
  let fixture: ComponentFixture<DailyPassCheckinCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyPassCheckinCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPassCheckinCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
