import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLocationComponent } from './sub-location.component';

describe('SubLocationComponent', () => {
  let component: SubLocationComponent;
  let fixture: ComponentFixture<SubLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
