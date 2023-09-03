import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorConfigPopupComponent } from './contractor-config-popup.component';

describe('ContractorConfigPopupComponent', () => {
  let component: ContractorConfigPopupComponent;
  let fixture: ComponentFixture<ContractorConfigPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractorConfigPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorConfigPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
