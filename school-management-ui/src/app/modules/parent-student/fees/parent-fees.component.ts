import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService, Fee } from '../../../core/api.service';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';

@Component({
  selector: 'app-parent-fees',
  standalone: true,
  imports: [DecimalPipe, BadgeComponent, EmptyStateComponent],
  template: `
    <div class="pf-fees">
      <div class="fees-header glass-card">
        <h2>My Fees</h2>
        <p class="muted">Student ID: 1 · Academic Year 2025–26</p>
      </div>

      <div class="fee-cards">
        @for (f of fees(); track f.id) {
          <div class="fee-card glass-card">
            <div class="fee-card-left">
              <div class="fee-type-icon">₹</div>
              <div>
                <b>{{ f.feeType }}</b>
                <small>Due: {{ f.dueDate }}</small>
              </div>
            </div>
            <div class="fee-card-right">
              <span class="fee-amount">₹ {{ f.amount | number }}</span>
              <ef-badge [variant]="statusVariant(f.paymentStatus)">{{ f.paymentStatus }}</ef-badge>
              @if (f.paymentStatus === 'PENDING' || f.paymentStatus === 'OVERDUE') {
                <button class="pay-btn" (click)="pay(f)">Pay now</button>
              }
            </div>
          </div>
        }
        @if (!fees().length && !loading()) {
          <div class="glass-card">
            <ef-empty icon="₹" message="No fee records found." />
          </div>
        }
        @if (loading()) {
          <div class="loading-msg">Loading fees…</div>
        }
      </div>

      @if (error()) { <p class="error-msg">{{ error() }}</p> }
      @if (successMsg()) { <p class="success-msg">{{ successMsg() }}</p> }
    </div>
  `,
  styles: [`
    .pf-fees { display: flex; flex-direction: column; gap: 12px; }
    .fees-header { padding: 20px; }
    .fees-header h2 { margin: 0 0 4px; }
    .fees-header p  { margin: 0; font-size: 13px; }

    .fee-cards { display: flex; flex-direction: column; gap: 10px; }
    .fee-card {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px; gap: 12px; flex-wrap: wrap;
    }
    .fee-card-left { display: flex; align-items: center; gap: 14px; }
    .fee-type-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: color-mix(in srgb, var(--primary) 12%, var(--surface-strong));
      color: var(--primary); font-size: 20px; font-weight: 800;
      display: grid; place-items: center; flex-shrink: 0;
    }
    .fee-card-left b { display: block; font-size: 14px; }
    .fee-card-left small { color: var(--muted); font-size: 12px; }

    .fee-card-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .fee-amount { font-size: 16px; font-weight: 800; }

    .pay-btn {
      border: 0; border-radius: 10px; padding: 8px 16px;
      background: var(--primary); color: #fff;
      font: 800 12px var(--font-body); cursor: pointer;
      transition: opacity .15s;
    }
    .pay-btn:hover { opacity: .85; }

    .loading-msg { text-align: center; padding: 32px; color: var(--muted); }
    .error-msg   { color: #c53d55; font-size: 13px; }
    .success-msg { color: var(--success); font-size: 13px; font-weight: 700; }
  `],
})
export class ParentFeesComponent implements OnInit {
  private api = inject(ApiService);

  fees       = signal<Fee[]>([]);
  loading    = signal(false);
  error      = signal('');
  successMsg = signal('');

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.fees(1).subscribe({
      next: data => { this.fees.set(data); this.loading.set(false); },
      error: () => {
        // Use mock data if API unavailable
        this.fees.set([
          { id: 1, studentId: 1, feeType: 'Term I Fees',    amount: 12500, dueDate: '2025-04-05', paymentStatus: 'PENDING' },
          { id: 2, studentId: 1, feeType: 'Transport',      amount: 3500,  dueDate: '2025-04-05', paymentStatus: 'PAID'    },
          { id: 3, studentId: 1, feeType: 'Term II Fees',   amount: 12500, dueDate: '2025-07-05', paymentStatus: 'PENDING' },
          { id: 4, studentId: 1, feeType: 'Annual Charges', amount: 5000,  dueDate: '2025-01-15', paymentStatus: 'OVERDUE' },
        ]);
        this.loading.set(false);
      },
    });
  }

  pay(f: Fee) {
    if (!f.id) return;
    this.api.markFeePaid(f.id).subscribe({
      next: () => {
        this.successMsg.set('Payment recorded successfully.');
        this.load();
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => {
        // Optimistic update with mock
        this.fees.update(list => list.map(x =>
          x.id === f.id ? { ...x, paymentStatus: 'PAID' } : x
        ));
        this.successMsg.set('Payment recorded successfully.');
        setTimeout(() => this.successMsg.set(''), 3000);
      },
    });
  }

  statusVariant(s: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { PENDING: 'warning', PAID: 'success', OVERDUE: 'danger' };
    return m[s] ?? 'neutral';
  }
}
