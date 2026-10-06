import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffShellComponent } from './staff-shell.component';

describe('StaffShellComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [StaffShellComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffShellComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
