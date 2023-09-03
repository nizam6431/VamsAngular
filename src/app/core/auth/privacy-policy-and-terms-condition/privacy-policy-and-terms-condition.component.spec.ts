import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyAndTermsConditionComponent } from './privacy-policy-and-terms-condition.component';

describe('PrivacyPolicyAndTermsConditionComponent', () => {
  let component: PrivacyPolicyAndTermsConditionComponent;
  let fixture: ComponentFixture<PrivacyPolicyAndTermsConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyAndTermsConditionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyAndTermsConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
