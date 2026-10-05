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
  template: `
    <div class="modal-backdrop" (click)="onBackdropClick($event)">
      <div class="modal-panel glass-card" role="dialog" [attr.aria-label]="title()">
        <div class="modal-head">
          <div>
            <p class="eyebrow">{{ eyebrow() }}</p>
            <h2>{{ title() }}</h2>
          </div>
          <button class="modal-close" type="button" aria-label="Close" (click)="close.emit()">✕</button>
        </div>
        <div class="modal-body">
          <ng-content />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(18, 32, 60, 0.45);
      backdrop-filter: blur(3px);
      display: grid;
      place-items: center;
      padding: 20px;
      z-index: 100;
      animation: fade-in 0.15s ease;
    }
    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .modal-panel {
      width: min(640px, 100%);
      padding: 28px 32px 32px;
      animation: slide-up 0.18s ease;
      max-height: 90vh;
      overflow-y: auto;
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(16px) scale(.97); }
      to   { opacity: 1; transform: none; }
    }
    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    }
    h2 { margin: 4px 0 0; font-size: 1.25rem; }
    .modal-close {
      border: 0;
      background: transparent;
      font-size: 20px;
      color: var(--muted);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background .15s;
      line-height: 1;
    }
    .modal-close:hover { background: var(--surface-strong); }
    .modal-body { display: grid; gap: 14px; }
  `],
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
