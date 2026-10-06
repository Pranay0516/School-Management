import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService, Teacher } from '../../core/api.service';
import { StatCardComponent }   from '../../shared/stat-card.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.scss',
})
export class TeacherDashboardComponent { }
