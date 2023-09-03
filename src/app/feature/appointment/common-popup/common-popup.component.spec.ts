import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPopupComponent } from './common-popup.component';

describe('CommonPopupComponent', () => {
  let component: CommonPopupComponent;
  let fixture: ComponentFixture<CommonPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
