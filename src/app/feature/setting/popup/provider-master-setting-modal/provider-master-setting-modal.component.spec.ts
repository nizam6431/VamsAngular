import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMasterSettingModalComponent } from './provider-master-setting-modal.component';

describe('ProviderMasterSettingModalComponent', () => {
  let component: ProviderMasterSettingModalComponent;
  let fixture: ComponentFixture<ProviderMasterSettingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderMasterSettingModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMasterSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
