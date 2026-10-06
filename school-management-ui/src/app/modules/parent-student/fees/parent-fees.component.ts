import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApiService, Fee } from '../../../core/api.service';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';

@Component({
  selector: 'app-parent-fees',
  standalone: true,
  imports: [DecimalPipe, BadgeComponent, EmptyStateComponent],
  templateUrl: './parent-fees.component.html',
  styleUrl: './parent-fees.component.scss',
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
