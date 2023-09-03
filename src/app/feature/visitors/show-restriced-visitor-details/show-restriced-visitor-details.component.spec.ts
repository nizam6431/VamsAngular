import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRestricedVisitorDetailsComponent } from './show-restriced-visitor-details.component';

describe('ShowRestricedVisitorDetailsComponent', () => {
  let component: ShowRestricedVisitorDetailsComponent;
  let fixture: ComponentFixture<ShowRestricedVisitorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRestricedVisitorDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRestricedVisitorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
