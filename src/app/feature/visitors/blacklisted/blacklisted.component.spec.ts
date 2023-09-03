import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistedComponent } from './blacklisted.component';

describe('BlacklistedComponent', () => {
  let component: BlacklistedComponent;
  let fixture: ComponentFixture<BlacklistedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlacklistedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
