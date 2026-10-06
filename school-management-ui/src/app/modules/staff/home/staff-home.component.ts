import { Component, input } from '@angular/core';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  templateUrl: './staff-home.component.html',
  styleUrl: './staff-home.component.scss',
})
export class StaffHomeComponent {
  teacherName = input('Mrs. Priya Sharma');
  subject     = input('Mathematics');
  nameInitials() { return this.teacherName().split(' ').filter(Boolean).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase(); }
  stats = [
    { icon: '🎓', value: '148', label: 'Total Students' },
    { icon: '📋', value: '3',   label: 'Pending Tasks'  },
    { icon: '📄', value: '2',   label: 'Exam Papers'    },
    { icon: '📅', value: '5',   label: 'Classes Today'  },
  ];
  todayClasses = [
    { time: '8:00 AM',  subject: 'Mathematics', class: 'IX-A', room: 'Room 101', current: false },
    { time: '9:30 AM',  subject: 'Mathematics', class: 'IX-B', room: 'Room 102', current: false },
    { time: '10:30 AM', subject: 'Mathematics', class: 'X-B',  room: 'Room 204', current: true  },
    { time: '12:00 PM', subject: 'Mathematics', class: 'X-A',  room: 'Room 201', current: false },
    { time: '1:30 PM',  subject: 'Free Period', class: 'Staff Room', room: '',   current: false },
  ];
  pendingTasks = [
    { icon: '📄', title: 'Submit Unit Test Paper', due: 'Due: Mar 25', tag: 'Urgent', tagBg: '#ffe5ea', tagColor: '#b72040' },
    { icon: '✓',  title: 'Mark IX-B Attendance',  due: 'Due: Today',  tag: 'Today',  tagBg: '#fff1d7', tagColor: '#9a5f08' },
    { icon: '📊', title: 'Upload X-A Marks',       due: 'Due: Mar 28', tag: 'Soon',   tagBg: '#e0eaff', tagColor: '#2551c7' },
  ];
}
