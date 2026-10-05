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
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="COMMUNICATIONS"
        title="Announcements"
        actionLabel="+ New announcement"
        (action)="openAdd()" />

      <div class="ann-list">
        @for (a of announcements(); track a.id) {
          <div class="ann-card glass-card">
            <div class="ann-head">
              <div>
                <h3>{{ a.title }}</h3>
                <small>{{ a.date }}</small>
              </div>
              <ef-badge [variant]="audienceVariant(a.audience)">{{ audienceLabel(a.audience) }}</ef-badge>
            </div>
            <p>{{ a.message }}</p>
          </div>
        }
        @empty {
          <div class="empty-ann">
            <span>📢</span>
            <p>No announcements yet. Create one to broadcast to schools.</p>
          </div>
        }
      </div>
    </article>

    @if (showModal()) {
      <ef-modal eyebrow="NEW ANNOUNCEMENT" title="Create announcement" (close)="closeModal()">
        <form (ngSubmit)="save()">
          <div class="form-grid">
            <ef-form-field label="Title" style="grid-column: 1/-1">
              <input [(ngModel)]="draft.title" name="title" required />
            </ef-form-field>
            <ef-form-field label="Target Audience">
              <select [(ngModel)]="draft.audience" name="audience">
                <option value="ALL">All Schools</option>
                <option value="PREMIUM">Premium Plan</option>
                <option value="STANDARD">Standard Plan</option>
                <option value="BASIC">Basic Plan</option>
              </select>
            </ef-form-field>
            <ef-form-field label="Message" style="grid-column: 1/-1">
              <textarea [(ngModel)]="draft.message" name="message" rows="4" required></textarea>
            </ef-form-field>
          </div>
          @if (formError()) { <p class="error-msg">{{ formError() }}</p> }
          <div class="form-actions">
            <button type="button" class="outline-btn" (click)="closeModal()">Cancel</button>
            <button type="submit" class="primary-btn">Send announcement</button>
          </div>
        </form>
      </ef-modal>
    }
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }
    .ann-list { display: flex; flex-direction: column; gap: 12px; }
    .ann-card { padding: 20px; }
    .ann-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .ann-head h3 { margin: 0; font-size: 15px; }
    .ann-head small { color: var(--muted); font-size: 12px; margin-top: 3px; display: block; }
    .ann-card p { font-size: 14px; color: var(--muted); line-height: 1.6; margin: 0; }
    .empty-ann {
      display: flex; flex-direction: column; align-items: center; padding: 56px 24px;
      gap: 12px; color: var(--muted); text-align: center;
    }
    .empty-ann span { font-size: 40px; }
    .empty-ann p { margin: 0; font-size: 14px; font-weight: 600; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
    .error-msg { color: #c53d55; font-size: 13px; margin-top: 8px; }
    :host ::ng-deep textarea {
      padding: 11px 13px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-strong); color: var(--text);
      font: 600 14px var(--font-body); width: 100%; box-sizing: border-box;
      resize: vertical; min-height: 100px;
    }
  `],
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
