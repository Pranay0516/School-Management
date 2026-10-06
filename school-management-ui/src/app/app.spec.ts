import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { API_BASE_URL } from './core/api-base';

describe('App', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne(`${API_BASE_URL}/auth/csrf`).flush({ token: 'csrf-token', headerName: 'X-XSRF-TOKEN' });
    http.expectOne(`${API_BASE_URL}/auth/me`).flush(
      { message: 'Not signed in' },
      { status: 401, statusText: 'Unauthorized' },
    );
    http.verify();
  });
});
