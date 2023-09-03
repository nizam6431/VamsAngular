import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassValidityComponent } from './pass-validity.component';

describe('PassValidityComponent', () => {
  let component: PassValidityComponent;
  let fixture: ComponentFixture<PassValidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassValidityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassValidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
