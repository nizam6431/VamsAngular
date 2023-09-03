import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexDetailsFormComponent } from './complex-details-form.component';

describe('ComplexDetailsFormComponent', () => {
  let component: ComplexDetailsFormComponent;
  let fixture: ComponentFixture<ComplexDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexDetailsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
