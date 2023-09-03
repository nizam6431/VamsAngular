import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPageViewComponent } from './detail-page-view.component';

describe('DetailPageViewComponent', () => {
  let component: DetailPageViewComponent;
  let fixture: ComponentFixture<DetailPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPageViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
