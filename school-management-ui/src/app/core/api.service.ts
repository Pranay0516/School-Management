import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_BASE_URL } from './api-base';

// ── Domain models ────────────────────────────────────────────────────────────

export interface Student {
  id?: number;
  admissionNo: string;
  name: string;
  className: string;
  section?: string;
  parentName?: string;
  parentPhone?: string;
  status?: string;
}

export interface Teacher {
  id?: number;
  employeeId: string;
  name: string;
  subject?: string;
  className?: string;
  phone?: string;
  email?: string;
  status?: string;
}

export interface Attendance {
  id?: number;
  studentId: number;
  className: string;
  attendanceDate: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface Examination {
  id?: number;
  name: string;
  className: string;
  startDate: string;
  endDate?: string;
  status: string;
}

export interface Fee {
  id?: number;
  studentId: number;
  feeType: string;
  amount: number;
  dueDate: string;
  paymentStatus: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface ExamPaper {
  id?: number;
  title: string;
  subject: string;
  className: string;
  totalMarks: number;
  durationMinutes: number;
  contentJson?: string;
  status: string;
  createdBy?: number;
  approvedBy?: number;
  approvedAt?: string;
}

export interface Menu {
  id?: number;
  title: string;
  route?: string;
  icon?: string;
  displayOrder?: number;
  active?: boolean;
  roles?: string[];
}

export interface TeacherAccount {
  id: number;
  username: string;
  role: 'TEACHER';
  teacherId: number;
  teacherName: string;
}

export interface SchoolSummary {
  schoolId: number;
  schoolName: string;
  schoolCode: string;
  city: string;
  active: boolean;
}

export interface CreateSchoolRequest {
  schoolName: string;
  schoolCode: string;
  city: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface CreatedSchool extends SchoolSummary {
  adminCustomId: string;
  adminEmail: string;
}

export interface CreateMemberRequest {
  name: string;
  email: string;
  password: string;
  role: 'TEACHER' | 'STUDENT';
  phone: string;
  subject: string;
  className: string;
  section: string;
  parentName: string;
  parentPhone: string;
}

export interface CreatedMember {
  customId: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  name: string;
  email: string;
}

export interface SchoolMember extends CreatedMember {
  subject: string | null;
  className: string | null;
}

export type LeaveType = 'SICK' | 'CASUAL' | 'EARNED' | 'EMERGENCY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveApplication {
  id: number;
  teacherId: number;
  teacherName: string;
  teacherUsername: string | null;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  reviewNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface StudentStats  { totalActive: number; }
export interface TeacherStats  { totalActive: number; }
export interface FeeStats      { pendingCount: number; }

export interface AdminDashboardData {
  today: string;
  academicYear: string;
  schoolName: string;
  seatCapacity: number;
  totalStudents: number;
  collectedThisMonth: number;
  collectionGrowthPercent: number;
  attendancePercent: number;
  attendancePresent: number;
  attendanceAbsent: number;
  enrolledStudents: number;
  activeStaff: number;
  staffPresent: number;
  staffAway: number;
  pendingDuesAmount: number;
  pendingDuesCount: number;
  pendingAdmissions: number;
  admittedEnquiries: number;
  interestedAdmissions: number;
  rejectedAdmissions: number;
  occupiedSeatsPercent: number;
  libraryIssuedToday: number;
  libraryReturnedToday: number;
  libraryOverdue: number;
  modules: { id: number; title: string; icon: string | null; category: string | null; route: string | null }[];
  activities: { sourceId: number; type: string; title: string; detail: string; amount: number | null; occurredAt: string | null }[];
  classAttendance: { className: string; present: number; absent: number }[];
  dueStudents: { feeId: number; studentId: number | null; name: string; className: string; amount: number; dueDate: string | null }[];
  timetable: { id: number; period: number; startTime: string | null; className: string | null; subject: string; teacherName: string }[];
  events: { title: string; description: string; eventDate: string }[];
  buses: { vehicleNumber: string; route: string; driverName: string; studentCount: number; status: string }[];
  feeCollections: { date: string; amount: number }[];
  announcements: { title: string; body: string; publishedAt: string | null }[];
  exams: { name: string; className: string | null; startDate: string; status: string }[];
  birthdays: { personId: number; name: string; detail: string; age: number; role: string }[];
  staff: { teacherId: number; name: string; title: string; status: string }[];
  setupSteps: { key: string; label: string; complete: boolean }[];
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = API_BASE_URL;
  private http = inject(HttpClient);

  // ── helpers ────────────────────────────────────────────────────────────────

  private handle<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      catchError((err: HttpErrorResponse) => {
        const message =
          err.error?.message ?? err.error?.error ?? err.message ?? 'Unknown error';
        return throwError(() => new Error(message));
      }),
    );
  }

  private params(obj: Record<string, string | number | boolean | undefined>): HttpParams {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null && v !== '') {
        p = p.set(k, String(v));
      }
    }
    return p;
  }

  // ── Students ───────────────────────────────────────────────────────────────

  students(search = ''): Observable<Student[]> {
    return this.handle(
      this.http.get<Student[]>(`${this.base}/students`, { params: this.params({ search }) }),
    );
  }

  studentStats(): Observable<StudentStats> {
    return this.handle(this.http.get<StudentStats>(`${this.base}/students/stats`));
  }

  addStudent(s: Student): Observable<Student> {
    return this.handle(this.http.post<Student>(`${this.base}/students`, s));
  }

  updateStudent(s: Student): Observable<Student> {
    return this.handle(this.http.put<Student>(`${this.base}/students/${s.id}`, s));
  }

  deleteStudent(id: number): Observable<void> {
    return this.handle(this.http.delete<void>(`${this.base}/students/${id}`));
  }

  // ── Teachers ───────────────────────────────────────────────────────────────

  teachers(search = ''): Observable<Teacher[]> {
    return this.handle(
      this.http.get<Teacher[]>(`${this.base}/teachers`, { params: this.params({ search }) }),
    );
  }

  teacherStats(): Observable<TeacherStats> {
    return this.handle(this.http.get<TeacherStats>(`${this.base}/teachers/stats`));
  }

  addTeacher(t: Teacher): Observable<Teacher> {
    return this.handle(this.http.post<Teacher>(`${this.base}/teachers`, t));
  }

  updateTeacher(t: Teacher): Observable<Teacher> {
    return this.handle(this.http.put<Teacher>(`${this.base}/teachers/${t.id}`, t));
  }

  deleteTeacher(id: number): Observable<void> {
    return this.handle(this.http.delete<void>(`${this.base}/teachers/${id}`));
  }

  teacherAccounts(): Observable<TeacherAccount[]> {
    return this.handle(this.http.get<TeacherAccount[]>(`${this.base}/teachers/accounts`));
  }

  createTeacherAccount(
    teacherId: number,
    account: { username: string; password: string },
  ): Observable<TeacherAccount> {
    return this.handle(
      this.http.post<TeacherAccount>(`${this.base}/teachers/${teacherId}/account`, account),
    );
  }

  myLeaveApplications(): Observable<LeaveApplication[]> {
    return this.handle(this.http.get<LeaveApplication[]>(`${this.base}/leaves/mine`));
  }

  applyForLeave(application: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    reason: string;
  }): Observable<LeaveApplication> {
    return this.handle(this.http.post<LeaveApplication>(`${this.base}/leaves`, application));
  }

  leaveApplicationsForAdmin(): Observable<LeaveApplication[]> {
    return this.handle(this.http.get<LeaveApplication[]>(`${this.base}/leaves/admin`));
  }

  approveLeave(id: number, note = ''): Observable<LeaveApplication> {
    return this.handle(
      this.http.post<LeaveApplication>(`${this.base}/leaves/${id}/approve`, { note }),
    );
  }

  rejectLeave(id: number, note: string): Observable<LeaveApplication> {
    return this.handle(
      this.http.post<LeaveApplication>(`${this.base}/leaves/${id}/reject`, { note }),
    );
  }

  // ── Attendance ─────────────────────────────────────────────────────────────

  attendance(date?: string, className?: string): Observable<Attendance[]> {
    return this.handle(
      this.http.get<Attendance[]>(`${this.base}/attendance`, {
        params: this.params({ date: date ?? '', className: className ?? '' }),
      }),
    );
  }

  saveAttendance(records: Attendance[]): Observable<Attendance[]> {
    return this.handle(this.http.post<Attendance[]>(`${this.base}/attendance`, records));
  }

  // ── Examinations ──────────────────────────────────────────────────────────

  examinations(): Observable<Examination[]> {
    return this.handle(this.http.get<Examination[]>(`${this.base}/examinations`));
  }

  addExamination(e: Examination): Observable<Examination> {
    return this.handle(this.http.post<Examination>(`${this.base}/examinations`, e));
  }

  updateExamination(e: Examination): Observable<Examination> {
    return this.handle(this.http.put<Examination>(`${this.base}/examinations/${e.id}`, e));
  }

  deleteExamination(id: number): Observable<void> {
    return this.handle(this.http.delete<void>(`${this.base}/examinations/${id}`));
  }

  // ── Fees ───────────────────────────────────────────────────────────────────

  fees(studentId?: number): Observable<Fee[]> {
    return this.handle(
      this.http.get<Fee[]>(`${this.base}/fees`, {
        params: this.params({ studentId: studentId ?? '' }),
      }),
    );
  }

  feeStats(): Observable<FeeStats> {
    return this.handle(this.http.get<FeeStats>(`${this.base}/fees/stats`));
  }

  adminDashboard(): Observable<AdminDashboardData> {
    return this.handle(this.http.get<AdminDashboardData>(`${this.base}/admin/dashboard`));
  }

  addFee(f: Fee): Observable<Fee> {
    return this.handle(this.http.post<Fee>(`${this.base}/fees`, f));
  }

  updateFee(f: Fee): Observable<Fee> {
    return this.handle(this.http.put<Fee>(`${this.base}/fees/${f.id}`, f));
  }

  markFeePaid(id: number): Observable<Fee> {
    return this.handle(this.http.post<Fee>(`${this.base}/fees/${id}/pay`, null));
  }

  // ── Exam Papers ───────────────────────────────────────────────────────────

  examPapers(): Observable<ExamPaper[]> {
    return this.handle(this.http.get<ExamPaper[]>(`${this.base}/exam-papers`));
  }

  addExamPaper(p: ExamPaper): Observable<ExamPaper> {
    return this.handle(this.http.post<ExamPaper>(`${this.base}/exam-papers`, p));
  }

  approveExamPaper(id: number, adminId = 1): Observable<ExamPaper> {
    return this.handle(
      this.http.post<ExamPaper>(
        `${this.base}/exam-papers/${id}/approve`,
        null,
        { params: this.params({ adminId }) },
      ),
    );
  }

  printableExamPaper(id: number): Observable<ExamPaper> {
    return this.handle(this.http.get<ExamPaper>(`${this.base}/exam-papers/${id}/printable`));
  }

  // ── Menus ─────────────────────────────────────────────────────────────────

  menus(): Observable<Menu[]> {
    return this.handle(this.http.get<Menu[]>(`${this.base}/menus`));
  }

  menusForRole(role: string): Observable<Menu[]> {
    return this.handle(
      this.http.get<Menu[]>(`${this.base}/menus/my-access`, { params: this.params({ role }) }),
    );
  }

  addMenu(m: Menu): Observable<Menu> {
    return this.handle(this.http.post<Menu>(`${this.base}/menus`, m));
  }

  updateMenu(m: Menu): Observable<Menu> {
    return this.handle(this.http.put<Menu>(`${this.base}/menus/${m.id}`, m));
  }

  schools(): Observable<SchoolSummary[]> {
    return this.handle(this.http.get<SchoolSummary[]>(`${this.base}/v1/super-admin/schools`));
  }

  createSchool(request: CreateSchoolRequest): Observable<CreatedSchool> {
    return this.handle(
      this.http.post<CreatedSchool>(`${this.base}/v1/super-admin/schools`, request),
    );
  }

  schoolMembers(): Observable<SchoolMember[]> {
    return this.handle(this.http.get<SchoolMember[]>(`${this.base}/v1/admin/members`));
  }

  createSchoolMember(request: CreateMemberRequest): Observable<CreatedMember> {
    return this.handle(
      this.http.post<CreatedMember>(`${this.base}/v1/admin/members`, request),
    );
  }
}
