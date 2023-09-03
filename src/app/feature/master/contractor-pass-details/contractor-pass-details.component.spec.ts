import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorPassDetailsComponent } from './contractor-pass-details.component';

describe('ContractorPassDetailsComponent', () => {
  let component: ContractorPassDetailsComponent;
  let fixture: ComponentFixture<ContractorPassDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorPassDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorPassDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
