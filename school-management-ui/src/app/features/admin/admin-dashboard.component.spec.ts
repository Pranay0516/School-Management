import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AdminDashboardData, ApiService } from '../../core/api.service';
import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  const dashboardData: AdminDashboardData = {
    today: '2026-10-06',
    academicYear: '2026-27',
    schoolName: 'Demo Academy',
    seatCapacity: 250,
    totalStudents: 17,
    collectedThisMonth: 22000,
    collectionGrowthPercent: 12,
    attendancePercent: 75,
    attendancePresent: 6,
    attendanceAbsent: 2,
    enrolledStudents: 8,
    activeStaff: 3,
    staffPresent: 2,
    staffAway: 1,
    pendingDuesAmount: 5400,
    pendingDuesCount: 2,
    pendingAdmissions: 1,
    admittedEnquiries: 1,
    interestedAdmissions: 1,
    rejectedAdmissions: 0,
    occupiedSeatsPercent: 7,
    libraryIssuedToday: 1,
    libraryReturnedToday: 1,
    libraryOverdue: 0,
    modules: [{ id: 1, title: 'Students', icon: '♟', category: 'Students', route: '/students' }],
    activities: [{ sourceId: 1, type: 'FEE', title: 'Demo learner paid a fee', detail: 'Tuition', amount: 2000, occurredAt: '2026-10-06T10:00:00' }],
    classAttendance: [{ className: 'Class V A', present: 6, absent: 2 }],
    dueStudents: [{ feeId: 1, studentId: 1, name: 'Demo learner', className: 'Class V A', amount: 5400, dueDate: '2026-10-01' }],
    timetable: [{ id: 1, period: 1, startTime: '09:00:00', className: 'Class V A', subject: 'Mathematics', teacherName: 'Demo teacher' }],
    events: [{ title: 'Open day', description: 'Welcome', eventDate: '2026-10-07' }],
    buses: [{ vehicleNumber: 'DEMO-01', route: 'North route', driverName: 'Demo driver', studentCount: 10, status: 'IDLE' }],
    feeCollections: [{ date: '2026-10-06', amount: 22000 }],
    announcements: [{ title: 'Welcome', body: 'Demo notice', publishedAt: '2026-10-06T10:00:00' }],
    exams: [{ name: 'Mid-term', className: 'Class V', startDate: '2026-10-14', status: 'SCHEDULED' }],
    birthdays: [{ personId: 1, name: 'Demo learner', detail: 'Class V A', age: 11, role: 'Student' }],
    staff: [{ teacherId: 1, name: 'Demo teacher', title: 'Mathematics', status: 'Present' }],
    setupSteps: [{ key: 'academic-session', label: 'Academic Session', complete: true }],
  };

  it('renders values and lists returned by the dashboard API', async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [{ provide: ApiService, useValue: { adminDashboard: () => of(dashboardData) } }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminDashboardComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Demo Academy');
    expect(text).toContain('17');
    expect(text).toContain('Demo learner paid a fee');
    expect(text).toContain('₹2,000');
    expect(text).toContain('Open day');
    expect(text).toContain('DEMO-01');
    expect(text).toContain('Turns 11');
  });
});
