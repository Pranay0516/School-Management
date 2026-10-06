import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, map, of, tap, throwError } from 'rxjs';
import { API_BASE_URL } from './api-base';

export type AccountRole = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AuthUser {
  userId: number;
  id: number;
  username: string;
  customId: string;
  role: AccountRole;
  schoolId: number | null;
  schoolName: string | null;
  teacherId: number | null;
  teacherName: string | null;
  accessToken: string;
  expiresIn: number;
}

interface AuthResponse extends Omit<AuthUser, 'id' | 'username' | 'accessToken'> {
  accessToken: string | null;
}

export const AUTH_TOKEN_STORAGE_KEY = 'school-management.access-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  readonly currentUser = signal<AuthUser | null>(null);

  signIn(identifier: string, password: string): Observable<AuthUser> {
    return this.http.post<AuthResponse>(`${API_BASE_URL}/v1/auth/login`, { identifier, password }).pipe(
      map(response => this.asUser(response, response.accessToken ?? '')),
      tap(user => {
        sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, user.accessToken);
        this.currentUser.set(user);
      }),
      catchError((error: unknown) => this.toAuthError(error)),
    );
  }

  restoreSession(): Observable<AuthUser | null> {
    const token = sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
      this.currentUser.set(null);
      return of(null);
    }
    return this.http.get<AuthResponse>(`${API_BASE_URL}/v1/auth/me`).pipe(
      map(response => this.asUser(response, token)),
      tap(user => this.currentUser.set(user)),
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.clearSession();
          return of(null);
        }
        return this.toAuthError(error);
      }),
    );
  }

  signOut(): Observable<void> {
    return this.http.post<void>(`${API_BASE_URL}/v1/auth/logout`, {}).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) return of(void 0);
        return this.toAuthError(error);
      }),
      finalize(() => this.clearSession()),
    );
  }

  private asUser(response: AuthResponse, token: string): AuthUser {
    return {
      ...response,
      id: response.userId,
      username: response.customId,
      accessToken: token,
    };
  }

  private clearSession(): void {
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    this.currentUser.set(null);
  }

  private toAuthError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message ?? error.error?.error ?? error.message;
      return throwError(() => new Error(message));
    }
    return throwError(() => error);
  }
}
