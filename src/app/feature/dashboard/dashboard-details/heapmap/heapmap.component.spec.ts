import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeapmapComponent } from './heapmap.component';

describe('HeapmapComponent', () => {
  let component: HeapmapComponent;
  let fixture: ComponentFixture<HeapmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeapmapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeapmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
