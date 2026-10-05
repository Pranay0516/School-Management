import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Teacher } from '../../core/api.service';
import { StatCardComponent }   from '../../shared/stat-card.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div class="welcome glass-card">
      <div class="welcome-copy">
        <p class="eyebrow">TEACHER WORKSPACE</p>
        <h2>Good morning,<br>ready to inspire?</h2>
        <p class="muted">Class X-A · Mathematics · Period 2 begins at 10:15 AM.</p>
      </div>
      <div class="welcome-orb">✦</div>
    </div>

    <div class="stats-row">
      <ef-stat-card label="MY STUDENTS" value="126" change="Across 4 classes" trend="up" />
      <ef-stat-card label="TODAY'S ATTENDANCE" value="94%" change="119 of 126 present" trend="up" />
      <ef-stat-card label="PAPERS TO REVIEW" value="3" change="Submit by 24 Aug" trend="warn" />
    </div>

    <div class="grid-two">
      <article class="glass-card info-card">
        <h3>Today's schedule</h3>
        <ul>
          <li><span class="time">09:00</span><span>Class X-A · Mathematics</span></li>
          <li><span class="time">10:15</span><span>Class IX-B · Mathematics</span></li>
          <li><span class="time">13:30</span><span>Class X-C · Remedial session</span></li>
        </ul>
      </article>
      <article class="glass-card info-card">
        <h3>Quick reminders</h3>
        <ul>
          <li><span class="dot">•</span><span>Mark Class IX-B attendance</span></li>
          <li><span class="dot">•</span><span>Create quarterly question paper</span></li>
          <li><span class="dot">•</span><span>Publish unit-test marks</span></li>
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
    ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
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
    .dot { color: var(--primary); font-weight: 900; font-size: 16px; }
    @media (max-width: 900px) {
      .stats-row { grid-template-columns: 1fr 1fr; }
      .grid-two  { grid-template-columns: 1fr; }
    }
  `],
})
export class TeacherDashboardComponent { }
