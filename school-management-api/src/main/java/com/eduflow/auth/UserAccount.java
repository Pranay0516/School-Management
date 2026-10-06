package com.eduflow.auth;

import com.eduflow.teacher.Teacher;
import jakarta.persistence.*;

@Entity
@Table(name = "user_accounts")
public class UserAccount {

    public enum Role {
        ADMIN,
        TEACHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 191)
    private String username;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", unique = true)
    private Teacher teacher;

    protected UserAccount() {}

    public UserAccount(String username, String passwordHash, Role role, Teacher teacher) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.teacher = teacher;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public Teacher getTeacher() {
        return teacher;
    }
}
