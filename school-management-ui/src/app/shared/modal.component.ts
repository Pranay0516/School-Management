import { Component, input, output } from '@angular/core';

/**
 * Reusable modal shell with backdrop.
 * Usage:
 *   <ef-modal title="Add Student" (close)="showModal = false">
 *     ... form content ...
 *   </ef-modal>
 */
@Component({
  selector: 'ef-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  title   = input('');
  eyebrow = input('');
  close   = output<void>();

  onBackdropClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
