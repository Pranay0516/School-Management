import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardAccessComponent } from './dashboard-access.component';

describe('DashboardAccessComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAccessComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(DashboardAccessComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
