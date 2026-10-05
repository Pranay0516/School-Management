import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Student } from '../../core/api.service';
import { BadgeComponent }      from '../../shared/badge.component';
import { DataTableComponent }  from '../../shared/data-table.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { FormFieldComponent }  from '../../shared/form-field.component';
import { ModalComponent }      from '../../shared/modal.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SearchBarComponent }  from '../../shared/search-bar.component';

const BLANK: Student = {
  admissionNo: '', name: '', className: '', section: '',
  parentName: '', parentPhone: '', status: 'ACTIVE',
};

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent, DataTableComponent, EmptyStateComponent,
    FormFieldComponent, ModalComponent, PageHeaderComponent, SearchBarComponent,
  ],
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="STUDENT DIRECTORY"
        title="Students"
        actionLabel="+ Add student"
        (action)="openAdd()" />

      <ef-search-bar
        [(query)]="search"
        placeholder="Search by name or admission no."
        (search)="load($event)" />

      <ef-data-table [columns]="cols" style="--dt-cols: 2fr 1fr 1fr 1.2fr 1.2fr 100px">
        @for (s of students(); track s.id) {
          <div class="dt-row">
            <div>
              <b>{{ s.name }}</b>
              <small>{{ s.admissionNo }}</small>
            </div>
            <span>{{ s.className }}{{ s.section ? '-' + s.section : '' }}</span>
            <span>{{ s.parentName || '–' }}</span>
            <span>{{ s.parentPhone || '–' }}</span>
            <ef-badge [variant]="s.status === 'ACTIVE' ? 'success' : 'neutral'">
              {{ s.status }}
            </ef-badge>
            <div class="row-actions">
              <button class="icon-btn" title="Edit" (click)="openEdit(s)">✎</button>
              <button class="icon-btn danger" title="Delete" (click)="remove(s)">✕</button>
            </div>
          </div>
        }
        @empty { <ef-empty icon="🎓" message="No students found. Add one to get started." /> }
      </ef-data-table>

      @if (error()) {
        <p class="error-msg">{{ error() }}</p>
      }
    </article>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT STUDENT' : 'NEW STUDENT'"
        [title]="editing() ? 'Edit student details' : 'Add a new student'"
        (close)="closeModal()">
        <form class="modal-form" (ngSubmit)="save()">
          <div class="form-grid">
            <ef-form-field label="Admission No">
              <input [(ngModel)]="draft.admissionNo" name="admissionNo"
                     [disabled]="!!editing()" required />
            </ef-form-field>
            <ef-form-field label="Full Name">
              <input [(ngModel)]="draft.name" name="name" required />
            </ef-form-field>
            <ef-form-field label="Class">
              <input [(ngModel)]="draft.className" name="className" placeholder="e.g. X" />
            </ef-form-field>
            <ef-form-field label="Section">
              <input [(ngModel)]="draft.section" name="section" placeholder="e.g. A" />
            </ef-form-field>
            <ef-form-field label="Parent Name">
              <input [(ngModel)]="draft.parentName" name="parentName" />
            </ef-form-field>
            <ef-form-field label="Parent Phone">
              <input [(ngModel)]="draft.parentPhone" name="parentPhone" />
            </ef-form-field>
            <ef-form-field label="Status">
              <select [(ngModel)]="draft.status" name="status">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TRANSFERRED">Transferred</option>
              </select>
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn" [disabled]="saving()">
              {{ saving() ? 'Saving…' : (editing() ? 'Update student' : 'Add student') }}
            </button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }
    .row-actions { display: flex; gap: 6px; }
    .icon-btn {
      border: 1px solid var(--border);
      background: var(--surface-strong);
      border-radius: 8px;
      padding: 5px 8px;
      font-size: 13px;
      cursor: pointer;
      color: var(--muted);
      transition: all .15s;
    }
    .icon-btn:hover         { border-color: var(--primary); color: var(--primary); }
    .icon-btn.danger:hover  { border-color: #c53d55; color: #c53d55; }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 4px;
    }
    .error-msg {
      font-size: 13px;
      color: #c53d55;
      margin: 8px 0 0;
    }
    @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class StudentListComponent implements OnInit {
  private api = inject(ApiService);

  cols = ['Student', 'Class', 'Parent', 'Phone', 'Status', ''];

  students  = signal<Student[]>([]);
  showModal = signal(false);
  editing   = signal<Student | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  search    = '';
  draft: Student = { ...BLANK };

  ngOnInit() { this.load(); }

  load(q = '') {
    this.error.set('');
    this.api.students(q).subscribe({
      next: data => this.students.set(data),
      error: e  => this.error.set(e.message),
    });
  }

  openAdd() {
    this.draft = { ...BLANK };
    this.editing.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(s: Student) {
    this.draft = { ...s };
    this.editing.set(s);
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.admissionNo || !this.draft.name) {
      this.formError.set('Admission No and Name are required.');
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    const req = this.editing()
      ? this.api.updateStudent(this.draft)
      : this.api.addStudent(this.draft);

    req.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  remove(s: Student) {
    if (!s.id || !confirm(`Delete ${s.name}?`)) return;
    this.api.deleteStudent(s.id).subscribe({
      next: () => this.load(),
      error: e  => this.error.set(e.message),
    });
  }
}
