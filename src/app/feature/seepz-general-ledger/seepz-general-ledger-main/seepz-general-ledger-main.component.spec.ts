import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeepzGeneralLedgerMainComponent } from './seepz-general-ledger-main.component';

describe('SeepzGeneralLedgerMainComponent', () => {
  let component: SeepzGeneralLedgerMainComponent;
  let fixture: ComponentFixture<SeepzGeneralLedgerMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeepzGeneralLedgerMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeepzGeneralLedgerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
