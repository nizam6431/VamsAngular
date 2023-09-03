import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPopUpComponent } from './common-pop-up.component';

describe('CommonPopUpComponent', () => {
  let component: CommonPopUpComponent;
  let fixture: ComponentFixture<CommonPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
