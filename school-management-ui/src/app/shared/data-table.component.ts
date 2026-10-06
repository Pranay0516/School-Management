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
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent {
  columns = input<string[]>([]);
}
