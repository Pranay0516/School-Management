package com.eduflow.dashboard;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "school_setup_steps", uniqueConstraints = {
        @UniqueConstraint(name = "uk_setup_school_step", columnNames = {"school_id", "step_key"})
})
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class SchoolSetupStep extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "step_key", nullable = false)
    public String stepKey;

    @Column(nullable = false)
    public String label;

    public boolean complete;
}
