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
  templateUrl: './parent-notices.component.html',
  styleUrl: './parent-notices.component.scss',
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
