import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SchoolMembersComponent } from './school-members.component';

describe('SchoolMembersComponent', () => {
  it('creates a school-scoped teacher account and displays its assigned ID', async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolMembersComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(SchoolMembersComponent);
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('http://localhost:8080/api/v1/admin/members').flush([]);

    const component = fixture.componentInstance;
    component.form.setValue({
      name: 'Jamie Teacher',
      email: 'jamie@example.com',
      password: 'StrongPassword123',
      role: 'TEACHER',
      phone: '555-0101',
      subject: 'Science',
      className: 'Class VII',
      section: '',
      parentName: '',
      parentPhone: '',
    });
    component.createMember();

    const request = http.expectOne('http://localhost:8080/api/v1/admin/members');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.role).toBe('TEACHER');
    request.flush({
      customId: 'NS01-TCH-1001',
      role: 'TEACHER',
      name: 'Jamie Teacher',
      email: 'jamie@example.com',
    });

    expect(component.lastCreated()?.customId).toBe('NS01-TCH-1001');
    http.expectOne('http://localhost:8080/api/v1/admin/members').flush([]);
    http.verify();
  });
});
