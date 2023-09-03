import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BioSecurityServerDetailComponent } from './bio-security-server-detail.component';

describe('BioSecurityServerDetailComponent', () => {
  let component: BioSecurityServerDetailComponent;
  let fixture: ComponentFixture<BioSecurityServerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BioSecurityServerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BioSecurityServerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
