import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinVisitorCheckinComponent } from './walkin-visitor-checkin.component';

describe('WalkinVisitorCheckinComponent', () => {
  let component: WalkinVisitorCheckinComponent;
  let fixture: ComponentFixture<WalkinVisitorCheckinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinVisitorCheckinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinVisitorCheckinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
