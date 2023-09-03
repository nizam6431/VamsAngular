import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSubContentComponent } from './configure-sub-content.component';

describe('ConfigureSubContentComponent', () => {
  let component: ConfigureSubContentComponent;
  let fixture: ComponentFixture<ConfigureSubContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureSubContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSubContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
