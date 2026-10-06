package com.eduflow.leave;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface LeaveApplicationRepository extends JpaRepository<LeaveApplication, Long> {

    List<LeaveApplication> findByTeacher_IdOrderByCreatedAtDesc(Long teacherId);

    List<LeaveApplication> findAllByOrderByCreatedAtDesc();

    boolean existsByTeacher_IdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long teacherId,
            Set<LeaveApplication.Status> statuses,
            java.time.LocalDate requestedEnd,
            java.time.LocalDate requestedStart);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select application from LeaveApplication application where application.id = :id")
    Optional<LeaveApplication> findByIdForUpdate(@Param("id") Long id);
}
