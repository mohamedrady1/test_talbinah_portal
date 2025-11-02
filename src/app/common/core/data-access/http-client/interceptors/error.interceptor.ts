import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationRoutesEnum, UserContextService } from '../../../../../domains';
import { ErrorHandlingService, handleApiErrors } from '../../../results';
import { inject, Injector } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Logger } from '../../../utilities';
import { Router } from '@angular/router';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const userContext = inject(UserContextService);
  const router = inject(Router);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const formattedError = handleApiErrors(error);
      Logger.error('Error Interceptor 1: ', formattedError);

      // Lazily resolve NotificationService to avoid circular dependency
      setTimeout(() => {
        // const notificationService = injector.get(NotificationService);
        // notificationService.showError(formattedError);
        Logger.error('Error Interceptor 2: ', formattedError);
      }, 0);

      if (error.status === 401 && !req.url.includes(AuthenticationRoutesEnum.LOGIN)) {
        userContext.clear();
        router.navigate([AuthenticationRoutesEnum.LOGIN]);
      }
      Logger.error('Error Interceptor 3: ', formattedError);

      return throwError(() => formattedError);
    })
  );
}
