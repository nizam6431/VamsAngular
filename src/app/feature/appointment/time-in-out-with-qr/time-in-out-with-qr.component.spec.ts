import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInOutWithQrComponent } from './time-in-out-with-qr.component';

describe('TimeInOutWithQrComponent', () => {
  let component: TimeInOutWithQrComponent;
  let fixture: ComponentFixture<TimeInOutWithQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeInOutWithQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeInOutWithQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
