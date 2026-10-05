package com.eduflow.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByNameContainingIgnoreCase(String name);
    List<Student> findByNameContainingIgnoreCaseOrAdmissionNoContainingIgnoreCase(String name, String admissionNo);
    boolean existsByAdmissionNo(String admissionNo);
    long countByStatus(String status);
}
