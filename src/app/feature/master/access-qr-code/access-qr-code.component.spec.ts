import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessQrCodeComponent } from './access-qr-code.component';

describe('AccessQrCodeComponent', () => {
  let component: AccessQrCodeComponent;
  let fixture: ComponentFixture<AccessQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessQrCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
