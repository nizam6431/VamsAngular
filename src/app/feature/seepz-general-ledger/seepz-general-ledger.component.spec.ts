import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeepzGeneralLedgerComponent } from './seepz-general-ledger.component';

describe('SeepzGeneralLedgerComponent', () => {
  let component: SeepzGeneralLedgerComponent;
  let fixture: ComponentFixture<SeepzGeneralLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeepzGeneralLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeepzGeneralLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
