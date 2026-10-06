package com.eduflow.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record AdminDashboardResponse(
        LocalDate today,
        String schoolName,
        int seatCapacity,
        long totalStudents,
        BigDecimal collectedThisMonth,
        BigDecimal collectionGrowthPercent,
        int attendancePercent,
        long attendancePresent,
        long attendanceAbsent,
        long enrolledStudents,
        long activeStaff,
        long staffPresent,
        long staffAway,
        BigDecimal pendingDuesAmount,
        long pendingDuesCount,
        long pendingAdmissions,
        long admittedEnquiries,
        long interestedAdmissions,
        long rejectedAdmissions,
        int occupiedSeatsPercent,
        long libraryIssuedToday,
        long libraryReturnedToday,
        long libraryOverdue,
        List<ModuleItem> modules,
        List<ActivityItem> activities,
        List<ClassAttendanceItem> classAttendance,
        List<FeeDueItem> dueStudents,
        List<TimetableItem> timetable,
        List<EventItem> events,
        List<TransportItem> buses,
        List<FeeCollectionDay> feeCollections,
        List<AnnouncementItem> announcements,
        List<ExamItem> exams,
        List<BirthdayItem> birthdays,
        List<StaffItem> staff,
        List<SetupItem> setupSteps) {

    public record ModuleItem(String title, String icon, String category, String route) {}

    public record ActivityItem(String type, String title, String detail, LocalDateTime occurredAt) {}

    public record ClassAttendanceItem(String className, long present, long absent) {}

    public record FeeDueItem(Long studentId, String name, String className, BigDecimal amount, LocalDate dueDate) {}

    public record TimetableItem(int period, LocalTime startTime, String subject, String teacherName) {}

    public record EventItem(String title, String description, LocalDate eventDate) {}

    public record TransportItem(String vehicleNumber, String route, String driverName, int studentCount, String status) {}

    public record FeeCollectionDay(LocalDate date, BigDecimal amount) {}

    public record AnnouncementItem(String title, String body, LocalDateTime publishedAt) {}

    public record ExamItem(String name, String className, LocalDate startDate, String status) {}

    public record BirthdayItem(String name, String detail, int age, String role) {}

    public record StaffItem(String name, String title, String status) {}

    public record SetupItem(String key, String label, boolean complete) {}
}
