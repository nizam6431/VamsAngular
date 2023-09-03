import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorConfigComponent } from './contractor-config.component';

describe('ContractorConfigComponent', () => {
  let component: ContractorConfigComponent;
  let fixture: ComponentFixture<ContractorConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
