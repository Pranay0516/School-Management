import { Component, inject } from '@angular/core';
import { DashboardAccessService } from '../../core/dashboard-access.service';

@Component({
  selector: 'app-dashboard-access',
  standalone: true,
  templateUrl: './dashboard-access.component.html',
  styleUrl: './dashboard-access.component.scss',
})
export class DashboardAccessComponent {
  readonly access = inject(DashboardAccessService);
}
