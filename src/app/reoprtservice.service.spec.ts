import { TestBed } from '@angular/core/testing';

import { ReoprtserviceService } from './reoprtservice.service';

describe('ReoprtserviceService', () => {
  let service: ReoprtserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReoprtserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
