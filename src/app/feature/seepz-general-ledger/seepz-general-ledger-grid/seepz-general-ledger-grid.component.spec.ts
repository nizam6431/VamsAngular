import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeepzGeneralLedgerGridComponent } from './seepz-general-ledger-grid.component';

describe('SeepzGeneralLedgerGridComponent', () => {
  let component: SeepzGeneralLedgerGridComponent;
  let fixture: ComponentFixture<SeepzGeneralLedgerGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeepzGeneralLedgerGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeepzGeneralLedgerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
