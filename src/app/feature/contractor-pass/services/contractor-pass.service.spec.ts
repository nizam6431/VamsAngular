import { TestBed } from '@angular/core/testing';

import { ContractorPassService } from './contractor-pass.service';

describe('ContractorPassService', () => {
  let service: ContractorPassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractorPassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
