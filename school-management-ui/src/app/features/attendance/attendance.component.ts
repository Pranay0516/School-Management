import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Attendance } from '../../core/api.service';
import { PageHeaderComponent } from '../../shared/page-header.component';

type AttStatus = 'PRESENT' | 'ABSENT' | 'LATE';
const CLASSES = ['X-A', 'X-B', 'IX-A', 'IX-B', 'VIII-A'];

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [FormsModule, PageHeaderComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  private api = inject(ApiService);

  classes       = CLASSES;
  statuses: AttStatus[] = ['PRESENT', 'ABSENT', 'LATE'];
  selectedDate  = new Date().toISOString().slice(0, 10);
  selectedClass = CLASSES[0];

  records = signal<Attendance[]>([]);
  saved   = signal(false);
  error   = signal('');

  presentCount = computed(() => this.records().filter(r => r.status === 'PRESENT').length);
  absentCount  = computed(() => this.records().filter(r => r.status === 'ABSENT').length);
  lateCount    = computed(() => this.records().filter(r => r.status === 'LATE').length);

  ngOnInit() { this.load(); }

  load() {
    this.error.set('');
    this.saved.set(false);
    this.api.attendance(this.selectedDate, this.selectedClass).subscribe({
      next: data => this.records.set(data),
      error: e   => this.error.set(e.message),
    });
  }

  loadSample() {
    const sample: Attendance[] = Array.from({ length: 5 }, (_, i) => ({
      studentId: i + 1,
      className: this.selectedClass,
      attendanceDate: this.selectedDate,
      status: 'PRESENT' as AttStatus,
    }));
    this.records.set(sample);
  }

  setStatus(r: Attendance, status: AttStatus) {
    this.records.update(rs => rs.map(x => x === r ? { ...x, status } : x));
    this.saved.set(false);
  }

  save() {
    if (!this.records().length) return;
    this.api.saveAttendance(this.records()).subscribe({
      next: saved => { this.records.set(saved); this.saved.set(true); },
      error: e    => this.error.set(e.message),
    });
  }
}
