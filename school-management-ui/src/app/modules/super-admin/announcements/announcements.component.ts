import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';
import { FormFieldComponent }  from '../../../shared/form-field.component';
import { ModalComponent }      from '../../../shared/modal.component';
import { PageHeaderComponent } from '../../../shared/page-header.component';

interface Announcement {
  id: number;
  title: string;
  message: string;
  audience: 'ALL' | 'PREMIUM' | 'STANDARD' | 'BASIC';
  date: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [FormsModule, BadgeComponent, FormFieldComponent, ModalComponent, PageHeaderComponent],
  templateUrl: './announcements.component.html',
  styleUrl: './announcements.component.scss',
})
export class AnnouncementsComponent {
  announcements = signal<Announcement[]>([
    { id: 1, title: 'Platform Maintenance Scheduled', message: 'The EduFlow platform will undergo scheduled maintenance on March 30, 2025 from 2 AM to 4 AM IST. Please inform your staff accordingly.', audience: 'ALL', date: 'Mar 20, 2025' },
    { id: 2, title: 'New Premium Feature: AI Report Cards', message: 'We are excited to announce AI-powered report card generation is now available for all Premium plan schools. Access it from the Examinations module.', audience: 'PREMIUM', date: 'Mar 15, 2025' },
    { id: 3, title: 'Upgrade to Standard — Limited Time Offer', message: 'Basic plan schools can upgrade to Standard plan at 20% off until March 31, 2025. Contact your account manager for details.', audience: 'BASIC', date: 'Mar 10, 2025' },
  ]);

  showModal = signal(false);
  formError = signal('');
  draft = { title: '', message: '', audience: 'ALL' as Announcement['audience'] };
  nextId = 4;

  openAdd() {
    this.draft = { title: '', message: '', audience: 'ALL' };
    this.formError.set('');
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); }

  save() {
    if (!this.draft.title || !this.draft.message) {
      this.formError.set('Title and message are required.');
      return;
    }
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    this.announcements.update(list => [
      { id: this.nextId++, ...this.draft, date: now },
      ...list,
    ]);
    this.closeModal();
  }

  audienceLabel(a: string) {
    const m: Record<string, string> = { ALL: 'All Schools', PREMIUM: 'Premium', STANDARD: 'Standard', BASIC: 'Basic' };
    return m[a] ?? a;
  }

  audienceVariant(a: string): BadgeVariant {
    const m: Record<string, BadgeVariant> = { ALL: 'info', PREMIUM: 'success', STANDARD: 'warning', BASIC: 'neutral' };
    return m[a] ?? 'neutral';
  }
}
