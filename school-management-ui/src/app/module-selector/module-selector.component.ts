import { Component, input, output } from '@angular/core';

export type ModuleId = 'super-admin' | 'school-portal' | 'parent-student' | 'staff';

interface ModuleCard {
  id: ModuleId;
  icon: string;
  name: string;
  desc: string;
  color: string;
  bg: string;
  roles: string[];
}

const MODULES: ModuleCard[] = [
  {
    id: 'super-admin',
    icon: '🏛️',
    name: 'Super Admin',
    desc: 'Manage schools, subscriptions, global users and platform announcements.',
    color: '#5c35c9',
    bg: '#f0ecff',
    roles: ['SUPER_ADMIN'],
  },
  {
    id: 'school-portal',
    icon: '🏫',
    name: 'School Portal',
    desc: 'Students, teachers, attendance, examinations, fees and menu configuration.',
    color: '#3868f4',
    bg: '#edf2ff',
    roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'],
  },
  {
    id: 'parent-student',
    icon: '👨‍👧',
    name: 'Parent & Student',
    desc: 'Attendance calendar, timetable, results, fees and school notices.',
    color: '#0ea87e',
    bg: '#e8faf5',
    roles: ['SUPER_ADMIN', 'ADMIN', 'STUDENT', 'PARENT'],
  },
  {
    id: 'staff',
    icon: '👩‍🏫',
    name: 'Staff App',
    desc: 'Mark attendance, manage exam papers, view timetable and apply for leave.',
    color: '#e87c35',
    bg: '#fff5ec',
    roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER'],
  },
];

@Component({
  selector: 'app-module-selector',
  standalone: true,
  template: `
    <div class="selector-wrap">
      <div class="selector-hero">
        <p class="eyebrow">EDUFLOW PLATFORM</p>
        <h1>Choose your workspace</h1>
        <p class="sub">Select the module that matches your role to get started.</p>
      </div>

      <div class="module-grid">
        @for (m of visibleModules(); track m.id) {
          <article
            class="module-card glass-card"
            [style.--accent]="m.color"
            [style.--accent-bg]="m.bg">
            <div class="card-icon">{{ m.icon }}</div>
            <div class="card-body">
              <h2>{{ m.name }}</h2>
              <p>{{ m.desc }}</p>
            </div>
            <button class="enter-btn" (click)="select.emit(m.id)">
              Enter <span>→</span>
            </button>
          </article>
        }
      </div>
    </div>
  `,
  styles: [`
    .selector-wrap {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: clamp(32px, 6vw, 80px) 24px;
      gap: 40px;
    }

    .selector-hero {
      text-align: center;
    }
    .selector-hero h1 {
      font-size: clamp(28px, 4vw, 44px);
      margin: 10px 0 8px;
    }
    .sub {
      color: var(--muted);
      font-size: 15px;
      margin: 0;
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      width: 100%;
      max-width: 1080px;
    }

    .module-card {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 28px;
      border-radius: 20px;
      border-top: 4px solid var(--accent);
      transition: transform .18s, box-shadow .18s;
      cursor: default;
    }
    .module-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px color-mix(in srgb, var(--accent) 20%, transparent);
    }

    .card-icon {
      font-size: 40px;
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: var(--accent-bg);
      display: grid;
      place-items: center;
    }

    .card-body h2 {
      font-size: 1.15rem;
      margin: 0 0 6px;
      color: var(--text);
    }
    .card-body p {
      font-size: 13px;
      color: var(--muted);
      line-height: 1.6;
      margin: 0;
    }

    .enter-btn {
      margin-top: auto;
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border: 0;
      border-radius: 10px;
      padding: 10px 18px;
      background: var(--accent);
      color: #fff;
      font: 800 13px var(--font-body);
      cursor: pointer;
      transition: opacity .15s, transform .15s;
    }
    .enter-btn:hover { opacity: .88; transform: translateX(2px); }

    @media (max-width: 600px) {
      .module-grid { grid-template-columns: 1fr; }
    }
  `],
})
export class ModuleSelectorComponent {
  role   = input('ADMIN');
  select = output<ModuleId>();

  visibleModules() {
    return MODULES.filter(m => m.roles.includes(this.role()));
  }
}
