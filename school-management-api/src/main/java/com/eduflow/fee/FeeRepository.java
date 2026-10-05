package com.eduflow.fee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudentId(Long studentId);
    long countByPaymentStatus(Fee.PaymentStatus status);
}
