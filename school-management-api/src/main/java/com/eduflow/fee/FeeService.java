package com.eduflow.fee;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class FeeService {

    private final FeeRepository repo;

    public FeeService(FeeRepository repo) {
        this.repo = repo;
    }

    public List<Fee> findAll() {
        return repo.findAll();
    }

    public List<Fee> findByStudentId(Long studentId) {
        return repo.findByStudentId(studentId);
    }

    @Transactional
    public Fee create(Fee fee) {
        if (fee.paymentStatus == null) {
            fee.paymentStatus = Fee.PaymentStatus.PENDING;
        }
        return repo.save(fee);
    }

    @Transactional
    public Fee update(Long id, Fee incoming) {
        Fee existing = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fee not found: " + id));
        existing.feeType       = incoming.feeType;
        existing.amount        = incoming.amount;
        existing.dueDate       = incoming.dueDate;
        existing.paymentStatus = incoming.paymentStatus;
        return repo.save(existing);
    }

    @Transactional
    public Fee markPaid(Long id) {
        Fee fee = repo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fee not found: " + id));
        fee.paymentStatus = Fee.PaymentStatus.PAID;
        return repo.save(fee);
    }

    public long countPending() {
        return repo.countByPaymentStatus(Fee.PaymentStatus.PENDING);
    }
}
