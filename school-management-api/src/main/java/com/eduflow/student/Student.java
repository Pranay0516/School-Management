package com.eduflow.student;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class Student extends SchoolScopedEntity {

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
    public String email;
    public LocalDate dateOfBirth;
    public String status = "ACTIVE";
}
