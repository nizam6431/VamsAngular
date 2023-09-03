import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateCardPopupComponent } from './rate-card-popup.component';

describe('RateCardPopupComponent', () => {
  let component: RateCardPopupComponent;
  let fixture: ComponentFixture<RateCardPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateCardPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
