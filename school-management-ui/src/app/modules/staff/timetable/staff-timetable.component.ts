import { Component } from '@angular/core';

@Component({
  selector: 'app-staff-timetable',
  standalone: true,
  templateUrl: './staff-timetable.component.html',
  styleUrl: './staff-timetable.component.scss',
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
