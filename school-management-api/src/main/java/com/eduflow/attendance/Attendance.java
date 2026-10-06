package com.eduflow.attendance;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;

@Entity
@Table(name="attendance_records")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class Attendance extends SchoolScopedEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    public Long studentId;
    public String className;
    public LocalDate attendanceDate;
    @Enumerated(EnumType.STRING) public AttendanceStatus status=AttendanceStatus.PRESENT;
    public enum AttendanceStatus { PRESENT, ABSENT, LATE }
}
