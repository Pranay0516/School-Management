package com.eduflow.exam;
import jakarta.persistence.*;
import java.time.*;
@Entity @Table(name="exam_papers") public class ExamPaper {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; @Column(nullable=false) public String title; public String subject; public String className; public Integer totalMarks; public Integer durationMinutes;
 @Lob public String contentJson; @Enumerated(EnumType.STRING) public Status status=Status.DRAFT; public Long createdBy; public Long approvedBy; public LocalDateTime approvedAt;
 public enum Status { DRAFT, PENDING_APPROVAL, APPROVED, REJECTED }
}
