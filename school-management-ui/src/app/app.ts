import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { TitleCasePipe }           from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { AuthService } from './core/auth.service';
import { LeaveNotificationService } from './core/leave-notification.service';

import { AdminDashboardComponent }   from './features/admin/admin-dashboard.component';
import { LeaveApprovalsComponent } from './features/admin/leave-approvals.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard.component';
import { StudentDashboardComponent } from './features/student/student-dashboard.component';
import { StudentListComponent }      from './features/students/student-list.component';
import { TeacherListComponent }      from './features/teachers/teacher-list.component';
import { AttendanceComponent }       from './features/attendance/attendance.component';
import { ExaminationsComponent }     from './features/examinations/examinations.component';
import { ExamPapersComponent }       from './features/exam-papers/exam-papers.component';
import { FeesComponent }             from './features/fees/fees.component';
import { MenuManagementComponent }   from './features/menu-management/menu-management.component';

import { ModuleSelectorComponent, ModuleId } from './module-selector/module-selector.component';
import { SuperAdminShellComponent }          from './modules/super-admin/super-admin-shell.component';
import { ParentStudentShellComponent }       from './modules/parent-student/parent-student-shell.component';
import { StaffShellComponent }               from './modules/staff/staff-shell.component';

interface NavMenu { title: string; icon: string; roles: string[]; }

const ALL_MENUS: NavMenu[] = [
  { title: 'Dashboard',       icon: 'dashboard', roles: ['ADMIN','TEACHER','STUDENT','PARENT'] },
  { title: 'Students',        icon: 'students',  roles: ['ADMIN','TEACHER'] },
  { title: 'Teachers',        icon: 'teachers',  roles: ['ADMIN'] },
  { title: 'Attendance',      icon: 'attendance',roles: ['ADMIN','TEACHER','STUDENT','PARENT'] },
  { title: 'Examinations',    icon: 'exams',     roles: ['ADMIN','TEACHER','STUDENT','PARENT'] },
  { title: 'Question Papers', icon: 'papers',    roles: ['ADMIN','TEACHER'] },
  { title: 'Fees',            icon: 'fees',      roles: ['ADMIN','STUDENT','PARENT'] },
  { title: 'Leave Approvals', icon: 'leaves',    roles: ['ADMIN'] },
  { title: 'Menu Management', icon: 'settings',  roles: ['ADMIN'] },
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule, TitleCasePipe,
    AdminDashboardComponent, TeacherDashboardComponent, StudentDashboardComponent,
    StudentListComponent, TeacherListComponent,
    AttendanceComponent, ExaminationsComponent, ExamPapersComponent,
    FeesComponent, MenuManagementComponent, LeaveApprovalsComponent,
    ModuleSelectorComponent, SuperAdminShellComponent,
    ParentStudentShellComponent, StaffShellComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy, OnInit {
  readonly auth = inject(AuthService);
  readonly leaveNotifications = inject(LeaveNotificationService);
  loggedIn         = signal(false);
  theme            = signal<'theme-1' | 'theme-2'>('theme-1');
  role             = signal('ADMIN');
  page             = signal('Dashboard');
  profileOpen      = signal(false);
  notificationsOpen = signal(false);
  sidebarCollapsed = signal(false);
  loginError       = signal('');
  signingIn        = signal(false);
  showPassword     = signal(false);
  activeModule     = signal<'selector' | ModuleId>('selector');

  login         = { username: '', password: '' };
  keepSignedIn  = false;

  get visibleMenus(): NavMenu[] { return ALL_MENUS.filter(m => m.roles.includes(this.role())); }

  initials = computed(() => {
    const u = this.login.username;
    if (!u) return this.role().slice(0, 2).toUpperCase();
    return u.split(/[\s@.]+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  });

  toggleTheme() { this.theme.set(this.theme() === 'theme-1' ? 'theme-2' : 'theme-1'); }
  toggleNotifications() { this.notificationsOpen.update(open => !open); }
  openLeaveApprovals() {
    this.page.set('Leave Approvals');
    this.notificationsOpen.set(false);
  }

  ngOnInit() {
    this.auth.restoreSession().subscribe({
      next: user => {
        if (user) {
          this.login.username = user.username;
          this.role.set(user.role);
          this.openWorkspaceForRole(user.role);
          this.loggedIn.set(true);
        }

      },
      error: error => this.loginError.set(error.message),
    });
  }

  ngOnDestroy() {
    this.leaveNotifications.stop();
  }

  signIn() {
    if (!this.login.username.trim() || !this.login.password.trim()) {
      this.loginError.set('Please enter your credentials.');
      return;
    }
    if (this.signingIn()) return;
    this.signingIn.set(true);
    this.loginError.set('');
    this.auth.signIn(this.login.username.trim(), this.login.password).subscribe({
      next: user => {
        this.login.password = '';
        this.role.set(user.role);
        this.openWorkspaceForRole(user.role);
        this.page.set('Dashboard');
        this.loggedIn.set(true);
        this.signingIn.set(false);
      },
      error: error => {
        this.signingIn.set(false);
        this.loginError.set(error.message);
      },
    });
  }

  signOut() {
    this.auth.signOut().subscribe({
      next: () => {
        this.loggedIn.set(false);
        this.login.password = '';
        this.profileOpen.set(false);
        this.activeModule.set('selector');
        this.leaveNotifications.stop();
        this.notificationsOpen.set(false);
        this.showPassword.set(false);
        this.loginError.set('');
      },
      error: error => this.loginError.set(error.message),
    });
  }

  enterModule(moduleId: ModuleId) { this.activeModule.set(moduleId); this.page.set('Dashboard'); }
  backToSelector() {
    this.openWorkspaceForRole(this.role());
    this.page.set('Dashboard');
  }

  private openWorkspaceForRole(role: string) {
    const workspaceByRole: Partial<Record<string, ModuleId>> = {
      SUPER_ADMIN: 'super-admin',
      ADMIN: 'school-portal',
      TEACHER: 'staff',
      STUDENT: 'parent-student',
      PARENT: 'parent-student',
    };
    this.activeModule.set(workspaceByRole[role] ?? 'selector');
    if (role === 'ADMIN') {
      this.leaveNotifications.start();
    } else {
      this.leaveNotifications.stop();
    }
  }
}
