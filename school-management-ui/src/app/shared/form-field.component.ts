import { Component, input } from '@angular/core';

/**
 * Labeled form field wrapper. Wraps any input/select/textarea with a label.
 * Usage:
 *   <ef-form-field label="Student Name">
 *     <input [(ngModel)]="name" />
 *   </ef-form-field>
 */
@Component({
  selector: 'ef-form-field',
  standalone: true,
  template: `
    <label class="form-field">
      <span class="field-label">{{ label() }}</span>
      <ng-content />
    </label>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .field-label {
      font-size: 12px;
      font-weight: 800;
      color: var(--muted);
      letter-spacing: .4px;
    }
    :host ::ng-deep input,
    :host ::ng-deep select,
    :host ::ng-deep textarea {
      padding: 11px 13px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface-strong);
      color: var(--text);
      font: 600 14px var(--font-body);
      width: 100%;
      box-sizing: border-box;
      transition: border-color .15s;
    }
    :host ::ng-deep input:focus,
    :host ::ng-deep select:focus,
    :host ::ng-deep textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 15%, transparent);
    }
  `],
})
export class FormFieldComponent {
  label = input('');
}
