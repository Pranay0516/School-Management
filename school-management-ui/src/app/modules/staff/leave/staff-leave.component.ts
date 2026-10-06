import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, LeaveApplication, LeaveType } from '../../../core/api.service';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { FormFieldComponent }  from '../../../shared/form-field.component';
import { ModalComponent }      from '../../../shared/modal.component';

@Component({
  selector: 'app-staff-leave',
  standalone: true,
  imports: [FormsModule, BadgeComponent, FormFieldComponent, ModalComponent],
  templateUrl: './staff-leave.component.html',
  styleUrl: './staff-leave.component.scss',
})
export class StaffLeaveComponent implements OnInit {
  private readonly api = inject(ApiService);
  applications = signal<LeaveApplication[]>([]);
  loading = signal(false);
  submitting = signal(false);
  pageError = signal('');
  showModal = signal(false);
  formError = signal('');
  draft: { type: LeaveType; startDate: string; endDate: string; reason: string } = this.blankDraft();

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.pageError.set('');
    this.api.myLeaveApplications().subscribe({
      next: applications => {
        this.applications.set(applications);
        this.loading.set(false);
      },
      error: error => {
        this.pageError.set(error.message);
        this.loading.set(false);
      },
    });
  }

  openApply() {
    this.draft = this.blankDraft();
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  submit() {
    const reason = this.draft.reason.trim();
    if (!this.draft.startDate || !this.draft.endDate || !reason) {
      this.formError.set('Leave type, both dates, and a reason are required.');
      return;
    }
    if (this.draft.startDate > this.draft.endDate) {
      this.formError.set('The start date must be on or before the end date.');
      return;
    }
    if (reason.length > 1000) {
      this.formError.set('The reason must not exceed 1000 characters.');
      return;
    }

    this.submitting.set(true);
    this.formError.set('');
    this.api.applyForLeave({ ...this.draft, reason }).subscribe({
      next: application => {
        this.applications.update(current => [application, ...current]);
        this.submitting.set(false);
        this.closeModal();
      },
      error: error => {
        this.submitting.set(false);
        this.formError.set(error.message);
      },
    });
  }

  statusVariant(s: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' };
    return m[s] ?? 'neutral';
  }

  leaveTypeLabel(type: LeaveType): string {
    return `${type.charAt(0)}${type.slice(1).toLowerCase()} leave`;
  }

  private blankDraft(): { type: LeaveType; startDate: string; endDate: string; reason: string } {
    return { type: 'SICK', startDate: '', endDate: '', reason: '' };
  }
}
