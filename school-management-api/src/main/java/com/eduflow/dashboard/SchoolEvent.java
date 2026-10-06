package com.eduflow.dashboard;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;

import java.time.LocalDate;

@Entity
@Table(name = "school_events")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class SchoolEvent extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    public String description;
    public LocalDate eventDate;
}
