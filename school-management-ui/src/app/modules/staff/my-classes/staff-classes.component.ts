import { Component, output } from '@angular/core';
interface ClassInfo { name: string; subject: string; students: number; room: string; schedule: string; color: string; bg: string; }

@Component({
  selector: 'app-staff-classes',
  standalone: true,
  templateUrl: './staff-classes.component.html',
  styleUrl: './staff-classes.component.scss',
})
export class StaffClassesComponent {
  markAttendance = output<string>();
  classes: ClassInfo[] = [
    { name: 'IX-A', subject: 'Mathematics', students: 42, room: 'Room 101', schedule: 'Mon/Wed/Fri 8:00 AM', color: '#3868f4', bg: '#edf2ff' },
    { name: 'IX-B', subject: 'Mathematics', students: 40, room: 'Room 102', schedule: 'Mon/Wed/Fri 9:30 AM', color: '#0ea87e', bg: '#e8faf5' },
    { name: 'X-A',  subject: 'Mathematics', students: 38, room: 'Room 201', schedule: 'Tue/Thu 12:00 PM',    color: '#e87c35', bg: '#fff5ec' },
    { name: 'X-B',  subject: 'Mathematics', students: 39, room: 'Room 204', schedule: 'Tue/Thu 10:30 AM',    color: '#5c35c9', bg: '#f0ecff' },
  ];
}
