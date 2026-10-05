import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { DataTableComponent }  from '../../../shared/data-table.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';
import { FormFieldComponent }  from '../../../shared/form-field.component';
import { ModalComponent }      from '../../../shared/modal.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { SearchBarComponent }  from '../../../shared/search-bar.component';

interface School {
  id: number;
  name: string;
  city: string;
  principal: string;
  email: string;
  plan: 'Basic' | 'Standard' | 'Premium';
  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
  students: number;
}

const BLANK_SCHOOL = {
  name: '', city: '', principal: '', email: '',
  plan: 'Basic' as School['plan'], status: 'ACTIVE' as School['status'],
};

@Component({
  selector: 'app-schools',
  standalone: true,
  imports: [
    FormsModule,
    BadgeComponent, DataTableComponent, EmptyStateComponent,
    FormFieldComponent, ModalComponent, PageHeaderComponent, SearchBarComponent,
  ],
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="SCHOOL MANAGEMENT"
        title="Schools"
        actionLabel="+ Add school"
        (action)="openAdd()" />

      <ef-search-bar
        [(query)]="search"
        placeholder="Search by name or city…"
        (search)="filterSchools($event)" />

      <ef-data-table [columns]="cols" style="--dt-cols: 2fr 1fr 1.5fr 1fr 80px 90px 80px">
        @for (s of filtered(); track s.id) {
          <div class="dt-row">
            <div>
              <b>{{ s.name }}</b>
              <small>{{ s.email }}</small>
            </div>
            <span>{{ s.city }}</span>
            <span>{{ s.principal }}</span>
            <ef-badge [variant]="planVariant(s.plan)">{{ s.plan }}</ef-badge>
            <span class="students-count">{{ s.students.toLocaleString() }}</span>
            <ef-badge [variant]="statusVariant(s.status)">{{ s.status }}</ef-badge>
            <div class="row-actions">
              <button class="icon-btn" (click)="openEdit(s)" title="Edit">✎</button>
            </div>
          </div>
        }
        @empty { <ef-empty icon="🏫" message="No schools found." /> }
      </ef-data-table>
    </article>

    @if (showModal()) {
      <ef-modal
        [eyebrow]="editing() ? 'EDIT SCHOOL' : 'ADD SCHOOL'"
        [title]="editing() ? 'Edit school details' : 'Register a new school'"
        (close)="closeModal()">
        <form (ngSubmit)="save()">
          <div class="form-grid">
            <ef-form-field label="School Name" style="grid-column: 1/-1">
              <input [(ngModel)]="draft.name" name="name" required />
            </ef-form-field>
            <ef-form-field label="City">
              <input [(ngModel)]="draft.city" name="city" required />
            </ef-form-field>
            <ef-form-field label="Principal Name">
              <input [(ngModel)]="draft.principal" name="principal" />
            </ef-form-field>
            <ef-form-field label="Contact Email" style="grid-column: 1/-1">
              <input type="email" [(ngModel)]="draft.email" name="email" />
            </ef-form-field>
            <ef-form-field label="Plan">
              <select [(ngModel)]="draft.plan" name="plan">
                <option value="Basic">Basic</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
              </select>
            </ef-form-field>
            <ef-form-field label="Status">
              <select [(ngModel)]="draft.status" name="status">
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="TRIAL">Trial</option>
              </select>
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn">
              {{ editing() ? 'Update school' : 'Add school' }}
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
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; padding: 5px 8px; font-size: 13px; cursor: pointer;
      color: var(--muted); transition: all .15s;
    }
    .icon-btn:hover { border-color: var(--primary); color: var(--primary); }
    .students-count { font-weight: 700; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    @media (max-width: 520px) { .form-grid { grid-template-columns: 1fr; } }
  `],
})
export class SchoolsComponent {
  cols = ['School', 'City', 'Principal', 'Plan', 'Students', 'Status', ''];
  search = '';

  schools = signal<School[]>([
    { id: 1, name: 'Sunrise Academy', city: 'Mumbai', principal: 'Dr. Meera Shah', email: 'admin@sunrise.edu', plan: 'Premium', status: 'ACTIVE', students: 1240 },
    { id: 2, name: 'Delhi Grammar School', city: 'Delhi', principal: 'Mr. Rajiv Kumar', email: 'rk@dgs.edu', plan: 'Standard', status: 'ACTIVE', students: 980 },
    { id: 3, name: 'MV Public School', city: 'Bangalore', principal: 'Ms. Priya Nair', email: 'priya@mvps.edu', plan: 'Basic', status: 'TRIAL', students: 340 },
    { id: 4, name: 'Lotus Valley International', city: 'Noida', principal: 'Dr. Anand Verma', email: 'av@lvi.edu', plan: 'Premium', status: 'ACTIVE', students: 2100 },
    { id: 5, name: 'St. Joseph High School', city: 'Chennai', principal: 'Fr. Thomas', email: 'thomas@sjhs.edu', plan: 'Standard', status: 'INACTIVE', students: 750 },
  ]);

  filtered   = signal<School[]>(this.schools());
  showModal  = signal(false);
  editing    = signal<School | null>(null);
  formError  = signal('');
  draft      = { ...BLANK_SCHOOL };
  nextId     = 6;

  filterSchools(q: string) {
    const lq = q.toLowerCase();
    this.filtered.set(
      q ? this.schools().filter(s =>
        s.name.toLowerCase().includes(lq) || s.city.toLowerCase().includes(lq)
      ) : this.schools()
    );
  }

  openAdd() {
    this.draft = { ...BLANK_SCHOOL };
    this.editing.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(s: School) {
    this.draft = { name: s.name, city: s.city, principal: s.principal, email: s.email, plan: s.plan, status: s.status };
    this.editing.set(s);
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.name || !this.draft.city) {
      this.formError.set('School name and city are required.');
      return;
    }
    const ed = this.editing();
    if (ed) {
      this.schools.update(list => list.map(s =>
        s.id === ed.id ? { ...s, ...this.draft } : s
      ));
    } else {
      this.schools.update(list => [...list, { id: this.nextId++, ...this.draft, students: 0 }]);
    }
    this.filtered.set(this.schools());
    this.closeModal();
  }

  planVariant(p: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { Premium: 'success', Standard: 'info', Basic: 'neutral' };
    return m[p] ?? 'neutral';
  }

  statusVariant(s: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { ACTIVE: 'success', INACTIVE: 'danger', TRIAL: 'warning' };
    return m[s] ?? 'neutral';
  }
}
