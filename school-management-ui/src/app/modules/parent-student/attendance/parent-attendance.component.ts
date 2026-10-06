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
  templateUrl: './parent-attendance.component.html',
  styleUrl: './parent-attendance.component.scss',
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
