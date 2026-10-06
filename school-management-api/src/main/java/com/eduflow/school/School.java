package com.eduflow.school;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "schools", uniqueConstraints = {
        @UniqueConstraint(name = "uk_school_code", columnNames = "code")
})
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 12)
    private String code;

    @Column(length = 120)
    private String city;

    @Column(nullable = false)
    private boolean active = true;

    protected School() {}

    public static School reference(Long id) {
        School school = new School();
        school.id = id;
        return school;
    }

    public School(String name, String code, String city) {
        this.name = name;
        this.code = code;
        this.city = city;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCode() { return code; }
    public String getCity() { return city; }
    public boolean isActive() { return active; }

    public void deactivate() { this.active = false; }
}
