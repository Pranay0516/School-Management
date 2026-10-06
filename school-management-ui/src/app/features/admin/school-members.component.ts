import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, CreatedMember, SchoolMember } from '../../core/api.service';

@Component({
  selector: 'app-school-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './school-members.component.html',
  styleUrl: './school-members.component.scss',
})
export class SchoolMembersComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly members = signal<SchoolMember[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly formError = signal('');
  readonly lastCreated = signal<CreatedMember | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(191)]],
    password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(72)]],
    role: ['TEACHER' as 'TEACHER' | 'STUDENT', Validators.required],
    phone: [''],
    subject: [''],
    className: ['', Validators.required],
    section: [''],
    parentName: [''],
    parentPhone: [''],
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  createMember(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.api.createSchoolMember(this.form.getRawValue()).subscribe({
      next: member => {
        this.lastCreated.set(member);
        this.form.reset({ role: 'TEACHER' });
        this.saving.set(false);
        this.loadMembers();
      },
      error: error => {
        this.formError.set(error.message);
        this.saving.set(false);
      },
    });
  }

  private loadMembers(): void {
    this.loading.set(true);
    this.api.schoolMembers().subscribe({
      next: members => {
        this.members.set(members);
        this.loading.set(false);
      },
      error: error => {
        this.formError.set(error.message);
        this.loading.set(false);
      },
    });
  }
}
