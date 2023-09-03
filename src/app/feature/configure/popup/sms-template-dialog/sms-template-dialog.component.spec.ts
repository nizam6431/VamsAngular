import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsTemplateDialogComponent } from './sms-template-dialog.component';

describe('SmsTemplateDialogComponent', () => {
  let component: SmsTemplateDialogComponent;
  let fixture: ComponentFixture<SmsTemplateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsTemplateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsTemplateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
