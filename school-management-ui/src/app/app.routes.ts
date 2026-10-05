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

export const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent, title: 'Admin Dashboard' },
  { path: 'teacher', component: TeacherDashboardComponent, title: 'Teacher Dashboard' },
  { path: 'student', component: StudentDashboardComponent, title: 'Student Dashboard' },
  { path: 'profile', component: ProfileComponent, title: 'Profile' },
  { path: 'students', component: StudentListComponent, title: 'Students' },
  { path: 'attendance', component: AttendanceComponent, title: 'Attendance' },
  { path: 'examinations', component: ExaminationsComponent, title: 'Examinations' },
  { path: 'fees', component: FeesComponent, title: 'Fees' },
  { path: 'management-help', component: ManagementComponent, title: 'Management Help' },
  { path: 'help', component: HelpComponent, title: 'Help' }
];
