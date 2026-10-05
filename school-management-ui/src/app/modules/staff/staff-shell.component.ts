import { Component, input, output, signal } from '@angular/core';
import { StaffHomeComponent }       from './home/staff-home.component';
import { StaffClassesComponent }    from './my-classes/staff-classes.component';
import { StaffAttendanceComponent } from './attendance/staff-attendance.component';
import { StaffExamPapersComponent } from './exam-papers/staff-exam-papers.component';
import { StaffTimetableComponent }  from './timetable/staff-timetable.component';
import { StaffLeaveComponent }      from './leave/staff-leave.component';

type StaffPage = 'Home' | 'My Classes' | 'Attendance' | 'Exam Papers' | 'Timetable' | 'Leave';
const STAFF_NAV: { title: StaffPage }[] = [
  { title: 'Home' }, { title: 'My Classes' }, { title: 'Attendance' },
  { title: 'Exam Papers' }, { title: 'Timetable' }, { title: 'Leave' },
];

@Component({
  selector: 'app-staff-shell',
  standalone: true,
  imports: [StaffHomeComponent, StaffClassesComponent, StaffAttendanceComponent, StaffExamPapersComponent, StaffTimetableComponent, StaffLeaveComponent],
  template: `
    <div class="staff-shell staff-theme">
      <aside class="staff-sidebar" [class.collapsed]="collapsed()">
        <div class="staff-brand">
          <span class="brand-icon">👩‍🏫</span>
          @if (!collapsed()) { <div class="brand-text"><b>Staff App</b><small>EduFlow</small></div> }
        </div>
        <nav>
          @for (item of nav; track item.title) {
            <button class="nav-item" [class.active]="page() === item.title" (click)="page.set(item.title)" [title]="item.title">
              <i class="nav-icon">{{ navIcon(item.title) }}</i>
              @if (!collapsed()) { <span>{{ item.title }}</span> }
            </button>
          }
        </nav>
        <div class="sidebar-bottom">
          <button class="collapse-btn" (click)="collapsed.set(!collapsed())">{{ collapsed() ? '>>' : '<<' }}</button>
          <button class="collapse-btn" (click)="back.emit()">@if (!collapsed()) { Back to Modules } @else { Back }</button>
        </div>
      </aside>
      <div class="staff-main">
        <header class="staff-topbar">
          <div class="topbar-left">
            <p class="topbar-meta">Staff Portal · EduFlow</p>
            <h1 class="topbar-title">{{ page() }}</h1>
          </div>
          <div class="staff-avatar">{{ initials() }}</div>
        </header>
        <section class="staff-content">
          @if (page() === 'Home')        { <app-staff-home [teacherName]="teacherName()" /> }
          @if (page() === 'My Classes')  { <app-staff-classes (markAttendance)="goToAttendance($event)" /> }
          @if (page() === 'Attendance')  { <app-staff-attendance [preloadClass]="attendanceClass()" /> }
          @if (page() === 'Exam Papers') { <app-staff-exam-papers /> }
          @if (page() === 'Timetable')   { <app-staff-timetable /> }
          @if (page() === 'Leave')       { <app-staff-leave /> }
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .staff-theme { --primary: #e87c35; --primary-2: #f4a262; }
    .staff-shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; transition: grid-template-columns .2s; }
    .staff-shell:has(.staff-sidebar.collapsed) { grid-template-columns: 68px 1fr; }
    .staff-sidebar { display: flex; flex-direction: column; padding: 18px 14px; position: sticky; top: 0; height: 100vh; overflow-y: auto; scrollbar-width: none; border-right: 1px solid var(--border); background: var(--surface); }
    .staff-brand { display: flex; align-items: center; gap: 10px; padding: 4px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
    .brand-icon { font-size: 22px; }
    .brand-text b    { display: block; font-size: 14px; font-weight: 800; color: var(--text); }
    .brand-text small{ display: block; font-size: 11px; color: var(--muted); }
    nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item { display: flex; align-items: center; gap: 11px; border: 0; background: transparent; color: var(--muted); font: 700 13.5px var(--font-body); text-align: left; padding: 11px 12px; border-radius: 12px; cursor: pointer; transition: background .14s, color .14s; white-space: nowrap; }
    .nav-icon { font-style: normal; font-size: 17px; min-width: 22px; text-align: center; }
    .nav-item.active, .nav-item:hover { background: color-mix(in srgb, var(--primary) 11%, transparent); color: var(--primary); }
    .sidebar-bottom { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
    .collapse-btn { width: 100%; border: 1px solid var(--border); border-radius: 10px; padding: 8px; background: var(--surface-strong); color: var(--muted); font-weight: 700; cursor: pointer; font-size: 12px; }
    .collapse-btn:hover { color: var(--primary); border-color: var(--primary); }
    .staff-main { display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
    .staff-topbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; position: sticky; top: 0; z-index: 30; border-bottom: 1px solid var(--border); background: var(--surface); }
    .topbar-meta { margin: 0; font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .4px; }
    .topbar-title { margin: 3px 0 0; font-size: 1.35rem; font-family: var(--font-display); }
    .staff-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: #fff; font: 700 13px var(--font-display); display: grid; place-items: center; }
    .staff-content { flex: 1; padding: 20px 28px 40px; }
    @media (max-width: 768px) { .staff-shell { grid-template-columns: 1fr !important; } .staff-sidebar { display: none; } .staff-content { padding: 14px 16px 28px; } }
  `],
})
export class StaffShellComponent {
  username    = input('');
  teacherName = input('Mrs. Priya Sharma');
  back        = output<void>();
  nav             = STAFF_NAV;
  page            = signal<StaffPage>('Home');
  collapsed       = signal(false);
  attendanceClass = signal('');
  initials() { return this.teacherName().split(/[\s.]+/).filter(Boolean).slice(0, 2).map((w: string) => w[0]).join('').toUpperCase(); }
  goToAttendance(className: string) { this.attendanceClass.set(className); this.page.set('Attendance'); }
  navIcon(title: string): string {
    const m: Record<string, string> = { 'Home': 'H', 'My Classes': 'C', 'Attendance': 'A', 'Exam Papers': 'P', 'Timetable': 'T', 'Leave': 'L' };
    return m[title] ?? title[0];
  }
}
