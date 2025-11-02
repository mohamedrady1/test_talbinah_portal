import { TestBed } from '@angular/core/testing';

import { RefreshUserPostsService } from './refresh-user-posts.service';

describe('RefreshUserPostsService', () => {
  let service: RefreshUserPostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshUserPostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
