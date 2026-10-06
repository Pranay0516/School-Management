package com.eduflow.leave;

import com.eduflow.teacher.Teacher;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_applications", indexes = {
        @Index(name = "idx_leave_teacher_dates", columnList = "teacher_id,start_date,end_date"),
        @Index(name = "idx_leave_status_created", columnList = "status,created_at")
})
public class LeaveApplication {

    public enum LeaveType {
        SICK,
        CASUAL,
        EARNED,
        EMERGENCY
    }

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeaveType type;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(length = 1000)
    private String reviewNote;

    @Column(length = 191)
    private String reviewedBy;

    private LocalDateTime reviewedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Version
    private long version;

    protected LeaveApplication() {}

    public LeaveApplication(
            Teacher teacher, LeaveType type, LocalDate startDate, LocalDate endDate, String reason) {
        this.teacher = teacher;
        this.type = type;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reason = reason;
    }

    @PrePersist
    void setCreatedAt() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Teacher getTeacher() {
        return teacher;
    }

    public LeaveType getType() {
        return type;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getReason() {
        return reason;
    }

    public Status getStatus() {
        return status;
    }

    public String getReviewNote() {
        return reviewNote;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void review(Status decision, String note, String reviewer) {
        this.status = decision;
        this.reviewNote = note;
        this.reviewedBy = reviewer;
        this.reviewedAt = LocalDateTime.now();
    }
}
