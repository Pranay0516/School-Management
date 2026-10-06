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
    roles: ['ADMIN'],
  },
  {
    id: 'parent-student',
    icon: '👨‍👧',
    name: 'Parent & Student',
    desc: 'Attendance calendar, timetable, results, fees and school notices.',
    color: '#0ea87e',
    bg: '#e8faf5',
    roles: ['STUDENT', 'PARENT'],
  },
  {
    id: 'staff',
    icon: '👩‍🏫',
    name: 'Staff App',
    desc: 'Mark attendance, manage exam papers, view timetable and apply for leave.',
    color: '#e87c35',
    bg: '#fff5ec',
    roles: ['TEACHER'],
  },
];

@Component({
  selector: 'app-module-selector',
  standalone: true,
  templateUrl: './module-selector.component.html',
  styleUrl: './module-selector.component.scss',
})
export class ModuleSelectorComponent {
  role   = input('ADMIN');
  select = output<ModuleId>();

  visibleModules() {
    return MODULES.filter(m => m.roles.includes(this.role()));
  }
}
