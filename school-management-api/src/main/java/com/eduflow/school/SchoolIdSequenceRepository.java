package com.eduflow.school;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SchoolIdSequenceRepository extends JpaRepository<SchoolIdSequence, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select sequence from SchoolIdSequence sequence where sequence.school.id = :schoolId and sequence.role = :role")
    Optional<SchoolIdSequence> findForUpdate(
            @Param("schoolId") Long schoolId,
            @Param("role") SchoolIdSequence.MemberRole role);
}
