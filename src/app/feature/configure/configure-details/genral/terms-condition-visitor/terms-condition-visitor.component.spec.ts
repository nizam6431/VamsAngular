import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsConditionVisitorComponent } from './terms-condition-visitor.component';

describe('TermsConditionVisitorComponent', () => {
  let component: TermsConditionVisitorComponent;
  let fixture: ComponentFixture<TermsConditionVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsConditionVisitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
