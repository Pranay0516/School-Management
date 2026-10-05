import { Component, output } from '@angular/core';
interface ClassInfo { name: string; subject: string; students: number; room: string; schedule: string; color: string; bg: string; }

@Component({
  selector: 'app-staff-classes',
  standalone: true,
  template: `
    <div class="sc-classes">
      <div class="classes-banner glass-card">
        <div><h2>My Classes</h2><p class="muted">4 classes assigned · 159 total students</p></div>
        <div class="banner-stats">
          <div class="bs-item"><b>159</b><small>Students</small></div>
          <div class="bs-item"><b>4</b><small>Classes</small></div>
          <div class="bs-item"><b>20</b><small>Periods/Week</small></div>
        </div>
      </div>
      <div class="class-grid">
        @for (c of classes; track c.name) {
          <div class="class-card glass-card" [style.border-top-color]="c.color">
            <div class="card-top">
              <div class="class-badge" [style.background]="c.bg" [style.color]="c.color">{{ c.name }}</div>
              <span class="student-count">{{ c.students }} students</span>
            </div>
            <h3>{{ c.subject }}</h3>
            <div class="card-meta">
              <span>Room: {{ c.room }}</span>
              <span>{{ c.schedule }}</span>
            </div>
            <button class="mark-btn" [style.background]="c.color" (click)="markAttendance.emit(c.name)">Mark Attendance</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .sc-classes { display: flex; flex-direction: column; gap: 20px; }
    .classes-banner { display: flex; align-items: center; justify-content: space-between; padding: 22px 26px; flex-wrap: wrap; gap: 16px; }
    .classes-banner h2 { margin: 0 0 4px; }
    .banner-stats { display: flex; gap: 24px; }
    .bs-item { text-align: center; }
    .bs-item b { display: block; font-size: 24px; font-weight: 800; color: var(--primary); }
    .bs-item small { font-size: 11px; color: var(--muted); }
    .class-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .class-card { border-top-width: 4px; border-top-style: solid; padding: 22px; display: flex; flex-direction: column; gap: 10px; }
    .card-top { display: flex; align-items: center; justify-content: space-between; }
    .class-badge { width: 52px; height: 52px; border-radius: 14px; font: 800 15px var(--font-display); display: grid; place-items: center; }
    .student-count { font-size: 13px; color: var(--muted); font-weight: 600; }
    .class-card h3 { margin: 0; font-size: 1.1rem; }
    .card-meta { display: flex; flex-direction: column; gap: 5px; }
    .card-meta span { font-size: 12px; color: var(--muted); font-weight: 600; }
    .mark-btn { padding: 10px; border: 0; border-radius: 10px; color: #fff; font: 700 13px var(--font-body); cursor: pointer; transition: opacity .15s; margin-top: 6px; }
    .mark-btn:hover { opacity: .85; }
    @media (max-width: 600px) { .class-grid { grid-template-columns: 1fr; } }
  `],
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
