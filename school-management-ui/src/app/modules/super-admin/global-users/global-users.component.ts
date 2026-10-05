import { Component, signal } from '@angular/core';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { DataTableComponent }  from '../../../shared/data-table.component';
import { EmptyStateComponent } from '../../../shared/empty-state.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';

interface GlobalUser {
  id: number;
  name: string;
  email: string;
  role: string;
  school: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

@Component({
  selector: 'app-global-users',
  standalone: true,
  imports: [BadgeComponent, DataTableComponent, EmptyStateComponent, PageHeaderComponent],
  template: `
    <article class="glass-card panel">
      <ef-page-header eyebrow="PLATFORM USERS" title="Global Users" />

      <ef-data-table [columns]="cols" style="--dt-cols: 2fr 2fr 1fr 2fr 1fr 80px">
        @for (u of users(); track u.id) {
          <div class="dt-row">
            <div>
              <b>{{ u.name }}</b>
            </div>
            <span>{{ u.email }}</span>
            <ef-badge variant="info">{{ u.role }}</ef-badge>
            <span>{{ u.school || '—' }}</span>
            <ef-badge [variant]="u.status === 'ACTIVE' ? 'success' : 'danger'">{{ u.status }}</ef-badge>
            <div class="row-actions">
              <button class="icon-btn" (click)="toggleStatus(u)" [title]="u.status === 'ACTIVE' ? 'Suspend' : 'Activate'">
                {{ u.status === 'ACTIVE' ? '⊘' : '✓' }}
              </button>
            </div>
          </div>
        }
        @empty { <ef-empty icon="👤" message="No users found." /> }
      </ef-data-table>
    </article>
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
  `],
})
export class GlobalUsersComponent {
  cols = ['Name', 'Email', 'Role', 'School', 'Status', ''];

  users = signal<GlobalUser[]>([
    { id: 1, name: 'Arjun Mehta', email: 'arjun@eduflow.io', role: 'SUPER_ADMIN', school: '', status: 'ACTIVE' },
    { id: 2, name: 'Kavya Sharma', email: 'kavya@eduflow.io', role: 'SUPER_ADMIN', school: '', status: 'ACTIVE' },
    { id: 3, name: 'Ritu Bose', email: 'ritu@sunrise.edu', role: 'ADMIN', school: 'Sunrise Academy', status: 'ACTIVE' },
    { id: 4, name: 'Prem Nair', email: 'prem@dgs.edu', role: 'ADMIN', school: 'Delhi Grammar School', status: 'ACTIVE' },
    { id: 5, name: 'Vijay Singh', email: 'vijay@sjhs.edu', role: 'ADMIN', school: 'St. Joseph High School', status: 'SUSPENDED' },
  ]);

  toggleStatus(u: GlobalUser) {
    this.users.update(list => list.map(x =>
      x.id === u.id ? { ...x, status: x.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : x
    ));
  }
}
