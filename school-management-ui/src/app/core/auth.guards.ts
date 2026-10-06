import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccountRole, AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.currentUser()) return true;
  return auth.restoreSession().pipe(map(user => user ? true : router.createUrlTree(['/'])));
};

export const roleGuard: CanActivateFn = route => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = route.data['roles'] as AccountRole[] | undefined;
  if (auth.currentUser()) {
    return allowedRoles?.includes(auth.currentUser()!.role) ?? true
      ? true
      : router.createUrlTree(['/']);
  }
  return auth.restoreSession().pipe(map(user =>
    user && (!allowedRoles || allowedRoles.includes(user.role))
      ? true
      : router.createUrlTree(['/']),
  ));
};
