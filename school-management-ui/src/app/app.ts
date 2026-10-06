import { Component, computed, signal } from '@angular/core';
import { TitleCasePipe }           from '@angular/common';
import { FormsModule }              from '@angular/forms';

import { AdminDashboardComponent }   from './features/admin/admin-dashboard.component';
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
    FeesComponent, MenuManagementComponent,
    ModuleSelectorComponent, SuperAdminShellComponent,
    ParentStudentShellComponent, StaffShellComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  loggedIn         = signal(false);
  theme            = signal<'theme-1' | 'theme-2'>('theme-1');
  role             = signal('ADMIN');
  page             = signal('Dashboard');
  profileOpen      = signal(false);
  sidebarCollapsed = signal(false);
  loginError       = signal('');
  showPassword     = signal(false);
  activeModule     = signal<'selector' | ModuleId>('selector');

  login         = { username: '', password: '', role: 'ADMIN' };
  keepSignedIn  = false;
  allRoles      = ['SUPER_ADMIN', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENT'];

  get visibleMenus(): NavMenu[] { return ALL_MENUS.filter(m => m.roles.includes(this.role())); }

  initials = computed(() => {
    const u = this.login.username;
    if (!u) return this.role().slice(0, 2).toUpperCase();
    return u.split(/[\s@.]+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  });

  toggleTheme() { this.theme.set(this.theme() === 'theme-1' ? 'theme-2' : 'theme-1'); }

  signIn() {
    if (!this.login.username.trim() || !this.login.password.trim()) {
      this.loginError.set('Please enter your credentials.');
      return;
    }
    this.loginError.set('');
    this.role.set(this.login.role || 'ADMIN');
    this.activeModule.set('selector');
    this.page.set('Dashboard');
    this.loggedIn.set(true);
  }

  quickLogin(role: string) {
    this.login.username = role === 'SUPER_ADMIN' ? 'owner@eduflow.io'
      : role === 'ADMIN'   ? 'admin@demo.school'
      : role === 'TEACHER' ? 'teacher@demo.school'
      : 'student@demo.school';
    this.login.password = 'demo123';
    this.login.role     = role;
    this.loginError.set('');
    this.role.set(role);
    this.activeModule.set('selector');
    this.page.set('Dashboard');
    this.loggedIn.set(true);
  }

  signOut() {
    this.loggedIn.set(false);
    this.login.password = '';
    this.profileOpen.set(false);
    this.activeModule.set('selector');
    this.showPassword.set(false);
  }

  changeRole(role: string) { this.role.set(role); this.page.set('Dashboard'); this.profileOpen.set(false); }
  enterModule(moduleId: ModuleId) { this.activeModule.set(moduleId); this.page.set('Dashboard'); }
  backToSelector() { this.activeModule.set('selector'); }
}
