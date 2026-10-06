package com.eduflow.teacher;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "Employee ID is required")
    @Column(nullable = false, unique = true)
    public String employeeId;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    public String name;

    public String subject;
    public String className;   // primary class assigned
    public String phone;
    public String email;
    public LocalDate dateOfBirth;
    public String status = "ACTIVE";

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getStatus() {
        return status;
    }
}
