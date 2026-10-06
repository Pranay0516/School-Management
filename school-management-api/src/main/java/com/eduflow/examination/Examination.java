package com.eduflow.examination;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;

@Entity
@Table(name="examinations")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class Examination extends SchoolScopedEntity {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false) public String name;
    public String className;
    public LocalDate startDate;
    public LocalDate endDate;
    public String status="DRAFT";
}
