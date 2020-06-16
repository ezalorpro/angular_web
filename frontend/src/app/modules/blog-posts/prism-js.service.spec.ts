import { TestBed } from '@angular/core/testing';

import { PrismJSService } from './prism-js.service';

describe('PrismJSService', () => {
  let service: PrismJSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrismJSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
