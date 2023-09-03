import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSettingsComponent } from './visitor-settings.component';

describe('VisitorSettingsComponent', () => {
  let component: VisitorSettingsComponent;
  let fixture: ComponentFixture<VisitorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
