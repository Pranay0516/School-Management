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
  template: `
    <div class="pr-results">
      <div class="results-header glass-card">
        <h2>Exam Results</h2>
        <p class="muted">Class X-A · Roll #24 · Aanya Mehta</p>
      </div>

      @for (exam of exams; track exam.name) {
        <div class="exam-section glass-card">
          <div class="exam-title">
            <h3>{{ exam.name }}</h3>
            <span class="exam-date">{{ exam.date }}</span>
          </div>
          <div class="results-table">
            <div class="rt-head">
              <span>Subject</span>
              <span>Max</span>
              <span>Scored</span>
              <span>Grade</span>
            </div>
            @for (r of exam.results; track r.subject) {
              <div class="rt-row">
                <span>{{ r.subject }}</span>
                <span>{{ r.maxMarks }}</span>
                <span class="marks" [class.low]="r.marks / r.maxMarks < 0.4">{{ r.marks }}</span>
                <ef-badge [variant]="gradeVariant(r.grade)">{{ r.grade }}</ef-badge>
              </div>
            }
            <div class="rt-total">
              <span>Total</span>
              <span>{{ totalMax(exam.results) }}</span>
              <span>{{ totalMarks(exam.results) }}</span>
              <span class="pct">{{ percentage(exam.results) }}%</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .pr-results { display: flex; flex-direction: column; gap: 12px; }
    .results-header { padding: 20px; }
    .results-header h2 { margin: 0 0 4px; }
    .results-header p  { margin: 0; font-size: 13px; }

    .exam-section { padding: 20px; }
    .exam-title {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
    }
    .exam-title h3 { margin: 0; font-size: 1rem; }
    .exam-date { font-size: 12px; color: var(--muted); font-weight: 600; }

    .rt-head, .rt-row {
      display: grid;
      grid-template-columns: 2fr 60px 70px 80px;
      padding: 8px 0;
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      align-items: center;
    }
    .rt-head {
      font-size: 11px; font-weight: 800; color: var(--muted);
      letter-spacing: .5px; text-transform: uppercase;
    }
    .rt-row:last-of-type { border-bottom: none; }
    .marks { font-weight: 700; }
    .marks.low { color: #b72040; }

    .rt-total {
      display: grid;
      grid-template-columns: 2fr 60px 70px 80px;
      padding: 10px 0 0;
      border-top: 2px solid var(--border);
      font-weight: 800;
      font-size: 14px;
      margin-top: 4px;
    }
    .pct { color: var(--primary); }
  `],
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
