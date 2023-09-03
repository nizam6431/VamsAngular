import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermanentPassPrintComponent } from './permanent-pass-print.component';

describe('PermanentPassPrintComponent', () => {
  let component: PermanentPassPrintComponent;
  let fixture: ComponentFixture<PermanentPassPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermanentPassPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermanentPassPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
