import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, LeaveApplication, LeaveStatus } from '../../core/api.service';
import { BadgeComponent, BadgeVariant } from '../../shared/badge.component';

@Component({
  selector: 'app-leave-approvals',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DatePipe],
  templateUrl: './leave-approvals.component.html',
  styleUrl: './leave-approvals.component.scss',
})
export class LeaveApprovalsComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly applications = signal<LeaveApplication[]>([]);
  readonly loading = signal(false);
  readonly pageError = signal('');
  readonly filter = signal<LeaveStatus | 'ALL'>('PENDING');
  readonly reviewNotes = signal<Record<number, string | undefined>>({});
  readonly processingId = signal<number | null>(null);
  readonly visibleApplications = computed(() => {
    const status = this.filter();
    return status === 'ALL'
      ? this.applications()
      : this.applications().filter(application => application.status === status);
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.pageError.set('');
    this.api.leaveApplicationsForAdmin().subscribe({
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

  setReviewNote(id: number, note: string) {
    this.reviewNotes.update(notes => ({ ...notes, [id]: note }));
  }

  approve(application: LeaveApplication) {
    this.review(application, this.api.approveLeave(application.id, this.reviewNotes()[application.id] ?? ''));
  }

  reject(application: LeaveApplication) {
    const note = this.reviewNotes()[application.id]?.trim() ?? '';
    if (!note) {
      this.pageError.set('Add a reason before rejecting this leave request.');
      return;
    }
    this.review(application, this.api.rejectLeave(application.id, note));
  }

  statusVariant(status: LeaveStatus): BadgeVariant {
    const variants: Record<LeaveStatus, BadgeVariant> = {
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'danger',
    };
    return variants[status];
  }

  leaveTypeLabel(type: LeaveApplication['type']): string {
    return `${type.charAt(0)}${type.slice(1).toLowerCase()} leave`;
  }

  private review(application: LeaveApplication, request: ReturnType<ApiService['approveLeave']>) {
    if (this.processingId() !== null) return;
    this.pageError.set('');
    this.processingId.set(application.id);
    request.subscribe({
      next: updated => {
        this.applications.update(current =>
          current.map(item => item.id === updated.id ? updated : item),
        );
        this.processingId.set(null);
      },
      error: error => {
        this.pageError.set(error.message);
        this.processingId.set(null);
      },
    });
  }
}
