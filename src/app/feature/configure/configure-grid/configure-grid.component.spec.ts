import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureGridComponent } from './configure-grid.component';

describe('ConfigureGridComponent', () => {
  let component: ConfigureGridComponent;
  let fixture: ComponentFixture<ConfigureGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
