import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { API_BASE_URL } from './api-base';

export type AccountRole = 'ADMIN' | 'TEACHER';

export interface AuthUser {
  id: number;
  username: string;
  role: AccountRole;
  teacherId: number | null;
  teacherName: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<AuthUser | null>(null);

  signIn(username: string, password: string): Observable<AuthUser> {
    return this.csrf().pipe(
      switchMap(() => this.http.post<AuthUser>(`${API_BASE_URL}/auth/login`, { username, password })),
      tap(user => this.currentUser.set(user)),
      switchMap(user => this.csrf().pipe(map(() => user))),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          const message = error.error?.message ?? error.error?.error ?? error.message;
          return throwError(() => new Error(message));
        }
        return throwError(() => error);
      }),
    );
  }

  restoreSession(): Observable<AuthUser | null> {
    return this.csrf().pipe(
      switchMap(() => this.http.get<AuthUser>(`${API_BASE_URL}/auth/me`)),
      tap(user => this.currentUser.set(user)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.currentUser.set(null);
          return of(null);
        }
        return throwError(() => error);
      }),
    );
  }

  signOut(): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/auth/logout`, {}).pipe(
      tap(() => this.currentUser.set(null)),
    );
  }

  private csrf(): Observable<unknown> {
    return this.http.get(`${API_BASE_URL}/auth/csrf`);
  }
}
