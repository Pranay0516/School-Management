import { Component, input } from '@angular/core';

/**
 * Empty state placeholder for lists/tables.
 * Usage: <ef-empty icon="📋" message="No records found yet." />
 */
@Component({
  selector: 'ef-empty',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 56px 24px;
      color: var(--muted);
      gap: 10px;
    }
    .empty-icon { font-size: 40px; line-height: 1; }
    p { margin: 0; font-size: 14px; font-weight: 600; }
  `],
})
export class EmptyStateComponent {
  icon    = input('📋');
  message = input('No records found.');
}
