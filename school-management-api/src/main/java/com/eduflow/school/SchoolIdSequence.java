package com.eduflow.school;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "school_id_sequences", uniqueConstraints = {
        @UniqueConstraint(name = "uk_school_sequence_role", columnNames = {"school_id", "role"})
})
public class SchoolIdSequence {
    public enum MemberRole { ADMIN, TEACHER, STUDENT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MemberRole role;

    @Column(name = "next_value", nullable = false)
    private long nextValue;

    protected SchoolIdSequence() {}

    public SchoolIdSequence(School school, MemberRole role, long nextValue) {
        this.school = school;
        this.role = role;
        this.nextValue = nextValue;
    }

    public Long getId() { return id; }
    public School getSchool() { return school; }
    public MemberRole getRole() { return role; }
    public long takeNextValue() { return nextValue++; }
}
