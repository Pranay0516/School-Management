package com.eduflow.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalTime;

@Entity
@Table(name = "timetable_entries")
public class TimetableEntry {
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
