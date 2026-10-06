import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Teacher } from '../../core/api.service';
import { BadgeComponent }      from '../../shared/badge.component';
import { DataTableComponent }  from '../../shared/data-table.component';
import { EmptyStateComponent } from '../../shared/empty-state.component';
import { FormFieldComponent }  from '../../shared/form-field.component';
import { ModalComponent }      from '../../shared/modal.component';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { SearchBarComponent }  from '../../shared/search-bar.component';

const BLANK: Teacher = { employeeId: '', name: '', subject: '', className: '', phone: '', email: '', status: 'ACTIVE' };

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent, DataTableComponent, EmptyStateComponent,
    FormFieldComponent, ModalComponent, PageHeaderComponent, SearchBarComponent,
  ],
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss',
})
export class TeacherListComponent implements OnInit {
  private api = inject(ApiService);

  cols = ['Teacher', 'Subject', 'Class', 'Phone', 'Status', ''];

  teachers  = signal<Teacher[]>([]);
  showModal = signal(false);
  editing   = signal<Teacher | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  search    = '';
  draft: Teacher = { ...BLANK };

  ngOnInit() { this.load(); }

  load(q = '') {
    this.api.teachers(q).subscribe({
      next: data => this.teachers.set(data),
      error: e   => this.error.set(e.message),
    });
  }

  openAdd()  { this.draft = { ...BLANK }; this.editing.set(null); this.formError.set(''); this.showModal.set(true); }
  openEdit(t: Teacher) { this.draft = { ...t }; this.editing.set(t); this.formError.set(''); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.employeeId || !this.draft.name) {
      this.formError.set('Employee ID and Name are required.');
      return;
    }
    this.saving.set(true);
    const req = this.editing()
      ? this.api.updateTeacher(this.draft)
      : this.api.addTeacher(this.draft);
    req.subscribe({
      next: () => { this.saving.set(false); this.closeModal(); this.load(); },
      error: e  => { this.saving.set(false); this.formError.set(e.message); },
    });
  }

  remove(t: Teacher) {
    if (!t.id || !confirm(`Delete ${t.name}?`)) return;
    this.api.deleteTeacher(t.id).subscribe({
      next: () => this.load(),
      error: e  => this.error.set(e.message),
    });
  }
}
