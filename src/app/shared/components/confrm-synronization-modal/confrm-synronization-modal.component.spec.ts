import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrmSynronizationModalComponent } from './confrm-synronization-modal.component';

describe('ConfrmSynronizationModalComponent', () => {
  let component: ConfrmSynronizationModalComponent;
  let fixture: ComponentFixture<ConfrmSynronizationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfrmSynronizationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfrmSynronizationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
