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
  templateUrl: './super-admin-shell.component.html',
  styleUrl: './super-admin-shell.component.scss',
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
