import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVisitorRestrictionComponent } from './confirm-visitor-restriction.component';

describe('ConfirmVisitorRestrictionComponent', () => {
  let component: ConfirmVisitorRestrictionComponent;
  let fixture: ComponentFixture<ConfirmVisitorRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmVisitorRestrictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmVisitorRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
