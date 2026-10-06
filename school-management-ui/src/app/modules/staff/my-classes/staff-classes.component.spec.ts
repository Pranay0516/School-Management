import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StaffClassesComponent } from './staff-classes.component';

describe('StaffClassesComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [StaffClassesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(StaffClassesComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
