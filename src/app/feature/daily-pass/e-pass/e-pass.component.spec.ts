import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPassComponent } from './e-pass.component';

describe('EPassComponent', () => {
  let component: EPassComponent;
  let fixture: ComponentFixture<EPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
