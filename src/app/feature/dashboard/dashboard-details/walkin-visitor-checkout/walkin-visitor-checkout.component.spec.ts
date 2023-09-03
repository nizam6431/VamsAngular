import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinVisitorCheckoutComponent } from './walkin-visitor-checkout.component';

describe('WalkinVisitorCheckoutComponent', () => {
  let component: WalkinVisitorCheckoutComponent;
  let fixture: ComponentFixture<WalkinVisitorCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinVisitorCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinVisitorCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
