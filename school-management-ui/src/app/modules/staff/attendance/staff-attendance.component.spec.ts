import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffAttendanceComponent } from './staff-attendance.component';

describe('StaffAttendanceComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAttendanceComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffAttendanceComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
