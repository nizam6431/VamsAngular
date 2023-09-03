import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInWithoutBioComponent } from './check-in-without-bio.component';

describe('CheckInWithoutBioComponent', () => {
  let component: CheckInWithoutBioComponent;
  let fixture: ComponentFixture<CheckInWithoutBioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckInWithoutBioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInWithoutBioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
