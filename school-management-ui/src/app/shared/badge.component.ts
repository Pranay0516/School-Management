import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

/**
 * Reusable status badge.
 * Usage: <ef-badge variant="success">Active</ef-badge>
 */
@Component({
  selector: 'ef-badge',
  standalone: true,
  imports: [NgClass],
  template: `<span class="badge" [ngClass]="'badge--' + variant()"><ng-content /></span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .4px;
      white-space: nowrap;
    }
    .badge--success  { background: #d4f5e6; color: #156843; }
    .badge--warning  { background: #fff1d7; color: #9a5f08; }
    .badge--danger   { background: #ffe5ea; color: #b72040; }
    .badge--info     { background: #e0eaff; color: #2551c7; }
    .badge--neutral  { background: #f0f2f5; color: #55627a; }
  `],
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
}
