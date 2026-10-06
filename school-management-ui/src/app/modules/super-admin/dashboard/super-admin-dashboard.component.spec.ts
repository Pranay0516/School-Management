import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SuperAdminDashboardComponent } from './super-admin-dashboard.component';

describe('SuperAdminDashboardComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminDashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(SuperAdminDashboardComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
