import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Examination } from '../../core/api.service';
import { BadgeComponent }      from '../../shared/badge.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { FormFieldComponent }  from '../../shared/form-field.component';
import { ModalComponent }      from '../../shared/modal.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { BadgeVariant }        from '../../shared/badge.component';

const BLANK: Examination = { name: '', className: '', startDate: '', endDate: '', status: 'SCHEDULED' };

@Component({
  selector: 'app-examinations',
  standalone: true,
  imports: [FormsModule, BadgeComponent, EmptyStateComponent, FormFieldComponent, ModalComponent, PageHeaderComponent],
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="EXAM SCHEDULE"
        title="Examinations"
        actionLabel="+ Create examination"
        (action)="openAdd()" />

      <div class="exam-list">
        @for (e of exams(); track e.id) {
          <div class="exam-card glass-card">
            <div class="exam-dates">
              <span class="date-range">{{ e.startDate }}{{ e.endDate ? ' → ' + e.endDate : '' }}</span>
            </div>
            <div class="exam-info">
              <h3>{{ e.name }}</h3>
              <p>{{ e.className }}</p>
            </div>
            <ef-badge [variant]="statusVariant(e.status)">{{ e.status }}</ef-badge>
            <div class="row-actions">
              <button class="icon-btn" (click)="openEdit(e)">✎</button>
              <button class="icon-btn danger" (click)="remove(e)">✕</button>
            </div>
          </div>
        }
        @empty {
          <ef-empty icon="📅" message="No examinations scheduled yet." />
        }
      </div>

      @if (error()) { <p class="error-msg">{{ error() }}</p> }
    </article>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT EXAMINATION' : 'NEW EXAMINATION'"
        [title]="editing() ? 'Edit examination' : 'Schedule an examination'"
        (close)="closeModal()">
        <form class="modal-form" (ngSubmit)="save()">
          <div class="form-grid">
            <ef-form-field label="Examination Name" style="grid-column: 1/-1">
              <input [(ngModel)]="draft.name" name="name" required placeholder="e.g. Quarterly Examination" />
            </ef-form-field>
            <ef-form-field label="Class">
              <input [(ngModel)]="draft.className" name="className" placeholder="e.g. Class X" />
            </ef-form-field>
            <ef-form-field label="Status">
              <select [(ngModel)]="draft.status" name="status">
                <option value="SCHEDULED">Scheduled</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </ef-form-field>
            <ef-form-field label="Start Date">
              <input type="date" [(ngModel)]="draft.startDate" name="startDate" required />
            </ef-form-field>
            <ef-form-field label="End Date">
              <input type="date" [(ngModel)]="draft.endDate" name="endDate" />
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn" [disabled]="saving()">
              {{ saving() ? 'Saving…' : (editing() ? 'Update' : 'Schedule') }}
            </button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }
    .exam-list { display: grid; gap: 10px; }
    .exam-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 14px;
    }
    .exam-dates { min-width: 130px; }
    .date-range { font-size: 12px; font-weight: 700; color: var(--muted); }
    .exam-info { flex: 1; }
    .exam-info h3 { margin: 0; font-size: 15px; }
    .exam-info p  { margin: 3px 0 0; font-size: 13px; color: var(--muted); }
    .row-actions { display: flex; gap: 6px; }
    .icon-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 5px 8px; font-size: 13px; cursor: pointer;
      color: var(--muted); transition: all .15s;
    }
    .icon-btn:hover        { border-color: var(--primary); color: var(--primary); }
    .icon-btn.danger:hover { border-color: #c53d55; color: #c53d55; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class ExaminationsComponent implements OnInit {
  private api = inject(ApiService);

  exams     = signal<Examination[]>([]);
  showModal = signal(false);
  editing   = signal<Examination | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  draft: Examination = { ...BLANK };

  ngOnInit() { this.load(); }

  load() {
    this.api.examinations().subscribe({
      next: data => this.exams.set(data),
      error: e   => this.error.set(e.message),
    });
  }

  openAdd()  { this.draft = { ...BLANK }; this.editing.set(null); this.formError.set(''); this.showModal.set(true); }
  openEdit(e: Examination) { this.draft = { ...e }; this.editing.set(e); this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.name || !this.draft.startDate) {
      this.formError.set('Name and Start Date are required.');
      return;
    }
    this.saving.set(true);
    const req = this.editing()
      ? this.api.updateExamination(this.draft)
      : this.api.addExamination(this.draft);
    req.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  remove(e: Examination) {
    if (!e.id || !confirm(`Delete "${e.name}"?`)) return;
    this.api.deleteExamination(e.id).subscribe({
      next: () => this.load(),
      error: e  => this.error.set(e.message),
    });
  }

  statusVariant(status: string): BadgeVariant {
    const map: Record<string, BadgeVariant> = {
      SCHEDULED: 'info', ONGOING: 'warning', COMPLETED: 'success', DRAFT: 'neutral',
    };
    return map[status] ?? 'neutral';
  }
}
