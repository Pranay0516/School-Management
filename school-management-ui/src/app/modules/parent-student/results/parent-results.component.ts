import { Component } from '@angular/core';
import { BadgeComponent, BadgeVariant } from '../../../shared/badge.component';

interface Result {
  subject: string;
  maxMarks: number;
  marks: number;
  grade: string;
}

@Component({
  selector: 'app-parent-results',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './parent-results.component.html',
  styleUrl: './parent-results.component.scss',
})
export class ParentResultsComponent {
  exams = [
    {
      name: 'Unit Test I',
      date: 'January 2025',
      results: [
        { subject: 'Mathematics', maxMarks: 25, marks: 22, grade: 'A+' },
        { subject: 'Physics',     maxMarks: 25, marks: 20, grade: 'A'  },
        { subject: 'Chemistry',   maxMarks: 25, marks: 18, grade: 'B+' },
        { subject: 'English',     maxMarks: 25, marks: 23, grade: 'A+' },
        { subject: 'Biology',     maxMarks: 25, marks: 21, grade: 'A'  },
      ],
    },
    {
      name: 'Half Yearly Exam',
      date: 'October 2024',
      results: [
        { subject: 'Mathematics', maxMarks: 80, marks: 72, grade: 'A+' },
        { subject: 'Physics',     maxMarks: 70, marks: 61, grade: 'A'  },
        { subject: 'Chemistry',   maxMarks: 70, marks: 58, grade: 'B+' },
        { subject: 'English',     maxMarks: 80, marks: 74, grade: 'A+' },
        { subject: 'Biology',     maxMarks: 70, marks: 65, grade: 'A'  },
        { subject: 'History',     maxMarks: 80, marks: 68, grade: 'A'  },
      ],
    },
  ];

  totalMax(results: Result[])   { return results.reduce((s, r) => s + r.maxMarks, 0); }
  totalMarks(results: Result[]) { return results.reduce((s, r) => s + r.marks, 0); }
  percentage(results: Result[]) {
    return Math.round((this.totalMarks(results) / this.totalMax(results)) * 100);
  }

  gradeVariant(g: string): BadgeVariant {
    if (g === 'A+' || g === 'A') return 'success';
    if (g === 'B+' || g === 'B') return 'info';
    if (g === 'C') return 'warning';
    return 'danger';
  }
}
