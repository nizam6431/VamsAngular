import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsqConfigComponent } from './hsq-config.component';

describe('HsqConfigComponent', () => {
  let component: HsqConfigComponent;
  let fixture: ComponentFixture<HsqConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsqConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsqConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
