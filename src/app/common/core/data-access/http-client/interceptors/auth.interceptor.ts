import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { UserContextService } from '../../../../../domains';
import { StorageKeys } from '../../../../../shared';
import { StorageService } from '../../storages';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const userContext = inject(UserContextService);
  const storage = inject(StorageService);

  // Prefer storage, fallback to context if needed
  const token = storage.getItem<string>(StorageKeys.TOKEN) ?? userContext.token() ?? null;

  // Define cloned request depending on token
  const authReq = token
    ? req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
    : req;

  return next(authReq);
}
