import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { App } from './app';
import { AuthService, AuthUser } from './core/auth.service';

describe('App', () => {
  async function createApp(auth: Pick<AuthService, 'currentUser' | 'restoreSession' | 'signIn' | 'signOut'>) {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    return fixture;
  }

  it('creates the component', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of(null),
      signIn: () => of({
        id: 1, username: 'user@school.local', role: 'ADMIN', teacherId: null, teacherName: null,
      }),
      signOut: () => of(void 0),
    });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('opens the admin dashboard directly after admin sign-in', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of(null),
      signIn: () => of({
        id: 1, username: 'admin@school.local', role: 'ADMIN', teacherId: null, teacherName: null,
      }),
      signOut: () => of(void 0),
    });
    const app = fixture.componentInstance;
    app.login.username = 'admin@school.local';
    app.login.password = 'password';
    app.signIn();

    expect(app.activeModule()).toBe('school-portal');
    expect(app.page()).toBe('Dashboard');
  });

  it('opens Leave Approvals when a leave notification is selected', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of(null),
      signIn: () => of({
        id: 1, username: 'admin@school.local', role: 'ADMIN', teacherId: null, teacherName: null,
      }),
      signOut: () => of(void 0),
    });
    const app = fixture.componentInstance;
    app.openLeaveApprovals();

    expect(app.page()).toBe('Leave Approvals');
    expect(app.notificationsOpen()).toBe(false);
  });

  it('opens the teacher dashboard directly after teacher sign-in', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of(null),
      signIn: () => of({
        id: 2, username: 'teacher@school.local', role: 'TEACHER', teacherId: 1, teacherName: 'Demo Teacher',
      }),
      signOut: () => of(void 0),
    });
    const app = fixture.componentInstance;
    app.login.username = 'teacher@school.local';
    app.login.password = 'password';
    app.signIn();

    expect(app.activeModule()).toBe('staff');
  });

  it('restores an existing teacher session to the teacher dashboard', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of({
        id: 2, username: 'teacher@school.local', role: 'TEACHER', teacherId: 1, teacherName: 'Demo Teacher',
      }),
      signIn: () => of({
        id: 1, username: 'admin@school.local', role: 'ADMIN', teacherId: null, teacherName: null,
      }),
      signOut: () => of(void 0),
    });

    expect(fixture.componentInstance.activeModule()).toBe('staff');
  });
});
