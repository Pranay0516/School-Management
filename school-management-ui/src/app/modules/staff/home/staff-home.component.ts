import { Component, input } from '@angular/core';

@Component({
  selector: 'app-staff-home',
  standalone: true,
  template: `
    <div class="sh-home">
      <div class="welcome-banner glass-card">
        <div class="welcome-avatar">{{ nameInitials() }}</div>
        <div class="welcome-info">
          <p class="eyebrow">GOOD MORNING</p>
          <h2>{{ teacherName() }}</h2>
          <p class="sub">{{ subject() }} Teacher · Class X-A Homeroom</p>
        </div>
        <div class="next-class-badge">
          <p class="nc-label">NEXT CLASS</p>
          <p class="nc-time">10:30 AM</p>
          <p class="nc-detail">Mathematics · X-B · Rm 204</p>
        </div>
      </div>

      <div class="stats-row">
        @for (s of stats; track s.label) {
          <div class="stat-card glass-card">
            <div class="stat-icon">{{ s.icon }}</div>
            <div>
              <b class="stat-value">{{ s.value }}</b>
              <p class="stat-label">{{ s.label }}</p>
            </div>
          </div>
        }
      </div>

      <div class="content-grid">
        <div class="glass-card schedule-card">
          <h3>Today's Schedule</h3>
          <div class="schedule-list">
            @for (c of todayClasses; track c.time; let last = $last) {
              <div class="schedule-row" [class.current]="c.current">
                <div class="sch-time-col"><span class="sch-time">{{ c.time }}</span></div>
                <div class="sch-dot-col">
                  <div class="sch-dot" [class.active]="c.current"></div>
                  @if (!last) { <div class="sch-line"></div> }
                </div>
                <div class="sch-info">
                  <b>{{ c.subject }}</b>
                  <small>{{ c.class }} · {{ c.room }}</small>
                  @if (c.current) { <span class="now-badge">ONGOING</span> }
                </div>
              </div>
            }
          </div>
        </div>
        <div class="right-col">
          <div class="glass-card tasks-card">
            <h3>Pending Tasks</h3>
            @for (t of pendingTasks; track t.title) {
              <div class="task-row">
                <span class="task-icon">{{ t.icon }}</span>
                <div><b>{{ t.title }}</b><small>{{ t.due }}</small></div>
                <span class="task-tag" [style.background]="t.tagBg" [style.color]="t.tagColor">{{ t.tag }}</span>
              </div>
            }
          </div>
          <div class="glass-card classes-card">
            <h3>Classes Today</h3>
            @for (c of todayClasses; track c.time) {
              <div class="class-chip">
                <b>{{ c.subject }}</b>
                <span>{{ c.class }}</span>
                <small>{{ c.time }}</small>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sh-home { display: flex; flex-direction: column; gap: 20px; }
    .welcome-banner { display: flex; align-items: center; gap: 24px; padding: 24px 28px; flex-wrap: wrap; }
    .welcome-avatar { width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: #fff; font: 800 22px var(--font-display); display: grid; place-items: center; }
    .welcome-info { flex: 1; min-width: 200px; }
    .welcome-info h2 { font-size: 1.5rem; margin: 4px 0; }
    .sub { font-size: 14px; color: var(--muted); margin: 0; }
    .next-class-badge { text-align: right; padding: 14px 20px; border-radius: 14px; background: color-mix(in srgb, var(--primary) 10%, var(--surface-strong)); border: 1px solid color-mix(in srgb, var(--primary) 20%, transparent); }
    .nc-label { font-size: 10px; font-weight: 800; color: var(--primary); letter-spacing: .8px; margin: 0; }
    .nc-time  { font-size: 26px; font-weight: 800; color: var(--primary); margin: 3px 0; font-family: var(--font-display); }
    .nc-detail{ font-size: 13px; color: var(--muted); margin: 0; }
    .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }
    .stat-card { display: flex; align-items: center; gap: 16px; padding: 20px; }
    .stat-icon { font-size: 26px; }
    .stat-value { font-size: 26px; font-weight: 800; display: block; }
    .stat-label { font-size: 12px; color: var(--muted); margin: 2px 0 0; }
    .content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
    .right-col { display: flex; flex-direction: column; gap: 20px; }
    .schedule-card { padding: 24px; }
    .schedule-card h3 { margin: 0 0 18px; }
    .schedule-list { display: flex; flex-direction: column; }
    .schedule-row { display: flex; align-items: flex-start; gap: 0; padding: 4px 0; }
    .sch-time-col { width: 80px; padding-top: 2px; }
    .sch-time { font-size: 13px; font-weight: 700; color: var(--muted); }
    .sch-dot-col { display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; padding: 3px 0; }
    .sch-dot { width: 12px; height: 12px; border-radius: 50%; border: 2px solid var(--border); background: var(--surface); flex-shrink: 0; }
    .sch-dot.active { background: var(--primary); border-color: var(--primary); }
    .sch-line { flex: 1; width: 2px; background: var(--border); min-height: 28px; }
    .sch-info { flex: 1; padding: 0 0 24px 14px; }
    .sch-info b { display: block; font-size: 14px; }
    .sch-info small { color: var(--muted); font-size: 12px; }
    .schedule-row.current .sch-info b { color: var(--primary); }
    .now-badge { display: inline-block; margin-top: 4px; background: var(--primary); color: #fff; font: 800 10px var(--font-body); padding: 2px 8px; border-radius: 6px; }
    .tasks-card { padding: 24px; }
    .tasks-card h3 { margin: 0 0 14px; }
    .task-row { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .task-row:last-child { border-bottom: none; }
    .task-icon { font-size: 20px; }
    .task-row > div { flex: 1; }
    .task-row b { display: block; font-size: 14px; }
    .task-row small { color: var(--muted); font-size: 12px; }
    .task-tag { font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 99px; white-space: nowrap; }
    .classes-card { padding: 24px; }
    .classes-card h3 { margin: 0 0 14px; }
    .class-chip { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
    .class-chip:last-child { border-bottom: none; }
    .class-chip b   { font-size: 14px; flex: 1; }
    .class-chip span{ color: var(--muted); }
    .class-chip small{ color: var(--muted); margin-left: auto; font-size: 12px; }
    @media (max-width: 1100px) { .content-grid { grid-template-columns: 1fr; } }
    @media (max-width: 680px)  { .stats-row { grid-template-columns: 1fr 1fr; } }
  `],
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
