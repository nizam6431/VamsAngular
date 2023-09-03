import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsScreenForAccessQrCodeComponent } from './sms-screen-for-access-qr-code.component';

describe('SmsScreenForAccessQrCodeComponent', () => {
  let component: SmsScreenForAccessQrCodeComponent;
  let fixture: ComponentFixture<SmsScreenForAccessQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsScreenForAccessQrCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsScreenForAccessQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
