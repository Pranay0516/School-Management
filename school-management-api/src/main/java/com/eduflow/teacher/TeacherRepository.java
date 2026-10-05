package com.eduflow.teacher;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<Teacher> findByNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String name, String subject);
    boolean existsByEmployeeId(String employeeId);
    long countByStatus(String status);
}
