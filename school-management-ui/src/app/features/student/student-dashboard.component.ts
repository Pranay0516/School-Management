import { Component } from '@angular/core';
import { StatCardComponent } from '../../shared/stat-card.component';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss',
})
export class StudentDashboardComponent { }
