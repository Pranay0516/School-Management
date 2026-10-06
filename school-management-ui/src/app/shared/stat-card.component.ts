import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type StatTrend = 'up' | 'down' | 'warn' | 'neutral';

/**
 * Reusable KPI stat card.
 * Usage: <ef-stat-card label="STUDENTS" value="1,248" trend="up" change="↑ 8%"/>
 */
@Component({
  selector: 'ef-stat-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  label  = input('');
  value  = input('');
  change = input('');
  trend  = input<StatTrend>('neutral');
}
