import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MenuManagementComponent } from './menu-management.component';

describe('MenuManagementComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [MenuManagementComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(MenuManagementComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
