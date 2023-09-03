import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowVisitorsDetailsComponent } from './show-visitors-details.component';

describe('ShowVisitorsDetailsComponent', () => {
  let component: ShowVisitorsDetailsComponent;
  let fixture: ComponentFixture<ShowVisitorsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowVisitorsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowVisitorsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
