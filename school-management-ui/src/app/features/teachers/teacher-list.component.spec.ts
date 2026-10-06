import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TeacherListComponent } from './teacher-list.component';
import { API_BASE_URL } from '../../core/api-base';

describe('TeacherListComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TeacherListComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${API_BASE_URL}/teachers`).flush([]);
    http.expectOne(`${API_BASE_URL}/teachers/accounts`).flush([]);
    http.verify();
  });
});
