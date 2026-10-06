package com.eduflow.dashboard;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "school_profiles")
public class SchoolProfile {
    @Id
    public Long id = 1L;

    @Column(nullable = false)
    public String schoolName;

    public int seatCapacity;
}
