package com.eduflow.attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByAttendanceDateAndClassName(LocalDate date, String className);
    List<Attendance> findByAttendanceDate(LocalDate date);
    long countByAttendanceDateAndStatus(LocalDate date, Attendance.AttendanceStatus status);
}
