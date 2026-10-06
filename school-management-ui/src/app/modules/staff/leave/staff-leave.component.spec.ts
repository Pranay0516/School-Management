import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffLeaveComponent } from './staff-leave.component';

describe('StaffLeaveComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [StaffLeaveComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffLeaveComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
