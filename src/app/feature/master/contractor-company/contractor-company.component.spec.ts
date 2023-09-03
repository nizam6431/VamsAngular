import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorCompanyComponent } from './contractor-company.component';

describe('ContractorCompanyComponent', () => {
  let component: ContractorCompanyComponent;
  let fixture: ComponentFixture<ContractorCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
