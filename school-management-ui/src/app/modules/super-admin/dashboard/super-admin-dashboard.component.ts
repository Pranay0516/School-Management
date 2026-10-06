import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/stat-card.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrl: './super-admin-dashboard.component.scss',
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
