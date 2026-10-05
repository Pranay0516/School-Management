import { Injectable, signal } from '@angular/core';

export interface DashboardWidget {
  id: string;
  label: string;
  enabled: boolean;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'total-students', label: 'Total Students', enabled: true },
  { id: 'collected-month', label: 'Collected This Month', enabled: true },
  { id: 'attendance-today', label: 'Attendance Today', enabled: true },
  { id: 'active-staff', label: 'Active Staff', enabled: true },
  { id: 'pending-dues', label: 'Pending Dues', enabled: true },
  { id: 'ecosystem-hub', label: 'Ecosystem Hub', enabled: true },
  { id: 'live-activity', label: 'Live Activity', enabled: true },
  { id: 'attendance-breakdown', label: "Today's Attendance", enabled: true },
  { id: 'pending-fees', label: 'Pending Fee Dues', enabled: true },
  { id: 'timetable', label: "Today's Timetable", enabled: true },
  { id: 'upcoming-events', label: 'Upcoming Events', enabled: true },
  { id: 'transport-status', label: 'Transport Status', enabled: true },
  { id: 'fee-overview', label: 'Fee Collection Overview', enabled: true },
  { id: 'announcements', label: 'Announcements', enabled: true },
  { id: 'upcoming-exams', label: 'Upcoming Exams', enabled: true },
  { id: 'admissions', label: 'Admissions', enabled: true },
  { id: 'birthdays-library', label: "Today's Birthdays & Library", enabled: true },
  { id: 'staff-snapshot', label: 'Staff Snapshot', enabled: true },
  { id: 'setup-status', label: 'Setup Status', enabled: true },
];

const STORAGE_KEY = 'eduflow-dashboard-widget-access';

@Injectable({ providedIn: 'root' })
export class DashboardAccessService {
  private readonly widgetState = signal(this.loadWidgets());
  readonly widgets = this.widgetState.asReadonly();

  isEnabled(id: string): boolean {
    return this.widgetState().find(widget => widget.id === id)?.enabled ?? true;
  }

  toggle(id: string): void {
    this.widgetState.update(widgets => {
      const updated = widgets.map(widget => widget.id === id
        ? { ...widget, enabled: !widget.enabled }
        : widget);
      this.saveWidgets(updated);
      return updated;
    });
  }

  setAll(enabled: boolean): void {
    this.widgetState.update(widgets => {
      const updated = widgets.map(widget => ({ ...widget, enabled }));
      this.saveWidgets(updated);
      return updated;
    });
  }

  private loadWidgets(): DashboardWidget[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedWidgets = JSON.parse(saved) as DashboardWidget[];
        return DEFAULT_WIDGETS.map(widget => ({
          ...widget,
          enabled: savedWidgets.find(savedWidget => savedWidget.id === widget.id)?.enabled ?? true,
        }));
      }
    } catch {
      // Fall back to the default access configuration if browser storage is unavailable.
    }
    return DEFAULT_WIDGETS.map(widget => ({ ...widget }));
  }

  private saveWidgets(widgets: DashboardWidget[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch {
      // Keep the in-memory settings active if browser storage is unavailable.
    }
  }
}
