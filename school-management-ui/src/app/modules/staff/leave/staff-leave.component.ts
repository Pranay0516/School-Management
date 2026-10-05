import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { FormFieldComponent }  from '../../../shared/form-field.component';
import { ModalComponent }      from '../../../shared/modal.component';

interface LeaveApplication {
  id: number;
  type: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  days: number;
}

@Component({
  selector: 'app-staff-leave',
  standalone: true,
  imports: [FormsModule, BadgeComponent, FormFieldComponent, ModalComponent],
  template: `
    <div class="sl-leave">
      <div class="leave-header glass-card">
        <div>
          <h2>Leave Management</h2>
          <p class="muted">Applied: {{ applications().length }} · Balance: 12 days</p>
        </div>
        <button class="apply-btn" (click)="openApply()">+ Apply for leave</button>
      </div>

      <!-- Balance chips -->
      <div class="balance-row">
        @for (b of balance; track b.type) {
          <div class="balance-card glass-card">
            <span class="bal-num">{{ b.remaining }}</span>
            <span class="bal-total">/ {{ b.total }}</span>
            <span class="bal-label">{{ b.type }}</span>
          </div>
        }
      </div>

      <!-- History -->
      <div class="leave-history glass-card">
        <h3>Leave History</h3>
        @for (a of applications(); track a.id) {
          <div class="leave-row">
            <div class="leave-info">
              <b>{{ a.type }}</b>
              <small>{{ a.fromDate }} to {{ a.toDate }} · {{ a.days }} day{{ a.days > 1 ? 's' : '' }}</small>
              <p class="leave-reason">{{ a.reason }}</p>
            </div>
            <ef-badge [variant]="statusVariant(a.status)">{{ a.status }}</ef-badge>
          </div>
        }
        @empty {
          <p class="no-records">No leave applications yet.</p>
        }
      </div>
    </div>

    @if (showModal()) {
      <ef-modal eyebrow="LEAVE REQUEST" title="Apply for leave" (close)="closeModal()">
        <form (ngSubmit)="submit()">
          <div class="form-grid">
            <ef-form-field label="Leave Type">
              <select [(ngModel)]="draft.type" name="type">
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Earned Leave">Earned Leave</option>
                <option value="Emergency Leave">Emergency Leave</option>
              </select>
            </ef-form-field>
            <ef-form-field label=""></ef-form-field>
            <ef-form-field label="From Date">
              <input type="date" [(ngModel)]="draft.fromDate" name="fromDate" required />
            </ef-form-field>
            <ef-form-field label="To Date">
              <input type="date" [(ngModel)]="draft.toDate" name="toDate" required />
            </ef-form-field>
            <ef-form-field label="Reason" style="grid-column: 1/-1">
              <textarea [(ngModel)]="draft.reason" name="reason" rows="3" required></textarea>
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn">Submit application</button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .sl-leave { display: flex; flex-direction: column; gap: 12px; }
    .leave-header {
      display: flex; align-items: center; justify-content: space-between; padding: 20px;
    }
    .leave-header h2 { margin: 0 0 4px; }
    .leave-header p  { margin: 0; font-size: 13px; }
    .apply-btn {
      border: 0; border-radius: 10px; padding: 10px 16px;
      background: var(--primary); color: #fff; font: 800 13px var(--font-body);
      cursor: pointer; white-space: nowrap; transition: opacity .15s;
    }
    .apply-btn:hover { opacity: .85; }

    .balance-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .balance-card {
      display: flex; flex-direction: column; align-items: center;
      padding: 16px; gap: 2px;
    }
    .bal-num { font-size: 28px; font-weight: 800; color: var(--primary); line-height: 1; }
    .bal-total { font-size: 14px; font-weight: 600; color: var(--muted); }
    .bal-label { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .5px; text-align: center; }

    .leave-history { padding: 20px; }
    .leave-history h3 { margin: 0 0 14px; font-size: 1rem; }
    .leave-row {
      display: flex; align-items: flex-start; justify-content: space-between;
      padding: 12px 0; border-bottom: 1px solid var(--border); gap: 12px;
    }
    .leave-row:last-child { border-bottom: none; }
    .leave-info b { display: block; font-size: 14px; }
    .leave-info small { color: var(--muted); font-size: 12px; }
    .leave-reason { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
    .no-records { margin: 0; font-size: 13px; color: var(--muted); }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    :host ::ng-deep textarea {
      padding: 11px 13px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-strong); color: var(--text);
      font: 600 14px var(--font-body); width: 100%; box-sizing: border-box;
      resize: vertical; min-height: 80px;
    }
  `],
})
export class StaffLeaveComponent {
  applications = signal<LeaveApplication[]>([
    { id: 1, type: 'Sick Leave',    fromDate: '2025-03-10', toDate: '2025-03-11', reason: 'Fever and cold.', status: 'APPROVED', days: 2 },
    { id: 2, type: 'Casual Leave',  fromDate: '2025-02-14', toDate: '2025-02-14', reason: 'Personal work.',   status: 'APPROVED', days: 1 },
    { id: 3, type: 'Emergency Leave', fromDate: '2025-01-20', toDate: '2025-01-22', reason: 'Family emergency.', status: 'APPROVED', days: 3 },
  ]);

  balance = [
    { type: 'Sick',    total: 12, remaining: 10 },
    { type: 'Casual',  total: 8,  remaining: 7  },
    { type: 'Earned',  total: 15, remaining: 15 },
  ];

  showModal = signal(false);
  formError = signal('');
  draft = { type: 'Sick Leave', fromDate: '', toDate: '', reason: '' };
  nextId = 4;

  openApply() {
    this.draft = { type: 'Sick Leave', fromDate: '', toDate: '', reason: '' };
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  submit() {
    if (!this.draft.fromDate || !this.draft.toDate || !this.draft.reason) {
      this.formError.set('All fields are required.');
      return;
    }
    const from = new Date(this.draft.fromDate);
    const to   = new Date(this.draft.toDate);
    const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
    this.applications.update(list => [
      { id: this.nextId++, ...this.draft, status: 'PENDING', days },
      ...list,
    ]);
    this.closeModal();
  }

  statusVariant(s: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' };
    return m[s] ?? 'neutral';
  }
}
