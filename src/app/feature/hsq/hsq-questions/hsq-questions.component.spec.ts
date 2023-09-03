import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsqQuestionsComponent } from './hsq-questions.component';

describe('HsqQuestionsComponent', () => {
  let component: HsqQuestionsComponent;
  let fixture: ComponentFixture<HsqQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsqQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsqQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
