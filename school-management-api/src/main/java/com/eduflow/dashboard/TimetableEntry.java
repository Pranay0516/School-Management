package com.eduflow.dashboard;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Filter;

import java.time.LocalTime;

@Entity
@Table(name = "timetable_entries")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class TimetableEntry extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public int dayOfWeek;
    public int period;
    public String className;
    public LocalTime startTime;
    public String subject;
    public String teacherName;
}
