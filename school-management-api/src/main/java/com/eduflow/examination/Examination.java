package com.eduflow.examination; import jakarta.persistence.*; import java.time.*;
@Entity @Table(name="examinations") public class Examination { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; @Column(nullable=false) public String name; public String className; public LocalDate startDate; public LocalDate endDate; public String status="DRAFT"; }
