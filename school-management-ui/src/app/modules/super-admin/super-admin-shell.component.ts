import { Component, input, output, signal } from '@angular/core';
import { SuperAdminDashboardComponent } from './dashboard/super-admin-dashboard.component';
import { SchoolsComponent }           from './schools/schools.component';
import { SubscriptionsComponent }      from './subscriptions/subscriptions.component';
import { GlobalUsersComponent }        from './global-users/global-users.component';
import { AnnouncementsComponent }      from './announcements/announcements.component';
import { DashboardAccessComponent }    from './dashboard-access.component';

type SAPage = 'Dashboard' | 'Schools' | 'Subscriptions' | 'Global Users' | 'Announcements' | 'Dashboard Access';

const SA_NAV: { title: SAPage; icon: string }[] = [
  { title: 'Dashboard',     icon: '⌂' },
  { title: 'Schools',       icon: '🏫' },
  { title: 'Subscriptions', icon: '💳' },
  { title: 'Global Users',  icon: '👤' },
  { title: 'Announcements', icon: '📢' },
  { title: 'Dashboard Access', icon: '▦' },
];

@Component({
  selector: 'app-super-admin-shell',
  standalone: true,
  imports: [
    SuperAdminDashboardComponent,
    SchoolsComponent,
    SubscriptionsComponent,
    GlobalUsersComponent,
    AnnouncementsComponent,
    DashboardAccessComponent,
  ],
  template: `
    <div class="sa-shell super-admin-theme">
      <!-- Sidebar -->
      <aside class="sa-sidebar">
        <div class="sa-brand">
          <span class="brand-icon">🏛️</span>
          <div>
            <span>SUPER ADMIN</span>
            <small>Platform Control</small>
          </div>
        </div>

        <nav>
          @for (item of nav; track item.title) {
            <button
              class="sa-nav-item"
              [class.active]="page() === item.title"
              (click)="page.set(item.title)">
              <i class="nav-icon">{{ item.icon }}</i>
              <span>{{ item.title }}</span>
            </button>
          }
        </nav>

        <div class="sa-sidebar-bottom">
          <button class="back-btn" (click)="back.emit()">← All Modules</button>
        </div>
      </aside>

      <!-- Main -->
      <div class="sa-main">
        <header class="sa-topbar">
          <div>
            <p class="topbar-meta">EduFlow Platform</p>
            <h1 class="topbar-title">{{ page() }}</h1>
          </div>
          <div class="topbar-right">
            <div class="sa-avatar">{{ initials() }}</div>
          </div>
        </header>

        <section class="sa-content">
          @if (page() === 'Dashboard')     { <app-super-admin-dashboard /> }
          @if (page() === 'Schools')       { <app-schools /> }
          @if (page() === 'Subscriptions') { <app-subscriptions /> }
          @if (page() === 'Global Users')  { <app-global-users /> }
          @if (page() === 'Announcements') { <app-announcements /> }
          @if (page() === 'Dashboard Access') { <app-dashboard-access /> }
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .super-admin-theme {
      --primary:   #5c35c9;
      --primary-2: #7c5de8;
    }

    .sa-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 240px 1fr;
    }

    /* Sidebar */
    .sa-sidebar {
      display: flex;
      flex-direction: column;
      padding: 18px 14px;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      border-right: 1px solid var(--border);
      background: var(--surface);
    }

    .sa-brand {
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 4px 0 20px;
    }
    .brand-icon { font-size: 26px; }
    .sa-brand > div > span { font: 700 15px var(--font-display); color: var(--primary); }
    .sa-brand small { display: block; font: 600 10px var(--font-body); letter-spacing: 1px; color: var(--muted); }

    nav { display: flex; flex-direction: column; gap: 4px; }

    .sa-nav-item {
      display: flex;
      align-items: center;
      gap: 11px;
      border: 0;
      background: transparent;
      color: var(--muted);
      font: 700 13.5px var(--font-body);
      text-align: left;
      padding: 11px 12px;
      border-radius: 12px;
      cursor: pointer;
      transition: background .14s, color .14s;
      white-space: nowrap;
    }
    .nav-icon { font-style: normal; font-size: 17px; min-width: 22px; text-align: center; }
    .sa-nav-item.active,
    .sa-nav-item:hover {
      background: color-mix(in srgb, var(--primary) 11%, transparent);
      color: var(--primary);
    }

    .sa-sidebar-bottom {
      margin-top: auto;
      padding-top: 14px;
      border-top: 1px solid var(--border);
    }
    .back-btn {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 9px;
      background: var(--surface-strong);
      color: var(--muted);
      font: 700 13px var(--font-body);
      cursor: pointer;
      transition: background .14s;
    }
    .back-btn:hover { color: var(--primary); border-color: var(--primary); }

    /* Topbar */
    .sa-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 24px;
      position: sticky;
      top: 0;
      z-index: 30;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .topbar-meta  { margin: 0; font-size: 11px; font-weight: 700; color: var(--muted); }
    .topbar-title { margin: 3px 0 0; font-size: 1.35rem; font-family: var(--font-display); }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .sa-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--primary-2));
      color: #fff; font: 700 13px var(--font-display);
      display: grid; place-items: center;
    }

    /* Content */
    .sa-main  { display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
    .sa-content { flex: 1; padding: 16px 24px 32px; min-width: 0; }

    @media (max-width: 768px) {
      .sa-shell { grid-template-columns: 1fr; }
      .sa-sidebar { display: none; }
    }
  `],
})
export class SuperAdminShellComponent {
  username = input('');
  back     = output<void>();

  nav  = SA_NAV;
  page = signal<SAPage>('Dashboard');

  initials() {
    const u = this.username();
    if (!u) return 'SA';
    return u.split(/[\s@.]+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');
  }
}
