import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from './api-base';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const apiSessionInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }

  let apiRequest = request.clone({ withCredentials: true });
  if (!SAFE_METHODS.has(request.method)) {
    const csrfCookie = document.cookie
      .split('; ')
      .find(cookie => cookie.startsWith('XSRF-TOKEN='))
      ?.slice('XSRF-TOKEN='.length);
    if (csrfCookie) {
      apiRequest = apiRequest.clone({
        setHeaders: { 'X-XSRF-TOKEN': decodeURIComponent(csrfCookie) },
      });
    }
  }

  return next(apiRequest);
};
