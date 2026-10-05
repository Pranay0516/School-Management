import { Component, input, output, signal } from '@angular/core';
import { ParentHomeComponent }       from './home/parent-home.component';
import { ParentAttendanceComponent } from './attendance/parent-attendance.component';
import { ParentTimetableComponent }  from './timetable/parent-timetable.component';
import { ParentResultsComponent }    from './results/parent-results.component';
import { ParentFeesComponent }       from './fees/parent-fees.component';
import { ParentNoticesComponent }    from './notices/parent-notices.component';

type PSPage = 'Home' | 'Attendance' | 'Timetable' | 'Results' | 'Fees' | 'Notices';
const PS_NAV: { title: PSPage; icon: string }[] = [
  { title: 'Home',       icon: 'Home'       },
  { title: 'Attendance', icon: 'Attendance' },
  { title: 'Timetable',  icon: 'Timetable'  },
  { title: 'Results',    icon: 'Results'    },
  { title: 'Fees',       icon: 'Fees'       },
  { title: 'Notices',    icon: 'Notices'    },
];

@Component({
  selector: 'app-parent-student-shell',
  standalone: true,
  imports: [ParentHomeComponent, ParentAttendanceComponent, ParentTimetableComponent, ParentResultsComponent, ParentFeesComponent, ParentNoticesComponent],
  template: `
    <div class="ps-shell parent-theme">
      <aside class="ps-sidebar" [class.collapsed]="collapsed()">
        <div class="ps-brand">
          <span class="brand-icon">👨‍👧</span>
          @if (!collapsed()) { <div class="brand-text"><b>Parent &amp; Student</b><small>EduFlow</small></div> }
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
      <div class="ps-main">
        <header class="ps-topbar">
          <div class="topbar-left">
            <p class="topbar-meta">Parent &amp; Student Portal</p>
            <h1 class="topbar-title">{{ page() }}</h1>
          </div>
          <div class="ps-avatar">{{ initials() }}</div>
        </header>
        <section class="ps-content">
          @if (page() === 'Home')       { <app-parent-home [studentName]="studentName()" [studentClass]="studentClass()" /> }
          @if (page() === 'Attendance') { <app-parent-attendance /> }
          @if (page() === 'Timetable')  { <app-parent-timetable /> }
          @if (page() === 'Results')    { <app-parent-results /> }
          @if (page() === 'Fees')       { <app-parent-fees /> }
          @if (page() === 'Notices')    { <app-parent-notices /> }
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .parent-theme { --primary: #0ea87e; --primary-2: #12c994; }
    .ps-shell { min-height: 100vh; display: grid; grid-template-columns: 240px 1fr; transition: grid-template-columns .2s; }
    .ps-shell:has(.ps-sidebar.collapsed) { grid-template-columns: 68px 1fr; }
    .ps-sidebar { display: flex; flex-direction: column; padding: 18px 14px; position: sticky; top: 0; height: 100vh; overflow-y: auto; scrollbar-width: none; border-right: 1px solid var(--border); background: var(--surface); }
    .ps-brand { display: flex; align-items: center; gap: 10px; padding: 4px 0 20px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
    .brand-icon { font-size: 22px; }
    .brand-text b    { display: block; font-size: 14px; font-weight: 800; color: var(--text); }
    .brand-text small{ display: block; font-size: 11px; color: var(--muted); }
    nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item { display: flex; align-items: center; gap: 11px; border: 0; background: transparent; color: var(--muted); font: 700 13.5px var(--font-body); text-align: left; padding: 11px 12px; border-radius: 12px; cursor: pointer; transition: background .14s, color .14s; white-space: nowrap; }
    .nav-icon { font-style: normal; font-size: 17px; min-width: 22px; text-align: center; }
    .nav-item.active, .nav-item:hover { background: color-mix(in srgb, var(--primary) 11%, transparent); color: var(--primary); }
    .sidebar-bottom { margin-top: auto; padding-top: 14px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
    .collapse-btn { width: 100%; border: 1px solid var(--border); border-radius: 10px; padding: 8px; background: var(--surface-strong); color: var(--muted); font-weight: 700; cursor: pointer; font-size: 12px; transition: background .14s; }
    .collapse-btn:hover { color: var(--primary); border-color: var(--primary); }
    .ps-main { display: flex; flex-direction: column; min-height: 100vh; min-width: 0; }
    .ps-topbar { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; position: sticky; top: 0; z-index: 30; border-bottom: 1px solid var(--border); background: var(--surface); }
    .topbar-meta { margin: 0; font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: .4px; }
    .topbar-title { margin: 3px 0 0; font-size: 1.35rem; font-family: var(--font-display); }
    .ps-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--primary-2)); color: #fff; font: 700 13px var(--font-display); display: grid; place-items: center; }
    .ps-content { flex: 1; padding: 20px 28px 40px; }
    @media (max-width: 768px) { .ps-shell { grid-template-columns: 1fr !important; } .ps-sidebar { display: none; } .ps-content { padding: 14px 16px 28px; } }
  `],
})
export class ParentStudentShellComponent {
  username     = input('');
  studentName  = input('Aanya Mehta');
  studentClass = input('X-A');
  back         = output<void>();
  nav       = PS_NAV;
  page      = signal<PSPage>('Home');
  collapsed = signal(false);
  initials() { return this.studentName().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(); }
  navIcon(title: PSPage): string {
    const m: Record<string, string> = { Home: 'Home', Attendance: 'Check', Timetable: 'Cal', Results: 'Chart', Fees: 'Rs', Notices: 'Bell' };
    return m[title] ?? title[0];
  }
}
