import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderSetupPopupComponent } from './provider-setup-popup.component';

describe('ProviderSetupPopupComponent', () => {
  let component: ProviderSetupPopupComponent;
  let fixture: ComponentFixture<ProviderSetupPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderSetupPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderSetupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
