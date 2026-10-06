import { Component, input } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge.component';

@Component({
  selector: 'app-parent-home',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './parent-home.component.html',
  styleUrl: './parent-home.component.scss',
})
export class ParentHomeComponent {
  studentName  = input('Aanya Mehta');
  studentClass = input('X-A');
  rollNo       = input('24');
  nameInitial() { return this.studentName().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(); }
  notices = [
    { id: 1, title: 'Annual Sports Day – March 30, 2025', date: 'Mar 18, 2025' },
    { id: 2, title: 'Parent-Teacher Meeting – April 5',   date: 'Mar 15, 2025' },
    { id: 3, title: 'Holiday Notice: Holi – March 25',    date: 'Mar 10, 2025' },
    { id: 4, title: 'Science Exhibition – April 12',      date: 'Mar 8, 2025'  },
  ];
  upcomingExams = [
    { subject: 'Mathematics',    date: 'Mar 28', time: '10:00 AM', type: 'Unit Test' },
    { subject: 'Science',        date: 'Apr 2',  time: '9:00 AM',  type: 'Unit Test' },
    { subject: 'Social Studies', date: 'Apr 8',  time: '11:00 AM', type: 'Mid-term' },
    { subject: 'English',        date: 'Apr 14', time: '9:00 AM',  type: 'Mid-term' },
  ];
  fees = [
    { term: 'Term I Fees',   due: 'Jan 5, 2025',  paid: true  },
    { term: 'Term II Fees',  due: 'Apr 5, 2025',  paid: false },
    { term: 'Term III Fees', due: 'Jul 5, 2025',  paid: false },
  ];
}
