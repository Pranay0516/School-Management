package com.eduflow.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "staff_attendance")
public class StaffAttendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public Long teacherId;
    public LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    public Status status = Status.PRESENT;

    public enum Status { PRESENT, ABSENT }
}
