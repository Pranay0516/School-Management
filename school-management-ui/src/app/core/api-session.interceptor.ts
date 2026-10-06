import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from './api-base';
import { AUTH_TOKEN_STORAGE_KEY } from './auth.service';

export const apiSessionInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_BASE_URL)) return next(request);
  const token = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return next(token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request);
};
