import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SchoolsComponent } from './schools.component';

describe('SchoolsComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads registered schools from the API', () => {
    const fixture = TestBed.createComponent(SchoolsComponent);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/v1/super-admin/schools').flush([]);
    expect(fixture.componentInstance.schools()).toEqual([]);
  });

  it('creates a school with its primary admin and shows the generated ID', () => {
    const fixture = TestBed.createComponent(SchoolsComponent);
    fixture.detectChanges();
    http.expectOne('http://localhost:8080/api/v1/super-admin/schools').flush([]);

    const component = fixture.componentInstance;
    component.form.setValue({
      schoolName: 'North School',
      schoolCode: 'NS01',
      city: 'Pune',
      adminName: 'Alex Admin',
      adminEmail: 'admin@north.example',
      adminPassword: 'VeryStrongPassword123',
    });
    component.createSchool();

    const request = http.expectOne('http://localhost:8080/api/v1/super-admin/schools');
    expect(request.request.method).toBe('POST');
    expect(request.request.body.schoolCode).toBe('NS01');
    request.flush({
      schoolId: 1,
      schoolName: 'North School',
      schoolCode: 'NS01',
      city: 'Pune',
      active: true,
      adminCustomId: 'NS01-ADM-0001',
      adminEmail: 'admin@north.example',
    });

    expect(component.lastCreated()?.adminCustomId).toBe('NS01-ADM-0001');
    http.expectOne('http://localhost:8080/api/v1/super-admin/schools').flush([]);
  });
});
