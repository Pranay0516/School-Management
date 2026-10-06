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
  templateUrl: './schools.component.html',
  styleUrl: './schools.component.scss',
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
