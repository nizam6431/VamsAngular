import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkErrorComponent } from './link-error.component';

describe('LinkErrorComponent', () => {
  let component: LinkErrorComponent;
  let fixture: ComponentFixture<LinkErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
