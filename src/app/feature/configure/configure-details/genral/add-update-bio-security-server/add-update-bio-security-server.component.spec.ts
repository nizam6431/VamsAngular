import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBioSecurityServerComponent } from './add-update-bio-security-server.component';

describe('AddUpdateBioSecurityServerComponent', () => {
  let component: AddUpdateBioSecurityServerComponent;
  let fixture: ComponentFixture<AddUpdateBioSecurityServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateBioSecurityServerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBioSecurityServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
