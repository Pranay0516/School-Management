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
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
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
