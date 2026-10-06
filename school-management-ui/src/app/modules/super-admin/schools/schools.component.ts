import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, CreatedSchool, SchoolSummary } from '../../../core/api.service';
import { PageHeaderComponent } from '../../../shared/page-header.component';

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss',
})
export class SchoolsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly schools = signal<SchoolSummary[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly formError = signal('');
  readonly lastCreated = signal<CreatedSchool | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    schoolName: ['', [Validators.required, Validators.maxLength(120)]],
    schoolCode: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{2,12}$/)]],
    city: ['', [Validators.required, Validators.maxLength(120)]],
    adminName: ['', [Validators.required, Validators.maxLength(120)]],
    adminEmail: ['', [Validators.required, Validators.email, Validators.maxLength(191)]],
    adminPassword: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(72)]],
  });

  ngOnInit(): void {
    this.loadSchools();
  }

  openCreate(): void {
    this.form.reset();
    this.formError.set('');
    this.showForm.set(true);
  }

  createSchool(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set('');
    this.api.createSchool(this.form.getRawValue()).subscribe({
      next: school => {
        this.lastCreated.set(school);
        this.showForm.set(false);
        this.saving.set(false);
        this.loadSchools();
      },
      error: error => {
        this.formError.set(error.message);
        this.saving.set(false);
      },
    });
  }

  private loadSchools(): void {
    this.loading.set(true);
    this.api.schools().subscribe({
      next: schools => {
        this.schools.set(schools);
        this.loading.set(false);
      },
      error: error => {
        this.formError.set(error.message);
        this.loading.set(false);
      },
    });
  }
}
