import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService, Teacher, TeacherAccount } from '../../core/api.service';
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

  cols = ['Teacher', 'Subject', 'Class', 'Phone', 'Status', 'Login', ''];

  teachers  = signal<Teacher[]>([]);
  showModal = signal(false);
  editing   = signal<Teacher | null>(null);
  saving    = signal(false);
  error     = signal('');
  formError = signal('');
  accounts = signal<TeacherAccount[]>([]);
  accountTeacher = signal<Teacher | null>(null);
  accountDraft = { username: '', password: '' };
  accountError = signal('');
  accountSaving = signal(false);
  search    = '';
  draft: Teacher = { ...BLANK };

  ngOnInit() { this.load(); }

  load(q = '') {
    forkJoin({
      teachers: this.api.teachers(q),
      accounts: this.api.teacherAccounts(),
    }).subscribe({
      next: ({ teachers, accounts }) => {
        this.teachers.set(teachers);
        this.accounts.set(accounts);
      },
      error: e   => this.error.set(e.message),
    });
  }

  accountFor(teacher: Teacher): TeacherAccount | undefined {
    return this.accounts().find(account => account.teacherId === teacher.id);
  }

  openAccountSetup(teacher: Teacher) {
    this.accountTeacher.set(teacher);
    this.accountDraft = { username: teacher.email ?? '', password: '' };
    this.accountError.set('');
  }

  closeAccountSetup() {
    this.accountTeacher.set(null);
  }

  createAccount() {
    const teacher = this.accountTeacher();
    const username = this.accountDraft.username.trim();
    if (!teacher?.id || !username || !this.accountDraft.password) {
      this.accountError.set('An email username and password are required.');
      return;
    }
    if (this.accountDraft.password.length < 12) {
      this.accountError.set('Password must contain at least 12 characters.');
      return;
    }

    this.accountSaving.set(true);
    this.accountError.set('');
    this.api.createTeacherAccount(teacher.id, {
      username,
      password: this.accountDraft.password,
    }).subscribe({
      next: account => {
        this.accounts.update(accounts => [...accounts, account]);
        this.accountSaving.set(false);
        this.closeAccountSetup();
      },
      error: error => {
        this.accountSaving.set(false);
        this.accountError.set(error.message);
      },
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
