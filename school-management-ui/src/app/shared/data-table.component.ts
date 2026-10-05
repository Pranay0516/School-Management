import { Component, input } from '@angular/core';

/**
 * Reusable table shell. Pass column headers via `columns` input;
 * supply rows via the default `<ng-content>` slot.
 *
 * Usage:
 *   <ef-data-table [columns]="['Name','Class','Status']">
 *     @for (s of students; track s.id) {
 *       <div class="dt-row">
 *         <span>{{s.name}}</span>
 *         <span>{{s.className}}</span>
 *         <ef-badge variant="success">Active</ef-badge>
 *       </div>
 *     }
 *   </ef-data-table>
 */
@Component({
  selector: 'ef-data-table',
  standalone: true,
  template: `
    <div class="dt-wrap">
      <div class="dt-head">
        @for (col of columns(); track col) {
          <span>{{ col }}</span>
        }
      </div>
      <div class="dt-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .dt-wrap {
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      margin-top: 4px;
    }
    .dt-head {
      display: grid;
      padding: 10px 16px;
      background: var(--surface-strong);
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      font-weight: 800;
      color: var(--muted);
      letter-spacing: .8px;
      text-transform: uppercase;
      grid-template-columns: var(--dt-cols, repeat(auto-fit, minmax(80px, 1fr)));
    }
    .dt-body { display: grid; }
    :host ::ng-deep .dt-row {
      display: grid;
      grid-template-columns: var(--dt-cols, repeat(auto-fit, minmax(80px, 1fr)));
      align-items: center;
      padding: 13px 16px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
      gap: 8px;
      transition: background .12s;
    }
    :host ::ng-deep .dt-row:last-child { border-bottom: none; }
    :host ::ng-deep .dt-row:hover { background: color-mix(in srgb, var(--primary) 4%, var(--surface)); }
    :host ::ng-deep .dt-row b  { font-weight: 700; display: block; }
    :host ::ng-deep .dt-row small { color: var(--muted); font-size: 12px; }
  `],
})
export class DataTableComponent {
  columns = input<string[]>([]);
}
