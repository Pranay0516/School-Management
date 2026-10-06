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
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  eyebrow     = input('');
  title       = input('');
  actionLabel = input('');
  action      = output<void>();
}
