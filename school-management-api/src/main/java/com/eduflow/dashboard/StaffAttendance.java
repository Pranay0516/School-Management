package com.eduflow.dashboard;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;

@Entity
@Table(name = "staff_attendance")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class StaffAttendance extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long teacherId;
    public LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    public Status status = Status.PRESENT;

    public enum Status { PRESENT, ABSENT }
}
