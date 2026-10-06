import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LeaveApplication } from './api.service';
import { LeaveNotificationService } from './leave-notification.service';

describe('LeaveNotificationService', () => {
  it('exposes only pending requests as notifications and the five most recent activities', async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const service = TestBed.inject(LeaveNotificationService);
    const applications: LeaveApplication[] = Array.from({ length: 7 }, (_, index) => ({
      id: index + 1,
      teacherId: index + 1,
      teacherName: `Teacher ${index + 1}`,
      teacherUsername: null,
      type: 'CASUAL',
      startDate: '2026-10-12',
      endDate: '2026-10-12',
      days: 1,
      reason: 'Personal leave',
      status: index === 0 ? 'APPROVED' : 'PENDING',
      reviewNote: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: '2026-10-06T10:00:00',
    }));
    service.applications.set(applications);

    expect(service.pendingApplications().map(application => application.id)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(service.recentApplications().map(application => application.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
