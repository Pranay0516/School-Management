import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ExamPaper } from '../../../core/api.service';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';
import { FormFieldComponent }  from '../../../shared/form-field.component';
import { ModalComponent }      from '../../../shared/modal.component';
import { StatusLabelPipe }     from '../../../shared/status-label.pipe';

const BLANK: ExamPaper = {
  title: '', subject: '', className: '', totalMarks: 80, durationMinutes: 180, status: 'DRAFT',
};

@Component({
  selector: 'app-staff-exam-papers',
  standalone: true,
  imports: [
    FormsModule, BadgeComponent, EmptyStateComponent,
    FormFieldComponent, ModalComponent, StatusLabelPipe,
  ],
  templateUrl: './staff-exam-papers.component.html',
  styleUrl: './staff-exam-papers.component.scss',
})
export class StaffExamPapersComponent implements OnInit {
  private api = inject(ApiService);

  papers    = signal<ExamPaper[]>([]);
  loading   = signal(false);
  showModal = signal(false);
  editing   = signal<ExamPaper | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  draft: ExamPaper = { ...BLANK };

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.api.examPapers().subscribe({
      next: data => { this.papers.set(data); this.loading.set(false); },
      error: ()  => { this.loading.set(false); },
    });
  }

  openAdd() {
    this.draft = { ...BLANK };
    this.editing.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(p: ExamPaper) {
    this.draft = { ...p };
    this.editing.set(p);
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  submit() {
    if (!this.draft.title) { this.formError.set('Title is required.'); return; }
    this.saving.set(true);
    this.api.addExamPaper({ ...this.draft, status: 'PENDING_APPROVAL' }).subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  statusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      DRAFT: 'neutral', PENDING_APPROVAL: 'warning', APPROVED: 'success', REJECTED: 'danger',
    };
    return map[status] ?? 'neutral';
  }
}
