import { TestBed } from '@angular/core/testing';

import { DetailsPageService } from './details-page.service';

describe('DetailsPageService', () => {
  let service: DetailsPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
