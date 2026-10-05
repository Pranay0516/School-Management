import { Component } from '@angular/core';
interface Period { time: string; subject: string; teacher: string; }
type DaySchedule = { day: string; periods: Period[] };

@Component({
  selector: 'app-parent-timetable',
  standalone: true,
  template: `
    <div class="pt-timetable">
      <div class="tt-header glass-card">
        <div><h2>Weekly Timetable</h2><p class="muted">Class X-A · Academic Year 2025-26</p></div>
        <div class="tt-legend">
          @for (s of subjects; track s.name) {
            <span class="subj-chip" [style.background]="s.bg" [style.color]="s.color">{{ s.name }}</span>
          }
        </div>
      </div>
      <div class="tt-grid glass-card">
        <div class="tt-time-col"></div>
        @for (day of timetable; track day.day) { <div class="tt-day-head"><b>{{ day.day }}</b></div> }
        @for (slot of timeSlots; track slot; let si = $index) {
          <div class="tt-time-label">{{ slot }}</div>
          @for (day of timetable; track day.day) {
            <div class="tt-cell" [style.background]="cellBg(day.periods[si]?.subject)" [style.color]="cellColor(day.periods[si]?.subject)">
              @if (day.periods[si]) {
                <b>{{ day.periods[si].subject }}</b>
                <small>{{ day.periods[si].teacher }}</small>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .pt-timetable { display: flex; flex-direction: column; gap: 16px; }
    .tt-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 20px 24px; flex-wrap: wrap; }
    .tt-header h2 { margin: 0 0 4px; }
    .tt-legend { display: flex; flex-wrap: wrap; gap: 8px; }
    .subj-chip { padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: 800; white-space: nowrap; }
    .tt-grid { display: grid; grid-template-columns: 90px repeat(5, 1fr); overflow: hidden; }
    .tt-time-col, .tt-day-head { padding: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: var(--muted); background: var(--surface-strong); border-bottom: 1px solid var(--border); }
    .tt-day-head { text-align: center; color: var(--text); }
    .tt-time-label { padding: 12px; font-size: 11px; font-weight: 700; color: var(--muted); background: var(--surface-strong); border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); display: flex; align-items: center; }
    .tt-cell { padding: 12px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); min-height: 60px; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
    .tt-cell b { font-size: 13px; font-weight: 700; }
    .tt-cell small { font-size: 11px; opacity: .75; }
    @media (max-width: 900px) { .tt-grid { grid-template-columns: 70px repeat(5, 1fr); } .tt-cell { min-height: 50px; padding: 8px 6px; } .tt-cell b { font-size: 11px; } .tt-cell small { display: none; } }
  `],
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
