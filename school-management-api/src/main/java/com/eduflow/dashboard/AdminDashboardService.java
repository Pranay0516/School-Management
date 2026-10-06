package com.eduflow.dashboard;

import com.eduflow.attendance.Attendance;
import com.eduflow.attendance.AttendanceRepository;
import com.eduflow.examination.Examination;
import com.eduflow.examination.ExaminationRepository;
import com.eduflow.fee.Fee;
import com.eduflow.fee.FeeRepository;
import com.eduflow.leave.LeaveApplication;
import com.eduflow.leave.LeaveApplicationRepository;
import com.eduflow.menu.Menu;
import com.eduflow.menu.MenuRepository;
import com.eduflow.student.Student;
import com.eduflow.student.StudentRepository;
import com.eduflow.teacher.Teacher;
import com.eduflow.teacher.TeacherRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional(readOnly = true)
public class AdminDashboardService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private final StudentRepository students;
    private final TeacherRepository teachers;
    private final FeeRepository fees;
    private final AttendanceRepository attendance;
    private final MenuRepository menus;
    private final LeaveApplicationRepository leaves;
    private final ExaminationRepository examinations;
    private final SchoolProfileRepository profiles;
    private final DashboardAnnouncementRepository announcements;
    private final SchoolEventRepository events;
    private final AdmissionEnquiryRepository admissions;
    private final TimetableEntryRepository timetable;
    private final TransportVehicleRepository vehicles;
    private final LibraryLoanRepository libraryLoans;
    private final StaffAttendanceRepository staffAttendance;
    private final SchoolSetupStepRepository setupSteps;

    public AdminDashboardService(
            StudentRepository students,
            TeacherRepository teachers,
            FeeRepository fees,
            AttendanceRepository attendance,
            MenuRepository menus,
            LeaveApplicationRepository leaves,
            ExaminationRepository examinations,
            SchoolProfileRepository profiles,
            DashboardAnnouncementRepository announcements,
            SchoolEventRepository events,
            AdmissionEnquiryRepository admissions,
            TimetableEntryRepository timetable,
            TransportVehicleRepository vehicles,
            LibraryLoanRepository libraryLoans,
            StaffAttendanceRepository staffAttendance,
            SchoolSetupStepRepository setupSteps) {
        this.students = students;
        this.teachers = teachers;
        this.fees = fees;
        this.attendance = attendance;
        this.menus = menus;
        this.leaves = leaves;
        this.examinations = examinations;
        this.profiles = profiles;
        this.announcements = announcements;
        this.events = events;
        this.admissions = admissions;
        this.timetable = timetable;
        this.vehicles = vehicles;
        this.libraryLoans = libraryLoans;
        this.staffAttendance = staffAttendance;
        this.setupSteps = setupSteps;
    }

    public AdminDashboardResponse getDashboard() {
        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.from(today);
        YearMonth lastMonth = thisMonth.minusMonths(1);
        List<Student> allStudents = students.findAll();
        List<Teacher> allTeachers = teachers.findAll();
        List<Fee> allFees = fees.findAll();
        List<Attendance> todayAttendance = attendance.findByAttendanceDate(today);
        List<AdmissionEnquiry> allAdmissions = admissions.findAll();
        List<StaffAttendance> todayStaffAttendance = staffAttendance.findAll().stream()
                .filter(record -> today.equals(record.attendanceDate))
                .toList();

        long activeStudents = allStudents.stream().filter(student -> isActive(student.status)).count();
        long activeStaff = allTeachers.stream().filter(teacher -> isActive(teacher.status)).count();
        long presentStudents = todayAttendance.stream()
                .filter(record -> record.status == Attendance.AttendanceStatus.PRESENT
                        || record.status == Attendance.AttendanceStatus.LATE)
                .count();
        long absentStudents = todayAttendance.stream()
                .filter(record -> record.status == Attendance.AttendanceStatus.ABSENT)
                .count();
        long enrolledStudents = presentStudents + absentStudents;

        BigDecimal collectedThisMonth = sumPaidBetween(allFees, thisMonth.atDay(1), today);
        BigDecimal collectedLastMonth = sumPaidBetween(allFees, lastMonth.atDay(1), lastMonth.atEndOfMonth());
        BigDecimal growth = collectedLastMonth.signum() == 0
                ? ZERO
                : collectedThisMonth.subtract(collectedLastMonth)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(collectedLastMonth, 2, RoundingMode.HALF_UP);

        List<AdminDashboardResponse.ClassAttendanceItem> classRows = todayAttendance.stream()
                .collect(Collectors.groupingBy(
                        record -> record.className == null || record.className.isBlank()
                                ? "Unassigned" : record.className,
                        Collectors.collectingAndThen(Collectors.toList(), records -> {
                            long present = records.stream()
                                    .filter(record -> record.status == Attendance.AttendanceStatus.PRESENT
                                            || record.status == Attendance.AttendanceStatus.LATE)
                                    .count();
                            long absent = records.stream()
                                    .filter(record -> record.status == Attendance.AttendanceStatus.ABSENT)
                                    .count();
                            return new AdminDashboardResponse.ClassAttendanceItem(
                                    records.get(0).className == null || records.get(0).className.isBlank()
                                            ? "Unassigned" : records.get(0).className,
                                    present,
                                    absent);
                        })))
                .values().stream()
                .sorted(Comparator.comparing(AdminDashboardResponse.ClassAttendanceItem::className))
                .toList();

        Map<Long, Student> studentById = allStudents.stream()
                .filter(student -> student.id != null)
                .collect(Collectors.toMap(student -> student.id, student -> student));
        List<Fee> outstandingFees = allFees.stream()
                .filter(fee -> fee.paymentStatus != Fee.PaymentStatus.PAID)
                .toList();
        List<AdminDashboardResponse.FeeDueItem> dueStudents = outstandingFees.stream()
                .sorted(Comparator.comparing(fee -> fee.dueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(7)
                .map(fee -> {
                    Student student = studentById.get(fee.studentId);
                    return new AdminDashboardResponse.FeeDueItem(
                            fee.id,
                            fee.studentId,
                            student == null ? "Unknown student" : student.name,
                            student == null ? "" : classLabel(student),
                            money(fee.amount),
                            fee.dueDate);
                })
                .toList();
        BigDecimal pendingDuesAmount = outstandingFees.stream()
                .map(fee -> money(fee.amount))
                .reduce(ZERO, BigDecimal::add);

        Map<Long, StaffAttendance> attendanceByTeacher = todayStaffAttendance.stream()
                .filter(record -> record.teacherId != null)
                .collect(Collectors.toMap(record -> record.teacherId, record -> record, (first, latest) -> latest));
        Set<Long> onLeaveTeacherIds = leaves.findAllByOrderByCreatedAtDesc().stream()
                .filter(leave -> leave.getStatus() == LeaveApplication.Status.APPROVED)
                .filter(leave -> !today.isBefore(leave.getStartDate()) && !today.isAfter(leave.getEndDate()))
                .map(leave -> leave.getTeacher().getId())
                .collect(Collectors.toSet());
        List<AdminDashboardResponse.StaffItem> staffItems = allTeachers.stream()
                .filter(teacher -> isActive(teacher.status))
                .sorted(Comparator.comparing(teacher -> teacher.name, Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER)))
                .limit(7)
                .map(teacher -> {
                    StaffAttendance record = attendanceByTeacher.get(teacher.id);
                    String status = onLeaveTeacherIds.contains(teacher.id) ? "On leave"
                            : record == null ? "Not marked" : record.status == StaffAttendance.Status.PRESENT
                            ? "Present" : "Away";
                    return new AdminDashboardResponse.StaffItem(
                            teacher.id,
                            teacher.name,
                            teacher.subject == null || teacher.subject.isBlank() ? "Staff" : teacher.subject,
                            status);
                })
                .toList();
        Set<Long> absentTeacherIds = todayStaffAttendance.stream()
                .filter(record -> record.status == StaffAttendance.Status.ABSENT)
                .map(record -> record.teacherId)
                .collect(Collectors.toSet());
        Set<Long> presentTeacherIds = todayStaffAttendance.stream()
                .filter(record -> record.status == StaffAttendance.Status.PRESENT)
                .map(record -> record.teacherId)
                .filter(teacherId -> !onLeaveTeacherIds.contains(teacherId))
                .collect(Collectors.toSet());
        long staffPresent = presentTeacherIds.size();
        long staffAway = Stream.concat(absentTeacherIds.stream(), onLeaveTeacherIds.stream())
                .distinct()
                .count();

        List<AdminDashboardResponse.FeeCollectionDay> collectionDays = new ArrayList<>();
        for (int offset = 14; offset >= 0; offset--) {
            LocalDate date = today.minusDays(offset);
            BigDecimal total = sumPaidBetween(allFees, date, date);
            collectionDays.add(new AdminDashboardResponse.FeeCollectionDay(date, total));
        }

        SchoolProfile profile = profiles.findFirstByOrderByIdAsc().orElse(null);
        int seatCapacity = profile == null ? 0 : profile.seatCapacity;
        int occupiedSeatsPercent = seatCapacity == 0 ? 0
                : (int) Math.min(100, Math.round(activeStudents * 100.0 / seatCapacity));

        List<AdminDashboardResponse.ActivityItem> activities = recentActivities(allFees, studentById);
        List<AdminDashboardResponse.ModuleItem> moduleItems = menus.findAll().stream()
                .filter(menu -> menu.active)
                .sorted(Comparator.comparing(menu -> menu.displayOrder, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(menu -> new AdminDashboardResponse.ModuleItem(
                        menu.id, menu.title, menu.icon, menu.category, menu.route))
                .toList();

        List<AdminDashboardResponse.EventItem> upcomingEvents = events.findAll().stream()
                .filter(event -> event.eventDate != null && !event.eventDate.isBefore(today))
                .sorted(Comparator.comparing(event -> event.eventDate))
                .limit(5)
                .map(event -> new AdminDashboardResponse.EventItem(event.title, event.description, event.eventDate))
                .toList();

        List<AdminDashboardResponse.ExamItem> upcomingExams = examinations.findAll().stream()
                .filter(exam -> exam.startDate != null && !exam.startDate.isBefore(today))
                .sorted(Comparator.comparing(exam -> exam.startDate))
                .limit(5)
                .map(exam -> new AdminDashboardResponse.ExamItem(
                        exam.name, exam.className, exam.startDate, exam.status))
                .toList();

        List<AdminDashboardResponse.BirthdayItem> birthdays = Stream.concat(
                        allStudents.stream()
                                .filter(student -> isBirthdayToday(student.dateOfBirth, today))
                                .map(student -> birthday(student.id, student.name, classLabel(student), student.dateOfBirth, "Student", today)),
                        allTeachers.stream()
                                .filter(teacher -> isBirthdayToday(teacher.dateOfBirth, today))
                                .map(teacher -> birthday(teacher.id, teacher.name, "Staff", teacher.dateOfBirth, "Staff", today)))
                .toList();

        List<LibraryLoan> loans = libraryLoans.findAll();
        long issuedToday = loans.stream().filter(loan -> today.equals(loan.issuedAt)).count();
        long returnedToday = loans.stream().filter(loan -> today.equals(loan.returnedAt)).count();
        long overdueLoans = loans.stream()
                .filter(loan -> loan.returnedAt == null && loan.dueDate != null && loan.dueDate.isBefore(today))
                .count();

        Map<AdmissionEnquiry.Status, Long> admissionsByStatus = allAdmissions.stream()
                .collect(Collectors.groupingBy(enquiry -> enquiry.status, Collectors.counting()));
        int attendancePercent = enrolledStudents == 0 ? 0        $env:APP_BOOTSTRAP_SUPER_ADMIN_USERNAME = "platform@example.com"
        $env:APP_BOOTSTRAP_SUPER_ADMIN_PASSWORD = "Choose-a-strong-password"
        
        cd "C:\Users\PRANAY TEJA\OneDrive\Documents\School Management\school-management-api"
        mvn spring-boot:run
                : (int) Math.round(presentStudents * 100.0 / enrolledStudents);

        return new AdminDashboardResponse(
                today,
                profile == null || profile.schoolName == null ? "School" : profile.schoolName,
                seatCapacity,
                activeStudents,
                collectedThisMonth,
                growth,
                academicYear(today),
                attendancePercent,
                presentStudents,
                absentStudents,
                enrolledStudents,
                activeStaff,
                staffPresent,
                staffAway,
                pendingDuesAmount,
                outstandingFees.size(),
                admissionsByStatus.getOrDefault(AdmissionEnquiry.Status.PENDING, 0L),
                admissionsByStatus.getOrDefault(AdmissionEnquiry.Status.ADMITTED, 0L),
                admissionsByStatus.getOrDefault(AdmissionEnquiry.Status.INTERESTED, 0L),
                admissionsByStatus.getOrDefault(AdmissionEnquiry.Status.REJECTED, 0L),
                occupiedSeatsPercent,
                issuedToday,
                returnedToday,
                overdueLoans,
                moduleItems,
                activities,
                classRows,
                dueStudents,
                timetable.findAll().stream()
                        .filter(entry -> entry.dayOfWeek == today.getDayOfWeek().getValue())
                        .sorted(Comparator.comparing(entry -> entry.startTime, Comparator.nullsLast(Comparator.naturalOrder())))
                        .map(entry -> new AdminDashboardResponse.TimetableItem(
                                entry.id, entry.period, entry.startTime, entry.className, entry.subject, entry.teacherName))
                        .toList(),
                upcomingEvents,
                vehicles.findAll().stream()
                        .sorted(Comparator.comparing(vehicle -> vehicle.vehicleNumber))
                        .map(vehicle -> new AdminDashboardResponse.TransportItem(
                                vehicle.vehicleNumber, vehicle.route, vehicle.driverName,
                                vehicle.studentCount, vehicle.status.name()))
                        .toList(),
                collectionDays,
                announcements.findAll().stream()
                        .sorted(Comparator.comparing(
                                (DashboardAnnouncement announcement) -> announcement.publishedAt,
                                Comparator.nullsLast(Comparator.reverseOrder())))
                        .limit(4)
                        .map(announcement -> new AdminDashboardResponse.AnnouncementItem(
                                announcement.title, announcement.body, announcement.publishedAt))
                        .toList(),
                upcomingExams,
                birthdays,
                staffItems,
                setupSteps.findAll().stream()
                        .sorted(Comparator.comparing(step -> step.id))
                        .map(step -> new AdminDashboardResponse.SetupItem(
                                step.stepKey, step.label, step.complete))
                        .toList());
    }

    private List<AdminDashboardResponse.ActivityItem> recentActivities(
            List<Fee> allFees, Map<Long, Student> studentById) {
        List<AdminDashboardResponse.ActivityItem> feeActivities = allFees.stream()
                .filter(fee -> fee.paymentStatus == Fee.PaymentStatus.PAID && fee.paymentDate != null)
                .map(fee -> {
                    Student student = studentById.get(fee.studentId);
                    return new AdminDashboardResponse.ActivityItem(
                            fee.id,
                            "FEE",
                            (student == null ? "Student" : student.name) + " paid a fee",
                            fee.feeType == null ? "Fee payment" : fee.feeType,
                            money(fee.amount),
                            fee.paymentDate.atStartOfDay());
                })
                .toList();
        List<AdminDashboardResponse.ActivityItem> leaveActivities = leaves.findAllByOrderByCreatedAtDesc().stream()
                .map(leave -> new AdminDashboardResponse.ActivityItem(
                        leave.getId(),
                        "LEAVE",
                        leave.getTeacher().getName() + " submitted " + leave.getType().name().toLowerCase() + " leave",
                        leave.getStartDate() + " to " + leave.getEndDate() + " · " + leave.getStatus().name(),
                        null,
                        leave.getCreatedAt()))
                .toList();
        return Stream.concat(feeActivities.stream(), leaveActivities.stream())
                .sorted(Comparator.comparing(
                        AdminDashboardResponse.ActivityItem::occurredAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .toList();
    }

    private static BigDecimal sumPaidBetween(List<Fee> allFees, LocalDate start, LocalDate end) {
        return allFees.stream()
                .filter(fee -> fee.paymentStatus == Fee.PaymentStatus.PAID)
                .filter(fee -> fee.paymentDate != null && !fee.paymentDate.isBefore(start) && !fee.paymentDate.isAfter(end))
                .map(fee -> money(fee.amount))
                .reduce(ZERO, BigDecimal::add);
    }

    private static AdminDashboardResponse.BirthdayItem birthday(
            Long personId, String name, String detail, LocalDate dateOfBirth, String role, LocalDate today) {
        int age = dateOfBirth == null ? 0 : today.getYear() - dateOfBirth.getYear();
        return new AdminDashboardResponse.BirthdayItem(personId, name, detail, age, role);
    }

    private static String academicYear(LocalDate today) {
        int startYear = today.getMonthValue() >= 4 ? today.getYear() : today.getYear() - 1;
        return startYear + "-" + String.format("%02d", (startYear + 1) % 100);
    }

    private static boolean isBirthdayToday(LocalDate birthDate, LocalDate today) {
        return birthDate != null && birthDate.getMonth() == today.getMonth() && birthDate.getDayOfMonth() == today.getDayOfMonth();
    }

    private static boolean isActive(String status) {
        return status != null && status.equalsIgnoreCase("ACTIVE");
    }

    private static String classLabel(Student student) {
        String name = student.className == null ? "" : student.className;
        return student.section == null || student.section.isBlank() ? name : name + " " + student.section;
    }

    private static BigDecimal money(BigDecimal amount) {
        return amount == null ? ZERO : amount;
    }
}
