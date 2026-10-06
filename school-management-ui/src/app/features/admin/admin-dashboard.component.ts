import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminDashboardData, ApiService } from '../../core/api.service';
import { DashboardAccessService } from '../../core/dashboard-access.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  readonly access = inject(DashboardAccessService);
  private readonly api = inject(ApiService);
  @Output() readonly openLeaveApprovals = new EventEmitter<void>();

  readonly dashboard = signal<AdminDashboardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly selectedModuleCategory = signal('All');
  readonly moduleSearch = signal('');
  readonly today = computed(() => {
    const value = this.dashboard()?.today;
    if (!value) return null;
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  });
  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  });
  readonly moduleCategories = computed(() => [
    'All',
    ...new Set((this.dashboard()?.modules ?? [])
      .map(module => module.category?.trim())
      .filter((category): category is string => Boolean(category))),
  ]);
  readonly visibleModules = computed(() => {
    const category = this.selectedModuleCategory();
    const search = this.moduleSearch().trim().toLowerCase();
    return (this.dashboard()?.modules ?? []).filter(module =>
      (category === 'All' || module.category === category)
      && (!search || module.title.toLowerCase().includes(search)),
    );
  });
  readonly maxFeeCollection = computed(() =>
    Math.max(...(this.dashboard()?.feeCollections ?? []).map(day => day.amount), 0),
  );

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.api.adminDashboard().subscribe({
      next: data => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(error instanceof Error ? error.message : 'Unable to load dashboard data.');
        this.loading.set(false);
      },
    });
  }

  collectionBarHeight(amount: number): number {
    const maximum = this.maxFeeCollection();
    return maximum === 0 ? 0 : amount / maximum * 100;
  }

  attendancePercent(present: number, absent: number): number {
    const total = present + absent;
    return total === 0 ? 0 : Math.round(present * 100 / total);
  }

  statusClass(status: string): string {
    switch (status) {
      case 'ON_TRIP': return 'online';
      case 'OFFLINE': return 'offline';
      default: return 'idle';
    }
  }

  initials(name: string): string {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
  }
}
