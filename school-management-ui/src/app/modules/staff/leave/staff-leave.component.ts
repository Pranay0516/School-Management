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
  templateUrl: './staff-leave.component.html',
  styleUrl: './staff-leave.component.scss',
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
