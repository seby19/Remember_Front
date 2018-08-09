import { TestBed, inject } from '@angular/core/testing';

import { LoginHomeService } from './login-home.service';

describe('LoginHomeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginHomeService]
    });
  });

  it('should be created', inject([LoginHomeService], (service: LoginHomeService) => {
    expect(service).toBeTruthy();
  }));
});
