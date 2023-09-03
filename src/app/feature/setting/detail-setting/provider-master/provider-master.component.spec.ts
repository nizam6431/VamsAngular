import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderMasterComponent } from './provider-master.component';

describe('ProviderMasterComponent', () => {
  let component: ProviderMasterComponent;
  let fixture: ComponentFixture<ProviderMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
