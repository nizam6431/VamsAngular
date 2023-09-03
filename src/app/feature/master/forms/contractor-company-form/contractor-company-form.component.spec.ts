import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorCompanyFormComponent } from './contractor-company-form.component';

describe('ContractorCompanyFormComponent', () => {
  let component: ContractorCompanyFormComponent;
  let fixture: ComponentFixture<ContractorCompanyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorCompanyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorCompanyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
