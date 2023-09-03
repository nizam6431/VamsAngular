import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSidebarComponent } from './configure-sidebar.component';

describe('ConfigureSidebarComponent', () => {
  let component: ConfigureSidebarComponent;
  let fixture: ComponentFixture<ConfigureSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
