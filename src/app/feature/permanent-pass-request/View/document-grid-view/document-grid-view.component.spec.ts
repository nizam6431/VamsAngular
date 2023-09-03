import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentGridViewComponent } from './document-grid-view.component';

describe('DocumentGridViewComponent', () => {
  let component: DocumentGridViewComponent;
  let fixture: ComponentFixture<DocumentGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentGridViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
