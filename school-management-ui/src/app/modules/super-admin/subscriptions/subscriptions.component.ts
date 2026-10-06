import { Component, signal } from '@angular/core';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { DataTableComponent }  from '../../../shared/data-table.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';

interface Subscription {
  id: number;
  school: string;
  plan: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [BadgeComponent, DataTableComponent, EmptyStateComponent, PageHeaderComponent],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.scss',
})
export class SubscriptionsComponent {
  cols = ['School', 'Plan', 'Amount', 'Start', 'End', 'Status', ''];

  subs = signal<Subscription[]>([
    { id: 1, school: 'Sunrise Academy', plan: 'Premium', amount: 120000, startDate: '2024-04-01', endDate: '2025-03-31', status: 'ACTIVE' },
    { id: 2, school: 'Delhi Grammar School', plan: 'Standard', amount: 72000, startDate: '2024-04-01', endDate: '2025-03-31', status: 'ACTIVE' },
    { id: 3, school: 'MV Public School', plan: 'Basic', amount: 36000, startDate: '2025-01-01', endDate: '2025-06-30', status: 'PENDING' },
    { id: 4, school: 'Lotus Valley International', plan: 'Premium', amount: 120000, startDate: '2024-04-01', endDate: '2025-03-31', status: 'ACTIVE' },
    { id: 5, school: 'St. Joseph High School', plan: 'Standard', amount: 72000, startDate: '2023-04-01', endDate: '2024-03-31', status: 'EXPIRED' },
  ]);

  activeCount  = () => this.subs().filter(s => s.status === 'ACTIVE').length;
  expiringSoon = () => 4;
  expiredCount = () => this.subs().filter(s => s.status === 'EXPIRED').length;
  totalRevenue = () => '4.2';

  markPaid(s: Subscription) {
    this.subs.update(list => list.map(x => x.id === s.id ? { ...x, status: 'ACTIVE' } : x));
  }

  statusVariant(s: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { ACTIVE: 'success', EXPIRED: 'danger', PENDING: 'warning' };
    return m[s] ?? 'neutral';
  }
}
