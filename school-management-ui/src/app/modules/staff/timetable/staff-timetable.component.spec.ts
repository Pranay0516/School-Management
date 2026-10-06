import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffTimetableComponent } from './staff-timetable.component';

describe('StaffTimetableComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [StaffTimetableComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffTimetableComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
