import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Subscription, timer } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { ApiService, LeaveApplication } from './api.service';

@Injectable({ providedIn: 'root' })
export class LeaveNotificationService {
  private readonly api = inject(ApiService);
  private polling?: Subscription;

  readonly applications = signal<LeaveApplication[]>([]);
  readonly error = signal('');
  readonly pendingApplications = computed(() =>
    this.applications().filter(application => application.status === 'PENDING'),
  );
  readonly recentApplications = computed(() => this.applications().slice(0, 5));

  start() {
    if (this.polling && !this.polling.closed) return;

    this.polling = timer(0, 30_000)
      .pipe(
        switchMap(() =>
          this.api.leaveApplicationsForAdmin().pipe(
            tap(applications => {
              this.applications.set(applications);
              this.error.set('');
            }),
            catchError(error => {
              this.error.set(error instanceof Error ? error.message : 'Unable to load leave requests.');
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe();
  }

  stop() {
    this.polling?.unsubscribe();
    this.polling = undefined;
    this.applications.set([]);
    this.error.set('');
  }
}
