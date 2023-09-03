import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyVisitorComponent } from './privacy-policy-visitor.component';

describe('PrivacyPolicyVisitorComponent', () => {
  let component: PrivacyPolicyVisitorComponent;
  let fixture: ComponentFixture<PrivacyPolicyVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyPolicyVisitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
