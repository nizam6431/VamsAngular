import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorPassComponent } from './contractor-pass.component';

describe('ContractorPassComponent', () => {
  let component: ContractorPassComponent;
  let fixture: ComponentFixture<ContractorPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
