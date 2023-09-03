import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReasonComponent } from './confirm-reason.component';

describe('ConfirmReasonComponent', () => {
  let component: ConfirmReasonComponent;
  let fixture: ComponentFixture<ConfirmReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
