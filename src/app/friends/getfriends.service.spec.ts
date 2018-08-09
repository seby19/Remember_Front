import { TestBed, inject } from '@angular/core/testing';

import { GetfriendsService } from './getfriends.service';

describe('GetfriendsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetfriendsService]
    });
  });

  it('should be created', inject([GetfriendsService], (service: GetfriendsService) => {
    expect(service).toBeTruthy();
  }));
});
