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
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  label = input('');
}
