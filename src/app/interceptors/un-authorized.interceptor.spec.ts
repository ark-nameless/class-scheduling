import { TestBed } from '@angular/core/testing';

import { UnAuthorizedInterceptor } from './un-authorized.interceptor';

describe('UnAuthorizedInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UnAuthorizedInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UnAuthorizedInterceptor = TestBed.inject(UnAuthorizedInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
