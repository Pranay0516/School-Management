import { Component } from '@angular/core';
import { StatCardComponent } from '../../shared/stat-card.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div class="welcome glass-card">
      <div class="welcome-copy">
        <p class="eyebrow">STUDENT PORTAL</p>
        <h2>Keep learning,<br>keep growing.</h2>
        <p class="muted">Class X-A · Your next class is Mathematics at 10:15 AM.</p>
      </div>
      <div class="welcome-orb">◆</div>
    </div>

    <div class="stats-row">
      <ef-stat-card label="ATTENDANCE" value="94.8%" change="Excellent standing" trend="up" />
      <ef-stat-card label="UPCOMING EXAMS" value="2" change="Starts 01 Sep" trend="warn" />
      <ef-stat-card label="ASSIGNMENTS" value="4" change="1 due tomorrow" trend="warn" />
    </div>

    <div class="grid-two">
      <article class="glass-card info-card">
        <h3>Today's timetable</h3>
        <ul>
          <li><span class="time">09:00</span><span>English</span></li>
          <li><span class="time">10:15</span><span>Mathematics</span></li>
          <li><span class="time">11:45</span><span>Science</span></li>
          <li><span class="time">13:00</span><span>Social Studies</span></li>
        </ul>
      </article>
      <article class="glass-card info-card">
        <h3>Announcements</h3>
        <ul>
          <li><span class="date">23 AUG</span><span>Parent–Teacher Meeting</span></li>
          <li><span class="date">28 AUG</span><span>Science Exhibition</span></li>
          <li><span class="date">01 SEP</span><span>Quarterly examinations</span></li>
        </ul>
      </article>
    </div>
  `,
  styles: [`
    .welcome {
      display: flex; align-items: center; justify-content: space-between;
      padding: 28px 32px; margin-top: 8px;
    }
    .welcome h2 { font-size: 1.9rem; margin: 8px 0 6px; }
    .welcome-orb { font-size: 56px; color: var(--primary); opacity: .18; line-height: 1; }
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
    .grid-two  { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .info-card { padding: 24px; }
    h3 { margin: 0 0 16px; font-size: 1rem; }
    ul { list-style: none; padding: 0; margin: 0; }
    li {
      display: flex; align-items: center; gap: 14px;
      padding: 11px 0; border-bottom: 1px solid var(--border); font-size: 14px;
    }
    li:last-child { border-bottom: none; }
    .time {
      font-size: 12px; font-weight: 800; color: var(--primary);
      min-width: 44px; background: color-mix(in srgb, var(--primary) 10%, transparent);
      padding: 3px 7px; border-radius: 6px; text-align: center;
    }
    .date {
      font-size: 11px; font-weight: 800; color: var(--muted);
      min-width: 54px; letter-spacing: .3px;
    }
    @media (max-width: 900px) {
      .stats-row { grid-template-columns: 1fr 1fr; }
      .grid-two  { grid-template-columns: 1fr; }
    }
  `],
})
export class StudentDashboardComponent { }
