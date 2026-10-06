import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LeaveApprovalsComponent } from './leave-approvals.component';
import { API_BASE_URL } from '../../core/api-base';

describe('LeaveApprovalsComponent', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApprovalsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(LeaveApprovalsComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    TestBed.inject(HttpTestingController)
      .expectOne(`${API_BASE_URL}/leaves/admin`)
      .flush([]);
  });
});
