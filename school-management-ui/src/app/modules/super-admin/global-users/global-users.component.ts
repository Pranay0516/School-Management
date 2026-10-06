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
  templateUrl: './global-users.component.html',
  styleUrl: './global-users.component.scss',
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
