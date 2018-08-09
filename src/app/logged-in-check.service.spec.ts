import { TestBed, inject } from '@angular/core/testing';

import { LoggedInCheckService } from './logged-in-check.service';

describe('LoggedInCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInCheckService]
    });
  });

  it('should be created', inject([LoggedInCheckService], (service: LoggedInCheckService) => {
    expect(service).toBeTruthy();
  }));
});
