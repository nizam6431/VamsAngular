import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUnitComponent } from './company-unit.component';

describe('CompanyUnitComponent', () => {
  let component: CompanyUnitComponent;
  let fixture: ComponentFixture<CompanyUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyUnitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
