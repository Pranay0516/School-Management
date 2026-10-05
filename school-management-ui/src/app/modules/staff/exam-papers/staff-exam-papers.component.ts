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
  template: `
    <div class="sep-papers">
      <div class="papers-header glass-card">
        <div>
          <h2>Exam Papers</h2>
          <p class="muted">Papers you have created or are drafting.</p>
        </div>
        <button class="create-btn" (click)="openAdd()">+ Create paper</button>
      </div>

      <div class="paper-list">
        @for (p of papers(); track p.id) {
          <div class="paper-card glass-card">
            <div class="paper-icon">▤</div>
            <div class="paper-info">
              <b>{{ p.title }}</b>
              <small>{{ p.subject }} · {{ p.className }} · {{ p.totalMarks }} marks · {{ p.durationMinutes }} min</small>
            </div>
            <ef-badge [variant]="statusVariant(p.status)">{{ p.status | statusLabel }}</ef-badge>
            @if (p.status === 'DRAFT' || p.status === 'REJECTED') {
              <button class="icon-btn" (click)="openEdit(p)">✎</button>
            }
          </div>
        }
        @if (!papers().length && !loading()) {
          <div class="glass-card"><ef-empty icon="📄" message="No papers yet. Create one." /></div>
        }
      </div>

      @if (error()) { <p class="error-msg">{{ error() }}</p> }
    </div>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT PAPER' : 'NEW PAPER'"
        [title]="editing() ? 'Edit question paper' : 'Create question paper'"
        (close)="closeModal()">
        <form (ngSubmit)="submit()">
          <div class="form-grid">
            <ef-form-field label="Title" style="grid-column: 1/-1">
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
    .sep-papers { display: flex; flex-direction: column; gap: 12px; }
    .papers-header {
      display: flex; align-items: center; justify-content: space-between; padding: 20px;
    }
    .papers-header h2 { margin: 0 0 4px; }
    .papers-header p  { margin: 0; font-size: 13px; }
    .create-btn {
      border: 0; border-radius: 10px; padding: 10px 16px;
      background: var(--primary); color: #fff; font: 800 13px var(--font-body);
      cursor: pointer; white-space: nowrap; transition: opacity .15s;
    }
    .create-btn:hover { opacity: .85; }

    .paper-list { display: flex; flex-direction: column; gap: 8px; }
    .paper-card {
      display: flex; align-items: center; gap: 14px; padding: 16px 20px;
    }
    .paper-icon { font-size: 24px; color: var(--primary); }
    .paper-info { flex: 1; }
    .paper-info b { display: block; font-size: 14px; }
    .paper-info small { color: var(--muted); font-size: 12px; }
    .icon-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 6px 9px; font-size: 13px; cursor: pointer;
      color: var(--muted); transition: all .15s;
    }
    .icon-btn:hover { border-color: var(--primary); color: var(--primary); }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; }
  `],
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
