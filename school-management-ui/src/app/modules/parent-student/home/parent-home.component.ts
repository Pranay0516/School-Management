import { Component, input } from '@angular/core';
import { BadgeComponent } from '../../../shared/badge.component';

@Component({
  selector: 'app-parent-home',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="ph-home">
      <div class="welcome-banner glass-card">
        <div class="welcome-avatar">{{ nameInitial() }}</div>
        <div class="welcome-info">
          <p class="eyebrow">GOOD MORNING</p>
          <h2>{{ studentName() }}</h2>
          <p class="class-info">Class {{ studentClass() }} · Roll #{{ rollNo() }}</p>
        </div>
        <ef-badge variant="success">Present Today</ef-badge>
      </div>

      <div class="content-grid">
        <div class="col-left">
          <div class="info-row">
            <div class="info-card glass-card upcoming">
              <div class="info-icon">📅</div>
              <div>
                <p class="info-label">NEXT EXAM</p>
                <b>Mathematics – Unit Test</b>
                <small>March 28, 2025 · 10:00 AM</small>
              </div>
            </div>
            <div class="info-card glass-card fee-card">
              <div class="info-icon">₹</div>
              <div>
                <p class="info-label">FEE DUE</p>
                <b>Term II Fees</b>
                <small>₹12,500 due Apr 5, 2025</small>
              </div>
            </div>
          </div>

          <div class="att-summary glass-card">
            <h3>This Month's Attendance</h3>
            <div class="att-pills">
              <div class="att-pill present"><span class="pill-num">18</span><span class="pill-lbl">Present</span></div>
              <div class="att-pill absent"><span class="pill-num">2</span><span class="pill-lbl">Absent</span></div>
              <div class="att-pill late"><span class="pill-num">1</span><span class="pill-lbl">Late</span></div>
              <div class="att-pill pct"><span class="pill-num">86%</span><span class="pill-lbl">Rate</span></div>
            </div>
          </div>

          <div class="upcoming-exams glass-card">
            <h3>Upcoming Examinations</h3>
            <table class="exam-table">
              <thead><tr><th>Subject</th><th>Date</th><th>Time</th><th>Type</th></tr></thead>
              <tbody>
                @for (e of upcomingExams; track e.subject) {
                  <tr>
                    <td><b>{{ e.subject }}</b></td>
                    <td>{{ e.date }}</td>
                    <td>{{ e.time }}</td>
                    <td><span class="exam-badge">{{ e.type }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="col-right">
          <div class="notices glass-card">
            <h3>Recent Notices</h3>
            @for (n of notices; track n.id) {
              <div class="notice-row">
                <span class="notice-dot"></span>
                <div><b>{{ n.title }}</b><small>{{ n.date }}</small></div>
              </div>
            }
          </div>
          <div class="fee-summary glass-card">
            <h3>Fee Summary</h3>
            @for (f of fees; track f.term) {
              <div class="fee-row">
                <div><b>{{ f.term }}</b><small>Due {{ f.due }}</small></div>
                <ef-badge [variant]="f.paid ? 'success' : 'warning'">{{ f.paid ? 'Paid' : 'Pending' }}</ef-badge>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ph-home { display: flex; flex-direction: column; gap: 20px; }
    .welcome-banner { display: flex; align-items: center; gap: 20px; padding: 24px 28px; flex-wrap: wrap; }
    .welcome-avatar {
      width: 60px; height: 60px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, var(--primary), var(--primary-2));
      color: #fff; font: 800 22px var(--font-display); display: grid; place-items: center;
    }
    .welcome-info { flex: 1; }
    .welcome-info h2 { font-size: 1.5rem; margin: 4px 0; }
    .class-info { font-size: 14px; color: var(--muted); margin: 0; }
    .content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
    .col-left, .col-right { display: flex; flex-direction: column; gap: 20px; }
    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .info-card { display: flex; align-items: flex-start; gap: 14px; padding: 20px; }
    .info-icon { font-size: 22px; width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center; flex-shrink: 0; }
    .upcoming .info-icon { background: #e8eeff; }
    .fee-card .info-icon { background: #fff5ec; }
    .info-label { font-size: 10px; font-weight: 800; color: var(--muted); letter-spacing: .8px; margin: 0 0 4px; }
    .info-card b { display: block; font-size: 15px; margin-bottom: 4px; }
    .info-card small { color: var(--muted); font-size: 13px; }
    .att-summary { padding: 24px; }
    .att-summary h3 { margin: 0 0 18px; }
    .att-pills { display: flex; gap: 12px; }
    .att-pill { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 10px; border-radius: 14px; }
    .att-pill.present { background: #d4f5e6; }
    .att-pill.absent  { background: #ffe5ea; }
    .att-pill.late    { background: #fff1d7; }
    .att-pill.pct     { background: #e8eeff; }
    .pill-num { font-size: 26px; font-weight: 800; color: var(--text); }
    .pill-lbl { font-size: 12px; font-weight: 700; color: var(--muted); }
    .upcoming-exams { padding: 24px; }
    .upcoming-exams h3 { margin: 0 0 16px; }
    .exam-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .exam-table th { text-align: left; font-size: 11px; font-weight: 800; color: var(--muted); letter-spacing: .6px; text-transform: uppercase; padding: 0 0 10px; border-bottom: 1px solid var(--border); }
    .exam-table td { padding: 12px 0; border-bottom: 1px solid var(--border); }
    .exam-table tr:last-child td { border-bottom: none; }
    .exam-badge { background: #e8eeff; color: #2551c7; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 99px; }
    .notices { padding: 24px; }
    .notices h3 { margin: 0 0 14px; }
    .notice-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .notice-row:last-child { border-bottom: none; }
    .notice-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 5px; flex-shrink: 0; }
    .notice-row b { display: block; font-size: 14px; }
    .notice-row small { color: var(--muted); font-size: 12px; }
    .fee-summary { padding: 24px; }
    .fee-summary h3 { margin: 0 0 14px; }
    .fee-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); }
    .fee-row:last-child { border-bottom: none; }
    .fee-row b { display: block; font-size: 14px; }
    .fee-row small { color: var(--muted); font-size: 12px; }
    @media (max-width: 1100px) { .content-grid { grid-template-columns: 1fr; } }
    @media (max-width: 680px)  { .info-row { grid-template-columns: 1fr; } .att-pills { flex-wrap: wrap; } }
  `],
})
export class ParentHomeComponent {
  studentName  = input('Aanya Mehta');
  studentClass = input('X-A');
  rollNo       = input('24');
  nameInitial() { return this.studentName().split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(); }
  notices = [
    { id: 1, title: 'Annual Sports Day – March 30, 2025', date: 'Mar 18, 2025' },
    { id: 2, title: 'Parent-Teacher Meeting – April 5',   date: 'Mar 15, 2025' },
    { id: 3, title: 'Holiday Notice: Holi – March 25',    date: 'Mar 10, 2025' },
    { id: 4, title: 'Science Exhibition – April 12',      date: 'Mar 8, 2025'  },
  ];
  upcomingExams = [
    { subject: 'Mathematics',    date: 'Mar 28', time: '10:00 AM', type: 'Unit Test' },
    { subject: 'Science',        date: 'Apr 2',  time: '9:00 AM',  type: 'Unit Test' },
    { subject: 'Social Studies', date: 'Apr 8',  time: '11:00 AM', type: 'Mid-term' },
    { subject: 'English',        date: 'Apr 14', time: '9:00 AM',  type: 'Mid-term' },
  ];
  fees = [
    { term: 'Term I Fees',   due: 'Jan 5, 2025',  paid: true  },
    { term: 'Term II Fees',  due: 'Apr 5, 2025',  paid: false },
    { term: 'Term III Fees', due: 'Jul 5, 2025',  paid: false },
  ];
}
