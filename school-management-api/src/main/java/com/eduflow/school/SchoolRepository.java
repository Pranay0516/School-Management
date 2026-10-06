package com.eduflow.school;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {
    boolean existsByCodeIgnoreCase(String code);
    Optional<School> findByIdAndActiveTrue(Long id);
}
