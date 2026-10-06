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
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  query       = model('');
  placeholder = input('Search…');
  search      = output<string>();
}
