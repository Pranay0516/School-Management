package com.eduflow.fee;

import com.eduflow.tenant.SchoolScopedEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class Fee extends SchoolScopedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public Long studentId;
    public String feeType;
    public BigDecimal amount;
    public LocalDate dueDate;
    public LocalDate paymentDate;
    @Enumerated(EnumType.STRING)
    public PaymentStatus paymentStatus = PaymentStatus.PENDING;

    public enum PaymentStatus { PENDING, PAID, OVERDUE }
}
