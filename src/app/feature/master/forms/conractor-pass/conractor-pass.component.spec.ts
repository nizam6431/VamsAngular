import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConractorPassComponent } from './conractor-pass.component';

describe('ConractorPassComponent', () => {
  let component: ConractorPassComponent;
  let fixture: ComponentFixture<ConractorPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConractorPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConractorPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
