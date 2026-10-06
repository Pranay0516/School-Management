import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './features/admin/admin-dashboard.component';
import { TeacherDashboardComponent } from './features/teacher/teacher-dashboard.component';
import { StudentDashboardComponent } from './features/student/student-dashboard.component';
import { ProfileComponent } from './features/profile.component';
import { ManagementComponent } from './features/management.component';
import { HelpComponent } from './features/help.component';
import { StudentListComponent } from './features/students/student-list.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { ExaminationsComponent } from './features/examinations/examinations.component';
import { FeesComponent } from './features/fees/fees.component';
import { SchoolMembersComponent } from './features/admin/school-members.component';
import { SchoolsComponent } from './modules/super-admin/schools/schools.component';
import { authGuard, roleGuard } from './core/auth.guards';

export const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, title: 'Admin Dashboard' },
  { path: 'teacher', component: TeacherDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['TEACHER'] }, title: 'Teacher Dashboard' },
  { path: 'student', component: StudentDashboardComponent, canActivate: [authGuard, roleGuard], data: { roles: ['STUDENT'] }, title: 'Student Dashboard' },
  { path: 'admin/members', component: SchoolMembersComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN'] }, title: 'School Members' },
  { path: 'super-admin/schools', component: SchoolsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN'] }, title: 'Schools' },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Profile' },
  { path: 'students', component: StudentListComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN', 'TEACHER'] }, title: 'Students' },
  { path: 'attendance', component: AttendanceComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN', 'TEACHER', 'STUDENT'] }, title: 'Attendance' },
  { path: 'examinations', component: ExaminationsComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN', 'TEACHER', 'STUDENT'] }, title: 'Examinations' },
  { path: 'fees', component: FeesComponent, canActivate: [authGuard, roleGuard], data: { roles: ['ADMIN', 'STUDENT'] }, title: 'Fees' },
  { path: 'management-help', component: ManagementComponent, canActivate: [authGuard], title: 'Management Help' },
  { path: 'help', component: HelpComponent, canActivate: [authGuard], title: 'Help' }
];
