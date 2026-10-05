import { Component, OnInit, inject, signal, computed, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Attendance } from '../../../core/api.service';

type AttStatus = 'PRESENT' | 'ABSENT' | 'LATE';
const CLASSES = ['X-A', 'X-B', 'IX-A', 'IX-B', 'VIII-A'];

@Component({
  selector: 'app-staff-attendance',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="sa-attendance">
      <div class="att-controls glass-card">
        <h2>Mark Attendance</h2>
        <div class="control-row">
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
        <div class="att-pills">
          <span class="pill present">✓ {{ presentCount() }} Present</span>
          <span class="pill absent">✗ {{ absentCount() }} Absent</span>
          <span class="pill late">⏱ {{ lateCount() }} Late</span>
        </div>
      </div>

      <div class="student-list">
        @for (r of records(); track r.studentId) {
          <div class="student-row glass-card">
            <div class="student-info">
              <b>Student #{{ r.studentId }}</b>
              <small>{{ r.className }}</small>
            </div>
            <div class="status-toggle">
              @for (st of statuses; track st) {
                <button
                  class="toggle-btn"
                  [class]="'toggle-btn ' + st.toLowerCase() + (r.status === st ? ' active' : '')"
                  (click)="setStatus(r, st)">
                  {{ st }}
                </button>
              }
            </div>
          </div>
        }
        @empty {
          <div class="empty-att glass-card">
            <span>📅</span>
            <p>No records for this class. Load sample to begin.</p>
            <button class="load-btn" (click)="loadSample()">Load sample records</button>
          </div>
        }
      </div>

      @if (records().length) {
        <button class="save-btn" (click)="save()" [disabled]="saving()">
          {{ saving() ? 'Saving…' : 'Save Attendance' }}
        </button>
      }

      @if (saved())  { <p class="success-msg">✓ Attendance saved successfully.</p> }
      @if (error())  { <p class="error-msg">{{ error() }}</p> }
    </div>
  `,
  styles: [`
    .sa-attendance { display: flex; flex-direction: column; gap: 12px; }

    .att-controls { padding: 20px; }
    .att-controls h2 { margin: 0 0 14px; font-size: 1.1rem; }
    .control-row { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
    .field-group { display: flex; flex-direction: column; gap: 5px; }
    .field-label { font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .5px; }
    input[type="date"], select {
      padding: 9px 12px; border: 1px solid var(--border); border-radius: 10px;
      background: var(--surface-strong); color: var(--text); font: 600 13px var(--font-body);
    }

    .att-pills { display: flex; gap: 8px; flex-wrap: wrap; }
    .pill {
      padding: 5px 12px; border-radius: 99px; font-size: 12px; font-weight: 800;
    }
    .pill.present { background: #d4f5e6; color: #156843; }
    .pill.absent  { background: #ffe5ea; color: #b72040; }
    .pill.late    { background: #fff1d7; color: #9a5f08; }

    .student-list { display: flex; flex-direction: column; gap: 8px; }
    .student-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 16px; gap: 12px; flex-wrap: wrap;
    }
    .student-info b { display: block; font-size: 14px; }
    .student-info small { color: var(--muted); font-size: 12px; }

    .status-toggle { display: flex; gap: 6px; }
    .toggle-btn {
      padding: 7px 12px; border: 1px solid var(--border); border-radius: 8px;
      background: var(--surface); color: var(--muted);
      font: 700 11px var(--font-body); cursor: pointer; transition: all .15s;
    }
    .toggle-btn.present.active { background: #d4f5e6; color: #156843; border-color: #a3e9c8; }
    .toggle-btn.absent.active  { background: #ffe5ea; color: #b72040; border-color: #ffc5ce; }
    .toggle-btn.late.active    { background: #fff1d7; color: #9a5f08; border-color: #ffd999; }

    .empty-att {
      display: flex; flex-direction: column; align-items: center;
      padding: 40px 24px; gap: 10px; color: var(--muted); text-align: center;
    }
    .empty-att span { font-size: 36px; }
    .empty-att p { margin: 0; font-size: 14px; font-weight: 600; }
    .load-btn {
      border: 0; border-radius: 10px; padding: 9px 18px;
      background: var(--primary); color: #fff; font: 700 13px var(--font-body); cursor: pointer;
    }

    .save-btn {
      width: 100%; border: 0; border-radius: 12px; padding: 14px;
      background: var(--primary); color: #fff; font: 800 14px var(--font-body);
      cursor: pointer; transition: opacity .15s;
    }
    .save-btn:hover { opacity: .88; }
    .save-btn:disabled { opacity: .6; cursor: not-allowed; }

    .success-msg { color: var(--success); font-size: 13px; font-weight: 700; text-align: center; }
    .error-msg   { color: #c53d55; font-size: 13px; text-align: center; }
  `],
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
