import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureContentComponent } from './configure-content.component';

describe('ConfigureContentComponent', () => {
  let component: ConfigureContentComponent;
  let fixture: ComponentFixture<ConfigureContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
