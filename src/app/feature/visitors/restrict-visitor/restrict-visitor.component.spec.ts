import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictVisitorComponent } from './restrict-visitor.component';

describe('RestrictVisitorComponent', () => {
  let component: RestrictVisitorComponent;
  let fixture: ComponentFixture<RestrictVisitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictVisitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictVisitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
