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
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="FEE COLLECTION"
        title="Fees"
        actionLabel="+ Create record"
        (action)="openAdd()" />

      <!-- summary pills -->
      <div class="fee-summary">
        <div class="summary-pill">
          <span class="pill-label">Total Records</span>
          <span class="pill-value">{{ fees().length }}</span>
        </div>
        <div class="summary-pill pending">
          <span class="pill-label">Pending</span>
          <span class="pill-value">{{ pendingCount() }}</span>
        </div>
        <div class="summary-pill paid">
          <span class="pill-label">Paid</span>
          <span class="pill-value">{{ paidCount() }}</span>
        </div>
      </div>

      <ef-data-table [columns]="cols" style="--dt-cols: 80px 1.5fr 1fr 1fr 1fr 120px">
        @for (f of fees(); track f.id) {
          <div class="dt-row">
            <span>#{{ f.studentId }}</span>
            <span>{{ f.feeType }}</span>
            <span>{{ f.dueDate }}</span>
            <span>₹ {{ f.amount | number }}</span>
            <ef-badge [variant]="statusVariant(f.paymentStatus)">{{ f.paymentStatus }}</ef-badge>
            <div class="row-actions">
              @if (f.paymentStatus === 'PENDING' || f.paymentStatus === 'OVERDUE') {
                <button class="icon-btn success" title="Mark paid" (click)="markPaid(f)">✓ Pay</button>
              }
              <button class="icon-btn danger" title="Edit" (click)="openEdit(f)">✎</button>
            </div>
          </div>
        }
        @empty { <ef-empty icon="₹" message="No fee records yet. Create one to get started." /> }
      </ef-data-table>

      @if (error()) { <p class="error-msg">{{ error() }}</p> }
    </article>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT FEE RECORD' : 'NEW FEE RECORD'"
        [title]="editing() ? 'Edit fee record' : 'Create a fee record'"
        (close)="closeModal()">
        <form (ngSubmit)="save()">
          <div class="form-grid">
            <ef-form-field label="Student ID">
              <input type="number" [(ngModel)]="draft.studentId" name="studentId" min="1" required />
            </ef-form-field>
            <ef-form-field label="Fee Type">
              <input [(ngModel)]="draft.feeType" name="feeType" placeholder="e.g. Term I, Transport" required />
            </ef-form-field>
            <ef-form-field label="Amount (₹)">
              <input type="number" [(ngModel)]="draft.amount" name="amount" min="0" required />
            </ef-form-field>
            <ef-form-field label="Due Date">
              <input type="date" [(ngModel)]="draft.dueDate" name="dueDate" required />
            </ef-form-field>
            <ef-form-field label="Payment Status" style="grid-column: 1/-1">
              <select [(ngModel)]="draft.paymentStatus" name="paymentStatus">
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn" [disabled]="saving()">
              {{ saving() ? 'Saving…' : (editing() ? 'Update' : 'Create record') }}
            </button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }

    .fee-summary {
      display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
    }
    .summary-pill {
      display: flex; flex-direction: column; gap: 2px;
      padding: 12px 18px; border-radius: 12px;
      border: 1px solid var(--border); background: var(--surface-strong);
      min-width: 90px;
    }
    .summary-pill.pending { background: #fff8ed; border-color: #ffd999; }
    .summary-pill.paid    { background: #edfaf2; border-color: #a3e9c8; }
    .pill-label { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .5px; }
    .pill-value { font-size: 22px; font-weight: 800; color: var(--text); }

    .row-actions { display: flex; gap: 6px; }
    .icon-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 5px 9px; font-size: 12px; cursor: pointer;
      color: var(--muted); font-weight: 700; transition: all .15s;
    }
    .icon-btn.success:hover { border-color: var(--success); color: var(--success); background: #edfaf2; }
    .icon-btn.danger:hover  { border-color: var(--primary); color: var(--primary); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
  `],
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
