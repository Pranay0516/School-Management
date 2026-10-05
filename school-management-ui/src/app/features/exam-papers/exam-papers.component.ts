import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, ExamPaper } from '../../core/api.service';
import { BadgeComponent }      from '../../shared/badge.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { FormFieldComponent }  from '../../shared/form-field.component';
import { ModalComponent }      from '../../shared/modal.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { StatusLabelPipe }     from '../../shared/status-label.pipe';
import { BadgeVariant }        from '../../shared/badge.component';

const BLANK: ExamPaper = {
  title: '', subject: '', className: '', totalMarks: 80, durationMinutes: 180, status: 'DRAFT',
};

@Component({
  selector: 'app-exam-papers',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent, EmptyStateComponent, FormFieldComponent,
    ModalComponent, PageHeaderComponent, StatusLabelPipe,
  ],
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="EXAMINATION CELL"
        title="Question Papers"
        [actionLabel]="role() === 'TEACHER' ? '+ Create paper' : ''"
        (action)="openAdd()" />

      <div class="paper-list">
        @for (p of papers(); track p.id) {
          <div class="paper-row glass-card">
            <div class="paper-icon">▤</div>
            <div class="paper-info">
              <h3>{{ p.title }}</h3>
              <p>{{ p.subject }} · {{ p.className }} · {{ p.totalMarks }} Marks · {{ p.durationMinutes }} min</p>
            </div>
            <ef-badge [variant]="statusVariant(p.status)">{{ p.status | statusLabel }}</ef-badge>
            <div class="paper-actions">
              @if (role() === 'ADMIN' && p.status === 'PENDING_APPROVAL') {
                <button class="primary-btn sm" (click)="approve(p)">Approve</button>
              }
              @if (p.status === 'APPROVED') {
                <button class="outline-btn sm" (click)="printPaper(p)">Print PDF</button>
              }
              @if (role() === 'TEACHER' && (p.status === 'DRAFT' || p.status === 'REJECTED')) {
                <button class="icon-btn" (click)="openEdit(p)">✎</button>
              }
            </div>
          </div>
        }
        @empty {
          <ef-empty icon="📄" message="No question papers yet." />
        }
      </div>
      @if (error()) { <p class="error-msg">{{ error() }}</p> }
    </article>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT PAPER' : 'PAPER BUILDER'"
        [title]="editing() ? 'Edit question paper' : 'Create question paper'"
        (close)="closeModal()">
        <form (ngSubmit)="submit()">
          <div class="form-grid">
            <ef-form-field label="Paper Title" style="grid-column: 1/-1">
              <input [(ngModel)]="draft.title" name="title" required />
            </ef-form-field>
            <ef-form-field label="Subject">
              <input [(ngModel)]="draft.subject" name="subject" />
            </ef-form-field>
            <ef-form-field label="Class">
              <input [(ngModel)]="draft.className" name="className" />
            </ef-form-field>
            <ef-form-field label="Total Marks">
              <input type="number" [(ngModel)]="draft.totalMarks" name="totalMarks" min="1" />
            </ef-form-field>
            <ef-form-field label="Duration (minutes)">
              <input type="number" [(ngModel)]="draft.durationMinutes" name="durationMinutes" min="1" />
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn" [disabled]="saving()">
              {{ saving() ? 'Submitting…' : 'Submit for approval' }}
            </button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }
    .paper-list { display: grid; gap: 10px; }
    .paper-row {
      display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-radius: 14px;
    }
    .paper-icon { font-size: 28px; color: var(--primary); }
    .paper-info { flex: 1; }
    .paper-info h3 { margin: 0; font-size: 15px; }
    .paper-info p  { margin: 4px 0 0; font-size: 13px; color: var(--muted); }
    .paper-actions { display: flex; gap: 8px; align-items: center; }
    .primary-btn.sm, .outline-btn.sm { padding: 7px 13px; font-size: 12px; }
    .icon-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 6px 9px; font-size: 13px; cursor: pointer;
      color: var(--muted); transition: all .15s;
    }
    .icon-btn:hover { border-color: var(--primary); color: var(--primary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class ExamPapersComponent implements OnInit {
  private api = inject(ApiService);
  role = input('ADMIN');

  papers    = signal<ExamPaper[]>([]);
  showModal = signal(false);
  editing   = signal<ExamPaper | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  draft: ExamPaper = { ...BLANK };

  ngOnInit() { this.load(); }

  load() {
    this.api.examPapers().subscribe({
      next: data => this.papers.set(data),
      error: e   => this.error.set(e.message),
    });
  }

  openAdd()  { this.draft = { ...BLANK }; this.editing.set(null); this.formError.set(''); this.showModal.set(true); }
  openEdit(p: ExamPaper) { this.draft = { ...p }; this.editing.set(p); this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  submit() {
    if (!this.draft.title) { this.formError.set('Title is required.'); return; }
    this.saving.set(true);
    this.api.addExamPaper({ ...this.draft, status: 'PENDING_APPROVAL' }).subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  approve(p: ExamPaper) {
    if (!p.id) return;
    this.api.approveExamPaper(p.id).subscribe({
      next: () => this.load(),
      error: e  => this.error.set(e.message),
    });
  }

  printPaper(p: ExamPaper) {
    if (!p.id) return;
    this.api.printableExamPaper(p.id).subscribe({
      next: () => window.print(),
      error: e  => this.error.set(e.message),
    });
  }

  statusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      DRAFT: 'neutral', PENDING_APPROVAL: 'warning', APPROVED: 'success', REJECTED: 'danger',
    };
    return map[status] ?? 'neutral';
  }
}
