import { Component } from '@angular/core';
interface Period { time: string; subject: string; teacher: string; }
type DaySchedule = { day: string; periods: Period[] };

@Component({
  selector: 'app-parent-timetable',
  standalone: true,
  templateUrl: './parent-timetable.component.html',
  styleUrl: './parent-timetable.component.scss',
})
export class ParentTimetableComponent {
  timeSlots = ['8:00-8:45', '8:45-9:30', '9:45-10:30', '10:30-11:15', '11:30-12:15', '12:15-13:00'];
  subjects = [
    { name: 'Mathematics',      bg: '#e8eeff', color: '#2551c7' },
    { name: 'Physics',          bg: '#e8f5ff', color: '#0a6ea8' },
    { name: 'Chemistry',        bg: '#fff0e8', color: '#b84500' },
    { name: 'English',          bg: '#f0ffe8', color: '#2a7a00' },
    { name: 'Biology',          bg: '#f5e8ff', color: '#7a00b8' },
    { name: 'History',          bg: '#fff8e8', color: '#b87a00' },
    { name: 'Computer Science', bg: '#e8fff5', color: '#007a5a' },
    { name: 'Geography',        bg: '#fffae8', color: '#8a6000' },
    { name: 'PE',               bg: '#ffe8e8', color: '#b80000' },
    { name: 'Art',              bg: '#ffe8f5', color: '#b80071' },
    { name: 'Library',          bg: '#f5f5f5', color: '#555'    },
  ];
  cellBg(subj: string | undefined): string { return this.subjects.find(s => s.name === subj)?.bg ?? 'transparent'; }
  cellColor(subj: string | undefined): string { return this.subjects.find(s => s.name === subj)?.color ?? 'var(--muted)'; }
  timetable: DaySchedule[] = [
    { day: 'Monday',    periods: [{ time: '8:00', subject: 'Mathematics', teacher: 'Mrs. Sharma' }, { time: '8:45', subject: 'Physics', teacher: 'Mr. Gupta' }, { time: '9:45', subject: 'English', teacher: 'Ms. Patel' }, { time: '10:30', subject: 'Chemistry', teacher: 'Mrs. Joshi' }, { time: '11:30', subject: 'History', teacher: 'Mr. Rao' }, { time: '12:15', subject: 'PE', teacher: 'Mr. Singh' }] },
    { day: 'Tuesday',   periods: [{ time: '8:00', subject: 'English', teacher: 'Ms. Patel' }, { time: '8:45', subject: 'Mathematics', teacher: 'Mrs. Sharma' }, { time: '9:45', subject: 'Biology', teacher: 'Mrs. Nair' }, { time: '10:30', subject: 'Geography', teacher: 'Mr. Khan' }, { time: '11:30', subject: 'Computer Science', teacher: 'Mr. Mehta' }, { time: '12:15', subject: 'Art', teacher: 'Ms. Roy' }] },
    { day: 'Wednesday', periods: [{ time: '8:00', subject: 'Physics', teacher: 'Mr. Gupta' }, { time: '8:45', subject: 'Chemistry', teacher: 'Mrs. Joshi' }, { time: '9:45', subject: 'Mathematics', teacher: 'Mrs. Sharma' }, { time: '10:30', subject: 'English', teacher: 'Ms. Patel' }, { time: '11:30', subject: 'Computer Science', teacher: 'Mr. Mehta' }, { time: '12:15', subject: 'Library', teacher: '-' }] },
    { day: 'Thursday',  periods: [{ time: '8:00', subject: 'History', teacher: 'Mr. Rao' }, { time: '8:45', subject: 'Biology', teacher: 'Mrs. Nair' }, { time: '9:45', subject: 'Physics', teacher: 'Mr. Gupta' }, { time: '10:30', subject: 'Mathematics', teacher: 'Mrs. Sharma' }, { time: '11:30', subject: 'English', teacher: 'Ms. Patel' }, { time: '12:15', subject: 'PE', teacher: 'Mr. Singh' }] },
    { day: 'Friday',    periods: [{ time: '8:00', subject: 'Chemistry', teacher: 'Mrs. Joshi' }, { time: '8:45', subject: 'Geography', teacher: 'Mr. Khan' }, { time: '9:45', subject: 'Biology', teacher: 'Mrs. Nair' }, { time: '10:30', subject: 'History', teacher: 'Mr. Rao' }, { time: '11:30', subject: 'Mathematics', teacher: 'Mrs. Sharma' }, { time: '12:15', subject: 'Art', teacher: 'Ms. Roy' }] },
  ];
}
