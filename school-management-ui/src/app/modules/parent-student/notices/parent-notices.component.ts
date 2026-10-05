import { Component, signal } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge.component';

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  category: 'GENERAL' | 'ACADEMIC' | 'EVENT' | 'EXAM';
}

@Component({
  selector: 'app-parent-notices',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="pn-notices">
      <div class="notices-header glass-card">
        <h2>School Notices</h2>
        <p class="muted">Official announcements from the school administration.</p>
      </div>

      <div class="notice-list">
        @for (n of notices(); track n.id) {
          <div class="notice-card glass-card" [class.expanded]="expanded() === n.id">
            <div class="notice-top" (click)="toggle(n.id)">
              <div class="notice-meta">
                <ef-badge [variant]="categoryVariant(n.category)">{{ n.category }}</ef-badge>
                <span class="notice-date">{{ n.date }}</span>
              </div>
              <div class="notice-title-row">
                <h3>{{ n.title }}</h3>
                <span class="expand-icon">{{ expanded() === n.id ? '−' : '+' }}</span>
              </div>
            </div>
            @if (expanded() === n.id) {
              <p class="notice-content">{{ n.content }}</p>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pn-notices { display: flex; flex-direction: column; gap: 12px; }
    .notices-header { padding: 20px; }
    .notices-header h2 { margin: 0 0 4px; }
    .notices-header p  { margin: 0; font-size: 13px; }

    .notice-list { display: flex; flex-direction: column; gap: 8px; }
    .notice-card { padding: 16px 20px; cursor: pointer; transition: box-shadow .15s; }
    .notice-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.08); }

    .notice-top { }
    .notice-meta {
      display: flex; align-items: center; gap: 10px; margin-bottom: 8px;
    }
    .notice-date { font-size: 12px; color: var(--muted); font-weight: 600; }
    .notice-title-row {
      display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
    }
    .notice-title-row h3 { margin: 0; font-size: 14px; line-height: 1.4; }
    .expand-icon {
      font-size: 20px; font-weight: 300; color: var(--muted);
      flex-shrink: 0; line-height: 1;
    }

    .notice-content {
      margin: 12px 0 0; font-size: 14px; color: var(--muted);
      line-height: 1.65; border-top: 1px solid var(--border); padding-top: 12px;
    }
  `],
})
export class ParentNoticesComponent {
  expanded = signal<number | null>(null);

  toggle(id: number) {
    this.expanded.set(this.expanded() === id ? null : id);
  }

  notices = signal<Notice[]>([
    {
      id: 1,
      title: 'Annual Sports Day - March 30, 2025',
      content: 'The Annual Sports Day will be held on March 30, 2025 at the school ground. Students are requested to report by 8:00 AM in their respective house colours. Parents are cordially invited to attend. Entry is free.',
      date: 'Mar 18, 2025',
      category: 'EVENT',
    },
    {
      id: 2,
      title: 'Parent-Teacher Meeting - April 5, 2025',
      content: 'The school will hold a Parent-Teacher Meeting on April 5, 2025 from 9:00 AM to 1:00 PM. Parents are requested to meet the class teacher to discuss academic progress. Please collect the time slot token from the school office before March 28.',
      date: 'Mar 15, 2025',
      category: 'ACADEMIC',
    },
    {
      id: 3,
      title: 'Holiday Notice: Holi - March 25, 2025',
      content: 'The school will remain closed on March 25, 2025 on account of Holi. Regular classes will resume on March 26, 2025.',
      date: 'Mar 10, 2025',
      category: 'GENERAL',
    },
    {
      id: 4,
      title: 'Unit Test II Schedule Released',
      content: 'Unit Test II will be conducted from April 8 to April 12, 2025. The timetable has been shared in the school diary. Students are advised to start preparation immediately. Syllabus will be covered up to chapters taught until March 31.',
      date: 'Mar 8, 2025',
      category: 'EXAM',
    },
    {
      id: 5,
      title: 'School Bus Route Change - Sector 14',
      content: 'Due to road construction work near Sector 14, the school bus route has been modified temporarily. Bus No. 7 will now pick up students from the main road junction near Sector 14 Park. This change will be in effect until April 15, 2025.',
      date: 'Mar 5, 2025',
      category: 'GENERAL',
    },
  ]);

  categoryVariant(c: string) {
    const m: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
      GENERAL: 'neutral', ACADEMIC: 'info', EVENT: 'success', EXAM: 'warning',
    };
    return m[c] ?? 'neutral';
  }
}
