import { Component, input, output, signal } from '@angular/core';
import { SchoolsComponent }           from './schools/schools.component';

type SAPage = 'Schools';

const SA_NAV: { title: SAPage; icon: string }[] = [
  { title: 'Schools',       icon: '🏫' },
];

@Component({
  selector: 'app-super-admin-shell',
  standalone: true,
  imports: [SchoolsComponent],
  templateUrl: './super-admin-shell.component.html',
  styleUrl: './super-admin-shell.component.scss',
})
export class SuperAdminShellComponent {
  username = input('');
  back     = output<void>();

  nav  = SA_NAV;
  page = signal<SAPage>('Schools');

  initials() {
    const u = this.username();
    if (!u) return 'SA';
    return u.split(/[\s@.]+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('');
  }
}
