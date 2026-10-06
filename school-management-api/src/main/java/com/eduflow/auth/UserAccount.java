package com.eduflow.auth;

import com.eduflow.teacher.Teacher;
import com.eduflow.student.Student;
import com.eduflow.school.School;
import jakarta.persistence.*;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_user_school_role", columnList = "school_id,role")
})
@Filter(name = "schoolScope", condition = "school_id = :schoolId")
public class UserAccount {

    public enum Role {
        SUPER_ADMIN,
        ADMIN,
        TEACHER,
        STUDENT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 191)
    private String username;

    @Column(name = "custom_id", nullable = false, unique = true, length = 32)
    private String customId;

    @Column(length = 191)
    private String email;

    @Column(name = "display_name", length = 120)
    private String displayName;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", unique = true)
    private Teacher teacher;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", unique = true)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id")
    private School school;

    protected UserAccount() {}

    public UserAccount(String username, String passwordHash, Role role, Teacher teacher) {
        this.username = username;
        this.customId = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.teacher = teacher;
    }

    public UserAccount(
            String username, String customId, String email, String passwordHash, Role role,
            String displayName, School school, Teacher teacher, Student student) {
        this.username = username;
        this.customId = customId;
        this.email = email;
        this.displayName = displayName;
        this.passwordHash = passwordHash;
        this.role = role;
        this.school = school;
        this.teacher = teacher;
        this.student = student;
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

    public String getCustomId() { return customId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public School getSchool() { return school; }
    public Student getStudent() { return student; }

    public Teacher getTeacher() {
        return teacher;
    }
}
