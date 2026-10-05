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
  template: `
    <article class="stat-card glass-card">
      <p class="label">{{ label() }}</p>
      <p class="value">{{ value() }}</p>
      @if (change()) {
        <span class="change" [ngClass]="'change--' + trend()">{{ change() }}</span>
      }
    </article>
  `,
  styles: [`
    .stat-card { padding: 20px; }
    .label {
      margin: 0;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: var(--muted);
      text-transform: uppercase;
    }
    .value {
      margin: 6px 0 4px;
      font-size: 30px;
      font-weight: 800;
      color: var(--text);
      font-family: var(--font-display);
    }
    .change {
      font-size: 12px;
      font-weight: 700;
    }
    .change--up     { color: var(--success); }
    .change--down   { color: var(--danger, #c53d55); }
    .change--warn   { color: var(--warning); }
    .change--neutral{ color: var(--muted); }
  `],
})
export class StatCardComponent {
  label  = input('');
  value  = input('');
  change = input('');
  trend  = input<StatTrend>('neutral');
}
