import { TestBed } from '@angular/core/testing';

import { ViewPreferenceService } from './view-preference.service';

describe('ViewPreferenceService', () => {
  let service: ViewPreferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewPreferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
