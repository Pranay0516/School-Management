import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { App } from './app';
import { AccountRole, AuthService, AuthUser } from './core/auth.service';

describe('App', () => {
  function user(role: AccountRole, id: number, customId: string, teacherName: string | null = null): AuthUser {
    return {
      userId: id,
      id,
      username: customId,
      customId,
      role,
      schoolId: role === 'SUPER_ADMIN' ? null : 1,
      schoolName: role === 'SUPER_ADMIN' ? null : 'Example School',
      teacherId: teacherName ? id : null,
      teacherName,
      accessToken: 'test-token',
      expiresIn: 1800,
    };
  }

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
      signIn: () => of(user('ADMIN', 1, 'SCH01-ADM-0001')),
      signOut: () => of(void 0),
    });
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('opens the admin dashboard directly after admin sign-in', async () => {
    const fixture = await createApp({
      currentUser: signal<AuthUser | null>(null),
      restoreSession: () => of(null),
      signIn: () => of(user('ADMIN', 1, 'SCH01-ADM-0001')),
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
      signIn: () => of(user('ADMIN', 1, 'SCH01-ADM-0001')),
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
      signIn: () => of(user('TEACHER', 2, 'SCH01-TCH-1001', 'Demo Teacher')),
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
      restoreSession: () => of(user('TEACHER', 2, 'SCH01-TCH-1001', 'Demo Teacher')),
      signIn: () => of(user('ADMIN', 1, 'SCH01-ADM-0001')),
      signOut: () => of(void 0),
    });

    expect(fixture.componentInstance.activeModule()).toBe('staff');
  });
});
