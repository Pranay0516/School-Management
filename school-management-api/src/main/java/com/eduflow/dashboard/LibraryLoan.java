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
@Table(name = "library_loans")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class LibraryLoan extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String bookTitle;
    public String borrowerName;
    public LocalDate issuedAt;
    public LocalDate dueDate;
    public LocalDate returnedAt;
}
