import { ComponentFixture, TestBed } from '@angular/core/testing';

import { L3CompanyDetailsComponent } from './l3-company-details.component';

describe('L3CompanyDetailsComponent', () => {
  let component: L3CompanyDetailsComponent;
  let fixture: ComponentFixture<L3CompanyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ L3CompanyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(L3CompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
