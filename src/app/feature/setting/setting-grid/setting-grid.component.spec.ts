import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingGridComponent } from './setting-grid.component';

describe('SettingGridComponent', () => {
  let component: SettingGridComponent;
  let fixture: ComponentFixture<SettingGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
