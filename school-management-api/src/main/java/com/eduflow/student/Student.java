package com.eduflow.student;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Admission number is required")
    @Column(nullable = false, unique = true)
    public String admissionNo;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    public String name;

    public String className;
    public String section;
    public String parentName;
    public String parentPhone;
    public LocalDate dateOfBirth;
    public String status = "ACTIVE";
}
