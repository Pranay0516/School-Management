import { Component, input } from '@angular/core';

/**
 * Empty state placeholder for lists/tables.
 * Usage: <ef-empty icon="📋" message="No records found yet." />
 */
@Component({
  selector: 'ef-empty',
  standalone: true,
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  icon    = input('📋');
  message = input('No records found.');
}
