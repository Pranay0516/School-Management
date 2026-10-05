import { Component, signal, computed } from '@angular/core';

type DayStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HOLIDAY' | 'FUTURE';

interface CalDay {
  date: number;
  status: DayStatus;
  dayOfWeek: number;
}

@Component({
  selector: 'app-parent-attendance',
  standalone: true,
  template: `
    <div class="pa-attendance">
      <div class="cal-header glass-card">
        <button class="nav-btn" (click)="prevMonth()">‹</button>
        <h2>{{ monthLabel() }}</h2>
        <button class="nav-btn" (click)="nextMonth()">›</button>
      </div>

      <div class="cal-card glass-card">
        <div class="cal-dow-row">
          @for (d of dows; track d) { <span class="dow">{{ d }}</span> }
        </div>
        <div class="cal-grid">
          @for (d of calDays(); track d.date + '-' + d.status) {
            <div
              class="cal-cell"
              [class]="'cal-cell ' + d.status.toLowerCase()"
              [class.empty]="d.date === 0">
              @if (d.date > 0) {
                <span class="cal-date">{{ d.date }}</span>
                @if (d.status !== 'FUTURE' && d.status !== 'HOLIDAY') {
                  <span class="cal-dot"></span>
                }
              }
            </div>
          }
        </div>
      </div>

      <div class="legend glass-card">
        @for (l of legend; track l.label) {
          <div class="leg-item">
            <span class="leg-dot" [class]="l.class"></span>
            {{ l.label }}
          </div>
        }
      </div>

      <div class="month-summary glass-card">
        <div class="sum-item present"><b>{{ presentCount() }}</b><span>Present</span></div>
        <div class="sum-item absent"><b>{{ absentCount() }}</b><span>Absent</span></div>
        <div class="sum-item late"><b>{{ lateCount() }}</b><span>Late</span></div>
        <div class="sum-item pct"><b>{{ attendancePct() }}%</b><span>Rate</span></div>
      </div>
    </div>
  `,
  styles: [`
    .pa-attendance { display: flex; flex-direction: column; gap: 12px; }

    .cal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 20px;
    }
    .cal-header h2 { margin: 0; font-size: 1.1rem; }
    .nav-btn {
      border: 1px solid var(--border); background: var(--surface-strong);
      border-radius: 8px; width: 36px; height: 36px; font-size: 18px;
      cursor: pointer; color: var(--text); display: grid; place-items: center;
      transition: background .14s;
    }
    .nav-btn:hover { background: color-mix(in srgb, var(--primary) 10%, var(--surface-strong)); }

    .cal-card { padding: 20px; }
    .cal-dow-row {
      display: grid; grid-template-columns: repeat(7, 1fr);
      margin-bottom: 8px;
    }
    .dow {
      text-align: center; font-size: 11px; font-weight: 800;
      color: var(--muted); padding: 4px 0;
    }
    .cal-grid {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
    }
    .cal-cell {
      aspect-ratio: 1;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      border-radius: 10px; position: relative; gap: 3px;
    }
    .cal-cell.empty { background: transparent; }
    .cal-cell.present { background: #d4f5e6; }
    .cal-cell.absent  { background: #ffe5ea; }
    .cal-cell.late    { background: #fff1d7; }
    .cal-cell.holiday { background: var(--surface-strong); }
    .cal-cell.future  { background: transparent; }
    .cal-date { font-size: 13px; font-weight: 700; color: var(--text); }
    .cal-dot  { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .cal-cell.present .cal-dot { background: #156843; }
    .cal-cell.absent  .cal-dot { background: #b72040; }
    .cal-cell.late    .cal-dot { background: #9a5f08; }

    .legend {
      display: flex; gap: 16px; flex-wrap: wrap; padding: 14px 20px;
    }
    .leg-item {
      display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600;
    }
    .leg-dot {
      width: 12px; height: 12px; border-radius: 4px;
    }
    .leg-dot.present { background: #d4f5e6; border: 1px solid #a3e9c8; }
    .leg-dot.absent  { background: #ffe5ea; border: 1px solid #ffc5ce; }
    .leg-dot.late    { background: #fff1d7; border: 1px solid #ffd999; }
    .leg-dot.holiday { background: var(--surface-strong); border: 1px solid var(--border); }

    .month-summary {
      display: flex; gap: 0; overflow: hidden; border-radius: 14px;
    }
    .sum-item {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 16px 8px; border-right: 1px solid var(--border);
    }
    .sum-item:last-child { border-right: none; }
    .sum-item b { font-size: 22px; font-weight: 800; color: var(--text); }
    .sum-item span { font-size: 11px; font-weight: 700; color: var(--muted); }
    .sum-item.present b { color: #156843; }
    .sum-item.absent  b { color: #b72040; }
    .sum-item.late    b { color: #9a5f08; }
    .sum-item.pct     b { color: var(--primary); }
  `],
})
export class ParentAttendanceComponent {
  dows = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  legend = [
    { label: 'Present', class: 'present' },
    { label: 'Absent',  class: 'absent'  },
    { label: 'Late',    class: 'late'    },
    { label: 'Holiday', class: 'holiday' },
  ];

  currentYear  = signal(new Date().getFullYear());
  currentMonth = signal(new Date().getMonth()); // 0-indexed

  monthLabel = computed(() => {
    return new Date(this.currentYear(), this.currentMonth(), 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  calDays = computed<CalDay[]>(() => {
    const year  = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const statuses: DayStatus[] = ['PRESENT', 'ABSENT', 'LATE'];
    const mockData: Record<number, DayStatus> = {
      1: 'PRESENT', 2: 'PRESENT', 3: 'LATE', 4: 'PRESENT', 5: 'HOLIDAY',
      6: 'HOLIDAY', 7: 'ABSENT', 8: 'PRESENT', 9: 'PRESENT', 10: 'PRESENT',
      11: 'PRESENT', 12: 'HOLIDAY', 13: 'HOLIDAY', 14: 'PRESENT', 15: 'PRESENT',
      16: 'PRESENT', 17: 'ABSENT', 18: 'PRESENT', 19: 'HOLIDAY', 20: 'HOLIDAY',
      21: 'PRESENT', 22: 'PRESENT', 23: 'PRESENT', 24: 'PRESENT', 25: 'HOLIDAY',
    };

    const cells: CalDay[] = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push({ date: 0, status: 'FUTURE', dayOfWeek: i });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      let status: DayStatus;
      if (cellDate > today) {
        status = 'FUTURE';
      } else {
        status = mockData[d] ?? 'PRESENT';
      }
      cells.push({ date: d, status, dayOfWeek: (firstDay + d - 1) % 7 });
    }
    return cells;
  });

  presentCount  = computed(() => this.calDays().filter(d => d.status === 'PRESENT').length);
  absentCount   = computed(() => this.calDays().filter(d => d.status === 'ABSENT').length);
  lateCount     = computed(() => this.calDays().filter(d => d.status === 'LATE').length);
  attendancePct = computed(() => {
    const total = this.presentCount() + this.absentCount() + this.lateCount();
    if (!total) return 0;
    return Math.round(((this.presentCount() + this.lateCount()) / total) * 100);
  });

  prevMonth() {
    if (this.currentMonth() === 0) {
      this.currentYear.update(y => y - 1);
      this.currentMonth.set(11);
    } else {
      this.currentMonth.update(m => m - 1);
    }
  }

  nextMonth() {
    if (this.currentMonth() === 11) {
      this.currentYear.update(y => y + 1);
      this.currentMonth.set(0);
    } else {
      this.currentMonth.update(m => m + 1);
    }
  }
}
