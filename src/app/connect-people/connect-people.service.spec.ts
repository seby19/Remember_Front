import { TestBed, inject } from '@angular/core/testing';

import { ConnectPeopleService } from './connect-people.service';

describe('ConnectPeopleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectPeopleService]
    });
  });

  it('should be created', inject([ConnectPeopleService], (service: ConnectPeopleService) => {
    expect(service).toBeTruthy();
  }));
});
