import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

export interface StudentStats  { totalActive: number; }
export interface TeacherStats  { totalActive: number; }
export interface FeeStats      { pendingCount: number; }

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:8080/api';
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
}
