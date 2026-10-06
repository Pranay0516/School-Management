import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ParentTimetableComponent } from './parent-timetable.component';

describe('ParentTimetableComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [ParentTimetableComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ParentTimetableComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
