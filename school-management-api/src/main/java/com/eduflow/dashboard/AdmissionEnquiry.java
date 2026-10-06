package com.eduflow.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "admission_enquiries")
public class AdmissionEnquiry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String applicantName;
    public String className;

    @Enumerated(EnumType.STRING)
    public Status status = Status.PENDING;

    public LocalDateTime createdAt;

    public enum Status { ADMITTED, PENDING, INTERESTED, REJECTED }
}
