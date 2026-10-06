import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Fee } from '../../core/api.service';
import { BadgeComponent }      from '../../shared/badge.component';
import { DataTableComponent }  from '../../shared/data-table.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { FormFieldComponent }  from '../../shared/form-field.component';
import { ModalComponent }      from '../../shared/modal.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { BadgeVariant }        from '../../shared/badge.component';

const BLANK: Fee = { studentId: 0, feeType: '', amount: 0, dueDate: '', paymentStatus: 'PENDING' };

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [
    FormsModule, DecimalPipe,
    BadgeComponent, DataTableComponent, EmptyStateComponent,
    FormFieldComponent, ModalComponent, PageHeaderComponent,
  ],
  templateUrl: './fees.component.html',
  styleUrl: './fees.component.scss',
})
export class FeesComponent implements OnInit {
  private api = inject(ApiService);

  cols = ['Student', 'Fee Type', 'Due Date', 'Amount', 'Status', ''];

  fees      = signal<Fee[]>([]);
  showModal = signal(false);
  editing   = signal<Fee | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  draft: Fee = { ...BLANK };

  pendingCount = () => this.fees().filter(f => f.paymentStatus === 'PENDING' || f.paymentStatus === 'OVERDUE').length;
  paidCount    = () => this.fees().filter(f => f.paymentStatus === 'PAID').length;

  ngOnInit() { this.load(); }

  load() {
    this.api.fees().subscribe({
      next: data => this.fees.set(data),
      error: e   => this.error.set(e.message),
    });
  }

  openAdd()  { this.draft = { ...BLANK }; this.editing.set(null); this.formError.set(''); this.showModal.set(true); }
  openEdit(f: Fee) { this.draft = { ...f }; this.editing.set(f); this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.feeType || !this.draft.dueDate || !this.draft.studentId) {
      this.formError.set('Student ID, Fee Type and Due Date are required.');
      return;
    }
    this.saving.set(true);
    const req = this.editing()
      ? this.api.updateFee(this.draft)
      : this.api.addFee(this.draft);
    req.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  markPaid(f: Fee) {
    if (!f.id) return;
    this.api.markFeePaid(f.id).subscribe({
      next: () => this.load(),
      error: e  => this.error.set(e.message),
    });
  }

  statusVariant(s: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = { PENDING: 'warning', PAID: 'success', OVERDUE: 'danger' };
    return map[s] ?? 'neutral';
  }
}
