package com.eduflow.fee; import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
public class Fee {
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
