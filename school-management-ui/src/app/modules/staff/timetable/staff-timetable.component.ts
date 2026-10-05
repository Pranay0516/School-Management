import { Component } from '@angular/core';

@Component({
  selector: 'app-staff-timetable',
  standalone: true,
  template: `
    <div class="stt-timetable">
      <div class="tt-header glass-card">
        <div><h2>My Weekly Timetable</h2><p class="muted">Mrs. Priya Sharma · Mathematics · 2025-26</p></div>
        <div class="tt-stats">
          <div class="tt-stat"><b>20</b><small>Classes/Week</small></div>
          <div class="tt-stat"><b>4</b><small>Per Day</small></div>
          <div class="tt-stat"><b>5</b><small>Free Periods</small></div>
        </div>
      </div>
      <div class="tt-grid glass-card">
        <div class="tt-time-col"></div>
        @for (day of days; track day) { <div class="tt-day-head">{{ day }}</div> }
        @for (slot of timeSlots; track slot; let si = $index) {
          <div class="tt-time-label">{{ slot }}</div>
          @for (day of days; track day; let di = $index) {
            <div class="tt-cell" [class.class-cell]="!!getClass(di,si)" [class.free-cell]="!getClass(di,si)">
              @if (getClass(di,si)) { <b>{{ getClass(di,si)!.cls }}</b><small>{{ getClass(di,si)!.room }}</small> }
              @else { <span class="free-lbl">Free</span> }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .stt-timetable { display: flex; flex-direction: column; gap: 16px; }
    .tt-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; flex-wrap: wrap; gap: 16px; }
    .tt-header h2 { margin: 0 0 4px; }
    .tt-stats { display: flex; gap: 20px; }
    .tt-stat { text-align: center; }
    .tt-stat b { display: block; font-size: 22px; font-weight: 800; color: var(--primary); }
    .tt-stat small { font-size: 11px; color: var(--muted); }
    .tt-grid { display: grid; grid-template-columns: 90px repeat(5, 1fr); overflow: hidden; }
    .tt-time-col, .tt-day-head { padding: 12px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .5px; color: var(--muted); background: var(--surface-strong); border-bottom: 1px solid var(--border); text-align: center; }
    .tt-day-head { color: var(--text); }
    .tt-time-label { padding: 12px; font-size: 11px; font-weight: 700; color: var(--muted); background: var(--surface-strong); border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); display: flex; align-items: center; }
    .tt-cell { padding: 12px; border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); min-height: 60px; display: flex; flex-direction: column; justify-content: center; gap: 3px; }
    .class-cell { background: color-mix(in srgb, var(--primary) 10%, var(--surface)); color: var(--primary); }
    .class-cell b { font-size: 14px; font-weight: 800; }
    .class-cell small { font-size: 11px; opacity: .75; }
    .free-cell { background: var(--surface-strong); }
    .free-lbl { font-size: 12px; color: var(--muted); font-style: italic; }
    @media (max-width: 900px) { .tt-grid { grid-template-columns: 70px repeat(5, 1fr); } .tt-cell { min-height: 46px; padding: 8px 6px; } .class-cell b { font-size: 11px; } .class-cell small { display: none; } }
  `],
})
export class StaffTimetableComponent {
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots = ['8:00-8:45', '8:45-9:30', '9:45-10:30', '10:30-11:15', '11:30-12:15', '12:15-13:00'];
  schedule: ({ cls: string; room: string } | null)[][] = [
    [{ cls: 'IX-A', room: 'Rm 101' }, null, { cls: 'IX-B', room: 'Rm 102' }, null, { cls: 'X-A', room: 'Rm 201' }, null],
    [null, { cls: 'X-B', room: 'Rm 204' }, null, { cls: 'X-A', room: 'Rm 201' }, null, null],
    [{ cls: 'IX-A', room: 'Rm 101' }, null, { cls: 'IX-B', room: 'Rm 102' }, null, null, { cls: 'X-B', room: 'Rm 204' }],
    [null, null, { cls: 'X-B', room: 'Rm 204' }, { cls: 'X-A', room: 'Rm 201' }, null, null],
    [{ cls: 'IX-A', room: 'Rm 101' }, null, { cls: 'IX-B', room: 'Rm 102' }, null, null, { cls: 'X-A', room: 'Rm 201' }],
  ];
  getClass(di: number, si: number) { return this.schedule[di]?.[si] ?? null; }
}
