import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GlobalUsersComponent } from './global-users.component';

describe('GlobalUsersComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalUsersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(GlobalUsersComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
