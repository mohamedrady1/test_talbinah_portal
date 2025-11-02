import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { LanguageService } from '../../../app-language';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { getB2BValue } from '../utils';

export function headersInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const _LanguageService = inject(LanguageService);
  const currentLang = _LanguageService.getCurrentLanguage();
  const talbinahToken = 's4kl2fC852tSpczXsdAJIH6fORLbgG4zfwVJVjLlolop74kUUyT0aYRxZSGAQXRB';
  const deviceType = 'web';
  const b2bValue = getB2BValue();

  // Ensure language is either 'ar' or 'en'
  const acceptLanguage = currentLang === 'ar' ? 'ar' : 'en';

  let headers = req.headers
    .set('Accept-Language', acceptLanguage)
    .set('talbinah-token', talbinahToken)
    .set('Device-Type', deviceType)
    .set('web-type', 'portal')
    .set('platform', 'portal');

  // Add b2b header if value exists
  if (b2bValue) {
    headers = headers.set('b2b', b2bValue);
  }

  const modifiedReq = req.clone({ headers });

  return next(modifiedReq);
}
