import { Component, input, output } from '@angular/core';

/**
 * Page-level panel header with eyebrow, title and an optional action button.
 * Usage:
 *   <ef-page-header eyebrow="STUDENT DIRECTORY" title="Students" actionLabel="+ Add student"
 *     (action)="openModal()" />
 */
@Component({
  selector: 'ef-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <p class="eyebrow">{{ eyebrow() }}</p>
        <h2>{{ title() }}</h2>
      </div>
      @if (actionLabel()) {
        <button class="primary-btn" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    h2 { margin: 4px 0 0; font-size: 1.2rem; }
  `],
})
export class PageHeaderComponent {
  eyebrow     = input('');
  title       = input('');
  actionLabel = input('');
  action      = output<void>();
}
