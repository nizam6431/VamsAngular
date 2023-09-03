import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailServerConfigComponent } from './email-server-config.component';

describe('EmailServerConfigComponent', () => {
  let component: EmailServerConfigComponent;
  let fixture: ComponentFixture<EmailServerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailServerConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
