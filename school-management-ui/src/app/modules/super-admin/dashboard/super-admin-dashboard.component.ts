import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/stat-card.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  template: `
    <div class="sa-dashboard">
      <div class="welcome glass-card">
        <div class="welcome-copy">
          <p class="eyebrow">PLATFORM OVERVIEW</p>
          <h2>Good morning,<br>Super Admin.</h2>
          <p class="muted">Here's what's happening across all schools today.</p>
        </div>
        <div class="welcome-orb">🏛️</div>
      </div>

      <div class="stats-row">
        <ef-stat-card label="TOTAL SCHOOLS"    value="142"   change="↑ 3 this month" trend="up" />
        <ef-stat-card label="ACTIVE SUBSCRIPTIONS" value="138" change="97% renewal rate" trend="up" />
        <ef-stat-card label="TOTAL STUDENTS"   value="84,210" change="Across all schools" trend="up" />
        <ef-stat-card label="MONTHLY REVENUE"  value="₹12.4L" change="↑ 8% vs last month" trend="up" />
      </div>

      <div class="grid-two">
        <article class="glass-card table-card">
          <h3>Schools by Plan</h3>
          <div class="plan-rows">
            @for (p of planData; track p.name) {
              <div class="plan-row">
                <span class="plan-dot" [style.background]="p.color"></span>
                <span class="plan-name">{{ p.name }}</span>
                <div class="plan-bar-wrap">
                  <div class="plan-bar" [style.width]="p.pct + '%'" [style.background]="p.color"></div>
                </div>
                <span class="plan-count">{{ p.count }}</span>
              </div>
            }
          </div>
        </article>

        <article class="glass-card notices-card">
          <h3>Recent Activity</h3>
          <ul>
            @for (a of recentActivity; track a.text) {
              <li>
                <span class="act-icon">{{ a.icon }}</span>
                <div>
                  <b>{{ a.text }}</b>
                  <small>{{ a.time }}</small>
                </div>
              </li>
            }
          </ul>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .sa-dashboard { display: flex; flex-direction: column; gap: 16px; }
    .welcome {
      display: flex; align-items: center; justify-content: space-between;
      padding: 28px 32px;
    }
    .welcome h2 { font-size: 1.9rem; margin: 8px 0 6px; }
    .welcome-orb { font-size: 56px; opacity: .3; line-height: 1; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    .grid-two {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 16px;
    }
    .table-card, .notices-card { padding: 24px; }
    h3 { margin: 0 0 20px; font-size: 1rem; }

    .plan-rows { display: flex; flex-direction: column; gap: 14px; }
    .plan-row {
      display: flex; align-items: center; gap: 10px; font-size: 13px;
    }
    .plan-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .plan-name { width: 80px; font-weight: 700; }
    .plan-bar-wrap {
      flex: 1; height: 8px; background: var(--surface-strong);
      border-radius: 99px; overflow: hidden;
    }
    .plan-bar { height: 100%; border-radius: 99px; transition: width .4s; }
    .plan-count { width: 32px; text-align: right; font-weight: 800; color: var(--muted); }

    ul { list-style: none; margin: 0; padding: 0; }
    li {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 0; border-bottom: 1px solid var(--border); font-size: 13px;
    }
    li:last-child { border-bottom: none; }
    .act-icon {
      font-size: 18px; width: 34px; height: 34px; border-radius: 10px;
      background: var(--surface-strong); display: grid; place-items: center; flex-shrink: 0;
    }
    li b { display: block; font-weight: 700; }
    li small { color: var(--muted); font-size: 11px; }

    @media (max-width: 1000px) {
      .stats-row { grid-template-columns: repeat(2, 1fr); }
      .grid-two  { grid-template-columns: 1fr; }
    }
    @media (max-width: 580px) {
      .stats-row { grid-template-columns: 1fr; }
    }
  `],
})
export class SuperAdminDashboardComponent {
  planData = [
    { name: 'Premium', count: 48,  pct: 85, color: '#5c35c9' },
    { name: 'Standard', count: 61, pct: 60, color: '#3868f4' },
    { name: 'Basic',   count: 33,  pct: 35, color: '#94a3b8' },
  ];
  recentActivity = [
    { icon: '🏫', text: 'Sunrise Academy renewed Premium plan', time: '2 hours ago' },
    { icon: '👤', text: 'New school registration: MV Public School', time: '5 hours ago' },
    { icon: '💳', text: 'Payment received from Delhi Grammar School', time: 'Yesterday' },
    { icon: '📢', text: 'Announcement sent to all Premium schools', time: '2 days ago' },
    { icon: '⚠️', text: '4 subscriptions expiring this week', time: '3 days ago' },
  ];
}
