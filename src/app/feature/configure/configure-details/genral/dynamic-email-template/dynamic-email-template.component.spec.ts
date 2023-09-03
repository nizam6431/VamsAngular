import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicEmailTemplateComponent } from './dynamic-email-template.component';

describe('DynamicEmailTemplateComponent', () => {
  let component: DynamicEmailTemplateComponent;
  let fixture: ComponentFixture<DynamicEmailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicEmailTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicEmailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
