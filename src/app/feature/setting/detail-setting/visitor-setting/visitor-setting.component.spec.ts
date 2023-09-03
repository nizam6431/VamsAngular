import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorSettingComponent } from './visitor-setting.component';

describe('VisitorSettingComponent', () => {
  let component: VisitorSettingComponent;
  let fixture: ComponentFixture<VisitorSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
