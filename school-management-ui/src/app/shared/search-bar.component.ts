import { Component, input, output, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Reusable search bar with optional button.
 * Usage:
 *   <ef-search-bar [(query)]="search" placeholder="Search by name…" (search)="load()" />
 */
@Component({
  selector: 'ef-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-bar">
      <input
        class="search-input"
        [(ngModel)]="query"
        [placeholder]="placeholder()"
        (keyup.enter)="search.emit(query())"
      />
      <button class="outline-btn" type="button" (click)="search.emit(query())">Search</button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      gap: 10px;
      align-items: center;
      margin-bottom: 16px;
    }
    .search-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface-strong);
      color: var(--text);
      font: 600 14px var(--font-body);
      transition: border-color .15s;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
    }
  `],
})
export class SearchBarComponent {
  query       = model('');
  placeholder = input('Search…');
  search      = output<string>();
}
