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
  template: `
    <article class="glass-card panel">
      <ef-page-header
        eyebrow="DAILY RECORD"
        title="Attendance"
        actionLabel="Save attendance"
        (action)="save()" />

      <!-- toolbar -->
      <div class="att-toolbar">
        <div class="toolbar-left">
          <div class="field-group">
            <label class="field-label">Date</label>
            <input type="date" [(ngModel)]="selectedDate" (change)="load()" />
          </div>
          <div class="field-group">
            <label class="field-label">Class</label>
            <select [(ngModel)]="selectedClass" (change)="load()">
              @for (c of classes; track c) { <option>{{ c }}</option> }
            </select>
          </div>
        </div>
        <div class="att-summary">
          <span class="pill present">✓ {{ presentCount() }} Present</span>
          <span class="pill absent">✗ {{ absentCount() }} Absent</span>
          <span class="pill late">⏱ {{ lateCount() }} Late</span>
        </div>
      </div>

      <!-- list -->
      <div class="att-list">
        @for (r of records(); track r.id ?? r.studentId) {
          <div class="att-row">
            <div class="student-info">
              <b>Student #{{ r.studentId }}</b>
              <small>{{ r.className }}</small>
            </div>
            <div class="status-toggle">
              @for (st of statuses; track st) {
                <button
                  class="toggle-btn"
                  [class.active]="r.status === st"
                  [class]="'toggle-btn ' + st.toLowerCase() + (r.status === st ? ' active' : '')"
                  (click)="setStatus(r, st)">
                  {{ st }}
                </button>
              }
            </div>
          </div>
        }
        @empty {
          <div class="att-empty">
            <span>📅</span>
            <p>No records for this class and date. Load attendance to begin.</p>
            <button class="primary-btn" (click)="loadSample()">Load sample records</button>
          </div>
        }
      </div>

      @if (saved()) { <p class="save-msg">✓ Attendance saved successfully.</p> }
      @if (error()) { <p class="error-msg">{{ error() }}</p> }
    </article>
  `,
  styles: [`
    .panel { padding: 24px; margin-top: 8px; }

    .att-toolbar {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }
    .toolbar-left { display: flex; gap: 14px; flex-wrap: wrap; }
    .field-group { display: flex; flex-direction: column; gap: 5px; }
    .field-label { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .5px; }
    input[type="date"], select {
      padding: 9px 12px;
      border: 1px solid var(--border);
      border-radius: 10px;
      background: var(--surface-strong);
      color: var(--text);
      font: 600 13px var(--font-body);
    }

    .att-summary { display: flex; gap: 10px; flex-wrap: wrap; }
    .pill {
      padding: 6px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-weight: 800;
    }
    .pill.present { background: #d4f5e6; color: #156843; }
    .pill.absent  { background: #ffe5ea; color: #b72040; }
    .pill.late    { background: #fff1d7; color: #9a5f08; }

    .att-list { display: flex; flex-direction: column; gap: 8px; }

    .att-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: var(--surface-strong);
      gap: 12px;
    }
    .student-info b    { display: block; font-size: 14px; }
    .student-info small{ color: var(--muted); font-size: 12px; }

    .status-toggle { display: flex; gap: 6px; }
    .toggle-btn {
      padding: 7px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      font: 700 12px var(--font-body);
      cursor: pointer;
      transition: all .15s;
    }
    .toggle-btn.present.active { background: #d4f5e6; color: #156843; border-color: #a3e9c8; }
    .toggle-btn.absent.active  { background: #ffe5ea; color: #b72040; border-color: #ffc5ce; }
    .toggle-btn.late.active    { background: #fff1d7; color: #9a5f08; border-color: #ffd999; }

    .att-empty {
      display: flex; flex-direction: column; align-items: center;
      padding: 52px 24px; gap: 12px; color: var(--muted); text-align: center;
    }
    .att-empty span { font-size: 40px; }
    .att-empty p    { margin: 0; font-size: 14px; font-weight: 600; }

    .save-msg  { color: var(--success); font-size: 13px; font-weight: 700; margin-top: 12px; }
    .error-msg { color: #c53d55;        font-size: 13px; margin-top: 8px; }
  `],
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
