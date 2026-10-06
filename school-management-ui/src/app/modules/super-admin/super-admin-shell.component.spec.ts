import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SuperAdminShellComponent } from './super-admin-shell.component';

describe('SuperAdminShellComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminShellComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(SuperAdminShellComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
