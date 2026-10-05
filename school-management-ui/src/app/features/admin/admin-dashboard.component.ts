import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DashboardAccessService } from '../../core/dashboard-access.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <div class="welcome-row">
        <div>
          <h2>Good Afternoon, school 👋</h2>
          <p>Here's what's happening at Yug International School today — Monday, 05 October 2026</p>
        </div>
        <div class="update-strip"><b>⚑ &nbsp;UPDATES</b><span>Oct 01</span><span>🔴 holiday (Oct 01)</span><span>🔴 Tomorrow is TUE</span></div>
      </div>
      <div class="stats-row">
        @if (access.isEnabled('total-students')) { <article class="stat-card widget"><span class="stat-icon blue">♟</span><strong>{{ studentCount() }}</strong><small>Total Students</small></article> }
        @else { <article class="stat-card widget is-disabled"><span class="stat-icon blue">♟</span><strong>{{ studentCount() }}</strong><small>Total Students</small><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('collected-month')) { <article class="stat-card widget"><span class="stat-icon green">▣</span><strong>₹28,02,014</strong><small>Collected This Month <em>↑ 615%</em></small></article> }
        @else { <article class="stat-card widget is-disabled"><span class="stat-icon green">▣</span><strong>₹28,02,014</strong><small>Collected This Month</small><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('attendance-today')) { <article class="stat-card widget"><span class="stat-icon purple">✓</span><strong>1%</strong><small>Attendance Today</small></article> }
        @else { <article class="stat-card widget is-disabled"><span class="stat-icon purple">✓</span><strong>1%</strong><small>Attendance Today</small><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('active-staff')) { <article class="stat-card widget"><span class="stat-icon violet">▣</span><strong>{{ teacherCount() }}</strong><small>Active Staff</small></article> }
        @else { <article class="stat-card widget is-disabled"><span class="stat-icon violet">▣</span><strong>{{ teacherCount() }}</strong><small>Active Staff</small><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('pending-dues')) { <article class="stat-card widget"><span class="stat-icon red">!</span><strong>₹42,01,010</strong><small>Pending Dues (All Years)</small></article> }
        @else { <article class="stat-card widget is-disabled"><span class="stat-icon red">!</span><strong>₹42,01,010</strong><small>Pending Dues (All Years)</small><span class="locked">Disabled by Super Admin</span></article> }
      </div>
      <div class="dashboard-grid">
        @if (access.isEnabled('ecosystem-hub')) {
          <article class="widget card ecosystem wide-two"><header><div><h3>▦ Ecosystem Hub</h3><small><b>238</b> modules — everything your school runs, in one place</small></div><input aria-label="Search modules" placeholder="⌕  Search modules..." /></header><div class="tabs"><span class="selected">All</span><span>Finance</span><span>Academics</span><span>Students</span><span>Operations</span><span>Engagement</span><span>Admin</span></div><div class="module-links">@for (module of modules; track module.name) { <div><i [class]="module.color">{{ module.icon }}</i><b>{{ module.name }}</b></div> }</div></article>
        } @else { <article class="widget card ecosystem wide-two is-disabled"><header><div><h3>▦ Ecosystem Hub</h3><small>School modules and shortcuts</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('live-activity')) {
          <article class="widget card"><header><div><h3>Live Activity</h3><small>Real-time updates</small></div><span class="pill">All &nbsp; Fees</span></header><div class="activity-list">@for (activity of activities; track activity.name) { <div class="activity"><i>✓</i><span><b>{{ activity.name }}</b><small>{{ activity.when }} &nbsp; <em>Paid</em></small></span><small class="time">Today<br>12:00 AM</small></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Live Activity</h3><small>Real-time updates</small></div></header><span class="locked">Disabled by Super Admin</span></article> }

        @if (access.isEnabled('attendance-breakdown')) {
          <article class="widget card"><header><div><h3>Today's Attendance</h3><small>Students — 05 Oct</small></div></header><div class="attendance-summary"><div class="donut"><b>1%</b><small>Present</small></div><div class="attendance-numbers"><p>🟣 Present <b>3</b></p><p>🔴 Absent <b>221</b></p><p>🔵 Enrolled <b>224</b></p></div></div><h4>CLASS-WISE BREAKDOWN</h4><div class="class-list">@for (row of classAttendance; track row.name) { <div><b>{{ row.name }}</b><span>🟢 0%</span><span>🔴 {{ row.absent }}</span></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Today's Attendance</h3><small>Students — 05 Oct</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('pending-fees')) {
          <article class="widget card"><header><div><h3>Pending Fee Dues</h3><small>Top due students</small></div></header><div class="due-list">@for (student of dueStudents; track student.name) { <div class="due-row"><i [class]="student.color">{{ student.initials }}</i><span><b>{{ student.name }}</b><small>{{ student.className }}</small></span><strong>₹24,000</strong><em>Overdue</em></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Pending Fee Dues</h3><small>Top due students</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('timetable')) {
          <article class="widget card"><header><div><h3>Today's Timetable</h3><small>Nursery A</small></div></header><div class="timetable">@for (period of timetable; track period.time) { <div><b>{{ period.time }}</b><span><strong>{{ period.subject }}</strong><small>{{ period.teacher }}</small></span></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Today's Timetable</h3><small>Nursery A</small></div></header><span class="locked">Disabled by Super Admin</span></article> }

        @if (access.isEnabled('upcoming-events')) {
          <article class="widget card"><header><div><h3>Upcoming Events</h3><small>This week</small></div></header><div class="empty">No upcoming events.</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Upcoming Events</h3><small>This week</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('transport-status')) {
          <article class="widget card"><header><div><h3>🚌 Transport Status</h3><small>Fleet overview</small></div></header><div class="transport-list">@for (bus of buses; track bus.number) { <div class="bus"><i [class]="bus.color">▣</i><span><b>{{ bus.number }}</b><small>{{ bus.route }}</small></span><em [class]="bus.stateClass">● {{ bus.state }}</em></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>🚌 Transport Status</h3><small>Fleet overview</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('fee-overview')) {
          <article class="widget card"><header><div><h3>Fee Collection Overview</h3><small>Daily collections — last 15 days</small></div></header><div class="fee-chart"><div class="chart-bars">@for (bar of feeBars; track $index) { <i [style.height.%]="bar"></i> }</div><div class="chart-labels"><span>Sep 20</span><span>Sep 25</span><span>Sep 30</span><span>Oct 02</span></div></div><small class="legend">🟣 Collected (₹)</small></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>Fee Collection Overview</h3><small>Daily collections — last 15 days</small></div></header><span class="locked">Disabled by Super Admin</span></article> }

        @if (access.isEnabled('announcements')) {
          <article class="widget card"><header><div><h3>📢 Announcements</h3><small>Latest notices</small></div></header><div class="notice-list">@for (notice of announcements; track notice.title) { <div><b>{{ notice.title }}</b><small>{{ notice.body }}</small><small>◷ &nbsp;4 days ago</small></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>📢 Announcements</h3><small>Latest notices</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('upcoming-exams')) {
          <article class="widget card"><header><div><h3>▣ Upcoming Exams</h3><small>Next scheduled papers</small></div></header><div class="empty">No upcoming exams.</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>▣ Upcoming Exams</h3><small>Next scheduled papers</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('admissions')) {
          <article class="widget card"><header><div><h3>♟ Admissions</h3><small>Enquiry summary</small></div></header><div class="admission-grid"><div><b>0</b><small>Admitted</small></div><div><b>5</b><small>Pending</small></div><div><b>0</b><small>Interested</small></div><div><b>0</b><small>Rejected</small></div></div><div class="capacity"><span>Seat Capacity</span><b>2%</b><i><b></b></i></div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>♟ Admissions</h3><small>Enquiry summary</small></div></header><span class="locked">Disabled by Super Admin</span></article> }

        @if (access.isEnabled('birthdays-library')) {
          <article class="widget card"><header><div><h3>🎂 Today's Birthdays</h3><small>Students & Staff</small></div></header><div class="birthday-list">@for (person of birthdays; track person.name) { <div><i>{{ person.icon }}</i><span><b>{{ person.name }}</b><small>{{ person.detail }}</small></span><strong>10 Oct</strong></div> }</div><h4>▤ Library Today</h4><div class="library-stats"><span><b>0</b><small>Issued</small></span><span><b>0</b><small>Returned</small></span><span><b>2</b><small>Overdue</small></span></div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>🎂 Today's Birthdays & Library</h3><small>Students, staff and books</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('staff-snapshot')) {
          <article class="widget card"><header><div><h3>♟ Staff Snapshot</h3><small>Attendance today</small></div></header><div class="staff-totals"><span><b>{{ teacherCount() }}</b><small>Total Staff</small></span><span><b>0</b><small>Present</small></span><span><b>8</b><small>Away</small></span></div><div class="progress"><i></i></div><div class="staff-list">@for (member of staff; track member.name) { <div><i [class]="member.color">{{ member.initials }}</i><span><b>{{ member.name }}</b><small>{{ member.title }}</small></span><em>Not marked</em></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>♟ Staff Snapshot</h3><small>Attendance today</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
        @if (access.isEnabled('setup-status')) {
          <article class="widget card"><header><div><h3>☑ Setup Status</h3><small>School configuration</small></div></header><div class="setup-list">@for (step of setupSteps; track step) { <div><i>✓</i><b>{{ step }}</b><em>Done</em></div> }</div></article>
        } @else { <article class="widget card is-disabled"><header><div><h3>☑ Setup Status</h3><small>School configuration</small></div></header><span class="locked">Disabled by Super Admin</span></article> }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .dashboard { display: grid; gap: 18px; color: #30271f; }
    .welcome-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
    .welcome-row h2 { margin: 0 0 4px; font-size: 22px; }
    .welcome-row p { margin: 0; color: #948779; font-size: 13px; }
    .update-strip { display: flex; align-items: center; gap: 14px; padding: 12px 15px; background: white; border: 1px solid #eee5dd; border-radius: 28px; color: #8c8074; font-size: 11px; white-space: nowrap; }
    .update-strip b { color: #5844e8; }
    .stats-row { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
    .stat-card, .card { background: #fff; border: 1px solid #eee5dd; border-radius: 13px; }
    .stat-card { min-height: 100px; padding: 13px; display: grid; align-content: center; justify-items: start; gap: 3px; position: relative; overflow: hidden; }
    .stat-card strong { font-size: 19px; margin-top: 3px; }
    .stat-card small { color: #978a7e; font-size: 10px; }
    .stat-card small em { color: #12a353; background: #eaf8ef; border-radius: 20px; padding: 3px 6px; font-style: normal; }
    .stat-icon { display: grid; place-items: center; width: 29px; height: 29px; border-radius: 9px; color: white; font-weight: 900; }
    .blue { background: #20a9df; } .green { background: #18b566; } .purple { background: #5651f3; } .violet { background: #9151ef; } .red { background: #f04468; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; align-items: stretch; }
    .card { min-width: 0; min-height: 250px; overflow: hidden; position: relative; }
    .wide-two { grid-column: span 2; }
    .card header { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 59px; padding: 12px 16px; border-bottom: 1px solid #f1eae4; }
    h3 { margin: 0 0 3px; font-size: 14px; }
    .card header small { color: #a29386; font-size: 11px; }
    .ecosystem header { align-items: flex-start; }
    .ecosystem header b { color: #5446e8; }
    .ecosystem input { width: 180px; max-width: 45%; border: 1px solid #eee5dd; border-radius: 8px; padding: 8px; font: inherit; font-size: 11px; }
    .tabs { display: flex; gap: 5px; justify-content: center; padding: 9px; background: #f6f4f8; color: #988d84; font-size: 10px; }
    .tabs span { padding: 6px 9px; white-space: nowrap; } .tabs .selected { background: white; border-radius: 7px; color: #5947ed; }
    .module-links { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; padding: 12px; }
    .module-links > div { display: grid; justify-items: center; gap: 5px; padding: 10px 3px; border: 1px solid #f1eae4; border-radius: 9px; font-size: 10px; }
    .module-links i { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; color: white; font-style: normal; background: #1ca9de; }
    .module-links i.green { background: #18b566; } .module-links i.orange { background: #ed8b08; } .module-links i.purple { background: #7151ed; }
    .pill { padding: 7px 10px; border-radius: 20px; color: #6255ea; background: #f0edff; font-size: 10px; }
    .activity-list, .due-list, .transport-list, .notice-list, .staff-list, .setup-list, .birthday-list { padding: 5px 14px; }
    .activity, .due-row, .bus, .birthday-list > div, .staff-list > div, .setup-list > div { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f5f0ec; }
    .activity:last-child, .due-row:last-child, .bus:last-child, .birthday-list > div:last-child, .staff-list > div:last-child, .setup-list > div:last-child { border-bottom: 0; }
    .activity > i { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 10px; background: #1bb466; color: white; font-style: normal; }
    .activity span, .due-row span, .bus span, .birthday-list span, .staff-list span { flex: 1; min-width: 0; display: grid; gap: 3px; }
    .activity b, .due-row b, .bus b, .birthday-list b, .staff-list b { font-size: 12px; }
    .activity small, .due-row small, .bus small, .birthday-list small, .staff-list small { color: #9b8d81; font-size: 10px; }
    .activity em { color: #12964c; font-style: normal; background: #eaf8ef; padding: 2px 5px; }
    .activity .time { text-align: right; white-space: nowrap; }
    .attendance-summary { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 20px 8px 14px; }
    .donut { display: grid; place-content: center; text-align: center; width: 104px; height: 104px; border: 8px solid #f5eee7; border-top-color: #5e4bed; border-radius: 50%; }
    .donut b { font-size: 20px; } .donut small { color: #a39487; font-size: 10px; }
    .attendance-numbers p { display: flex; justify-content: space-between; gap: 16px; font-size: 11px; color: #786b60; }
    h4 { margin: 14px 16px 8px; color: #a59588; font-size: 11px; letter-spacing: .3px; }
    .class-list { padding: 0 16px 10px; }
    .class-list div { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px dashed #eee5dd; font-size: 11px; }
    .class-list b { flex: 1; color: #75685d; } .class-list span { white-space: nowrap; }
    .due-row { gap: 8px; padding: 8px 0; }
    .due-row i, .birthday-list i, .staff-list i, .bus i { width: 29px; height: 29px; border-radius: 8px; display: grid; place-items: center; color: white; font-style: normal; font-weight: 800; font-size: 10px; }
    .pink { background: #df287d; } .amber { background: #ef8b00; } .teal { background: #0cb5a3; } .blue-bg { background: #1ba7dc; } .violet-bg { background: #8453ee; }
    .due-row strong { font-size: 12px; white-space: nowrap; } .due-row em { color: #f13b35; background: #fff0ef; padding: 4px 8px; border-radius: 20px; font-size: 9px; font-style: normal; }
    .timetable { padding: 14px 22px; } .timetable > div { display: flex; align-items: center; gap: 25px; min-height: 56px; }
    .timetable > div > b { color: #a39487; font-size: 11px; } .timetable span { display: grid; gap: 3px; }
    .timetable strong { color: #208fd3; font-size: 13px; } .timetable small { color: #98897d; font-size: 10px; }
    .empty { height: 180px; display: grid; place-items: center; color: #a19285; font-size: 12px; }
    .bus { border: 1px solid #f0e7df; border-radius: 9px; margin: 7px 0; padding: 9px; }
    .bus em { font-style: normal; font-size: 10px; white-space: nowrap; background: #eaf8ef; color: #13a153; border-radius: 20px; padding: 5px 7px; }
    .bus .idle { color: #6255e8; background: #f0edff; } .bus .offline { color: #8d8790; background: #f1eff3; }
    .fee-chart { padding: 12px 18px 0; } .chart-bars { height: 125px; display: flex; justify-content: flex-end; align-items: flex-end; gap: 10px; border-bottom: 1px solid #eee5dd; }
    .chart-bars i { width: 12px; border-radius: 4px 4px 0 0; background: #5950eb; } .chart-labels { display: flex; justify-content: space-between; color: #a39487; font-size: 9px; padding-top: 7px; }
    .legend { display: block; padding: 22px 18px; color: #8c8074; font-size: 10px; }
    .notice-list > div { display: grid; gap: 4px; padding: 11px; margin: 8px 0; border: 1px solid #f0e7df; border-radius: 9px; }
    .notice-list b { font-size: 12px; } .notice-list small { color: #9b8d81; font-size: 10px; }
    .admission-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 16px; }
    .admission-grid div, .library-stats span, .staff-totals span { display: grid; place-items: center; gap: 4px; border-radius: 9px; padding: 13px; background: #eef8f1; }
    .admission-grid div:nth-child(2) { background: #f0edff; } .admission-grid div:nth-child(3) { background: #edf7fb; } .admission-grid div:nth-child(4) { background: #fff1ef; }
    .admission-grid b { font-size: 22px; color: #19a45a; } .admission-grid div:nth-child(2) b { color: #5148e9; } .admission-grid small, .library-stats small, .staff-totals small { color: #9a8c80; font-size: 10px; }
    .capacity { display: flex; align-items: center; gap: 8px; margin: 0 16px 14px; padding: 10px; border: 1px solid #eee5dd; border-radius: 8px; font-size: 10px; }
    .capacity span { flex: 1; } .capacity b { color: #5d51ed; } .capacity i { position: absolute; height: 4px; width: 80%; left: 16px; bottom: 10px; background: #eeeaf4; }
    .capacity i b { display: block; width: 2%; height: 100%; background: #5c50ee; }
    .birthday-list > div { border: 1px solid #f0e7df; border-radius: 9px; margin: 7px 0; padding: 8px; }
    .birthday-list i { border-radius: 50%; background: #e93283; font-size: 13px; }
    .birthday-list strong { color: #5146e8; font-size: 10px; white-space: nowrap; }
    .library-stats, .staff-totals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; padding: 0 14px 12px; }
    .library-stats span { padding: 9px; } .library-stats span:nth-child(2) { background: #edf7fb; } .library-stats span:nth-child(3) { background: #fff0ef; }
    .library-stats b, .staff-totals b { color: #18a45a; font-size: 17px; }
    .staff-totals { padding-top: 13px; } .staff-totals span { padding: 9px; background: #f1f0f6; } .staff-totals span:nth-child(2) { background: #eef8f1; } .staff-totals span:nth-child(3) { background: #fff3ee; }
    .staff-totals span:nth-child(3) b { color: #ee6e37; } .progress { margin: 0 14px 8px; height: 5px; background: #f1eff4; border-radius: 5px; }
    .staff-list > div { padding: 7px 0; } .staff-list i { background: #1aa9df; } .staff-list i.purple { background: #8651ef; } .staff-list i.teal { background: #10a994; }
    .staff-list em { background: #f1eff4; color: #a19589; padding: 5px 8px; border-radius: 15px; font-size: 9px; font-style: normal; }
    .setup-list > div { padding: 9px 0; } .setup-list i { display: grid; place-items: center; width: 23px; height: 23px; border-radius: 7px; color: white; background: #18b566; font-style: normal; }
    .setup-list b { flex: 1; font-size: 11px; } .setup-list em { color: #1ba65b; background: #edf8f0; border-radius: 15px; padding: 4px 9px; font-size: 9px; font-style: normal; }
    .is-disabled { background: #f8f7f7; } .is-disabled > :not(.locked) { opacity: .38; }
    .locked { display: block; position: absolute; right: 10px; top: 8px; z-index: 2; border-radius: 20px; padding: 5px 8px; color: #746e77; background: #f0edf2; font-size: 9px; font-weight: 800; }
    .stat-card .locked { top: auto; bottom: 7px; }
    @media (max-width: 1100px) { .dashboard-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .stats-row { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 700px) { .dashboard-grid { grid-template-columns: 1fr; } .wide-two { grid-column: auto; } .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); } .update-strip { overflow-x: auto; max-width: 100%; } }
  `],
})
export class AdminDashboardComponent implements OnInit {
  readonly access = inject(DashboardAccessService);
  private api = inject(ApiService);

  studentCount = signal('–');
  teacherCount = signal('–');
  pendingFees  = signal('–');

  modules = [
    { name: 'Students', icon: '♟', color: 'blue' }, { name: 'Fees', icon: '₹', color: 'green' },
    { name: 'Exams', icon: '▤', color: 'orange' }, { name: 'Transport', icon: '◎', color: 'blue' },
    { name: 'Notices', icon: '▣', color: 'orange' },
  ];
  activities = [
    { name: 'Ishaan Patel paid ₹5,000 fee', when: '12h ago' },
    { name: 'Chhavi Desai paid ₹5,000 fee', when: '1d ago' },
    { name: 'Ali Bose paid ₹4,000 fee', when: '1d ago' },
  ];
  classAttendance = [{ name: 'Nursery', absent: 37 }, { name: 'Class I', absent: 24 }, { name: 'Class II', absent: 22 }, { name: 'Class V', absent: 21 }, { name: 'Class III', absent: 20 }];
  dueStudents = [
    { name: 'Ali Bansal', className: 'Class VIA', initials: 'AB', color: 'pink' },
    { name: 'Eva Jain', className: 'Class VIA', initials: 'EJ', color: 'amber' },
    { name: 'Omar Chouhan', className: 'Class VIA', initials: 'OC', color: 'teal' },
    { name: 'Fatima Tiwari', className: 'Class V', initials: 'FT', color: 'violet-bg' },
    { name: 'Daksh Tiwari', className: 'Nursery A', initials: 'DT', color: 'blue-bg' },
    { name: 'Dev Rajput', className: 'Nursery A', initials: 'DR', color: 'pink' },
    { name: 'Nandini Garg', className: 'Class X A', initials: 'NG', color: 'amber' },
  ];
  timetable = [
    { time: '10:00', subject: 'English', teacher: 'Amit Sharma' }, { time: '11:00', subject: 'English', teacher: 'Amit Sharma' },
    { time: '13:00', subject: 'English', teacher: 'Amit Sharma' }, { time: '14:00', subject: 'English', teacher: 'Amit Sharma' },
  ];
  buses = [
    { number: 'CG04HD7250', route: 'Raipur — 2 students', state: 'On Trip', stateClass: 'online', color: 'green' },
    { number: 'CG04AB1234', route: 'Route A — Shankar Nagar · AJ — 7 students', state: 'Idle', stateClass: 'idle', color: 'amber' },
    { number: 'CG04CD5678', route: 'Suresh Yadav', state: 'Idle', stateClass: 'idle', color: 'blue-bg' },
    { number: 'CG04EF9012', route: 'Route C — Devendra Nagar — 4 students', state: 'Offline', stateClass: 'offline', color: 'pink' },
  ];
  feeBars = [7, 8, 8, 9, 10, 12, 11, 14, 16, 13, 17, 15, 24, 18, 100];
  announcements = [
    { title: 'hlo', body: 'Xnhc' }, { title: 'holiday', body: 'Enjoy your day' },
    { title: 'Tomorrow is TUESDAY....', body: 'Tomorrow is TUESDAY...Tomorrow is TUESDAY...Tomorrow is TUESDAY...' },
  ];
  birthdays = [
    { name: 'Reyansh Bose', detail: 'Nursery B — Turns 5', icon: '🎂' }, { name: 'Ali Bose', detail: 'Class V A — Turns 11', icon: '🎂' },
    { name: 'Dhruv Bose', detail: 'Class VII — Turns 14', icon: '🎂' }, { name: 'Reyansh Bose', detail: 'Class X A — Turns 16', icon: '🎂' },
  ];
  staff = [
    { name: 'Amit Sharma', title: 'Senior Teacher', initials: 'AS', color: 'blue' }, { name: 'Rajesh Kumar', title: 'Staff', initials: 'RK', color: 'purple' },
    { name: 'Vikram Singh', title: 'Staff', initials: 'VS', color: 'teal' }, { name: 'Sneha Desai', title: 'Staff', initials: 'SD', color: 'amber' },
    { name: 'Accountant1', title: 'HOD', initials: 'A', color: 'pink' },
  ];
  setupSteps = ['Academic Session', 'Classes & Sections', 'Subjects', 'Fees Assigned'];

  ngOnInit() {
    forkJoin({
      students: this.api.studentStats(),
      teachers: this.api.teacherStats(),
      fees:     this.api.feeStats(),
    }).subscribe({
      next: ({ students, teachers, fees }) => {
        this.studentCount.set(students.totalActive.toLocaleString());
        this.teacherCount.set(teachers.totalActive.toLocaleString());
        this.pendingFees.set(String(fees.pendingCount));
      },
      error: () => {
        // keep placeholders if API is down
        this.studentCount.set('1,248');
        this.teacherCount.set('64');
        this.pendingFees.set('12');
      },
    });
  }
}
