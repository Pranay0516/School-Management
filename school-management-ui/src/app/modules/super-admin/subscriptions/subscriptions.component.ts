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
  template: `
    <article class="glass-card panel">
      <ef-page-header eyebrow="BILLING & SUBSCRIPTIONS" title="Subscriptions" />

      <div class="sub-summary">
        <div class="pill">
          <span class="pill-label">Active</span>
          <span class="pill-value">{{ activeCount() }}</span>
        </div>
        <div class="pill warn">
          <span class="pill-label">Expiring Soon</span>
          <span class="pill-value">{{ expiringSoon() }}</span>
        </div>
        <div class="pill danger">
          <span class="pill-label">Expired</span>
          <span class="pill-value">{{ expiredCount() }}</span>
        </div>
        <div class="pill success">
          <span class="pill-label">Total Revenue</span>
          <span class="pill-value">₹{{ totalRevenue() }}L</span>
        </div>
      </div>

      <ef-data-table [columns]="cols" style="--dt-cols: 2fr 1fr 1fr 1fr 1fr 1fr 100px">
        @for (s of subs(); track s.id) {
          <div class="dt-row">
            <b>{{ s.school }}</b>
            <span>{{ s.plan }}</span>
            <span>₹{{ s.amount.toLocaleString() }}/yr</span>
            <span>{{ s.startDate }}</span>
            <span>{{ s.endDate }}</span>
            <ef-badge [variant]="statusVariant(s.status)">{{ s.status }}</ef-badge>
            <div class="row-actions">
              @if (s.status !== 'ACTIVE') {
                <button class="icon-btn success" (click)="markPaid(s)">Renew</button>
              }
            </div>
          </div>
        }
        @empty { <ef-empty icon="💳" message="No subscriptions found." /> }
      </ef-data-table>
    </article>
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }
    .sub-summary { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
    .pill {
      display: flex; flex-direction: column; gap: 2px;
      padding: 12px 18px; border-radius: 12px;
      border: 1px solid var(--border); background: var(--surface-strong);
      min-width: 90px;
    }
    .pill.warn    { background: #fff8ed; border-color: #ffd999; }
    .pill.danger  { background: #fff0f3; border-color: #ffc5ce; }
    .pill.success { background: #edfaf2; border-color: #a3e9c8; }
    .pill-label { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .5px; }
    .pill-value { font-size: 22px; font-weight: 800; color: var(--text); }
    .row-actions { display: flex; gap: 6px; }
    .icon-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 5px 9px; font-size: 12px; cursor: pointer;
      color: var(--muted); font-weight: 700; transition: all .15s;
    }
    .icon-btn.success:hover { border-color: var(--success); color: var(--success); background: #edfaf2; }
  `],
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
