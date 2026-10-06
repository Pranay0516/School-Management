package com.eduflow.dashboard;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "school_profiles")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class SchoolProfile extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String schoolName;

    public int seatCapacity;
}
