import { Component, input, output, signal } from '@angular/core';
import { StaffHomeComponent }       from './home/staff-home.component';
import { StaffClassesComponent }    from './my-classes/staff-classes.component';
import { StaffAttendanceComponent } from './attendance/staff-attendance.component';
import { StaffExamPapersComponent } from './exam-papers/staff-exam-papers.component';
import { StaffTimetableComponent }  from './timetable/staff-timetable.component';
import { StaffLeaveComponent }      from './leave/staff-leave.component';

type StaffPage = 'Home' | 'My Classes' | 'Attendance' | 'Exam Papers' | 'Timetable' | 'Leave';
const STAFF_NAV: { title: StaffPage }[] = [
  { title: 'Home' }, { title: 'My Classes' }, { title: 'Attendance' },
  { title: 'Exam Papers' }, { title: 'Timetable' }, { title: 'Leave' },
];

@Component({
  selector: 'app-staff-shell',
  standalone: true,
  imports: [StaffHomeComponent, StaffClassesComponent, StaffAttendanceComponent, StaffExamPapersComponent, StaffTimetableComponent, StaffLeaveComponent],
  templateUrl: './staff-shell.component.html',
  styleUrl: './staff-shell.component.scss',
})
export class StaffShellComponent {
  username    = input('');
  teacherName = input('Mrs. Priya Sharma');
  back        = output<void>();
  nav             = STAFF_NAV;
  page            = signal<StaffPage>('Home');
  collapsed       = signal(false);
  attendanceClass = signal('');
  initials() { return this.teacherName().split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase(); }
  goToAttendance(className: string) { this.attendanceClass.set(className); this.page.set('Attendance'); }
  navIcon(title: string): string {
    const m: Record<string, string> = { 'Home': 'H', 'My Classes': 'C', 'Attendance': 'A', 'Exam Papers': 'P', 'Timetable': 'T', 'Leave': 'L' };
    return m[title] ?? title[0];
  }
}
