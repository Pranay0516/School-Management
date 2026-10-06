import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Attendance } from '../../../core/api.service';

type AttStatus = 'PRESENT' | 'ABSENT' | 'LATE';
const CLASSES = ['X-A', 'X-B', 'IX-A', 'IX-B', 'VIII-A'];

@Component({
  selector: 'app-staff-attendance',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './staff-attendance.component.html',
  styleUrl: './staff-attendance.component.scss',
})
export class StaffAttendanceComponent implements OnInit {
  private api = inject(ApiService);

  preloadClass = input('');

  classes       = CLASSES;
  statuses: AttStatus[] = ['PRESENT', 'ABSENT', 'LATE'];
  selectedDate  = new Date().toISOString().slice(0, 10);
  selectedClass = CLASSES[0];

  records = signal<Attendance[]>([]);
  saving  = signal(false);
  saved   = signal(false);
  error   = signal('');

  presentCount = computed(() => this.records().filter(r => r.status === 'PRESENT').length);
  absentCount  = computed(() => this.records().filter(r => r.status === 'ABSENT').length);
  lateCount    = computed(() => this.records().filter(r => r.status === 'LATE').length);

  ngOnInit() {
    if (this.preloadClass()) {
      this.selectedClass = this.preloadClass();
    }
    this.load();
  }

  load() {
    this.error.set('');
    this.saved.set(false);
    this.api.attendance(this.selectedDate, this.selectedClass).subscribe({
      next: data => this.records.set(data),
      error: ()  => this.records.set([]),
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
    this.saving.set(true);
    this.api.saveAttendance(this.records()).subscribe({
      next: saved => { this.records.set(saved); this.saving.set(false); this.saved.set(true); },
      error: e    => { this.saving.set(false); this.error.set(e.message); },
    });
  }
}
