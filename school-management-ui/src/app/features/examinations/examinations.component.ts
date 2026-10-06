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
  templateUrl: './examinations.component.html',
  styleUrl: './examinations.component.scss',
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
