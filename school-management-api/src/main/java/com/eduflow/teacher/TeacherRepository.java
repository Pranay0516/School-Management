package com.eduflow.teacher;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    List<Teacher> findByNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String name, String subject);
    boolean existsByEmployeeId(String employeeId);
    long countByStatus(String status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select teacher from Teacher teacher where teacher.id = :id")
    Optional<Teacher> findByIdForUpdate(@Param("id") Long id);
}
