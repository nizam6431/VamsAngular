import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsServerConfigComponent } from './sms-server-config.component';

describe('SmsServerConfigComponent', () => {
  let component: SmsServerConfigComponent;
  let fixture: ComponentFixture<SmsServerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsServerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
