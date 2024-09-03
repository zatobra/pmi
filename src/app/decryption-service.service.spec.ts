import { TestBed } from '@angular/core/testing';

import { DecryptionServiceService } from './decryption-service.service';

describe('DecryptionServiceService', () => {
  let service: DecryptionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecryptionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
