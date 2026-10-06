import { Component, input, output, signal } from '@angular/core';
import { ParentHomeComponent }       from './home/parent-home.component';
import { ParentAttendanceComponent } from './attendance/parent-attendance.component';
import { ParentTimetableComponent }  from './timetable/parent-timetable.component';
import { ParentResultsComponent }    from './results/parent-results.component';
import { ParentFeesComponent }       from './fees/parent-fees.component';
import { ParentNoticesComponent }    from './notices/parent-notices.component';

type PSPage = 'Home' | 'Attendance' | 'Timetable' | 'Results' | 'Fees' | 'Notices';
const PS_NAV: { title: PSPage; icon: string }[] = [
  { title: 'Home',       icon: 'Home'       },
  { title: 'Attendance', icon: 'Attendance' },
  { title: 'Timetable',  icon: 'Timetable'  },
  { title: 'Results',    icon: 'Results'    },
  { title: 'Fees',       icon: 'Fees'       },
  { title: 'Notices',    icon: 'Notices'    },
];

@Component({
  selector: 'app-parent-student-shell',
  standalone: true,
  imports: [ParentHomeComponent, ParentAttendanceComponent, ParentTimetableComponent, ParentResultsComponent, ParentFeesComponent, ParentNoticesComponent],
  templateUrl: './parent-student-shell.component.html',
  styleUrl: './parent-student-shell.component.scss',
})
export class ParentStudentShellComponent {
  username     = input('');
  studentName  = input('Aanya Mehta');
  studentClass = input('X-A');
  back         = output<void>();
  nav       = PS_NAV;
  page      = signal<PSPage>('Home');
  collapsed = signal(false);
  initials() { return this.studentName().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(); }
  navIcon(title: PSPage): string {
    const m: Record<string, string> = { Home: 'Home', Attendance: 'Check', Timetable: 'Cal', Results: 'Chart', Fees: 'Rs', Notices: 'Bell' };
    return m[title] ?? title[0];
  }
}
