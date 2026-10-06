package com.eduflow.dashboard;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "library_loans")
public class LibraryLoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String bookTitle;
    public String borrowerName;
    public LocalDate issuedAt;
    public LocalDate dueDate;
    public LocalDate returnedAt;
}
