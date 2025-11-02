import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { NetworkStatusService } from '../../../network-status';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { ApiErrorFactory } from '../../../results';
import { take, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export function offlineInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const networkStatusService = inject(NetworkStatusService);
  const platformId = inject(PLATFORM_ID);

  // Always allow requests during SSR
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  return networkStatusService.isOnline$().pipe(
    take(1),
    switchMap((isOnline) => {
      if (!isOnline) {
        return throwError(() =>
          ApiErrorFactory.create(0, 'No internet connection')
        );
      }
      return next(req);
    })
  );
}
