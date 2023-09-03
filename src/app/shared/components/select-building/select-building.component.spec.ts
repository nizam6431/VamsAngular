import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBuildingComponent } from './select-building.component';

describe('SelectBuildingComponent', () => {
  let component: SelectBuildingComponent;
  let fixture: ComponentFixture<SelectBuildingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectBuildingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
