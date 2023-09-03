import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinNewComponent } from './walkin-new.component';

describe('WalkinNewComponent', () => {
  let component: WalkinNewComponent;
  let fixture: ComponentFixture<WalkinNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalkinNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalkinNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
