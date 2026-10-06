import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DashboardAccessService } from '../../core/dashboard-access.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  readonly access = inject(DashboardAccessService);
  private api = inject(ApiService);

  studentCount = signal('–');
  teacherCount = signal('–');
  pendingFees  = signal('–');

  modules = [
    { name: 'Students', icon: '♟', color: 'blue' }, { name: 'Fees', icon: '₹', color: 'green' },
    { name: 'Exams', icon: '▤', color: 'orange' }, { name: 'Transport', icon: '◎', color: 'blue' },
    { name: 'Notices', icon: '▣', color: 'orange' },
  ];
  activities = [
    { name: 'Ishaan Patel paid ₹5,000 fee', when: '12h ago' },
    { name: 'Chhavi Desai paid ₹5,000 fee', when: '1d ago' },
    { name: 'Ali Bose paid ₹4,000 fee', when: '1d ago' },
  ];
  classAttendance = [{ name: 'Nursery', absent: 37 }, { name: 'Class I', absent: 24 }, { name: 'Class II', absent: 22 }, { name: 'Class V', absent: 21 }, { name: 'Class III', absent: 20 }];
  dueStudents = [
    { name: 'Ali Bansal', className: 'Class VIA', initials: 'AB', color: 'pink' },
    { name: 'Eva Jain', className: 'Class VIA', initials: 'EJ', color: 'amber' },
    { name: 'Omar Chouhan', className: 'Class VIA', initials: 'OC', color: 'teal' },
    { name: 'Fatima Tiwari', className: 'Class V', initials: 'FT', color: 'violet-bg' },
    { name: 'Daksh Tiwari', className: 'Nursery A', initials: 'DT', color: 'blue-bg' },
    { name: 'Dev Rajput', className: 'Nursery A', initials: 'DR', color: 'pink' },
    { name: 'Nandini Garg', className: 'Class X A', initials: 'NG', color: 'amber' },
  ];
  timetable = [
    { time: '10:00', subject: 'English', teacher: 'Amit Sharma' }, { time: '11:00', subject: 'English', teacher: 'Amit Sharma' },
    { time: '13:00', subject: 'English', teacher: 'Amit Sharma' }, { time: '14:00', subject: 'English', teacher: 'Amit Sharma' },
  ];
  buses = [
    { number: 'CG04HD7250', route: 'Raipur — 2 students', state: 'On Trip', stateClass: 'online', color: 'green' },
    { number: 'CG04AB1234', route: 'Route A — Shankar Nagar · AJ — 7 students', state: 'Idle', stateClass: 'idle', color: 'amber' },
    { number: 'CG04CD5678', route: 'Suresh Yadav', state: 'Idle', stateClass: 'idle', color: 'blue-bg' },
    { number: 'CG04EF9012', route: 'Route C — Devendra Nagar — 4 students', state: 'Offline', stateClass: 'offline', color: 'pink' },
  ];
  feeBars = [7, 8, 8, 9, 10, 12, 11, 14, 16, 13, 17, 15, 24, 18, 100];
  announcements = [
    { title: 'hlo', body: 'Xnhc' }, { title: 'holiday', body: 'Enjoy your day' },
    { title: 'Tomorrow is TUESDAY....', body: 'Tomorrow is TUESDAY...Tomorrow is TUESDAY...Tomorrow is TUESDAY...' },
  ];
  birthdays = [
    { name: 'Reyansh Bose', detail: 'Nursery B — Turns 5', icon: '🎂' }, { name: 'Ali Bose', detail: 'Class V A — Turns 11', icon: '🎂' },
    { name: 'Dhruv Bose', detail: 'Class VII — Turns 14', icon: '🎂' }, { name: 'Reyansh Bose', detail: 'Class X A — Turns 16', icon: '🎂' },
  ];
  staff = [
    { name: 'Amit Sharma', title: 'Senior Teacher', initials: 'AS', color: 'blue' }, { name: 'Rajesh Kumar', title: 'Staff', initials: 'RK', color: 'purple' },
    { name: 'Vikram Singh', title: 'Staff', initials: 'VS', color: 'teal' }, { name: 'Sneha Desai', title: 'Staff', initials: 'SD', color: 'amber' },
    { name: 'Accountant1', title: 'HOD', initials: 'A', color: 'pink' },
  ];
  setupSteps = ['Academic Session', 'Classes & Sections', 'Subjects', 'Fees Assigned'];

  ngOnInit() {
    forkJoin({
      students: this.api.studentStats(),
      teachers: this.api.teacherStats(),
      fees:     this.api.feeStats(),
    }).subscribe({
      next: ({ students, teachers, fees }) => {
        this.studentCount.set(students.totalActive.toLocaleString());
        this.teacherCount.set(teachers.totalActive.toLocaleString());
        this.pendingFees.set(String(fees.pendingCount));
      },
      error: () => {
        // keep placeholders if API is down
        this.studentCount.set('1,248');
        this.teacherCount.set('64');
        this.pendingFees.set('12');
      },
    });
  }
}
