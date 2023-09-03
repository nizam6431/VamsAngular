import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinVisitorReportComponent } from './walkin-visitor-report.component';

describe('WalkinVisitorReportComponent', () => {
  let component: WalkinVisitorReportComponent;
  let fixture: ComponentFixture<WalkinVisitorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinVisitorReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinVisitorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
