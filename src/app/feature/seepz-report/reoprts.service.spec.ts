import { TestBed } from '@angular/core/testing';

import { ReoprtsService } from './reoprts.service';

describe('ReoprtsService', () => {
  let service: ReoprtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReoprtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
