import { TestBed, inject } from '@angular/core/testing';

import { JwttokenService } from './jwttoken.service';

describe('JwttokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwttokenService]
    });
  });

  it('should be created', inject([JwttokenService], (service: JwttokenService) => {
    expect(service).toBeTruthy();
  }));
});
