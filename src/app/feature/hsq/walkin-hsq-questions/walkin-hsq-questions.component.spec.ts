import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinHsqQuestionsComponent } from './walkin-hsq-questions.component';

describe('WalkinHsqQuestionsComponent', () => {
  let component: WalkinHsqQuestionsComponent;
  let fixture: ComponentFixture<WalkinHsqQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinHsqQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinHsqQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
